const Application = require('../models/Application');
const Job = require('../models/Job');
const { createAuditLog } = require('./auditController');

// Get bot dashboard data
exports.getDashboard = async (req, res) => {
    try {
        // Get pending applications
        const pendingApplications = await Application.find({ status: 'pending' })
            .populate([
                { path: 'jobId', select: 'title department type' },
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
            action: 'VIEW',
            resourceType: 'BOT_DASHBOARD',
            details: 'Bot accessed dashboard data'
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