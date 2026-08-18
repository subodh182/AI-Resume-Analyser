const User = require('../models/User');
const Resume = require('../models/Resume');
const Application = require('../models/Application');
const Activity = require('../models/Activity');

// =============================================
// GET USER PROFILE
// =============================================
// @desc    Get user profile
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

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get profile error:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// =============================================
// UPDATE USER PROFILE
// =============================================
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
      'name',
      'phone',
      'location',
      'currentPosition',
      'currentCompany',
      'skills',
      'experience',
      'education',
      'socialLinks'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    user.lastActive = Date.now();

    await user.save();

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// =============================================
// DASHBOARD STATISTICS
// =============================================
// @desc    Get dashboard statistics
// @route   GET /api/users/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // -----------------------------------------
    // Total Resumes
    // -----------------------------------------
    const totalResumes = await Resume.countDocuments({
      user: userId
    });

    // -----------------------------------------
    // Get resumes for ATS calculation
    // -----------------------------------------
    const resumes = await Resume.find({
      user: userId
    })
      .select('analysis')
      .lean();

    // -----------------------------------------
    // Average ATS Score
    // -----------------------------------------
    const atsScores = resumes
      .map(resume => resume.analysis?.atsScore)
      .filter(score => typeof score === 'number');

    const avgATSScore = atsScores.length > 0
      ? Math.round(
          atsScores.reduce((sum, score) => sum + score, 0) /
          atsScores.length
        )
      : 0;

    // -----------------------------------------
    // Total Jobs Applied
    // -----------------------------------------
    const jobsApplied = await Application.countDocuments({
      user: userId
    });

    // -----------------------------------------
    // Profile Views
    // -----------------------------------------
    const profileViews = await Activity.countDocuments({
      user: userId,
      type: 'profile_viewed'
    });

    // -----------------------------------------
    // Get User Profile
    // -----------------------------------------
    const user = await User.findById(userId)
      .select('-password')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // -----------------------------------------
    // Profile Completion
    // -----------------------------------------
    const profileFields = [
      user.name,
      user.phone,
      user.currentPosition,
      user.currentCompany,

      user.skills && user.skills.length > 0,
      user.experience && user.experience.length > 0,
      user.education && user.education.length > 0,

      user.location?.city,
      user.location?.state,

      user.socialLinks?.linkedin,
      user.socialLinks?.github,
      user.socialLinks?.portfolio
    ];

    const completedFields = profileFields.filter(field => {
      return (
        field !== undefined &&
        field !== null &&
        field !== '' &&
        field !== false
      );
    }).length;

    const profileCompletion = Math.round(
      (completedFields / profileFields.length) * 100
    );

    // -----------------------------------------
    // Send Dashboard Stats
    // -----------------------------------------
    res.json({
      success: true,
      stats: {
        totalResumes,
        avgATSScore,
        jobsApplied,
        profileViews,
        profileCompletion
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// =============================================
// GET USER ACTIVITIES
// =============================================
// @desc    Get recent user activities
// @route   GET /api/users/activities
// @access  Private
exports.getActivities = async (req, res) => {
  try {
    const userId = req.user.id;

    // Limit activities
    const limit = Math.min(
      parseInt(req.query.limit) || 10,
      50
    );

    // Get recent activities
    const activities = await Activity.find({
      user: userId
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json({
      success: true,
      count: activities.length,
      activities
    });

  } catch (error) {
    console.error('Activities error:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
