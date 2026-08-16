const Resume = require('../models/Resume');

// @desc    Rank multiple resumes
// @route   POST /api/resume/rank
// @access  Private
exports.rankResumes = async (req, res) => {
  try {
    const { resumeIds } = req.body;

    // Validate resume IDs
    if (!resumeIds || !Array.isArray(resumeIds) || resumeIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least 2 resume IDs'
      });
    }

    // Find resumes belonging to logged-in user
    const resumes = await Resume.find({
      _id: { $in: resumeIds },
      user: req.user.id
    });

    if (resumes.length < 2) {
      return res.status(404).json({
        success: false,
        message: 'Not enough resumes found'
      });
    }

    // Calculate ranking score
    const rankings = resumes.map((resume) => {
      const atsScore = resume.analysis?.atsScore || 0;
      const overallScore = resume.analysis?.overallScore || 0;
      const skillsCount = resume.analysis?.skills?.length || 0;

      const finalScore = Math.round(
        atsScore * 0.4 +
        overallScore * 0.4 +
        skillsCount * 0.2
      );

      return {
        resumeId: resume._id,
        fileName: resume.fileName,
        atsScore,
        overallScore,
        skillsCount,
        finalScore,
        createdAt: resume.createdAt
      };
    });

    // Sort highest score first
    rankings.sort((a, b) => b.finalScore - a.finalScore);

    // Assign rank
    rankings.forEach((item, index) => {
      item.rank = index + 1;
    });

    return res.status(200).json({
      success: true,
      rankings
    });

  } catch (error) {
    console.error('Rank resumes error:', error);

    return res.status(500).json({
      success: false,
      message: 'Error ranking resumes',
      error: error.message
    });
  }
};


// @desc    Compare two resumes
// @route   POST /api/resume/compare
// @access  Private
exports.compareResumes = async (req, res) => {
  try {
    const { resumeIds } = req.body;

    // Validate resume IDs
    if (!resumeIds || !Array.isArray(resumeIds) || resumeIds.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide exactly 2 resume IDs'
      });
    }

    // Find resumes belonging to logged-in user
    const resumes = await Resume.find({
      _id: { $in: resumeIds },
      user: req.user.id
    });

    if (resumes.length !== 2) {
      return res.status(404).json({
        success: false,
        message: 'Resumes not found'
      });
    }

    // Prepare comparison data
    const comparison = {
      resume1: {
        id: resumes[0]._id,
        fileName: resumes[0].fileName,
        atsScore: resumes[0].analysis?.atsScore || 0,
        overallScore: resumes[0].analysis?.overallScore || 0,
        skills: resumes[0].analysis?.skills || []
      },

      resume2: {
        id: resumes[1]._id,
        fileName: resumes[1].fileName,
        atsScore: resumes[1].analysis?.atsScore || 0,
        overallScore: resumes[1].analysis?.overallScore || 0,
        skills: resumes[1].analysis?.skills || []
      },

      winner: null
    };

    // Calculate average scores
    const score1 =
      (comparison.resume1.atsScore +
        comparison.resume1.overallScore) / 2;

    const score2 =
      (comparison.resume2.atsScore +
        comparison.resume2.overallScore) / 2;

    // Determine winner
    if (score1 > score2) {
      comparison.winner = 'resume1';
    } else if (score2 > score1) {
      comparison.winner = 'resume2';
    } else {
      comparison.winner = 'tie';
    }

    return res.status(200).json({
      success: true,
      comparison
    });

  } catch (error) {
    console.error('Compare resumes error:', error);

    return res.status(500).json({
      success: false,
      message: 'Error comparing resumes',
      error: error.message
    });
  }
};
