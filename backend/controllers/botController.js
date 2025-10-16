const Application = require('../models/Application');
const Job = require('../models/Job');
const { createAuditLog } = require('./auditController');

// Get bot dashboard data
exports.getDashboard = async (req, res) => {
    try {
        // Get pending applications
        const pendingApplications = await Application.find({ status: 'pending' })
            .populate([
                { path: 'jobId', select: 'title department type roleCategory' },
                { path: 'applicantId', select: 'username email' }
            ])
            .sort({ createdAt: 1 }); // Process oldest first

        // Get active jobs
        const activeJobs = await Job.find({ isActive: true })
            .populate('postedBy', 'username')
            .sort({ createdAt: -1 });

        // Get application statistics
        const applicationStats = await Application.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Create audit log for bot dashboard access
        await createAuditLog({
            userId: req.user._id,
            action: 'ADMIN_ACTION',
            resourceType: 'user',
            resourceId: req.user._id,
            description: 'Bot accessed dashboard data'
        });

        res.json({
            pendingApplications,
            activeJobs,
            applicationStats,
            botInfo: {
                id: req.user._id,
                name: req.user.username,
                lastAccess: new Date()
            }
        });
    } catch (error) {
        console.error('Bot dashboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Process applications automatically (for technical roles)
exports.processApplications = async (req, res) => {
    try {
        const { applicationIds } = req.body;
        
        if (!applicationIds || !Array.isArray(applicationIds)) {
            return res.status(400).json({ message: 'Application IDs array is required' });
        }

        const processedApplications = [];
        const errors = [];

        for (const appId of applicationIds) {
            try {
                const application = await Application.findById(appId)
                    .populate('jobId', 'title department type roleCategory');

                if (!application) {
                    errors.push({ appId, error: 'Application not found' });
                    continue;
                }

                // Check if it's a technical role via roleCategory
                const isTechnical = application.jobId && application.jobId.roleCategory === 'technical';

                if (!isTechnical) {
                    errors.push({ appId, error: 'Not a technical role - bot cannot process' });
                    continue;
                }

                // Simulate automated processing
                const statuses = ['pending', 'reviewing', 'shortlisted', 'accepted'];
                const currentIndex = statuses.indexOf(application.status);
                const nextStatus = statuses[currentIndex + 1] || 'accepted';

                application.status = nextStatus;
                await application.save();

                // Add automated note
                application.notes.push({
                    text: `Automated processing: Status updated to ${nextStatus} by bot system`,
                    addedBy: req.user._id
                });
                await application.save();

                // Create audit log
                await createAuditLog({
                    userId: req.user._id,
                    action: 'APPLICATION_STATUS_CHANGE',
                    resourceType: 'application',
                    resourceId: application._id,
                    description: `Bot processed application: ${application.jobId.title}`
                });

                processedApplications.push(application);
            } catch (error) {
                errors.push({ appId, error: error.message });
            }
        }

        res.json({
            processed: processedApplications.length,
            errors,
            applications: processedApplications
        });
    } catch (error) {
        console.error('Process applications error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Simulate automated updates
exports.simulateUpdates = async (req, res) => {
    try {
        const { count = 5 } = req.body;

        // Get technical applications that can be processed
        const applications = await Application.find({ 
            status: { $in: ['pending', 'reviewing'] }
        })
        .populate('jobId', 'title department type')
        .limit(parseInt(count));

        const technicalApps = applications.filter(app => 
            app.jobId && 
            (app.jobId.department.toLowerCase().includes('engineering') ||
             app.jobId.department.toLowerCase().includes('technical') ||
             app.jobId.department.toLowerCase().includes('development'))
        );

        const updatedApplications = [];

        for (const app of technicalApps) {
            const statuses = ['pending', 'reviewing', 'shortlisted', 'accepted'];
            const currentIndex = statuses.indexOf(app.status);
            const nextStatus = statuses[currentIndex + 1] || 'accepted';

            app.status = nextStatus;
            await app.save();

            // Add automated note
            app.notes.push({
                text: `🤖 Automated update: Application moved to ${nextStatus} status by bot system`,
                addedBy: req.user._id
            });
            await app.save();

            // Create audit log
            await createAuditLog({
                userId: req.user._id,
                action: 'APPLICATION_STATUS_CHANGE',
                resourceType: 'application',
                resourceId: app._id,
                description: `Bot simulated update for: ${app.jobId.title}`
            });

            updatedApplications.push(app);
        }

        res.json({
            message: `Simulated updates for ${updatedApplications.length} applications`,
            applications: updatedApplications
        });
    } catch (error) {
        console.error('Simulate updates error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get technical applications only
exports.getTechnicalApplications = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = {};

        if (status) query.status = status;

        const skip = (page - 1) * limit;

        const applications = await Application.find(query)
            .populate([
                { path: 'jobId', select: 'title department type location' },
                { path: 'applicantId', select: 'username email' }
            ])
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Filter for technical roles only
        const technicalApplications = applications.filter(app => 
            app.jobId && 
            (app.jobId.department.toLowerCase().includes('engineering') ||
             app.jobId.department.toLowerCase().includes('technical') ||
             app.jobId.department.toLowerCase().includes('development'))
        );

        const total = await Application.countDocuments(query);

        res.json({
            applications: technicalApplications,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalApplications: total
        });
    } catch (error) {
        console.error('Get technical applications error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get bot activity log
exports.getBotActivity = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const activity = await AuditLog.find({ userId: req.user._id })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('resourceId');

        const total = await AuditLog.countDocuments({ userId: req.user._id });

        res.json({
            activity,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalActivities: total
        });
    } catch (error) {
        console.error('Get bot activity error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};