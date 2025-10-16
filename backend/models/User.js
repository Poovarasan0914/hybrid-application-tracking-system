// MongoDB ODM for schema definition and validation
const mongoose = require('mongoose');
// Secure password hashing library
const bcrypt = require('bcryptjs');

/**
 * User Schema Definition
 * 
 * Defines the structure for user accounts with role-based access control,
 * profile management, and secure authentication features.
 */
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    },
    role: {
        type: String,
        enum: ['applicant', 'admin', 'bot'],
        default: 'applicant'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    },
    profile: {
        firstName: { type: String, trim: true },
        lastName: { type: String, trim: true },
        phone: { type: String, trim: true },
        address: { type: String, trim: true },
        experience: { type: Number, min: 0 },
        skills: [{ type: String, trim: true }],
        education: { type: String, trim: true },
        resume: { type: String },
        isComplete: { type: Boolean, default: false }
    }
});

/**
 * Pre-save middleware to hash passwords
 * 
 * Automatically hashes the password before saving to database
 * using bcrypt with salt rounds for security. Only hashes if
 * password field has been modified.
 */
UserSchema.pre('save', async function(next) {
    // Skip hashing if password hasn't been modified
    if (!this.isModified('password')) {
        return next();
    }
    
    // Generate salt with 10 rounds for security
    const salt = await bcrypt.genSalt(10);
    // Hash password with generated salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON responses
UserSchema.set('toJSON', {
    transform: function(doc, ret) {
        delete ret.password;
        return ret;
    }
});

module.exports = mongoose.model('User', UserSchema);