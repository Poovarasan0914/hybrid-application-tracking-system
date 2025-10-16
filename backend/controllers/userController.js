const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { validationResult } = require('express-validator');
const { createAuditLog } = require('./auditController');
const { auditLogin } = require('../middleware/auditMiddleware');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const query = {};
        if (role && ['applicant', 'admin', 'bot'].includes(role)) {
            query.role = role;
        }
        const users = await User.find(query).select('-password');
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Register new user
exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password, role } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user with provided role (applicant or admin)
        const normalizedRole = (role === 'admin') ? 'admin' : 'applicant';
        user = new User({ username, email, password, role: normalizedRole });
        await user.save();

        // Create audit log for user registration
        await createAuditLog({
            userId: user._id,
            action: 'USER_CREATE',
            resourceType: 'user',
            resourceId: user._id,
            description: `New ${normalizedRole} registered`,
            details: { username, email, role: normalizedRole },
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Get user with password
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is deactivated' });
        }

        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        // Generate token
        const token = generateToken(user._id, user.role);

        // Log successful login
        await auditLogin(req, user, true);

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: create bot user
exports.createBotUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        let existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const botUser = new User({ username, email, password, role: 'bot', isActive: true });
        await botUser.save();

        await createAuditLog({
            userId: req.user._id,
            action: 'USER_CREATE',
            resourceType: 'user',
            resourceId: botUser._id,
            description: 'Admin created bot user'
        });

        res.status(201).json({
            id: botUser._id,
            username: botUser.username,
            email: botUser.email,
            role: botUser.role,
            isActive: botUser.isActive
        });
    } catch (error) {
        console.error('Create bot user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user);
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, address, experience, skills, education, resume } = req.body;
        
        const profileData = {
            firstName, lastName, phone, address, experience, skills, education, resume,
            isComplete: !!(firstName && lastName && phone && experience !== undefined && skills?.length)
        };

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { profile: profileData },
            { new: true, runValidators: true }
        );

        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Activate/deactivate user (admin only)
exports.toggleUserActivation = async (req, res) => {
    try {
        const { isActive } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent deactivating own account
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot deactivate own account' });
        }

        const oldStatus = user.isActive;
        user.isActive = isActive;
        await user.save();

        // Create audit log for user status change
        await createAuditLog({
            userId: req.user._id,
            action: 'USER_STATUS_CHANGE',
            resourceType: 'user',
            resourceId: user._id,
            description: `User ${isActive ? 'activated' : 'deactivated'} by admin`,
            details: {
                targetUser: user.username,
                oldStatus,
                newStatus: isActive,
                changedBy: req.user.username
            },
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.json(user);
    } catch (error) {
        console.error('User activation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};