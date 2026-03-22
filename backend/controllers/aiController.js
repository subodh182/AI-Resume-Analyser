const Resume = require('../models/Resume');

// @desc    Generate AI-powered resume summary
// @route   POST /api/ai/generate-summary
// @access  Private
exports.generateSummary = async (req, res) => {
  try {
    const { resumeId, tone } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: 'Resume ID is required'
      });
    }

    // Get resume
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Extract resume data
    const resumeData = {
      skills: resume.analysis?.skills || [],
      experience: resume.analysis?.experience || [],
      education: resume.analysis?.education || []
    };

    // Generate summary based on tone
    const summary = generateAISummary(resumeData, tone);

    res.json({
      success: true,
      summary,
      tone: tone || 'professional'
    });
  } catch (error) {
    console.error('Generate summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating summary',
      error: error.message
    });
  }
};

// Generate AI summary (rule-based for now, can integrate OpenAI later)
function generateAISummary(resumeData, tone = 'professional') {
  const { skills, experience, education } = resumeData;
  
  const skillsList = skills.slice(0, 5).join(', ');
  const yearsExp = experience.length || 0;
  
  const templates = {
    professional: `Highly motivated professional with ${yearsExp}+ years of experience in software development. Proficient in ${skillsList}. Demonstrated expertise in delivering high-quality solutions and collaborating with cross-functional teams to achieve business objectives. Strong problem-solving abilities with a track record of optimizing processes and driving innovation.`,
    
    creative: `Dynamic and innovative tech enthusiast with ${yearsExp}+ years of hands-on experience creating impactful solutions. Master of ${skillsList}, I thrive on turning complex challenges into elegant, user-friendly applications. Passionate about pushing boundaries and bringing fresh perspectives to every project.`,
    
    concise: `${yearsExp}+ years experienced developer specializing in ${skillsList}. Proven track record in building scalable applications and leading technical initiatives. Results-driven with strong analytical and problem-solving skills.`,
    
    detailed: `Accomplished software professional with over ${yearsExp} years of comprehensive experience in full-stack development and system architecture. Core competencies include ${skillsList}, with additional proficiency in agile methodologies, test-driven development, and continuous integration/deployment. Recognized for consistently delivering robust, scalable solutions that align with business goals while maintaining code quality and best practices. Adept at mentoring junior developers, conducting code reviews, and fostering a collaborative team environment.`
  };

  return templates[tone] || templates.professional;
}

// @desc    Regenerate summary with different tone
// @route   POST /api/ai/regenerate-summary
// @access  Private
exports.regenerateSummary = async (req, res) => {
  try {
    const { resumeId, tone } = req.body;
    
    // Reuse generateSummary logic
    return exports.generateSummary(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error regenerating summary'
    });
  }
};

module.exports = {
  generateSummary,
  regenerateSummary
};
