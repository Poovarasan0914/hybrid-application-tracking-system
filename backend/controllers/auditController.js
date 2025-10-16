const AuditLog = require('../models/AuditLog');

// Get audit logs (admin only)
exports.getAuditLogs = async (req, res) => {
    try {
        console.log('Audit logs request query:', req.query);
        console.log('Requesting user:', req.user?.username, req.user?.role);
        
        const { page = 1, limit = 20, action, resourceType, userId } = req.query;
        const query = {};

        // Add filters if provided
        if (action && action !== '') query.action = action;
        if (resourceType && resourceType !== '') query.resourceType = resourceType;
        if (userId && userId !== '') query.userId = userId;

        console.log('Audit query:', query);

        // Pagination
        const skip = (page - 1) * limit;
        const limitNum = parseInt(limit);

        const auditLogs = await AuditLog.find(query)
            .populate('userId', 'username email role')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limitNum);

        // Get total count for pagination
        const total = await AuditLog.countDocuments(query);

        console.log(`Found ${auditLogs.length} audit logs out of ${total} total`);

        res.json({
            auditLogs,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limitNum),
            totalLogs: total
        });
    } catch (error) {
        console.error('Get audit logs error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
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
