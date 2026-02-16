const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  extractedText: {
    type: String,
    default: ''
  },
  analysis: {
    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    atsScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    skillsFound: [{
      skill: String,
      category: String,
      confidence: Number
    }],
    keywordMatches: [{
      keyword: String,
      count: Number
    }],
    sections: {
      hasContactInfo: { type: Boolean, default: false },
      hasExperience: { type: Boolean, default: false },
      hasEducation: { type: Boolean, default: false },
      hasSkills: { type: Boolean, default: false },
      hasProjects: { type: Boolean, default: false }
    },
    improvements: [{
      category: String,
      suggestion: String,
      priority: String
    }],
    readabilityScore: {
      type: Number,
      default: 0
    },
    formattingScore: {
      type: Number,
      default: 0
    }
  },
  jobMatches: [{
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    matchScore: Number,
    matchedSkills: [String],
    missingSkills: [String]
  }],
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'analyzed', 'error'],
    default: 'uploaded'
  }
}, {
  timestamps: true
});

// Index for faster queries
resumeSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Resume', resumeSchema);
