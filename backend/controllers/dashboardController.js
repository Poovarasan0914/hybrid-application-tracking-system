const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// Get applicant dashboard data
exports.getApplicantDashboard = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Get user's applications with status counts
        const applications = await Application.find({ applicantId: userId })
            .populate('jobId', 'title department type')
            .sort({ submittedAt: -1 });

        // Get application statistics
        const statusCounts = await Application.aggregate([
            { $match: { applicantId: userId } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Get recent activity
        const recentActivity = await AuditLog.find({ userId })
            .sort({ timestamp: -1 })
            .limit(10)
            .populate('resourceId');

        // Get available jobs
        const availableJobs = await Job.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title department type location deadline');

        res.json({
            applications,
            statusCounts,
            recentActivity,
            availableJobs,
            totalApplications: applications.length
        });
    } catch (error) {
        console.error('Applicant dashboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get admin dashboard data
exports.getAdminDashboard = async (req, res) => {
    try {
        // Get all applications with pagination
        const { page = 1, limit = 10, status } = req.query;
        const query = {};
        if (status) query.status = status;

        const skip = (page - 1) * limit;

        const applications = await Application.find(query)
            .populate([
                { path: 'jobId', select: 'title department type' },
                { path: 'applicantId', select: 'username email' }
            ])
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get application statistics
        const applicationStats = await Application.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Get job statistics
        const jobStats = await Job.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);

        // Get recent activity
        const recentActivity = await AuditLog.find()
            .sort({ timestamp: -1 })
            .limit(20)
            .populate('userId', 'username role');

        // Get total counts
        const totalApplications = await Application.countDocuments();
        const totalJobs = await Job.countDocuments({ isActive: true });
        const totalUsers = await User.countDocuments({ role: 'applicant' });

        res.json({
            applications,
            applicationStats,
            jobStats,
            recentActivity,
            totals: {
                applications: totalApplications,
                jobs: totalJobs,
                users: totalUsers
            },
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalApplications / limit)
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get bot dashboard data (enhanced version)
exports.getBotDashboard = async (req, res) => {
    try {
        // Get pending technical applications
        const pendingApplications = await Application.find({ status: 'pending' })
            .populate([
                { path: 'jobId', select: 'title department type' },
                { path: 'applicantId', select: 'username email' }
            ])
            .sort({ submittedAt: 1 });

        // Filter for technical roles only
        const technicalApplications = pendingApplications.filter(app => 
            app.jobId && app.jobId.type === 'full-time' && 
            (app.jobId.department.toLowerCase().includes('engineering') || 
             app.jobId.department.toLowerCase().includes('technical') ||
             app.jobId.department.toLowerCase().includes('development'))
        );

        // Get active technical jobs
        const activeJobs = await Job.find({ 
            isActive: true,
            $or: [
                { department: { $regex: /engineering|technical|development/i } },
                { type: 'full-time' }
            ]
        })
        .populate('postedBy', 'username')
        .sort({ createdAt: -1 });

        // Get application statistics
        const applicationStats = await Application.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Get bot activity log
        const botActivity = await AuditLog.find({ userId: req.user._id })
            .sort({ timestamp: -1 })
            .limit(10);

        res.json({
            pendingApplications: technicalApplications,
            activeJobs,
            applicationStats,
            botActivity,
            botInfo: {
                id: req.user._id,
                name: req.user.username,
                lastAccess: new Date(),
                processedToday: botActivity.length
            }
        });
    } catch (error) {
        console.error('Bot dashboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
