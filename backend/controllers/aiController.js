const Resume = require('../models/Resume');

// @desc    Generate AI summary
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
  const yearsExp = experience.length || 2;
  
  const templates = {
    professional: `Highly motivated professional with ${yearsExp}+ years of experience in software development. Proficient in ${skillsList}. Demonstrated expertise in delivering high-quality solutions and collaborating with cross-functional teams to achieve business objectives.`,
    
    creative: `Dynamic and innovative tech enthusiast with ${yearsExp}+ years of hands-on experience creating impactful solutions. Master of ${skillsList}, I thrive on turning complex challenges into elegant applications.`,
    
    concise: `${yearsExp}+ years experienced developer specializing in ${skillsList}. Proven track record in building scalable applications.`,
    
    detailed: `Accomplished software professional with over ${yearsExp} years of comprehensive experience in full-stack development. Core competencies include ${skillsList}, with additional proficiency in agile methodologies and continuous integration.`
  };

  return templates[tone] || templates.professional;
}

// @desc    Generate interview questions
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

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    const skills = resume.analysis?.skills || [];
    const questions = generateQuestions(skills, difficulty || 'intermediate', count || 10);

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

function generateQuestions(skills, difficulty, count) {
  const templates = {
    beginner: [
      { skill: 'react', question: 'What is React and why is it used?', category: 'Basics' },
      { skill: 'javascript', question: 'Explain the difference between var, let, and const.', category: 'Basics' },
      { skill: 'python', question: 'What are the key features of Python?', category: 'Basics' },
      { skill: 'node', question: 'What is Node.js and how does it work?', category: 'Basics' },
      { skill: 'mongodb', question: 'What is MongoDB and when would you use it?', category: 'Database' },
      { skill: 'sql', question: 'What is the difference between SQL and NoSQL?', category: 'Database' },
      { skill: 'html', question: 'What is semantic HTML?', category: 'Frontend' },
      { skill: 'css', question: 'Explain the CSS Box Model.', category: 'Frontend' },
      { skill: 'git', question: 'What is Git and why is version control important?', category: 'Tools' },
      { skill: 'docker', question: 'What is Docker and what problem does it solve?', category: 'DevOps' }
    ],
    intermediate: [
      { skill: 'react', question: 'Explain the Virtual DOM in React and how it improves performance.', category: 'Technical' },
      { skill: 'javascript', question: 'What are Promises and how do they differ from callbacks?', category: 'Technical' },
      { skill: 'python', question: 'Explain decorators in Python with an example.', category: 'Technical' },
      { skill: 'node', question: 'How does the event loop work in Node.js?', category: 'Technical' },
      { skill: 'mongodb', question: 'Explain indexing in MongoDB and its performance benefits.', category: 'Database' },
      { skill: 'sql', question: 'What are JOINs in SQL? Explain different types.', category: 'Database' },
      { skill: 'api', question: 'What are RESTful APIs and their key principles?', category: 'Backend' },
      { skill: 'redux', question: 'Explain the Redux architecture and data flow.', category: 'State Management' },
      { skill: 'aws', question: 'What are the core services of AWS?', category: 'Cloud' },
      { skill: 'docker', question: 'Explain Docker containers vs Virtual Machines.', category: 'DevOps' }
    ],
    advanced: [
      { skill: 'react', question: 'How would you optimize performance of a large React application?', category: 'System Design' },
      { skill: 'javascript', question: 'Explain Event Loop, Microtasks, and Macrotasks.', category: 'Advanced' },
      { skill: 'python', question: 'How would you implement a memory-efficient data processing pipeline?', category: 'System Design' },
      { skill: 'node', question: 'Design a scalable microservices architecture using Node.js.', category: 'Architecture' },
      { skill: 'mongodb', question: 'How would you handle sharding and replication for high-traffic?', category: 'Scalability' },
      { skill: 'system', question: 'Design a URL shortening service like bit.ly.', category: 'System Design' },
      { skill: 'microservices', question: 'How do you handle distributed transactions?', category: 'Architecture' },
      { skill: 'kubernetes', question: 'Explain Kubernetes orchestration strategies.', category: 'DevOps' },
      { skill: 'security', question: 'How would you implement end-to-end security?', category: 'Security' },
      { skill: 'performance', question: 'What strategies optimize database query performance?', category: 'Performance' }
    ]
  };

  const behavioral = [
    { question: 'Tell me about a challenging project you worked on.', category: 'Behavioral', type: 'experience' },
    { question: 'Describe a time when you had to debug a critical production issue.', category: 'Behavioral', type: 'problem-solving' },
    { question: 'How do you handle disagreements with team members?', category: 'Behavioral', type: 'teamwork' },
    { question: 'What is your approach to learning new technologies?', category: 'Behavioral', type: 'learning' }
  ];

  const selectedTemplate = templates[difficulty] || templates.intermediate;
  const matchedQuestions = [];
  
  skills.forEach(userSkill => {
    const skill = userSkill.toLowerCase();
    const matchingQuestions = selectedTemplate.filter(q => 
      skill.includes(q.skill) || q.skill.includes(skill)
    );
    matchedQuestions.push(...matchingQuestions);
  });

  if (matchedQuestions.length < count - 2) {
    matchedQuestions.push(...selectedTemplate.slice(0, count - matchedQuestions.length - 2));
  }

  matchedQuestions.push(...behavioral.slice(0, 2));

  const finalQuestions = matchedQuestions.slice(0, count).map((q, index) => ({
    id: index + 1,
    question: q.question,
    category: q.category,
    difficulty,
    type: q.type || 'technical'
  }));

  return finalQuestions;
}

exports.regenerateSummary = exports.generateSummary;

module.exports = {
  generateSummary,
  regenerateSummary,
  generateInterviewQuestions
};