const Resume = require('../models/Resume');

// @desc    Rank multiple resumes
// @route   POST /api/resume/rank
// @access  Private
exports.rankResumes = async (req, res) => {
  try {
    const { resumeIds } = req.body;

    if (!resumeIds || resumeIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least 2 resume IDs'
      });
    }

    // Fetch all resumes
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

    // Calculate ranking
    const rankings = resumes.map(resume => {
      const atsScore = resume.analysis?.atsScore || 0;
      const overallScore = resume.analysis?.overallScore || 0;
      const skillsCount = resume.analysis?.skills?.length || 0;
      
      // Weighted score
      const finalScore = (atsScore * 0.4) + (overallScore * 0.4) + (skillsCount * 0.2);

      return {
        resumeId: resume._id,
        fileName: resume.fileName,
        atsScore,
        overallScore,
        skillsCount,
        finalScore: Math.round(finalScore),
        createdAt: resume.createdAt
      };
    });

    // Sort by final score
    rankings.sort((a, b) => b.finalScore - a.finalScore);

    // Add rank
    rankings.forEach((item, index) => {
      item.rank = index + 1;
    });

    res.json({
      success: true,
      rankings
    });
  } catch (error) {
    console.error('Rank resumes error:', error);
    res.status(500).json({
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

    if (!resumeIds || resumeIds.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide exactly 2 resume IDs'
      });
    }

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

    const comparison = {
      resume1: {
        id: resumes[0]._id,
        fileName: resumes[0].fileName,
        atsScore: resumes[0].analysis?.atsScore || 0,
        overallScore: resumes[0].analysis?.overallScore || 0,
        skills: resumes[0].analysis?.skills || [],
        sections: resumes[0].analysis?.sections || []
      },
      resume2: {
        id: resumes[1]._id,
        fileName: resumes[1].fileName,
        atsScore: resumes[1].analysis?.atsScore || 0,
        overallScore: resumes[1].analysis?.overallScore || 0,
        skills: resumes[1].analysis?.skills || [],
        sections: resumes[1].analysis?.sections || []
      },
      winner: null
    };

    // Determine winner
    const score1 = (comparison.resume1.atsScore + comparison.resume1.overallScore) / 2;
    const score2 = (comparison.resume2.atsScore + comparison.resume2.overallScore) / 2;
    
    comparison.winner = score1 > score2 ? 'resume1' : score2 > score1 ? 'resume2' : 'tie';

    res.json({
      success: true,
      comparison
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error comparing resumes'
    });
  }
};

module.exports = {
  rankResumes,
  compareResumes
};
