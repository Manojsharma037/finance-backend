const router = require('express').Router();
const ctrl   = require('./dashboard.controller');
const auth   = require('../../middleware/auth');
const guard  = require('../../middleware/roleGuard');

router.get('/summary', auth, guard('admin', 'analyst'), ctrl.getSummary);

module.exports = router;