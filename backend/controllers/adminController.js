const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { createAuditLog } = require('./auditController');

// Admin Dashboard - Get comprehensive metrics
exports.getAdminDashboard = async (req, res) => {
    try {
        console.log('Loading admin dashboard data...');
        
        // Get all applications with job details
        const allApplications = await Application.find({})
            .populate('jobId', 'title department roleCategory')
            .populate('applicantId', 'username email');

        console.log(`Found ${allApplications.length} total applications`);

        // Get all applications (not just non-technical for better stats)
        const validApplications = allApplications.filter(app => app.jobId);
        
        // Filter non-technical applications for specific stats
        const nonTechnicalApps = validApplications.filter(app => 
            app.jobId.roleCategory === 'non-technical'
        );

        console.log(`Found ${nonTechnicalApps.length} non-technical applications`);

        // Application statistics by status (all applications)
        const applicationStats = validApplications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {});

        // Recent applications (last 7 days) - all applications
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentApplications = validApplications.filter(app => 
            new Date(app.submittedAt) >= weekAgo
        );

        // Job statistics
        const totalJobs = await Job.countDocuments({ isActive: true });
        const nonTechnicalJobs = await Job.countDocuments({ 
            isActive: true, 
            roleCategory: 'non-technical' 
        });
        const technicalJobs = await Job.countDocuments({ 
            isActive: true, 
            roleCategory: 'technical' 
        });

        // User statistics
        const totalUsers = await User.countDocuments({});
        const activeUsers = await User.countDocuments({ isActive: true });

        // Applications by department (all applications)
        const departmentStats = validApplications.reduce((acc, app) => {
            const dept = app.jobId?.department || 'Unknown';
            acc[dept] = (acc[dept] || 0) + 1;
            return acc;
        }, {});

        console.log('Dashboard stats:', {
            totalApplications: validApplications.length,
            nonTechnicalApps: nonTechnicalApps.length,
            recentApps: recentApplications.length,
            totalJobs,
            activeUsers
        });

        // Create audit log
        await createAuditLog({
            userId: req.user._id,
            action: 'DASHBOARD_ACCESS',
            resourceType: 'system',
            resourceId: req.user._id,
            description: 'Admin accessed dashboard',
            details: {
                role: 'admin',
                username: req.user.username,
                totalAppsCount: validApplications.length
            },
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.json({
            applicationStats,
            recentApplications: recentApplications.length,
            totalApplications: validApplications.length,
            nonTechnicalApplications: nonTechnicalApps.length,
            totalJobs,
            nonTechnicalJobs,
            technicalJobs,
            totalUsers,
            activeUsers,
            departmentStats,
            adminInfo: {
                id: req.user._id,
                name: req.user.username,
                lastAccess: new Date(),
                managedRoles: 'all'
            }
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get applications for admin management
exports.getNonTechnicalApplications = async (req, res) => {
    try {
        const { status, department, page = 1, limit = 20, roleCategory } = req.query;
        const skip = (page - 1) * limit;

        // Build query for applications
        const applications = await Application.find({})
            .populate([
                { path: 'jobId', select: 'title department roleCategory' },
                { path: 'applicantId', select: 'username email profile' }
            ])
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Filter applications based on role category
        let filteredApps = applications;
        if (roleCategory && roleCategory !== 'all') {
            filteredApps = applications.filter(app => 
                app.jobId && app.jobId.roleCategory === roleCategory
            );
        }

        // Apply additional filters
        if (status) {
            filteredApps = filteredApps.filter(app => app.status === status);
        }
        if (department) {
            filteredApps = filteredApps.filter(app => 
                app.jobId && app.jobId.department === department
            );
        }

        const totalCount = await Application.countDocuments({});

        res.json({
            applications: filteredApps,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / limit),
            totalApplications: filteredApps.length
        });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Manually update application status (non-technical only)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status, comment } = req.body;
        const application = await Application.findById(req.params.id)
            .populate('jobId', 'roleCategory title');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // For technical roles, only allow accept/reject for shortlisted applications
        if (application.jobId.roleCategory === 'technical') {
            if (application.status !== 'shortlisted') {
                return res.status(403).json({ 
                    message: 'Technical applications must be shortlisted by bot before admin can accept/reject' 
                });
            }
            if (!['accepted', 'rejected'].includes(status)) {
                return res.status(403).json({ 
                    message: 'Technical roles can only be accepted or rejected by admin' 
                });
            }
        }

        const oldStatus = application.status;
        application.status = status;

        // Add admin comment if provided
        if (comment && comment.trim()) {
            application.notes.push({
                text: `Admin Update: ${comment}`,
                addedBy: req.user._id,
                addedAt: new Date(),
                processedBy: 'admin',
                actionType: 'status_change_with_comment'
            });
        }

        await application.save();

        // Create audit log
        await createAuditLog({
            userId: req.user._id,
            action: 'APPLICATION_STATUS_CHANGE',
            resourceType: 'application',
            resourceId: application._id,
            description: `Admin manually updated application status: ${oldStatus} → ${status}`,
            details: {
                oldStatus,
                newStatus: status,
                comment: comment || null,
                jobTitle: application.jobId.title,
                processedBy: 'admin',
                adminUsername: req.user.username
            },
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.json({
            message: 'Application status updated successfully',
            application
        });
    } catch (error) {
        console.error('Update application status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add note to application
exports.addApplicationNote = async (req, res) => {
    try {
        const { note } = req.body;
        const application = await Application.findById(req.params.id)
            .populate('jobId', 'roleCategory title');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Add admin note
        application.notes.push({
            text: `Admin Note: ${note}`,
            addedBy: req.user._id,
            addedAt: new Date(),
            processedBy: 'admin',
            actionType: 'admin_note'
        });

        await application.save();

        // Create audit log
        await createAuditLog({
            userId: req.user._id,
            action: 'APPLICATION_NOTE_ADDED',
            resourceType: 'application',
            resourceId: application._id,
            description: 'Admin added note to application',
            details: {
                noteText: note,
                jobTitle: application.jobId.title,
                adminUsername: req.user.username
            },
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.json({
            message: 'Note added successfully',
            application
        });
    } catch (error) {
        console.error('Add application note error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create new job role
exports.createJobRole = async (req, res) => {
    try {
        const jobData = {
            ...req.body,
            postedBy: req.user._id,
            roleCategory: req.body.roleCategory || 'non-technical' // Default to non-technical for admin
        };

        const job = new Job(jobData);
        await job.save();

        // Create audit log
        await createAuditLog({
            userId: req.user._id,
            action: 'JOB_CREATE',
            resourceType: 'job',
            resourceId: job._id,
            description: `Admin created new job role: ${job.title}`,
            details: {
                jobTitle: job.title,
                department: job.department,
                roleCategory: job.roleCategory,
                type: job.type,
                createdBy: req.user.username
            },
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.status(201).json({
            message: 'Job role created successfully',
            job
        });
    } catch (error) {
        console.error('Create job role error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get application progress tracking
exports.getApplicationProgress = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate([
                { path: 'jobId', select: 'title department roleCategory' },
                { path: 'applicantId', select: 'username email' },
                { path: 'notes.addedBy', select: 'username role' }
            ]);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Get audit logs for this application
        const AuditLog = require('../models/AuditLog');
        const auditLogs = await AuditLog.find({
            resourceType: 'application',
            resourceId: application._id
        })
        .populate('userId', 'username role')
        .sort({ timestamp: -1 });

        // Create progress timeline
        const progressTimeline = [];

        // Add submission event
        progressTimeline.push({
            type: 'submission',
            timestamp: application.submittedAt,
            title: 'Application Submitted',
            description: `Applied for ${application.jobId.title}`,
            user: application.applicantId.username,
            source: 'applicant'
        });

        // Add audit events
        auditLogs.forEach(log => {
            if (log.action === 'APPLICATION_STATUS_CHANGE') {
                progressTimeline.push({
                    type: 'status_change',
                    timestamp: log.timestamp,
                    title: 'Status Updated',
                    description: log.description,
                    user: log.userId ? log.userId.username : 'System',
                    source: log.details?.processedBy || 'system'
                });
            }
            if (log.action === 'APPLICATION_NOTE_ADDED') {
                progressTimeline.push({
                    type: 'note',
                    timestamp: log.timestamp,
                    title: 'Note Added',
                    description: log.details?.noteText || 'Note added',
                    user: log.userId ? log.userId.username : 'Admin',
                    source: 'admin'
                });
            }
        });

        // Sort by timestamp
        progressTimeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.json({
            application: {
                id: application._id,
                job: application.jobId,
                applicant: application.applicantId,
                status: application.status,
                submittedAt: application.submittedAt,
                lastUpdated: application.lastUpdated,
                notes: application.notes
            },
            progressTimeline,
            totalEvents: progressTimeline.length
        });
    } catch (error) {
        console.error('Get application progress error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

