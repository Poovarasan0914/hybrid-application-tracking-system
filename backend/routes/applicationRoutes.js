const express = require('express');
const { body } = require('express-validator');
const { authenticate, isAdmin, isAdminOrBot } = require('../middleware/auth');
const {
    submitApplication,
    getMyApplications,
    getAllApplications,
    getNonTechnicalApplications,
    getApplicationById,
    getApplicationTimeline,
    updateApplicationStatus,
    addApplicationNote
} = require('../controllers/applicationController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Application:
 *       type: object
 *       required:
 *         - jobId
 *         - coverLetter
 *       properties:
 *         jobId:
 *           type: string
 *         coverLetter:
 *           type: string
 */

// Validation middleware
const applicationValidation = [
    body('jobId').isMongoId().withMessage('Valid job ID is required'),
    body('coverLetter').optional().isString().withMessage('Cover letter must be a string'),
    body('documents').optional().isArray().withMessage('Documents must be an array'),
    body('documents.*.name').optional().notEmpty().withMessage('Document name is required'),
    body('documents.*.url').optional().isURL().withMessage('Valid document URL is required'),
    body('documents.*.type').optional().notEmpty().withMessage('Document type is required')
];

const statusValidation = [
    body('status').isIn(['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'])
        .withMessage('Invalid status value')
];

const noteValidation = [
    body('note').notEmpty().withMessage('Note text is required')
        .isLength({ min: 3 }).withMessage('Note must be at least 3 characters long')
];

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Submit job application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Application'
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       403:
 *         description: Only applicants can submit applications
 */
router.post('/applications', authenticate, (req, res, next) => {
    if (req.user.role !== 'applicant') {
        return res.status(403).json({ message: 'Only applicants can submit applications' });
    }
    next();
}, applicationValidation, submitApplication);

/**
 * @swagger
 * /api/applications/my-applications:
 *   get:
 *     summary: Get user's applications
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user applications
 */
router.get('/applications/my-applications', authenticate, getMyApplications);
router.get('/applications/all', authenticate, isAdmin, getAllApplications);
router.get('/applications/non-technical', authenticate, isAdmin, getNonTechnicalApplications);
router.get('/applications/:id', authenticate, getApplicationById);
router.get('/applications/:id/timeline', authenticate, getApplicationTimeline);
router.put('/applications/:id/status', authenticate, isAdminOrBot, statusValidation, updateApplicationStatus);
router.post('/applications/:id/notes', authenticate, isAdminOrBot, noteValidation, addApplicationNote);

module.exports = router;