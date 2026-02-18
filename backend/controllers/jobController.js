const Job = require('../models/Job');
const Resume = require('../models/Resume');
const { calculateJobMatch } = require('../utils/jobMatcher');
const { fetchAllJobs } = require('../services/jobAPI');

// @desc    Create job posting
// @route   POST /api/jobs
// @access  Private (Recruiter/Admin)
exports.createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      postedBy: req.user.id
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating job',
      error: error.message
    });
  }
};

// @desc    Get all jobs (internal + external)
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const { status, type, search, page = 1, limit = 10, source = 'all' } = req.query;

    let allJobs = [];

    // Fetch internal jobs (from database)
    if (source === 'all' || source === 'internal') {
      const query = {};
      
      if (status) {
        query.status = status;
      } else {
        query.status = 'active';
      }

      if (type) {
        query.type = type;
      }

      if (search) {
        query.$text = { $search: search };
      }

      const internalJobs = await Job.find(query)
        .populate('postedBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      // Mark as internal
      const formattedInternal = internalJobs.map(job => ({
        ...job.toObject(),
        source: 'internal',
        isInternal: true
      }));

      allJobs = [...formattedInternal];
    }

    // Fetch external jobs (from APIs)
    if (source === 'all' || source === 'external') {
      try {
        console.log('🔄 Fetching external jobs...');
        const externalJobs = await fetchAllJobs(search || '', '');
        
        // Mark as external
        const formattedExternal = externalJobs.map(job => ({
          _id: `ext-${job.id}`,
          ...job,
          isInternal: false,
          applicants: [],
          views: 0,
          status: 'active',
          createdAt: job.postedDate || new Date()
        }));

        allJobs = [...allJobs, ...formattedExternal];
        console.log(`✅ Total jobs: ${allJobs.length}`);
      } catch (error) {
        console.error('❌ Error fetching external jobs:', error.message);
      }
    }

    const count = await Job.countDocuments({ status: 'active' });

    res.status(200).json({
      success: true,
      count: allJobs.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      jobs: allJobs
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email company');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment views
    job.views += 1;
    await job.save();

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter/Admin - own jobs)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating job',
      error: error.message
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter/Admin - own jobs)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting job',
      error: error.message
    });
  }
};

// @desc    Apply to job
// @route   POST /api/jobs/:id/apply
// @access  Private
exports.applyToJob = async (req, res) => {
  try {
    const { resumeId } = req.body;

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Check if already applied
    const alreadyApplied = job.applicants.some(
      applicant => applicant.user.toString() === req.user.id
    );

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job'
      });
    }

    // Calculate match score
    const matchScore = calculateJobMatch(resume, job);

    // Add applicant
    job.applicants.push({
      user: req.user.id,
      resume: resumeId,
      matchScore
    });

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      matchScore
    });
  } catch (error) {
    console.error('Apply to job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error applying to job',
      error: error.message
    });
  }
};

// @desc    Get matched jobs for user
// @route   GET /api/jobs/matches/:resumeId
// @access  Private
exports.getMatchedJobs = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Check ownership
    if (resume.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resume'
      });
    }

    const jobs = await Job.find({ status: 'active' }).limit(50);

    // Calculate match scores
    const matchedJobs = jobs.map(job => {
      const matchScore = calculateJobMatch(resume, job);
      return {
        job,
        matchScore,
        matchedSkills: resume.analysis.skillsFound
          .filter(skill => job.skills.includes(skill.skill))
          .map(s => s.skill),
        missingSkills: job.skills.filter(
          skill => !resume.analysis.skillsFound.some(s => s.skill === skill)
        )
      };
    });

    // Sort by match score
    matchedJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      count: matchedJobs.length,
      matches: matchedJobs.slice(0, 20) // Return top 20 matches
    });
  } catch (error) {
    console.error('Get matched jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching matched jobs',
      error: error.message
    });
  }
};
