const router = require('express').Router();
const ctrl   = require('./user.controller');
const auth   = require('../../middleware/auth');
const guard  = require('../../middleware/roleGuard');

router.post('/register', ctrl.register);
router.post('/login',    ctrl.login);
router.get('/',          auth, guard('admin'), ctrl.getAllUsers);
router.patch('/:id',     auth, guard('admin'), ctrl.updateUser);

module.exports = router;