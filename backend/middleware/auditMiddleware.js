const { createAuditLog } = require('../controllers/auditController');

// Middleware to automatically log API requests
const auditMiddleware = (action, resourceType) => {
    return async (req, res, next) => {
        // Store original res.json to intercept response
        const originalJson = res.json;
        
        res.json = function(data) {
            // Log the action after successful response
            if (res.statusCode >= 200 && res.statusCode < 300) {
                setImmediate(async () => {
                    try {
                        await createAuditLog({
                            userId: req.user?._id || null,
                            action: action,
                            resourceType: resourceType,
                            resourceId: req.params.id || req.user?._id || 'system',
                            description: `${action.replace(/_/g, ' ').toLowerCase()} - ${req.method} ${req.originalUrl}`,
                            details: {
                                method: req.method,
                                url: req.originalUrl,
                                params: req.params,
                                query: req.query,
                                userAgent: req.get('User-Agent'),
                                ipAddress: req.ip || req.connection.remoteAddress,
                                timestamp: new Date(),
                                statusCode: res.statusCode
                            },
                            ipAddress: req.ip || req.connection.remoteAddress,
                            userAgent: req.get('User-Agent')
                        });
                    } catch (error) {
                        console.error('Audit logging error:', error);
                    }
                });
            }
            
            // Call original json method
            return originalJson.call(this, data);
        };
        
        next();
    };
};

// Specific audit functions for common actions
const auditLogin = async (req, user, success = true) => {
    await createAuditLog({
        userId: user._id,
        action: 'USER_LOGIN',
        resourceType: 'user',
        resourceId: user._id,
        description: success ? 'User logged in successfully' : 'Failed login attempt',
        details: {
            username: user.username,
            email: user.email,
            success: success,
            timestamp: new Date()
        },
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
    });
};

const auditLogout = async (req, user) => {
    await createAuditLog({
        userId: user._id,
        action: 'USER_LOGOUT',
        resourceType: 'user',
        resourceId: user._id,
        description: 'User logged out',
        details: {
            username: user.username,
            timestamp: new Date()
        },
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
    });
};

const auditDashboardAccess = async (req, user) => {
    await createAuditLog({
        userId: user._id,
        action: 'DASHBOARD_ACCESS',
        resourceType: 'system',
        resourceId: user._id,
        description: `${user.role} accessed dashboard`,
        details: {
            role: user.role,
            username: user.username,
            timestamp: new Date()
        },
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
    });
};

module.exports = {
    auditMiddleware,
    auditLogin,
    auditLogout,
    auditDashboardAccess
};