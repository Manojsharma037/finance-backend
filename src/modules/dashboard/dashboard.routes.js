const router = require('express').Router();
const ctrl = require('./dashboard.controller');
const auth = require('../../middleware/auth');
const guard = require('../../middleware/roleGuard');

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get financial summary (Admin/Analyst only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Financial summary with totals and trends
 *       403:
 *         description: Access denied
 */
router.get('/summary', auth, guard('admin', 'analyst'), ctrl.getSummary);

module.exports = router;