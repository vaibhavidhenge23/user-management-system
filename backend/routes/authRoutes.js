const express = require('express');
const router = express.Router();
const { register, login, refresh, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate, registerRules, loginRules } = require('../validators/userValidator');

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.post('/refresh', refresh);
router.get('/me', protect, getMe);

module.exports = router;