const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Job description is required']
    },
    requirements: [{
        type: String,
        required: true
    }],
    roleCategory: {
        type: String,
        enum: ['technical', 'non-technical'],
        required: true,
        default: 'technical'
    },
    type: {
        type: String,
        required: true,
        enum: ['full-time', 'part-time', 'contract', 'internship'],
        default: 'full-time'
    },
    location: {
        type: String,
        required: true
    },
    salary: {
        min: {
            type: Number,
            required: true
        },
        max: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'USD'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
JobSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Job', JobSchema);