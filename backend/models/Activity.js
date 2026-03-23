const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'resume_uploaded',
      'resume_analyzed', 
      'job_applied',
      'job_saved',
      'profile_updated',
      'profile_viewed',
      'interview_scheduled',
      'application_status_changed'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  relatedTo: {
    model: {
      type: String,
      enum: ['Resume', 'Job', 'Application', 'User']
    },
    id: mongoose.Schema.Types.ObjectId
  },
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Index for faster queries
activitySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
