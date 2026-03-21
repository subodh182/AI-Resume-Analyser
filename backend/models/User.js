const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Required fields
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
  
  // Basic optional fields
  phone: {
    type: String,
    default: ''
  },
  skills: {
    type: Array,
    default: []
  },
  experience: {
    type: Array,
    default: []
  },
  education: {
    type: Array,
    default: []
  },
  
  // Profile fields
  profilePhoto: {
    type: String,
    default: ''
  },
  location: {
    city: String,
    state: String,
    country: String
  },
  currentPosition: {
    type: String,
    default: ''
  },
  currentCompany: {
    type: String,
    default: ''
  },
  socialLinks: {
    linkedin: String,
    github: String,
    portfolio: String
  },
  
  // Timestamps
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
