const express = require('express');
const { authenticate, isBot } = require('../middleware/auth');
const { getDashboard } = require('../controllers/botController');

const router = express.Router();

// Get bot dashboard data (bot only)
router.get('/bot/dashboard', authenticate, isBot, getDashboard);

module.exports = router;