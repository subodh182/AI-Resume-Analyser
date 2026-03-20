// Enhanced Resume Analyzer with Detailed Suggestions

const TECHNICAL_SKILLS = {
  programming: ['JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go', 'Rust', 'TypeScript', 'SQL', 'HTML', 'CSS', 'C'],
  frameworks: ['React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'ASP.NET', 'Next.js', 'Nuxt.js', 'FastAPI', 'NestJS'],
  databases: ['MongoDB', 'MySQL', 'PostgreSQL', 'Oracle', 'Redis', 'Cassandra', 'DynamoDB', 'SQLite', 'Firebase', 'MariaDB', 'Elasticsearch'],
  cloud: ['AWS', 'Azure', 'GCP', 'Google Cloud', 'Heroku', 'DigitalOcean', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'CircleCI'],
  tools: ['Git', 'GitHub', 'GitLab', 'Jira', 'Jenkins', 'Travis CI', 'CircleCI', 'Webpack', 'Babel', 'npm', 'yarn', 'VS Code', 'Postman', 'Figma'],
  soft_skills: ['Leadership', 'Communication', 'Teamwork', 'Problem Solving', 'Critical Thinking', 'Time Management', 'Adaptability', 'Creativity']
};

// Action verbs for resume impact
const ACTION_VERBS = {
  leadership: ['Led', 'Managed', 'Directed', 'Coordinated', 'Supervised', 'Mentored', 'Guided'],
  achievement: ['Achieved', 'Improved', 'Increased', 'Reduced', 'Enhanced', 'Optimized', 'Streamlined'],
  technical: ['Developed', 'Designed', 'Implemented', 'Built', 'Created', 'Engineered', 'Architected'],
  collaboration: ['Collaborated', 'Partnered', 'Cooperated', 'Facilitated', 'Contributed'],
  innovation: ['Innovated', 'Pioneered', 'Launched', 'Initiated', 'Established']
};

// Weak words to avoid
const WEAK_WORDS = ['responsible for', 'helped', 'assisted', 'worked on', 'tried', 'attempted', 'handled', 'did'];

// Escape regex special characters
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Analyze resume text
exports.analyzeResume = (text) => {
  const lowerText = text.toLowerCase();
  
  // Extract skills
  const skillsFound = [];
  const skillsByCategory = {};
  
  Object.entries(TECHNICAL_SKILLS).forEach(([category, skills]) => {
    skillsByCategory[category] = [];
    skills.forEach(skill => {
      const escapedSkill = escapeRegex(skill.toLowerCase());
      const regex = new RegExp(`\\b${escapedSkill}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches && matches.length > 0) {
        skillsFound.push({
          skill,
          category,
          confidence: Math.min(matches.length * 0.2, 1)
        });
        skillsByCategory[category].push(skill);
      }
    });
  });

  // Count keyword matches
  const keywordMatches = [];
  const allSkills = Object.values(TECHNICAL_SKILLS).flat();
  allSkills.forEach(keyword => {
    const escapedKeyword = escapeRegex(keyword.toLowerCase());
    const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches && matches.length > 0) {
      keywordMatches.push({
        keyword,
        count: matches.length
      });
    }
  });

  // Detect sections
  const sections = {
    hasContactInfo: /email|phone|linkedin|github/i.test(text),
    hasExperience: /experience|work history|employment/i.test(text),
    hasEducation: /education|degree|university|college/i.test(text),
    hasSkills: /skills|technical skills|competencies/i.test(text),
    hasProjects: /projects|portfolio|github/i.test(text),
    hasSummary: /summary|objective|profile/i.test(text),
    hasCertifications: /certification|certificate|certified/i.test(text)
  };

  // Check for quantifiable achievements
  const hasNumbers = /\d+%|\d+ years?|\d+\+|\$\d+|increased by \d+|reduced \d+/i.test(text);
  const hasMetrics = /revenue|sales|performance|efficiency|productivity/i.test(text);

  // Check for action verbs
  const usedActionVerbs = [];
  Object.values(ACTION_VERBS).flat().forEach(verb => {
    if (new RegExp(`\\b${verb}\\b`, 'i').test(text)) {
      usedActionVerbs.push(verb);
    }
  });

  // Check for weak words
  const foundWeakWords = [];
  WEAK_WORDS.forEach(word => {
    if (new RegExp(word, 'i').test(text)) {
      foundWeakWords.push(word);
    }
  });

  // Word count analysis
  const wordCount = text.split(/\s+/).length;
  const isOptimalLength = wordCount >= 300 && wordCount <= 800;

  // Generate detailed improvements
  const improvements = generateImprovements({
    sections,
    skillsFound,
    skillsByCategory,
    hasNumbers,
    hasMetrics,
    usedActionVerbs,
    foundWeakWords,
    wordCount,
    isOptimalLength,
    text
  });

  // Calculate scores
  const readabilityScore = Math.min(
    ((text.length / 2000) * 40) +
    (sections.hasExperience ? 20 : 0) +
    (sections.hasEducation ? 20 : 0) +
    (sections.hasSkills ? 20 : 0),
    100
  );

  const formattingScore = Math.round(
    (sections.hasContactInfo ? 15 : 0) +
    (sections.hasExperience ? 15 : 0) +
    (sections.hasEducation ? 15 : 0) +
    (sections.hasSkills ? 15 : 0) +
    (sections.hasProjects ? 15 : 0) +
    (sections.hasSummary ? 15 : 0) +
    (sections.hasCertifications ? 10 : 0)
  );

  return {
    skillsFound,
    skillsByCategory,
    keywordMatches: keywordMatches.slice(0, 20),
    sections,
    improvements,
    readabilityScore: Math.round(readabilityScore),
    formattingScore,
    metrics: {
      hasNumbers,
      hasMetrics,
      actionVerbsCount: usedActionVerbs.length,
      weakWordsCount: foundWeakWords.length,
      wordCount,
      isOptimalLength
    }
  };
};

// Generate detailed improvement suggestions
function generateImprovements(data) {
  const improvements = [];
  const {
    sections,
    skillsFound,
    skillsByCategory,
    hasNumbers,
    hasMetrics,
    usedActionVerbs,
    foundWeakWords,
    wordCount,
    isOptimalLength,
    text
  } = data;

  // 1. Contact Information
  if (!sections.hasContactInfo) {
    improvements.push({
      category: 'Contact Information',
      priority: 'high',
      issue: 'Missing or incomplete contact information',
      suggestion: 'Add professional contact details at the top of your resume',
      whatToAdd: [
        'Full Name (large, bold font)',
        'Professional email address (firstname.lastname@email.com)',
        'Phone number with country code',
        'LinkedIn profile URL',
        'GitHub profile (for tech roles)',
        'Location (City, State/Country)'
      ],
      example: 'John Doe\njohn.doe@email.com | +1-234-567-8900\nlinkedin.com/in/johndoe | github.com/johndoe\nSan Francisco, CA',
      impact: 'Critical - Recruiters need to contact you!',
      resources: [
        { type: 'article', title: 'How to Format Contact Information', url: '#' },
        { type: 'template', title: 'Professional Header Templates', url: '#' }
      ]
    });
  }

  // 2. Professional Summary
  if (!sections.hasSummary) {
    improvements.push({
      category: 'Professional Summary',
      priority: 'high',
      issue: 'No professional summary or objective statement',
      suggestion: 'Add a compelling 3-4 line summary highlighting your expertise and value proposition',
      whatToAdd: [
        'Your current role/title',
        'Years of experience',
        'Key technical skills (3-4 most relevant)',
        'Major achievement or unique value',
        'Career goal or what you\'re seeking'
      ],
      example: 'Results-driven Full Stack Developer with 5+ years of experience building scalable web applications using React, Node.js, and MongoDB. Led development of e-commerce platform serving 100K+ users. Passionate about clean code and agile methodologies. Seeking senior engineering role to drive technical innovation.',
      impact: 'High - First thing recruiters read!',
      howTo: [
        'Keep it concise (3-4 sentences)',
        'Use numbers and metrics',
        'Tailor to job description',
        'Avoid generic statements',
        'Show value, not just experience'
      ],
      resources: [
        { type: 'guide', title: 'Writing Powerful Resume Summaries', url: '#' },
        { type: 'examples', title: '50+ Professional Summary Examples', url: '#' }
      ]
    });
  }

  // 3. Skills Section
  if (skillsFound.length < 8) {
    const missingCategories = Object.entries(skillsByCategory)
      .filter(([_, skills]) => skills.length === 0)
      .map(([category]) => category);

    improvements.push({
      category: 'Technical Skills',
      priority: 'high',
      issue: `Only ${skillsFound.length} technical skills detected. ATS systems look for 10-15 relevant skills.`,
      suggestion: 'Add more relevant technical skills to improve ATS matching',
      whatToAdd: [
        'Programming languages you\'ve used',
        'Frameworks and libraries',
        'Tools and platforms',
        'Databases and cloud services',
        'Methodologies (Agile, Scrum, TDD)',
        'Soft skills (Leadership, Communication)'
      ],
      missingCategories,
      skillSuggestions: {
        programming: ['JavaScript', 'Python', 'TypeScript', 'Java'],
        frameworks: ['React', 'Node.js', 'Express', 'Next.js'],
        databases: ['MongoDB', 'PostgreSQL', 'Redis'],
        cloud: ['AWS', 'Docker', 'Kubernetes'],
        tools: ['Git', 'Jira', 'VS Code']
      },
      example: 'Technical Skills:\n- Languages: JavaScript, Python, TypeScript, SQL\n- Frameworks: React.js, Node.js, Express, Next.js\n- Databases: MongoDB, PostgreSQL, Redis\n- Cloud & DevOps: AWS, Docker, Kubernetes, Jenkins\n- Tools: Git, GitHub, Jira, Postman',
      impact: 'Very High - Critical for ATS filtering',
      howTo: [
        'Organize by category',
        'List most relevant first',
        'Include proficiency level if needed',
        'Match job description keywords',
        'Be honest - only list what you know'
      ],
      resources: [
        { type: 'tool', title: 'Skills Gap Analyzer', url: '#' },
        { type: 'list', title: 'Top Tech Skills 2024', url: '#' }
      ]
    });
  }

  // 4. Quantifiable Achievements
  if (!hasNumbers || !hasMetrics) {
    improvements.push({
      category: 'Quantifiable Achievements',
      priority: 'high',
      issue: 'Lacks quantifiable achievements and metrics',
      suggestion: 'Add numbers, percentages, and metrics to demonstrate impact',
      whatToAdd: [
        'Percentage improvements (Increased sales by 25%)',
        'Time savings (Reduced processing time from 4 hours to 30 minutes)',
        'Revenue impact ($500K+ annual revenue)',
        'Scale (Managed team of 10 developers)',
        'User base (Platform serving 1M+ users)',
        'Performance metrics (Improved page load by 40%)'
      ],
      beforeAfter: {
        before: 'Developed web application for the company',
        after: 'Developed e-commerce platform serving 50K+ monthly users, increasing online revenue by 35% ($2M annually)'
      },
      examples: [
        'Reduced API response time by 60% through caching implementation',
        'Led team of 5 developers to deliver project 2 weeks ahead of schedule',
        'Increased user engagement by 40% through redesigned UI/UX',
        'Managed $500K budget for cloud infrastructure optimization',
        'Automated testing process, reducing bugs by 75%'
      ],
      impact: 'Very High - Shows tangible results',
      howTo: [
        'Use specific numbers instead of vague terms',
        'Show before/after comparisons',
        'Include dollar amounts when possible',
        'Mention team size if you led/managed',
        'Use percentages for improvements',
        'Add timeframes (delivered in 6 weeks)'
      ],
      resources: [
        { type: 'guide', title: 'How to Quantify Your Achievements', url: '#' },
        { type: 'calculator', title: 'Achievement Impact Calculator', url: '#' }
      ]
    });
  }

  // 5. Action Verbs
  if (usedActionVerbs.length < 10 || foundWeakWords.length > 0) {
    improvements.push({
      category: 'Strong Action Verbs',
      priority: 'medium',
      issue: foundWeakWords.length > 0 
        ? `Found ${foundWeakWords.length} weak phrases: ${foundWeakWords.join(', ')}`
        : 'Limited use of strong action verbs',
      suggestion: 'Replace weak phrases with powerful action verbs',
      weakWordsFound: foundWeakWords,
      replacements: {
        'responsible for': 'Led, Managed, Oversaw, Directed',
        'helped': 'Assisted, Supported, Facilitated, Enabled',
        'worked on': 'Developed, Built, Created, Implemented',
        'handled': 'Managed, Executed, Coordinated, Administered'
      },
      actionVerbCategories: ACTION_VERBS,
      beforeAfter: {
        before: 'Responsible for managing team projects',
        after: 'Led cross-functional team of 8 to deliver 12 projects on time'
      },
      examples: [
        'Led migration of legacy system to microservices architecture',
        'Architected scalable backend handling 1M+ requests/day',
        'Spearheaded implementation of CI/CD pipeline, reducing deployment time by 70%',
        'Engineered real-time analytics dashboard used by 500+ stakeholders'
      ],
      impact: 'Medium - Makes resume more compelling',
      howTo: [
        'Start each bullet with action verb',
        'Vary your verbs (don\'t repeat)',
        'Match verb to your role (technical vs leadership)',
        'Use past tense for previous roles',
        'Present tense only for current role'
      ],
      resources: [
        { type: 'list', title: '200+ Power Verbs for Resumes', url: '#' },
        { type: 'tool', title: 'Action Verb Suggester', url: '#' }
      ]
    });
  }

  // 6. Projects Section
  if (!sections.hasProjects) {
    improvements.push({
      category: 'Projects',
      priority: 'medium',
      issue: 'No projects section found',
      suggestion: 'Add a projects section to showcase practical experience',
      whatToAdd: [
        'Project name and brief description',
        'Technologies used',
        'Your role and responsibilities',
        'Challenges solved',
        'Impact/results achieved',
        'Link to live demo or GitHub repo'
      ],
      example: 'E-Commerce Platform (MERN Stack)\n- Built full-stack shopping application using React, Node.js, MongoDB\n- Implemented secure payment gateway (Stripe) processing 1000+ transactions/month\n- Integrated real-time inventory management system\n- Technologies: React, Redux, Node.js, Express, MongoDB, AWS\n- GitHub: github.com/username/project | Live: project-demo.com',
      impact: 'High - Demonstrates hands-on skills',
      howTo: [
        'Include 2-4 most impressive projects',
        'List newest/most relevant first',
        'Show variety of skills',
        'Include links (GitHub, live demo)',
        'Explain your specific contribution',
        'Mention if it\'s a personal or team project'
      ],
      resources: [
        { type: 'template', title: 'Project Description Templates', url: '#' },
        { type: 'examples', title: 'Top Portfolio Projects', url: '#' }
      ]
    });
  }

  // 7. Certifications
  if (!sections.hasCertifications) {
    improvements.push({
      category: 'Certifications',
      priority: 'low',
      issue: 'No certifications mentioned',
      suggestion: 'Add relevant certifications to boost credibility',
      whatToAdd: [
        'Professional certifications',
        'Online course completions',
        'Industry-specific credentials',
        'Issuing organization',
        'Date obtained',
        'Certification ID (if applicable)'
      ],
      popularCertifications: [
        'AWS Certified Solutions Architect',
        'Google Cloud Professional',
        'Microsoft Azure Fundamentals',
        'MongoDB Certified Developer',
        'Certified Kubernetes Administrator',
        'PMP (Project Management Professional)',
        'Scrum Master Certification'
      ],
      example: 'Certifications:\n- AWS Certified Solutions Architect – Associate | Amazon Web Services | June 2023\n- MongoDB Certified Developer | MongoDB University | Jan 2023\n- Google Cloud Professional Cloud Architect | Google | 2022',
      impact: 'Medium - Shows commitment to learning',
      resources: [
        { type: 'courses', title: 'Top Free Certifications', url: '#' },
        { type: 'guide', title: 'Which Certifications Matter?', url: '#' }
      ]
    });
  }

  // 8. Resume Length
  if (!isOptimalLength) {
    const lengthIssue = wordCount < 300 
      ? 'Too short - lacks detail'
      : 'Too long - may lose recruiter attention';
    
    improvements.push({
      category: 'Resume Length',
      priority: 'medium',
      issue: `Current: ${wordCount} words. ${lengthIssue}`,
      suggestion: wordCount < 300
        ? 'Expand your resume with more details and achievements'
        : 'Condense your resume to focus on most relevant information',
      optimalRange: '300-800 words (1-2 pages)',
      currentCount: wordCount,
      whatToDo: wordCount < 300 ? [
        'Add more details to each role',
        'Include 3-5 bullet points per job',
        'Elaborate on key achievements',
        'Add projects section',
        'Include relevant coursework or certifications'
      ] : [
        'Remove outdated or irrelevant experience',
        'Combine similar roles',
        'Trim to 3-4 bullets per job',
        'Focus on last 10 years of experience',
        'Remove generic statements'
      ],
      impact: 'Medium - Affects readability',
      resources: [
        { type: 'tool', title: 'Resume Length Optimizer', url: '#' }
      ]
    });
  }

  // 9. Experience Section Enhancement
  if (sections.hasExperience) {
    improvements.push({
      category: 'Experience Section Enhancement',
      priority: 'high',
      issue: 'Experience section can be strengthened',
      suggestion: 'Follow the STAR method: Situation, Task, Action, Result',
      whatToInclude: [
        'Company name and location',
        'Job title',
        'Employment dates (Month Year - Month Year)',
        '3-5 bullet points per role',
        'Quantified achievements',
        'Relevant technologies used'
      ],
      starMethod: {
        situation: 'Set the context',
        task: 'Describe your responsibility',
        action: 'Explain what you did',
        result: 'Show the impact with numbers'
      },
      example: 'Senior Software Engineer | Tech Corp | San Francisco, CA | Jan 2020 - Present\n• Led development of microservices architecture, improving system scalability by 300%\n• Reduced API response time by 60% through Redis caching implementation\n• Mentored team of 5 junior developers, resulting in 2 promotions\n• Technologies: Node.js, React, MongoDB, AWS, Docker, Kubernetes',
      impact: 'Very High - Core of your resume',
      howTo: [
        'List in reverse chronological order',
        'Use consistent formatting',
        'Tailor to job description',
        'Show career progression',
        'Include relevant technologies'
      ]
    });
  }

  // 10. ATS Optimization
  improvements.push({
    category: 'ATS Optimization',
    priority: 'high',
    issue: 'Resume may not be fully ATS-optimized',
    suggestion: 'Ensure your resume passes Applicant Tracking Systems',
    atsRequirements: [
      'Use standard section headings (Experience, Education, Skills)',
      'Avoid tables, images, and complex formatting',
      'Use standard fonts (Arial, Calibri, Times New Roman)',
      'Save as .docx or PDF (check job posting requirements)',
      'Include keywords from job description',
      'Use standard bullet points (•, -, *)',
      'Avoid headers and footers for important info'
    ],
    keywordMatching: {
      tip: 'Mirror language from job description',
      example: 'If job says "React.js", use "React.js" not "ReactJS"'
    },
    impact: 'Critical - Get past automated screening',
    checklist: [
      '✓ Standard section headings',
      '✓ No tables or images',
      '✓ Standard font (11-12pt)',
      '✓ Keywords from job posting',
      '✓ Consistent formatting',
      '✓ Proper file format (.pdf or .docx)',
      '✓ File name: FirstName_LastName_Resume.pdf'
    ],
    resources: [
      { type: 'tool', title: 'ATS Compatibility Checker', url: '#' },
      { type: 'guide', title: 'Beat the ATS Guide', url: '#' }
    ]
  });

  return improvements;
}

// Calculate ATS score
exports.calculateATSScore = (analysis) => {
  let score = 0;

  // Skills (35 points)
  const skillScore = Math.min(analysis.skillsFound.length * 3, 35);
  score += skillScore;

  // Sections (30 points)
  const sectionScore = Object.values(analysis.sections).filter(Boolean).length * 4;
  score += Math.min(sectionScore, 30);

  // Keywords (20 points)
  const keywordScore = Math.min(analysis.keywordMatches.length * 1.5, 20);
  score += keywordScore;

  // Metrics & Numbers (10 points)
  if (analysis.metrics.hasNumbers) score += 5;
  if (analysis.metrics.hasMetrics) score += 5;

  // Action verbs (5 points)
  if (analysis.metrics.actionVerbsCount >= 10) score += 5;
  else if (analysis.metrics.actionVerbsCount >= 5) score += 3;

  // Weak words penalty
  score -= Math.min(analysis.metrics.weakWordsCount * 2, 10);

  return Math.round(Math.max(Math.min(score, 100), 0));
};
