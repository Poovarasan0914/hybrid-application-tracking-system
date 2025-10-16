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

/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       required:
 *         - title
 *         - department
 *         - description
 *         - requirements
 *         - roleCategory
 *         - type
 *         - location
 *         - salary
 *         - deadline
 *       properties:
 *         title:
 *           type: string
 *         department:
 *           type: string
 *         description:
 *           type: string
 *         requirements:
 *           type: array
 *           items:
 *             type: string
 *         roleCategory:
 *           type: string
 *           enum: [technical, non-technical]
 *         type:
 *           type: string
 *           enum: [full-time, part-time, contract, internship]
 *         location:
 *           type: string
 *         salary:
 *           type: object
 *           properties:
 *             min:
 *               type: number
 *             max:
 *               type: number
 *             currency:
 *               type: string
 *         deadline:
 *           type: string
 *           format: date-time
 */

// Validation middleware
const jobValidation = [
    body('title').trim().notEmpty().withMessage('Job title is required'),
    body('department').trim().notEmpty().withMessage('Department is required'),
    body('description').notEmpty().withMessage('Job description is required'),
    body('requirements').isArray().withMessage('Requirements must be an array')
        .notEmpty().withMessage('At least one requirement is required'),
    body('roleCategory').isIn(['technical', 'non-technical']).withMessage('Role category must be technical or non-technical'),
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

/**
 * @swagger
 * /api/jobs/active:
 *   get:
 *     summary: Get active job listings
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of jobs per page
 *     responses:
 *       200:
 *         description: List of active jobs
 */
router.get('/jobs/active', getActiveJobs);
router.get('/jobs/technical', getTechnicalJobs);
router.get('/jobs/non-technical', getNonTechnicalJobs);
router.get('/jobs/:id', getJobById);

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job (Admin only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       201:
 *         description: Job created successfully
 *       403:
 *         description: Admin access required
 */
router.post('/jobs', authenticate, isAdmin, jobValidation, createJob);
router.put('/jobs/:id', authenticate, isAdmin, jobValidation, updateJob);
router.delete('/jobs/:id', authenticate, isAdmin, deleteJob);

module.exports = router;