const Resume = require('../models/Resume');

// @desc    Match resume with job description
// @route   POST /api/job-match/analyze
// @access  Private
exports.analyzeJobMatch = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Resume ID and job description are required'
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

    // Extract skills from job description
    const jobSkills = extractSkills(jobDescription);
    const resumeSkills = resume.analysis?.skills || [];

    // Calculate match
    const matchAnalysis = calculateMatch(resumeSkills, jobSkills, jobDescription, resume);

    res.json({
      success: true,
      matchAnalysis
    });
  } catch (error) {
    console.error('Job match error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing job match',
      error: error.message
    });
  }
};

// Extract skills from job description
function extractSkills(jobDescription) {
  const skillsDatabase = [
    // Frontend
    'react', 'angular', 'vue', 'javascript', 'typescript', 'html', 'css', 
    'redux', 'nextjs', 'webpack', 'sass', 'tailwind',
    
    // Backend
    'nodejs', 'node.js', 'express', 'python', 'django', 'flask', 'java', 
    'spring', 'php', 'laravel', 'ruby', 'rails', 'go', 'golang',
    
    // Databases
    'mongodb', 'mysql', 'postgresql', 'redis', 'elasticsearch', 'sql',
    'nosql', 'dynamodb', 'oracle', 'sqlite',
    
    // DevOps
    'docker', 'kubernetes', 'jenkins', 'aws', 'azure', 'gcp', 'ci/cd',
    'terraform', 'ansible', 'linux', 'nginx', 'apache',
    
    // Tools
    'git', 'jira', 'agile', 'scrum', 'rest api', 'graphql', 'microservices',
    'socket.io', 'websocket', 'oauth', 'jwt',
    
    // Others
    'machine learning', 'data science', 'ai', 'tensorflow', 'pytorch',
    'react native', 'flutter', 'swift', 'kotlin', 'android', 'ios'
  ];

  const jdLower = jobDescription.toLowerCase();
  const foundSkills = [];

  skillsDatabase.forEach(skill => {
    const regex = new RegExp(`\\b${skill}\\b`, 'i');
    if (regex.test(jdLower)) {
      foundSkills.push(skill);
    }
  });

  return foundSkills;
}

// Calculate match percentage and analysis
function calculateMatch(resumeSkills, jobSkills, jobDescription, resume) {
  // Normalize skills
  const normalizedResumeSkills = resumeSkills.map(s => s.toLowerCase());
  const normalizedJobSkills = jobSkills.map(s => s.toLowerCase());

  // Find matching and missing skills
  const matchingSkills = normalizedJobSkills.filter(skill => 
    normalizedResumeSkills.includes(skill)
  );
  
  const missingSkills = normalizedJobSkills.filter(skill => 
    !normalizedResumeSkills.includes(skill)
  );

  // Calculate match percentage
  const matchPercentage = normalizedJobSkills.length > 0
    ? Math.round((matchingSkills.length / normalizedJobSkills.length) * 100)
    : 0;

  // Generate recommendations
  const recommendations = generateRecommendations(
    matchPercentage, 
    missingSkills, 
    jobDescription,
    resume
  );

  return {
    matchPercentage,
    matchingSkills,
    missingSkills,
    totalJobSkills: normalizedJobSkills.length,
    totalResumeSkills: normalizedResumeSkills.length,
    recommendations,
    jobSkills: normalizedJobSkills
  };
}

// Generate personalized recommendations
function generateRecommendations(matchPercentage, missingSkills, jobDescription, resume) {
  const recommendations = [];

  if (matchPercentage < 50) {
    recommendations.push({
      priority: 'high',
      title: 'Low Match Score',
      message: 'Your resume matches less than 50% of the job requirements. Consider applying to better-matched positions or updating your resume.',
      action: 'Review missing skills and add relevant experience'
    });
  }

  if (missingSkills.length > 0) {
    recommendations.push({
      priority: missingSkills.length > 5 ? 'high' : 'medium',
      title: 'Add Missing Skills',
      message: `You're missing ${missingSkills.length} key skills mentioned in the job description.`,
      skills: missingSkills.slice(0, 5),
      action: 'Add these skills to your resume if you have experience with them'
    });
  }

  // Check for experience level
  const jdLower = jobDescription.toLowerCase();
  const yearMatches = jdLower.match(/(\d+)\+?\s*years?/gi);
  if (yearMatches && yearMatches.length > 0) {
    recommendations.push({
      priority: 'medium',
      title: 'Experience Level',
      message: 'Make sure to highlight your years of experience prominently in your resume.',
      action: 'Add years of experience in summary or work history'
    });
  }

  // Check for education requirements
  if (jdLower.includes('bachelor') || jdLower.includes('master') || jdLower.includes('phd')) {
    recommendations.push({
      priority: 'medium',
      title: 'Education Requirements',
      message: 'This job has specific education requirements. Ensure your education section is complete.',
      action: 'Verify education section matches job requirements'
    });
  }

  // Keyword optimization
  recommendations.push({
    priority: 'low',
    title: 'Optimize Keywords',
    message: 'Add job-specific keywords to improve ATS compatibility.',
    action: 'Use exact phrases from the job description in your resume'
  });

  return recommendations;
}

module.exports = { analyzeJobMatch };
