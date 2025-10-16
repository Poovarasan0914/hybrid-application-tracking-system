const Application = require('../models/Application');
const Job = require('../models/Job');
const { createAuditLog } = require('./auditController');
const botMimic = require('../services/botMimic');

// Get bot dashboard data - only technical applications
exports.getDashboard = async (req, res) => {
    try {
        // Get pending technical applications only
        const pendingApplications = await Application.find({ status: 'pending' })
            .populate([
                { path: 'jobId', select: 'title department type roleCategory' },
                { path: 'applicantId', select: 'username email' }
            ])
            .sort({ createdAt: 1 }); // Process oldest first
        
        // Filter for technical roles only
        const technicalApplications = pendingApplications.filter(app => 
            app.jobId && app.jobId.roleCategory === 'technical'
        );

        // Get active technical jobs only
        const activeJobs = await Job.find({ isActive: true, roleCategory: 'technical' })
            .populate('postedBy', 'username')
            .sort({ createdAt: -1 });

        // Get application statistics for technical roles only
        const allTechnicalApps = await Application.find({})
            .populate('jobId', 'roleCategory');
        
        const technicalAppsOnly = allTechnicalApps.filter(app => 
            app.jobId && app.jobId.roleCategory === 'technical'
        );
        
        const applicationStats = technicalAppsOnly.reduce((acc, app) => {
            const existing = acc.find(stat => stat._id === app.status);
            if (existing) {
                existing.count++;
            } else {
                acc.push({ _id: app.status, count: 1 });
            }
            return acc;
        }, []);

        // Create audit log for bot dashboard access
        await createAuditLog({
            userId: req.user._id,
            action: 'DASHBOARD_ACCESS',
            resourceType: 'system',
            resourceId: req.user._id,
            description: 'Bot accessed dashboard data',
            details: {
                role: 'bot',
                username: req.user.username,
                pendingCount: technicalApplications.length,
                activeJobsCount: activeJobs.length
            },
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.json({
            pendingApplications: technicalApplications,
            activeJobs,
            applicationStats,
            botInfo: {
                id: req.user._id,
                name: req.user.username,
                lastAccess: new Date(),
                handledRoles: 'technical'
            }
        });
    } catch (error) {
        console.error('Bot dashboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Auto-process technical applications with random outcomes
exports.processApplications = async (req, res) => {
    try {
        // Get all pending technical applications
        const pendingTechnicalApps = await Application.find({ status: 'pending' })
            .populate('jobId', 'title department type roleCategory');
        
        const technicalApps = pendingTechnicalApps.filter(app => 
            app.jobId && app.jobId.roleCategory === 'technical'
        );

        const processedApplications = [];
        const statuses = ['reviewing', 'shortlisted', 'rejected', 'accepted'];

        for (const application of technicalApps) {
            // Random status progression for technical roles
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            application.status = randomStatus;
            await application.save();

            // Add automated note
            application.notes.push({
                text: `🤖 Bot Auto-Processing: Status randomly updated to ${randomStatus} for technical role`,
                addedBy: req.user._id
            });
            await application.save();

            // Create audit log
            await createAuditLog({
                userId: req.user._id,
                action: 'APPLICATION_STATUS_CHANGE',
                resourceType: 'application',
                resourceId: application._id,
                description: `Bot auto-processed technical application: ${application.jobId.title}`
            });

            processedApplications.push(application);
        }

        res.json({
            processed: processedApplications.length,
            message: `Auto-processed ${processedApplications.length} technical applications`,
            applications: processedApplications
        });
    } catch (error) {
        console.error('Process applications error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Auto-process all pending technical applications
exports.autoProcessTechnical = async (req, res) => {
    try {
        // Get all pending technical applications
        const pendingApps = await Application.find({ status: 'pending' })
            .populate('jobId', 'title department type roleCategory');

        const technicalApps = pendingApps.filter(app => 
            app.jobId && app.jobId.roleCategory === 'technical'
        );

        const updatedApplications = [];
        const outcomes = ['reviewing', 'shortlisted', 'rejected', 'accepted'];

        for (const app of technicalApps) {
            // Random outcome for technical applications
            const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
            
            app.status = randomOutcome;
            await app.save();

            // Add automated note with detailed info
            app.notes.push({
                text: `🤖 Bot Auto-Processing: Status changed from pending to ${randomOutcome} (Technical role - automated processing)`,
                addedBy: req.user._id,
                addedAt: new Date(),
                processedBy: 'bot',
                actionType: 'status_change'
            });
            await app.save();

            // Create detailed audit log
            await createAuditLog({
                userId: req.user._id,
                action: 'APPLICATION_STATUS_CHANGE',
                resourceType: 'application',
                resourceId: app._id,
                description: `Bot auto-processed technical role: ${app.jobId.title} -> ${randomOutcome}`,
                details: {
                    oldStatus: 'pending',
                    newStatus: randomOutcome,
                    processedBy: 'bot',
                    roleCategory: 'technical',
                    timestamp: new Date()
                }
            });

            updatedApplications.push(app);
        }

        res.json({
            message: `Auto-processed ${updatedApplications.length} technical applications`,
            processed: updatedApplications.length,
            applications: updatedApplications
        });
    } catch (error) {
        console.error('Auto process technical error:', error);
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
                { path: 'jobId', select: 'title department type location roleCategory' },
                { path: 'applicantId', select: 'username email' }
            ])
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Filter for technical roles using roleCategory
        const technicalApplications = applications.filter(app => 
            app.jobId && app.jobId.roleCategory === 'technical'
        );

        const totalTechnical = await Application.countDocuments({})
            .then(async () => {
                const allApps = await Application.find({}).populate('jobId', 'roleCategory');
                return allApps.filter(app => app.jobId && app.jobId.roleCategory === 'technical').length;
            });

        res.json({
            applications: technicalApplications,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalTechnical / limit),
            totalApplications: totalTechnical
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

// Bot Mimic - Trigger human-like workflow
exports.triggerBotMimic = async (req, res) => {
    try {
        const result = await botMimic.triggerWorkflow();
        
        // Create audit log
        await createAuditLog({
            userId: req.user._id,
            action: 'BOT_MIMIC_TRIGGER',
            resourceType: 'system',
            resourceId: req.user._id,
            description: 'Bot Mimic workflow manually triggered'
        });

        res.json({
            message: 'Bot Mimic workflow triggered successfully',
            result
        });
    } catch (error) {
        console.error('Bot Mimic trigger error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Bot Mimic workflow statistics
exports.getBotMimicStats = async (req, res) => {
    try {
        const stats = await botMimic.getWorkflowStats();
        res.json(stats);
    } catch (error) {
        console.error('Bot Mimic stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Start/Stop Bot Mimic
exports.toggleBotMimic = async (req, res) => {
    try {
        const { action } = req.body; // 'start' or 'stop'
        
        if (action === 'start') {
            botMimic.start();
        } else if (action === 'stop') {
            botMimic.stop();
        } else {
            return res.status(400).json({ message: 'Invalid action. Use start or stop.' });
        }

        // Create audit log
        await createAuditLog({
            userId: req.user._id,
            action: 'BOT_MIMIC_TOGGLE',
            resourceType: 'system',
            resourceId: req.user._id,
            description: `Bot Mimic ${action}ed by admin`
        });

        res.json({
            message: `Bot Mimic ${action}ed successfully`,
            isRunning: botMimic.isRunning
        });
    } catch (error) {
        console.error('Bot Mimic toggle error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};