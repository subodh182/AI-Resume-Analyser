const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
  
  // Optional fields
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
