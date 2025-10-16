const express = require('express');
const { authenticate, isBot } = require('../middleware/auth');
const {
    processApplications,
    autoProcessTechnical,
    getTechnicalApplications,
    getBotActivity,
    getDashboard,
    triggerBotMimic,
    getBotMimicStats,
    toggleBotMimic
} = require('../controllers/botController');

const router = express.Router();

/**
 * @swagger
 * /api/bot/mimic/trigger:
 *   post:
 *     summary: Trigger bot mimic processing
 *     tags: [Bot]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bot processing triggered
 *       403:
 *         description: Bot access required
 *
 * /api/bot/mimic/stats:
 *   get:
 *     summary: Get bot mimic statistics
 *     tags: [Bot]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bot statistics
 */

// Bot automation routes - only for technical roles
router.get('/bot/dashboard', authenticate, isBot, getDashboard);
router.post('/bot/process-applications', authenticate, isBot, processApplications);
router.post('/bot/auto-process-technical', authenticate, isBot, autoProcessTechnical);
router.get('/bot/technical-applications', authenticate, isBot, getTechnicalApplications);
router.get('/bot/activity', authenticate, isBot, getBotActivity);

// Bot Mimic routes - human-like workflow
router.post('/bot/mimic/trigger', authenticate, isBot, triggerBotMimic);
router.get('/bot/mimic/stats', authenticate, isBot, getBotMimicStats);
router.post('/bot/mimic/toggle', authenticate, isBot, toggleBotMimic);

module.exports = router;