const User = require('../models/User');
const Activity = require('../models/Activity');
const Resume = require('../models/Resume');
const Application = require('../models/Application');
const multer = require('multer');
const path = require('path');

// Configure multer for profile photo upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profiles/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// @desc    Get user profile with stats
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Calculate profile completion
    user.calculateProfileCompletion();
    await user.save();
    
    // Get user statistics
    const resumeCount = await Resume.countDocuments({ user: req.user.id });
    const applicationCount = await Application.countDocuments({ user: req.user.id });
    
    // Get average ATS score
    const resumes = await Resume.find({ user: req.user.id });
    const avgScore = resumes.length > 0
      ? Math.round(resumes.reduce((sum, r) => sum + (r.analysis?.atsScore || 0), 0) / resumes.length)
      : 0;
    
    // Update stats
    user.stats.resumesUploaded = resumeCount;
    user.stats.jobsApplied = applicationCount;
    user.stats.averageAtsScore = avgScore;
    await user.save();
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update allowed fields
    const allowedFields = [
      'name', 'phone', 'location', 'currentPosition', 'currentCompany',
      'skills', 'experience', 'education', 'certifications', 'projects',
      'socialLinks', 'languages', 'achievements', 'careerGoals',
      'jobPreferences', 'privacySettings'
    ];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });
    
    // Recalculate profile completion
    user.calculateProfileCompletion();
    
    // Update last active
    user.lastActive = Date.now();
    
    await user.save();
    
    // Log activity
    await Activity.create({
      user: user._id,
      type: 'profile_updated',
      title: 'Profile Updated',
      description: 'User updated their profile information'
    });
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload profile photo
// @route   POST /api/users/profile/photo
// @access  Private
exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    user.profilePhoto = `/uploads/profiles/${req.file.filename}`;
    user.calculateProfileCompletion();
    await user.save();
    
    res.json({
      success: true,
      photoUrl: user.profilePhoto
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/users/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get resume stats
    const resumes = await Resume.find({ user: userId });
    const resumeCount = resumes.length;
    const avgAtsScore = resumes.length > 0
      ? Math.round(resumes.reduce((sum, r) => sum + (r.analysis?.atsScore || 0), 0) / resumes.length)
      : 0;
    
    // Get application stats
    const applications = await Application.find({ user: userId });
    const applicationCount = applications.length;
    const applicationsByStatus = {
      applied: applications.filter(a => a.status === 'applied').length,
      interview: applications.filter(a => a.status === 'interview').length,
      offered: applications.filter(a => a.status === 'offered').length,
      rejected: applications.filter(a => a.status === 'rejected').length
    };
    
    // Get user
    const user = await User.findById(userId).select('profileCompletion stats');
    
    // Get profile views (you can implement view tracking separately)
    const profileViews = user.stats?.profileViews || 0;
    
    res.json({
      success: true,
      stats: {
        resumeCount,
        avgAtsScore,
        applicationCount,
        profileViews,
        profileCompletion: user.profileCompletion,
        applicationsByStatus,
        lastActive: user.lastActive
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get recent activities
// @route   GET /api/users/activities
// @access  Private
exports.getActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const activities = await Activity.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('relatedTo.id', 'fileName title company');
    
    res.json({
      success: true,
      activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { upload };
