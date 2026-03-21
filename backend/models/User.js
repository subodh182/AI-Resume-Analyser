const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'recruiter', 'admin'],
    default: 'user'
  },
  
  // Profile Photo
  profilePhoto: {
    type: String,
    default: ''
  },
  
  // Contact Info
  phone: {
    type: String,
    default: ''
  },
  location: {
    city: String,
    state: String,
    country: String
  },
  
  // Professional Info
  currentPosition: {
    type: String,
    default: ''
  },
  currentCompany: {
    type: String,
    default: ''
  },
  
  // Skills with proficiency
  skills: [{
    name: String,
    proficiency: {
      type: Number,
      min: 1,
      max: 10,
      default: 5
    },
    category: {
      type: String,
      enum: ['programming', 'frameworks', 'databases', 'cloud', 'tools', 'soft_skills'],
      default: 'programming'
    }
  }],
  
  // Experience
  experience: [{
    company: String,
    position: String,
    location: String,
    startDate: Date,
    endDate: Date,
    current: {
      type: Boolean,
      default: false
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
      default: 'Full-time'
    },
    description: String,
    achievements: [String],
    techStack: [String]
  }],
  
  // Education
  education: [{
    degree: String,
    university: String,
    fieldOfStudy: String,
    startYear: Number,
    endYear: Number,
    grade: String,
    achievements: [String],
    relevantCoursework: [String]
  }],
  
  // Certifications
  certifications: [{
    name: String,
    issuingOrganization: String,
    issueDate: Date,
    expiryDate: Date,
    credentialId: String,
    credentialUrl: String
  }],
  
  // Projects
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    role: String,
    startDate: Date,
    endDate: Date,
    liveUrl: String,
    githubUrl: String,
    impact: String,
    images: [String]
  }],
  
  // Social Links
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    portfolio: String,
    medium: String,
    youtube: String
  },
  
  // Languages
  languages: [{
    name: String,
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Fluent', 'Native'],
      default: 'Intermediate'
    }
  }],
  
  // Achievements & Awards
  achievements: [{
    title: String,
    organization: String,
    date: Date,
    description: String
  }],
  
  // Career Goals
  careerGoals: {
    shortTerm: String,
    longTerm: String,
    dreamCompanies: [String],
    targetRoles: [String]
  },
  
  // Job Preferences
  jobPreferences: {
    openToWork: {
      type: Boolean,
      default: false
    },
    jobTypes: {
      type: [String],
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
      default: ['Full-time']
    },
    preferredLocations: [String],
    salaryExpectation: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    noticePeriod: {
      type: String,
      enum: ['Immediate', '15 days', '30 days', '60 days', '90 days'],
      default: '30 days'
    },
    willingToRelocate: {
      type: Boolean,
      default: false
    }
  },
  
  // Privacy Settings
  privacySettings: {
    profileVisibility: {
      type: String,
      enum: ['public', 'recruiters', 'private'],
      default: 'recruiters'
    },
    showToCurrentEmployer: {
      type: Boolean,
      default: false
    },
    allowCompanySearches: {
      type: Boolean,
      default: true
    }
  },
  
  // Profile Completion
  profileCompletion: {
    type: Number,
    default: 0
  },
  
  // Statistics
  stats: {
    resumesUploaded: {
      type: Number,
      default: 0
    },
    jobsApplied: {
      type: Number,
      default: 0
    },
    profileViews: {
      type: Number,
      default: 0
    },
    averageAtsScore: {
      type: Number,
      default: 0
    }
  },
  
  // Timestamps
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate profile completion percentage
userSchema.methods.calculateProfileCompletion = function() {
  let completed = 0;
  const total = 15;
  
  if (this.name) completed++;
  if (this.email) completed++;
  if (this.phone) completed++;
  if (this.profilePhoto) completed++;
  if (this.skills && this.skills.length >= 5) completed++;
  if (this.experience && this.experience.length > 0) completed++;
  if (this.education && this.education.length > 0) completed++;
  if (this.socialLinks && this.socialLinks.linkedin) completed++;
  if (this.socialLinks && this.socialLinks.github) completed++;
  if (this.projects && this.projects.length > 0) completed++;
  if (this.certifications && this.certifications.length > 0) completed++;
  if (this.careerGoals && this.careerGoals.shortTerm) completed++;
  if (this.jobPreferences && this.jobPreferences.openToWork !== undefined) completed++;
  if (this.languages && this.languages.length > 0) completed++;
  if (this.achievements && this.achievements.length > 0) completed++;
  
  this.profileCompletion = Math.round((completed / total) * 100);
  return this.profileCompletion;
};

module.exports = mongoose.model('User', userSchema);
