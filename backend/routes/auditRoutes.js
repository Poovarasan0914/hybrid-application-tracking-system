const express = require('express');
const { authenticate, isAdmin } = require('../middleware/auth');
const { getAuditLogs } = require('../controllers/auditController');

const router = express.Router();

// Get audit logs (admin only)
router.get('/audit', authenticate, isAdmin, getAuditLogs);

module.exports = router;