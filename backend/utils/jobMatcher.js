// Calculate job match score between resume and job
exports.calculateJobMatch = (resume, job) => {
  let matchScore = 0;
  const weights = {
    skills: 0.5,
    experience: 0.2,
    keywords: 0.2,
    education: 0.1
  };

  // Skills match
  const resumeSkills = resume.analysis.skillsFound.map(s => s.skill.toLowerCase());
  const jobSkills = job.skills.map(s => s.toLowerCase());
  
  const matchedSkills = jobSkills.filter(skill => 
    resumeSkills.some(rs => rs.includes(skill) || skill.includes(rs))
  );
  
  const skillsMatchPercentage = jobSkills.length > 0 
    ? (matchedSkills.length / jobSkills.length) * 100 
    : 0;
  
  matchScore += skillsMatchPercentage * weights.skills;

  // Keyword match from job description
  const jobText = `${job.title} ${job.description} ${job.requirements.join(' ')}`.toLowerCase();
  const resumeText = resume.extractedText.toLowerCase();
  
  const jobWords = jobText.split(/\s+/).filter(w => w.length > 3);
  const uniqueJobWords = [...new Set(jobWords)];
  
  const keywordMatches = uniqueJobWords.filter(word => 
    resumeText.includes(word)
  ).length;
  
  const keywordMatchPercentage = (keywordMatches / uniqueJobWords.length) * 100;
  matchScore += keywordMatchPercentage * weights.keywords;

  // Experience level match (simplified)
  const hasExperience = resume.analysis.sections.hasExperience;
  if (hasExperience) {
    matchScore += 80 * weights.experience;
  } else {
    matchScore += 40 * weights.experience;
  }

  // Education match
  const hasEducation = resume.analysis.sections.hasEducation;
  if (hasEducation) {
    matchScore += 100 * weights.education;
  }

  return Math.round(Math.min(matchScore, 100));
};
