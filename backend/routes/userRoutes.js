const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const userController = require('../controllers/userController');

// =============================================
// DASHBOARD ROUTES
// =============================================

// Get dashboard statistics
// GET /api/users/dashboard/stats
router.get(
  '/dashboard/stats',
  protect,
  userController.getDashboardStats
);

// Get recent user activities
// GET /api/users/activities
router.get(
  '/activities',
  protect,
  userController.getActivities
);


// =============================================
// PROFILE ROUTES
// =============================================

// Get user profile
// GET /api/users/profile
router.get(
  '/profile',
  protect,
  userController.getProfile
);

// Update user profile
// PUT /api/users/profile
router.put(
  '/profile',
  protect,
  userController.updateProfile
);


module.exports = router;
