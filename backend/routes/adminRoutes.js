const express = require('express');
const { body } = require('express-validator');
const { authenticate, isAdmin } = require('../middleware/auth');
const {
    getAdminDashboard,
    getNonTechnicalApplications,
    updateApplicationStatus,
    addApplicationNote,
    createJobRole,
    getApplicationProgress
} = require('../controllers/adminController');

const router = express.Router();

// Validation middleware
const jobValidation = [
    body('title').notEmpty().withMessage('Job title is required'),
    body('department').notEmpty().withMessage('Department is required'),
    body('description').notEmpty().withMessage('Job description is required'),
    body('requirements').isArray().withMessage('Requirements must be an array'),
    body('type').isIn(['full-time', 'part-time', 'contract', 'internship']).withMessage('Invalid job type'),
    body('location').notEmpty().withMessage('Location is required'),
    body('salary.min').isNumeric().withMessage('Minimum salary must be a number'),
    body('salary.max').isNumeric().withMessage('Maximum salary must be a number'),
    body('deadline').isISO8601().withMessage('Valid deadline date is required')
];

const statusUpdateValidation = [
    body('status').isIn(['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'])
        .withMessage('Invalid status value'),
    body('comment').optional().isString().withMessage('Comment must be a string')
];

const noteValidation = [
    body('note').notEmpty().withMessage('Note text is required')
        .isLength({ min: 3 }).withMessage('Note must be at least 3 characters long')
];

// Admin routes
router.get('/admin/dashboard', authenticate, isAdmin, getAdminDashboard);
router.get('/admin/applications/non-technical', authenticate, isAdmin, getNonTechnicalApplications);
router.put('/admin/applications/:id/status', authenticate, isAdmin, statusUpdateValidation, updateApplicationStatus);
router.post('/admin/applications/:id/notes', authenticate, isAdmin, noteValidation, addApplicationNote);
router.post('/admin/jobs', authenticate, isAdmin, jobValidation, createJobRole);
router.get('/admin/applications/:id/progress', authenticate, isAdmin, getApplicationProgress);

module.exports = router;