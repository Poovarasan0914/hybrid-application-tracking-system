const express = require('express');
const { body } = require('express-validator');
const { authenticate, isAdmin } = require('../middleware/auth');
const {
    getActiveJobs,
    getTechnicalJobs,
    getNonTechnicalJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob
} = require('../controllers/jobController');

const router = express.Router();

// Validation middleware
const jobValidation = [
    body('title').trim().notEmpty().withMessage('Job title is required'),
    body('department').trim().notEmpty().withMessage('Department is required'),
    body('description').notEmpty().withMessage('Job description is required'),
    body('requirements').isArray().withMessage('Requirements must be an array')
        .notEmpty().withMessage('At least one requirement is required'),
    body('type').isIn(['full-time', 'part-time', 'contract', 'internship'])
        .withMessage('Invalid job type'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('salary.min').isNumeric().withMessage('Minimum salary must be a number'),
    body('salary.max').isNumeric().withMessage('Maximum salary must be a number')
        .custom((value, { req }) => {
            if (value < req.body.salary.min) {
                throw new Error('Maximum salary must be greater than minimum salary');
            }
            return true;
        }),
    body('deadline').isISO8601().withMessage('Valid deadline date is required')
        .custom(value => {
            if (new Date(value) < new Date()) {
                throw new Error('Deadline must be in the future');
            }
            return true;
        })
];

// Public routes
router.get('/jobs/active', getActiveJobs);
router.get('/jobs/technical', getTechnicalJobs);
router.get('/jobs/non-technical', getNonTechnicalJobs);
router.get('/jobs/:id', getJobById);

// Admin routes
router.post('/jobs', authenticate, isAdmin, jobValidation, createJob);
router.put('/jobs/:id', authenticate, isAdmin, jobValidation, updateJob);
router.delete('/jobs/:id', authenticate, isAdmin, deleteJob);

module.exports = router;