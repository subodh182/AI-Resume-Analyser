const express = require('express');
const router = express.Router();
const { register, login, verifyEmail, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.get('/me', protect, getMe);

module.exports = router;
