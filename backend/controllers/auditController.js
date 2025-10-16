const AuditLog = require('../models/AuditLog');

// Get audit logs with filtering and pagination
exports.getAuditLogs = async (req, res) => {
    try {
        const {
            action,
            resourceType,
            resourceId,
            userId,
            startDate,
            endDate,
            page = 1,
            limit = 50
        } = req.query;

        // Build query
        const query = {};

        if (action) query.action = action;
        if (resourceType) query.resourceType = resourceType;
        if (resourceId) query.resourceId = resourceId;
        if (userId) query.userId = userId;

        // Date range filter
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query with population
        const logs = await AuditLog.find(query)
            .populate('userId', 'username email role')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await AuditLog.countDocuments(query);

        res.json({
            logs,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalLogs: total
        });
    } catch (error) {
        console.error('Get audit logs error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create audit log entry (internal use)
exports.createAuditLog = async (action, description, userId, resourceType, resourceId, req) => {
    try {
        const auditLog = new AuditLog({
            action,
            description,
            userId,
            resourceType,
            resourceId,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            details: {
                method: req.method,
                path: req.path,
                query: req.query,
                body: action.includes('PASSWORD') ? { ...req.body, password: '[REDACTED]' } : req.body
            }
        });

        await auditLog.save();
        return auditLog;
    } catch (error) {
        console.error('Create audit log error:', error);
        // Don't throw error to prevent disrupting main operations
        return null;
    }
};