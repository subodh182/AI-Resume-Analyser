const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  },
  status: {
    type: String,
    enum: ['applied', 'viewed', 'shortlisted', 'interview', 'rejected', 'offered', 'accepted'],
    default: 'applied'
  },
  coverLetter: {
    type: String,
    default: ''
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  statusHistory: [{
    status: String,
    date: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  interviews: [{
    date: Date,
    type: {
      type: String,
      enum: ['Phone', 'Video', 'Onsite', 'Technical', 'HR'],
      default: 'Phone'
    },
    interviewer: String,
    feedback: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  notes: [{
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  followUpDate: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);
