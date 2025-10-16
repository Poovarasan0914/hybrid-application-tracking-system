const AuditLog = require('../models/AuditLog');

// Get audit logs (admin only)
exports.getAuditLogs = async (req, res) => {
    try {
        const { page = 1, limit = 20, action, resourceType, userId } = req.query;
        const query = {};

        // Add filters if provided
        if (action) query.action = action;
        if (resourceType) query.resourceType = resourceType;
        if (userId) query.userId = userId;

        // Pagination
        const skip = (page - 1) * limit;

        const auditLogs = await AuditLog.find(query)
            .populate('userId', 'username email role')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await AuditLog.countDocuments(query);

        res.json({
            auditLogs,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalLogs: total
        });
    } catch (error) {
        console.error('Get audit logs error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create audit log (utility function)
exports.createAuditLog = async (logData) => {
    try {
        const auditLog = new AuditLog({
            userId: logData.userId,
            action: logData.action,
            description: logData.description || logData.details,
            details: logData.details || {},
            ipAddress: logData.ipAddress,
            userAgent: logData.userAgent,
            resourceType: logData.resourceType,
            resourceId: logData.resourceId
        });

        await auditLog.save();
        return auditLog;
    } catch (error) {
        console.error('Create audit log error:', error);
        // Don't throw error to avoid breaking the main operation
        return null;
    }
};
