const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: [
            'USER_CREATE',
            'USER_UPDATE',
            'USER_LOGIN',
            'USER_LOGOUT',
            'USER_STATUS_CHANGE',
            'JOB_CREATE',
            'JOB_UPDATE',
            'JOB_DELETE',
            'APPLICATION_SUBMIT',
            'APPLICATION_STATUS_CHANGE',
            'APPLICATION_NOTE_ADDED',
            'APPLICATION_VIEW',
            'BOT_MIMIC_WORKFLOW',
            'BOT_MIMIC_TRIGGER',
            'BOT_MIMIC_TOGGLE',
            'BOT_AUTO_PROCESS',
            'ADMIN_ACTION',
            'DASHBOARD_ACCESS',
            'SYSTEM_ACTION'
        ]
    },
    description: {
        type: String,
        required: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    resourceType: {
        type: String,
        enum: ['user', 'job', 'application', 'system'],
        required: true
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

// Add indexes for frequent queries
AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ userId: 1, timestamp: -1 });
AuditLogSchema.index({ resourceType: 1, resourceId: 1 });
AuditLogSchema.index({ action: 1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);