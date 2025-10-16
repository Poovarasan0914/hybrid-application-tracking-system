const Job = require('../models/Job');
const { validationResult } = require('express-validator');
const { createAuditLog } = require('./auditController');

// Get all active jobs with filters
exports.getActiveJobs = async (req, res) => {
    try {
        const { type, department, page = 1, limit = 10 } = req.query;
        const query = { isActive: true };

        // Add filters if provided
        if (type) query.type = type;
        if (department) query.department = department;

        // Pagination
        const skip = (page - 1) * limit;

        const jobs = await Job.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('postedBy', 'username');

        // Get total count for pagination
        const total = await Job.countDocuments(query);

        res.json({
            jobs,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalJobs: total
        });
    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get technical jobs only (using roleCategory)
exports.getTechnicalJobs = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const query = { 
            isActive: true,
            roleCategory: 'technical'
        };

        const skip = (page - 1) * limit;

        const jobs = await Job.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('postedBy', 'username');

        const total = await Job.countDocuments(query);

        res.json({
            jobs,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalJobs: total,
            roleType: 'technical'
        });
    } catch (error) {
        console.error('Get technical jobs error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get non-technical jobs only (using roleCategory)
exports.getNonTechnicalJobs = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const query = { 
            isActive: true,
            roleCategory: 'non-technical'
        };

        const skip = (page - 1) * limit;

        const jobs = await Job.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('postedBy', 'username');

        const total = await Job.countDocuments(query);

        res.json({
            jobs,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalJobs: total,
            roleType: 'non-technical'
        });
    } catch (error) {
        console.error('Get non-technical jobs error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get specific job by ID
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'username');

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.json(job);
    } catch (error) {
        console.error('Get job error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create new job (admin only)
exports.createJob = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const jobData = {
            ...req.body,
            postedBy: req.user._id
        };

        const job = new Job(jobData);
        await job.save();

        // Create audit log
        await createAuditLog({
            userId: req.user._id,
            action: 'JOB_CREATE',
            resourceType: 'job',
            resourceId: job._id,
            description: `Job created: ${job.title}`,
            details: {
                jobTitle: job.title,
                department: job.department,
                roleCategory: job.roleCategory,
                type: job.type,
                createdBy: req.user.username
            },
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.status(201).json(job);
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update job (admin only)
exports.updateJob = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Store old values for audit
        const oldValues = {
            title: job.title,
            department: job.department,
            roleCategory: job.roleCategory,
            isActive: job.isActive
        };

        // Update fields
        Object.keys(req.body).forEach(key => {
            job[key] = req.body[key];
        });

        await job.save();

        // Create audit log
        await createAuditLog({
            userId: req.user._id,
            action: 'JOB_UPDATE',
            resourceType: 'job',
            resourceId: job._id,
            description: `Job updated: ${job.title}`,
            details: {
                jobTitle: job.title,
                oldValues,
                newValues: req.body,
                updatedBy: req.user.username
            },
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.json(job);
    } catch (error) {
        console.error('Update job error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete job (admin only)
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        await job.deleteOne();

        // Create audit log
        await createAuditLog({
            userId: req.user._id,
            action: 'JOB_DELETE',
            resourceType: 'job',
            resourceId: job._id,
            description: `Job deleted: ${job.title}`,
            details: {
                jobTitle: job.title,
                department: job.department,
                roleCategory: job.roleCategory,
                deletedBy: req.user.username
            },
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Delete job error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};