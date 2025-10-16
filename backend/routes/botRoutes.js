const express = require('express');
const { authenticate, isBot } = require('../middleware/auth');
const {
    processApplications,
    simulateUpdates,
    getTechnicalApplications,
    getBotActivity
} = require('../controllers/botController');

const router = express.Router();

// Bot automation routes
router.post('/bot/process-applications', authenticate, isBot, processApplications);
router.post('/bot/simulate-updates', authenticate, isBot, simulateUpdates);
router.get('/bot/technical-applications', authenticate, isBot, getTechnicalApplications);
router.get('/bot/activity', authenticate, isBot, getBotActivity);

module.exports = router;