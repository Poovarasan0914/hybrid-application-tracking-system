const Application = require('../models/Application');
const Job = require('../models/Job');
const { validationResult } = require('express-validator');
const { createAuditLog } = require('./auditController');

// Submit new application
exports.submitApplication = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { jobId, coverLetter, documents } = req.body;

        // Check if job exists and is active
        const job = await Job.findOne({ _id: jobId, isActive: true });
        if (!job) {
            return res.status(404).json({ message: 'Job not found or is no longer active' });
        }

        // Check if user has already applied
        const existingApplication = await Application.findOne({
            jobId,
            applicantId: req.user._id
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        // Create new application
        const application = new Application({
            jobId,
            applicantId: req.user._id,
            coverLetter: coverLetter || '',
            documents: documents || []
        });

        await application.save();

        // Create audit log for application submission
        await createAuditLog({
            userId: req.user._id,
            action: 'APPLICATION_SUBMIT',
            resourceType: 'application',
            resourceId: application._id,
            description: `Application submitted for job: ${job.title}`
        });

        // Populate job and applicant details
        await application.populate([
            { path: 'jobId', select: 'title department' },
            { path: 'applicantId', select: 'username email' }
        ]);

        res.status(201).json(application);
    } catch (error) {
        console.error('Application submission error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get my applications
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicantId: req.user._id })
            .populate('jobId', 'title department')
            .sort({ submittedAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all applications (admin only) - filtered by role type
exports.getAllApplications = async (req, res) => {
    try {
        const { status, roleType, page = 1, limit = 10 } = req.query;
        const query = {};

        // Add status filter if provided
        if (status) {
            query.status = status;
        }

        // Pagination
        const skip = (page - 1) * limit;

        const applications = await Application.find(query)
            .populate([
                { path: 'jobId', select: 'title department roleCategory' },
                { path: 'applicantId', select: 'username email' }
            ])
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Filter by role type if specified
        let filteredApplications = applications;
        if (roleType) {
            filteredApplications = applications.filter(app => 
                app.jobId && app.jobId.roleCategory === roleType
            );
        }

        // Get total count for pagination
        const total = await Application.countDocuments(query);

        res.json({
            applications: filteredApplications,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalApplications: total,
            roleFilter: roleType || 'all'
        });
    } catch (error) {
        console.error('Get all applications error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get non-technical applications for admin management
exports.getNonTechnicalApplications = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = {};

        if (status) query.status = status;

        const skip = (page - 1) * limit;

        const applications = await Application.find(query)
            .populate([
                { path: 'jobId', select: 'title department roleCategory' },
                { path: 'applicantId', select: 'username email' }
            ])
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Filter for non-technical roles only
        const nonTechnicalApplications = applications.filter(app => 
            app.jobId && app.jobId.roleCategory === 'non-technical'
        );

        const totalNonTechnical = await Application.countDocuments({})
            .then(async () => {
                const allApps = await Application.find({}).populate('jobId', 'roleCategory');
                return allApps.filter(app => app.jobId && app.jobId.roleCategory === 'non-technical').length;
            });

        res.json({
            applications: nonTechnicalApplications,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalNonTechnical / limit),
            totalApplications: totalNonTechnical
        });
    } catch (error) {
        console.error('Get non-technical applications error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get application by ID
exports.getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate([
                { path: 'jobId', select: 'title department' },
                { path: 'applicantId', select: 'username email' },
                { path: 'notes.addedBy', select: 'username role' }
            ]);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if user is authorized to view this application
        if (req.user.role !== 'admin' && 
            application.applicantId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this application' });
        }

        res.json(application);
    } catch (error) {
        console.error('Get application error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update application status (admin for non-technical, bot for technical)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { status } = req.body;
        const application = await Application.findById(req.params.id)
            .populate('jobId', 'roleCategory title');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check role-based permissions
        const isAdmin = req.user.role === 'admin';
        const isBot = req.user.role === 'bot';
        const isTechnicalRole = application.jobId && application.jobId.roleCategory === 'technical';
        
        // Admin can only update non-technical roles
        if (isAdmin && isTechnicalRole) {
            return res.status(403).json({ 
                message: 'Technical roles are handled automatically by the bot system' 
            });
        }
        
        // Bot can only update technical roles
        if (isBot && !isTechnicalRole) {
            return res.status(403).json({ 
                message: 'Non-technical roles must be handled manually by admin' 
            });
        }

        const oldStatus = application.status;
        application.status = status;
        await application.save();

        // Add note about who updated it
        const updateSource = isBot ? 'Bot System' : 'Admin';
        application.notes.push({
            text: `Status updated from ${oldStatus} to ${status} by ${updateSource}`,
            addedBy: req.user._id
        });
        await application.save();

        // Create audit log for status change
        await createAuditLog({
            userId: req.user._id,
            action: 'APPLICATION_STATUS_CHANGE',
            resourceType: 'application',
            resourceId: application._id,
            description: `${updateSource} updated ${application.jobId.title}: ${oldStatus} -> ${status}`
        });

        res.json(application);
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add note to application (admin/bot only)
exports.addApplicationNote = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { note } = req.body;
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.notes.push({
            text: note,
            addedBy: req.user._id
        });

        await application.save();
        
        // Populate the newly added note's addedBy field
        await application.populate('notes.addedBy', 'username role');

        res.json(application);
    } catch (error) {
        console.error('Add note error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get application timeline/activity history
exports.getApplicationTimeline = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate([
                { path: 'jobId', select: 'title department' },
                { path: 'applicantId', select: 'username email' },
                { path: 'notes.addedBy', select: 'username role' }
            ]);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if user is authorized to view this application
        if (req.user.role !== 'admin' && 
            application.applicantId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this application' });
        }

        // Get audit logs for this application
        const AuditLog = require('../models/AuditLog');
        const auditLogs = await AuditLog.find({ 
            resourceType: 'APPLICATION',
            resourceId: application._id 
        })
        .populate('userId', 'username role')
        .sort({ timestamp: -1 });

        // Create timeline events
        const timeline = [];

        // Add application submission event
        timeline.push({
            type: 'submission',
            timestamp: application.submittedAt,
            title: 'Application Submitted',
            description: `Applied for ${application.jobId.title}`,
            user: application.applicantId.username,
            status: 'submitted'
        });

        // Add status change events from audit logs
        auditLogs.forEach(log => {
            if (log.action === 'APPLICATION_STATUS_CHANGE') {
                timeline.push({
                    type: 'status_change',
                    timestamp: log.timestamp,
                    title: 'Status Updated',
                    description: log.details,
                    user: log.userId.username,
                    status: 'updated'
                });
            }
        });

        // Add note events
        application.notes.forEach(note => {
            timeline.push({
                type: 'note',
                timestamp: note.addedAt,
                title: 'Note Added',
                description: note.text,
                user: note.addedBy.username,
                status: 'commented'
            });
        });

        // Sort timeline by timestamp
        timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.json({
            application: {
                id: application._id,
                job: application.jobId,
                applicant: application.applicantId,
                status: application.status,
                submittedAt: application.submittedAt,
                lastUpdated: application.lastUpdated
            },
            timeline,
            totalEvents: timeline.length
        });
    } catch (error) {
        console.error('Get application timeline error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};