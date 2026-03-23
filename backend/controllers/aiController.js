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

// @desc    Generate interview questions based on resume
// @route   POST /api/ai/interview-questions
// @access  Private
exports.generateInterviewQuestions = async (req, res) => {
  try {
    const { resumeId, difficulty, count } = req.body;

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
    const skills = resume.analysis?.skills || [];
    const experience = resume.analysis?.experience || [];

    // Generate questions
    const questions = generateQuestions(skills, experience, difficulty || 'intermediate', count || 10);

    res.json({
      success: true,
      questions,
      difficulty: difficulty || 'intermediate',
      total: questions.length
    });
  } catch (error) {
    console.error('Generate questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating interview questions',
      error: error.message
    });
  }
};

// Generate interview questions based on skills
function generateQuestions(skills, experience, difficulty, count) {
  const questions = [];
  
  // Question templates by difficulty
  const templates = {
    beginner: [
      { skill: 'react', question: 'What is React and why is it used?', category: 'Basics' },
      { skill: 'javascript', question: 'Explain the difference between var, let, and const in JavaScript.', category: 'Basics' },
      { skill: 'python', question: 'What are the key features of Python?', category: 'Basics' },
      { skill: 'node.js', question: 'What is Node.js and how does it work?', category: 'Basics' },
      { skill: 'mongodb', question: 'What is MongoDB and when would you use it?', category: 'Database' },
      { skill: 'sql', question: 'What is the difference between SQL and NoSQL databases?', category: 'Database' },
      { skill: 'html', question: 'What is semantic HTML and why is it important?', category: 'Frontend' },
      { skill: 'css', question: 'Explain the CSS Box Model.', category: 'Frontend' },
      { skill: 'git', question: 'What is Git and why is version control important?', category: 'Tools' },
      { skill: 'docker', question: 'What is Docker and what problem does it solve?', category: 'DevOps' }
    ],
    intermediate: [
      { skill: 'react', question: 'Explain the Virtual DOM in React and how it improves performance.', category: 'Technical' },
      { skill: 'javascript', question: 'What are Promises and how do they differ from callbacks?', category: 'Technical' },
      { skill: 'python', question: 'Explain decorators in Python with an example.', category: 'Technical' },
      { skill: 'node.js', question: 'How does the event loop work in Node.js?', category: 'Technical' },
      { skill: 'mongodb', question: 'Explain indexing in MongoDB and its performance benefits.', category: 'Database' },
      { skill: 'sql', question: 'What are JOINs in SQL? Explain different types.', category: 'Database' },
      { skill: 'rest api', question: 'What are RESTful APIs and their key principles?', category: 'Backend' },
      { skill: 'redux', question: 'Explain the Redux architecture and data flow.', category: 'State Management' },
      { skill: 'aws', question: 'What are the core services of AWS you have worked with?', category: 'Cloud' },
      { skill: 'docker', question: 'Explain Docker containers vs Virtual Machines.', category: 'DevOps' }
    ],
    advanced: [
      { skill: 'react', question: 'How would you optimize the performance of a large React application?', category: 'System Design' },
      { skill: 'javascript', question: 'Explain Event Loop, Microtasks, and Macrotasks in JavaScript.', category: 'Advanced' },
      { skill: 'python', question: 'How would you implement a memory-efficient data processing pipeline in Python?', category: 'System Design' },
      { skill: 'node.js', question: 'Design a scalable microservices architecture using Node.js.', category: 'Architecture' },
      { skill: 'mongodb', question: 'How would you handle sharding and replication in MongoDB for a high-traffic application?', category: 'Scalability' },
      { skill: 'system design', question: 'Design a URL shortening service like bit.ly.', category: 'System Design' },
      { skill: 'microservices', question: 'How do you handle distributed transactions in microservices?', category: 'Architecture' },
      { skill: 'kubernetes', question: 'Explain Kubernetes orchestration and auto-scaling strategies.', category: 'DevOps' },
      { skill: 'security', question: 'How would you implement end-to-end security in a web application?', category: 'Security' },
      { skill: 'performance', question: 'What strategies would you use to optimize database query performance at scale?', category: 'Performance' }
    ]
  };

  // Behavioral questions (always included)
  const behavioralQuestions = [
    { question: 'Tell me about a challenging project you worked on.', category: 'Behavioral', type: 'experience' },
    { question: 'Describe a time when you had to debug a critical production issue.', category: 'Behavioral', type: 'problem-solving' },
    { question: 'How do you handle disagreements with team members?', category: 'Behavioral', type: 'teamwork' },
    { question: 'What is your approach to learning new technologies?', category: 'Behavioral', type: 'learning' },
    { question: 'Tell me about a time you improved a process or system.', category: 'Behavioral', type: 'innovation' }
  ];

  const selectedTemplate = templates[difficulty] || templates.intermediate;
  
  // Match questions to user skills
  const matchedQuestions = [];
  
  skills.forEach(userSkill => {
    const skill = userSkill.toLowerCase();
    const matchingQuestions = selectedTemplate.filter(q => 
      q.skill.includes(skill) || skill.includes(q.skill)
    );
    matchedQuestions.push(...matchingQuestions);
  });

  // Add generic questions if not enough matched
  if (matchedQuestions.length < count - 2) {
    matchedQuestions.push(...selectedTemplate.slice(0, count - matchedQuestions.length - 2));
  }

  // Add 2 behavioral questions
  matchedQuestions.push(...behavioralQuestions.slice(0, 2));

  // Limit to requested count
  const finalQuestions = matchedQuestions.slice(0, count).map((q, index) => ({
    id: index + 1,
    question: q.question,
    category: q.category,
    difficulty,
    type: q.type || 'technical'
  }));

  return finalQuestions;
}

// Update module.exports
module.exports = {
  generateSummary,
  regenerateSummary,
  generateInterviewQuestions
};
