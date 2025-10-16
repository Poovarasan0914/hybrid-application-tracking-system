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

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 6
 *         role:
 *           type: string
 *           enum: [applicant, admin, bot]
 */

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

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post('/auth/register', registerValidation, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post('/auth/login', loginValidation, login);

// Protected routes
router.get('/auth/profile', authenticate, getProfile);
router.put('/auth/profile', authenticate, require('../controllers/userController').updateProfile);

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