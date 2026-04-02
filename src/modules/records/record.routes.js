const router = require('express').Router();
const ctrl   = require('./record.controller');
const auth   = require('../../middleware/auth');
const guard  = require('../../middleware/roleGuard');

router.post('/',      auth, guard('admin', 'analyst'), ctrl.create);
router.get('/',       auth, ctrl.getAll);
router.put('/:id',   auth, guard('admin', 'analyst'), ctrl.update);
router.delete('/:id', auth, guard('admin'), ctrl.remove);

module.exports = router;