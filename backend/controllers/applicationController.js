
const Application = require('../models/Application');
const Job = require('../models/Job');
const Activity = require('../models/Activity');

// @desc    Get all applications for user
// @route   GET /api/applications
// @access  Private
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id })
      .populate('job', 'title company location salary')
      .populate('resume', 'fileName')
      .sort({ appliedDate: -1 });
    
    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new application
// @route   POST /api/applications
// @access  Private
exports.createApplication = async (req, res) => {
  try {
    const { jobId, resumeId, coverLetter } = req.body;
    
    // Check if already applied
    const existingApplication = await Application.findOne({
      user: req.user.id,
      job: jobId
    });
    
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job'
      });
    }
    
    const application = await Application.create({
      user: req.user.id,
      job: jobId,
      resume: resumeId,
      coverLetter,
      statusHistory: [{
        status: 'applied',
        date: Date.now(),
        note: 'Application submitted'
      }]
    });
    
    // Update job applicants count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicants: 1 }
    });
    
    // Log activity
    await Activity.create({
      user: req.user.id,
      type: 'job_applied',
      title: 'Applied to Job',
      description: `Applied to job`,
      relatedTo: {
        model: 'Application',
        id: application._id
      }
    });
    
    res.status(201).json({
      success: true,
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private
exports.updateApplication = async (req, res) => {
  try {
    const { status, note } = req.body;
    
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    application.status = status;
    application.statusHistory.push({
      status,
      date: Date.now(),
      note
    });
    
    await application.save();
    
    // Log activity
    await Activity.create({
      user: req.user.id,
      type: 'application_status_changed',
      title: `Application ${status}`,
      description: `Application status changed to ${status}`,
      relatedTo: {
        model: 'Application',
        id: application._id
      }
    });
    
    res.json({
      success: true,
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add interview to application
// @route   POST /api/applications/:id/interview
// @access  Private
exports.addInterview = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    application.interviews.push(req.body);
    await application.save();
    
    // Log activity
    await Activity.create({
      user: req.user.id,
      type: 'interview_scheduled',
      title: 'Interview Scheduled',
      description: `Interview scheduled for ${req.body.date}`,
      relatedTo: {
        model: 'Application',
        id: application._id
      }
    });
    
    res.json({
      success: true,
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = exports;
