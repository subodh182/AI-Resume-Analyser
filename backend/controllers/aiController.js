const Resume = require('../models/Resume');

const generateSummary = async (req, res) => {
  try {
    const { resumeId, tone } = req.body;
    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: 'Resume ID is required'
      });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    const resumeData = {
      skills: resume.analysis?.skills || [],
      experience: resume.analysis?.experience || [],
      education: resume.analysis?.education || []
    };

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

function generateAISummary(resumeData, tone = 'professional') {
  const { skills, experience } = resumeData;
  const skillsList = skills.slice(0, 5).join(', ');
  const yearsExp = experience.length || 0;

  const templates = {
    professional: `Highly motivated professional with ${yearsExp}+ years of experience in software development. Proficient in ${skillsList}. Demonstrated expertise in delivering high-quality solutions and collaborating with cross-functional teams to achieve business objectives.`,
    creative: `Dynamic and innovative tech enthusiast with ${yearsExp}+ years of hands-on experience creating impactful solutions. Master of ${skillsList}, I thrive on turning complex challenges into elegant, user-friendly applications.`,
    concise: `${yearsExp}+ years experienced developer specializing in ${skillsList}. Proven track record in building scalable applications and leading technical initiatives.`,
    detailed: `Accomplished software professional with over ${yearsExp} years of comprehensive experience in full-stack development. Core competencies include ${skillsList}, with proficiency in agile methodologies, test-driven development, and CI/CD. Adept at mentoring junior developers and fostering a collaborative team environment.`
  };

  return templates[tone] || templates.professional;
}

const regenerateSummary = async (req, res) => {
  try {
    return generateSummary(req, res);
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
