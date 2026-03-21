const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  logout 
} = require('../controllers/authController');

// Try to import protect middleware
let protect;
try {
  protect = require('../middleware/auth').protect;
} catch (err) {
  try {
    protect = require('../middleware/authMiddleware').protect;
  } catch (err2) {
    console.error('❌ Could not load auth middleware');
    protect = (req, res, next) => {
      res.status(500).json({ 
        success: false, 
        message: 'Auth middleware not configured' 
      });
    };
  }
}

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (if middleware loaded)
if (protect) {
  router.get('/me', protect, getMe);
  router.post('/logout', protect, logout);
}

module.exports = router;
