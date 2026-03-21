const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// Profile routes
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.post('/profile/photo', protect, userController.upload.single('photo'), userController.uploadProfilePhoto);

// Dashboard routes
router.get('/dashboard/stats', protect, userController.getDashboardStats);
router.get('/activities', protect, userController.getActivities);

module.exports = router;
