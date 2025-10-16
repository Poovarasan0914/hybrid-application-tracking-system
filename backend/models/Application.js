const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coverLetter: {
        type: String,
        required: false,
        default: ''
    },
    documents: [{
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    }],
    status: {
        type: String,
        enum: ['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'],
        default: 'pending'
    },
    notes: [{
        text: {
            type: String,
            required: true
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    submittedAt: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Update lastUpdated timestamp before saving
ApplicationSchema.pre('save', function(next) {
    this.lastUpdated = Date.now();
    next();
});

// Add indexes for frequent queries
ApplicationSchema.index({ applicantId: 1, jobId: 1 }, { unique: true });
ApplicationSchema.index({ status: 1 });
ApplicationSchema.index({ submittedAt: -1 });

module.exports = mongoose.model('Application', ApplicationSchema);