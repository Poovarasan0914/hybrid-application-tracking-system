const express = require('express');
const { authenticate, isAdmin, isBot } = require('../middleware/auth');
const {
    getApplicantDashboard,
    getAdminDashboard,
    getBotDashboard
} = require('../controllers/dashboardController');

const router = express.Router();

// Dashboard routes for different roles
router.get('/dashboard/applicant', authenticate, getApplicantDashboard);
router.get('/dashboard/admin', authenticate, isAdmin, getAdminDashboard);
router.get('/dashboard/bot', authenticate, isBot, getBotDashboard);

module.exports = router;
