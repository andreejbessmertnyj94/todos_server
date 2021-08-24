const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const controller = require('./controller');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/logout', auth, controller.logout);
router.get('/logout/others', auth, controller.logoutOthers);

module.exports = router;
