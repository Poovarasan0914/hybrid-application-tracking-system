const express = require('express');
const { authenticate, isBot } = require('../middleware/auth');
const {
    processApplications,
    autoProcessTechnical,
    getTechnicalApplications,
    getBotActivity,
    getDashboard
} = require('../controllers/botController');

const router = express.Router();

// Bot automation routes - only for technical roles
router.get('/bot/dashboard', authenticate, isBot, getDashboard);
router.post('/bot/process-applications', authenticate, isBot, processApplications);
router.post('/bot/auto-process-technical', authenticate, isBot, autoProcessTechnical);
router.get('/bot/technical-applications', authenticate, isBot, getTechnicalApplications);
router.get('/bot/activity', authenticate, isBot, getBotActivity);

module.exports = router;