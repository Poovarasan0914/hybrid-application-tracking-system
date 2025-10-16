const express = require('express');
const { authenticate, isAdmin } = require('../middleware/auth');
const { getAuditLogs } = require('../controllers/auditController');

const router = express.Router();

// Audit routes (admin only)
router.get('/audit', authenticate, isAdmin, getAuditLogs);

module.exports = router;