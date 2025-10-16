const Application = require('../models/Application');
const Job = require('../models/Job');
const { validationResult } = require('express-validator');
const { createAuditLog } = require('./auditController');

// Submit new application
exports.submitApplication = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { jobId, coverLetter, documents } = req.body;

        // Check if job exists and is active
        const job = await Job.findOne({ _id: jobId, isActive: true });
        if (!job) {
            return res.status(404).json({ message: 'Job not found or is no longer active' });
        }

        // Check if user has already applied
        const existingApplication = await Application.findOne({
            jobId,
            applicantId: req.user._id
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        // Create new application
        const application = new Application({
            jobId,
            applicantId: req.user._id,
            coverLetter,
            documents: documents || []
        });

        await application.save();

        // Create audit log for application submission
        await createAuditLog({
            userId: req.user._id,
            action: 'SUBMIT',
            resourceType: 'APPLICATION',
            resourceId: application._id,
            details: `Application submitted for job: ${job.title}`
        });

        // Populate job and applicant details
        await application.populate([
            { path: 'jobId', select: 'title department' },
            { path: 'applicantId', select: 'username email' }
        ]);

        res.status(201).json(application);
    } catch (error) {
        console.error('Application submission error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get my applications
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicantId: req.user._id })
            .populate('jobId', 'title department')
            .sort({ submittedAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all applications (admin only)
exports.getAllApplications = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = {};

        // Add status filter if provided
        if (status) {
            query.status = status;
        }

        // Pagination
        const skip = (page - 1) * limit;

        const applications = await Application.find(query)
            .populate([
                { path: 'jobId', select: 'title department' },
                { path: 'applicantId', select: 'username email' }
            ])
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Application.countDocuments(query);

        res.json({
            applications,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalApplications: total
        });
    } catch (error) {
        console.error('Get all applications error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get application by ID
exports.getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate([
                { path: 'jobId', select: 'title department' },
                { path: 'applicantId', select: 'username email' },
                { path: 'notes.addedBy', select: 'username role' }
            ]);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if user is authorized to view this application
        if (req.user.role !== 'admin' && 
            application.applicantId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this application' });
        }

        res.json(application);
    } catch (error) {
        console.error('Get application error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update application status (admin/bot only)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { status } = req.body;
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const oldStatus = application.status;
        application.status = status;
        await application.save();

        // Create audit log for status change
        await createAuditLog({
            userId: req.user._id,
            action: 'UPDATE_STATUS',
            resourceType: 'APPLICATION',
            resourceId: application._id,
            details: `Application status changed from ${oldStatus} to ${status}`
        });

        res.json(application);
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add note to application (admin/bot only)
exports.addApplicationNote = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { note } = req.body;
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.notes.push({
            text: note,
            addedBy: req.user._id
        });

        await application.save();
        
        // Populate the newly added note's addedBy field
        await application.populate('notes.addedBy', 'username role');

        res.json(application);
    } catch (error) {
        console.error('Add note error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};