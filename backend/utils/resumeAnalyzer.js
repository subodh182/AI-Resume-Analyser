// Common technical skills database
const TECHNICAL_SKILLS = {
  programming: ['JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go', 'Rust', 'TypeScript', 'SQL', 'HTML', 'CSS', 'C'],
  frameworks: ['React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'ASP.NET', 'Next.js', 'Nuxt.js'],
  databases: ['MongoDB', 'MySQL', 'PostgreSQL', 'Oracle', 'Redis', 'Cassandra', 'DynamoDB', 'SQLite', 'Firebase'],
  cloud: ['AWS', 'Azure', 'GCP', 'Google Cloud', 'Heroku', 'DigitalOcean', 'Docker', 'Kubernetes'],
  tools: ['Git', 'GitHub', 'GitLab', 'Jira', 'Jenkins', 'Travis CI', 'CircleCI', 'Webpack', 'Babel', 'npm', 'yarn'],
  soft_skills: ['Leadership', 'Communication', 'Teamwork', 'Problem Solving', 'Critical Thinking', 'Time Management', 'Adaptability']
};

// Common keywords for different sections
const SECTION_KEYWORDS = {
  contact: ['email', 'phone', 'linkedin', 'github', 'portfolio', 'address', 'website'],
  experience: ['experience', 'work history', 'employment', 'professional experience', 'work experience'],
  education: ['education', 'degree', 'university', 'college', 'school', 'bachelor', 'master', 'phd'],
  skills: ['skills', 'technical skills', 'core competencies', 'expertise', 'proficiencies'],
  projects: ['projects', 'portfolio', 'work samples', 'github']
};

// Escape special regex characters
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Analyze resume text and extract information
exports.analyzeResume = (text) => {
  const lowerText = text.toLowerCase();
  
  // Extract skills
  const skillsFound = [];
  
  Object.entries(TECHNICAL_SKILLS).forEach(([category, skills]) => {
    skills.forEach(skill => {
      // Escape special characters in skill name
      const escapedSkill = escapeRegex(skill.toLowerCase());
      const regex = new RegExp(`\\b${escapedSkill}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches && matches.length > 0) {
        skillsFound.push({
          skill,
          category,
          confidence: Math.min(matches.length * 0.2, 1)
        });
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
    hasProjects: /projects|portfolio|github/i.test(text)
  };

  // Generate improvements
  const improvements = [];
  
  if (!sections.hasContactInfo) {
    improvements.push({
      category: 'Contact Information',
      suggestion: 'Add clear contact information including email, phone, and LinkedIn profile',
      priority: 'high'
    });
  }

  if (skillsFound.length < 5) {
    improvements.push({
      category: 'Skills',
      suggestion: 'Include more relevant technical skills to improve ATS compatibility',
      priority: 'high'
    });
  }

  if (!sections.hasProjects) {
    improvements.push({
      category: 'Projects',
      suggestion: 'Add a projects section to showcase your practical experience',
      priority: 'medium'
    });
  }

  if (text.length < 500) {
    improvements.push({
      category: 'Content',
      suggestion: 'Expand your resume with more detailed descriptions of your experience',
      priority: 'high'
    });
  }

  // Calculate readability score (based on text length and structure)
  const readabilityScore = Math.min(
    ((text.length / 2000) * 40) + // Length factor
    (sections.hasExperience ? 20 : 0) +
    (sections.hasEducation ? 20 : 0) +
    (sections.hasSkills ? 20 : 0),
    100
  );

  // Calculate formatting score
  const formattingScore = Math.round(
    (sections.hasContactInfo ? 20 : 0) +
    (sections.hasExperience ? 20 : 0) +
    (sections.hasEducation ? 20 : 0) +
    (sections.hasSkills ? 20 : 0) +
    (sections.hasProjects ? 20 : 0)
  );

  return {
    skillsFound,
    keywordMatches: keywordMatches.slice(0, 20), // Top 20 keywords
    sections,
    improvements,
    readabilityScore: Math.round(readabilityScore),
    formattingScore
  };
};

// Calculate ATS score
exports.calculateATSScore = (analysis) => {
  let score = 0;

  // Skills found (40 points max)
  score += Math.min(analysis.skillsFound.length * 4, 40);

  // Sections present (30 points max)
  const sectionScore = Object.values(analysis.sections).filter(Boolean).length * 6;
  score += sectionScore;

  // Keyword density (30 points max)
  const keywordScore = Math.min(analysis.keywordMatches.length * 2, 30);
  score += keywordScore;

  return Math.round(Math.min(score, 100));
};