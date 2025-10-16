const express = require('express');
const { body } = require('express-validator');
const { authenticate, isAdmin } = require('../middleware/auth');
const {
    register,
    login,
    getProfile,
    getAllUsers,
    toggleUserActivation
} = require('../controllers/userController');

const router = express.Router();

// Validation middleware
const registerValidation = [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['applicant', 'admin']).withMessage('Role must be applicant or admin')
];

const loginValidation = [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

// Public routes
router.post('/auth/register', registerValidation, register);
router.post('/auth/login', loginValidation, login);

// Protected routes
router.get('/auth/profile', authenticate, getProfile);

// Admin routes
router.get('/admin/users', authenticate, isAdmin, getAllUsers);
router.put('/admin/users/:id/activate', authenticate, isAdmin, [
    body('isActive').isBoolean().withMessage('isActive must be a boolean')
], toggleUserActivation);

// Admin create bot user
router.post('/admin/users/bots', authenticate, isAdmin, [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], require('../controllers/userController').createBotUser);

module.exports = router;