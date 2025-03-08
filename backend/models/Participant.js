// models/Participant.js
const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  // Personal Information
  full_name: {
    type: String,
    required: [true, 'Full name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone_number: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10}$/, 'Phone number must be 10 digits']
  },
  
  // Education Information
  college_name: {
    type: String,
    required: [true, 'College name is required']
  },
  degree: {
    type: String,
    required: [true, 'Degree is required'],
    enum: ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'B.Sc', 'M.Sc', 'Other']
  },
  year_of_study: {
    type: String,
    required: [true, 'Year of study is required'],
    enum: ['1st', '2nd', '3rd', '4th', '5th']
  },
  cgpa: {
    type: Number,
    required: [true, 'CGPA is required'],
    min: [0, 'CGPA cannot be less than 0'],
    max: [10, 'CGPA cannot be more than 10']
  },
  
  // Technical Skills
  tech_stack: {
    type: [String],
    required: [true, 'At least one tech stack is required'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'Please select at least one tech stack'
    }
  },
  other_skills: {
    type: String
  },
  
  // Project Idea
  project_idea: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || v.length >= 50;
      },
      message: 'Project idea must be at least 50 characters if provided'
    }
  },
  
  // Social Profiles
  github: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https:\/\/github\.com\/[\w-]+\/?$/.test(v);
      },
      message: 'Please provide a valid GitHub URL'
    }
  },
  linkedin: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https:\/\/.*linkedin\.com\/in\/[\w-]+\/?$/.test(v);
      },
      message: 'Please provide a valid LinkedIn URL'
    }
  },
  
  // Additional fields
  registration_date: {
    type: Date,
    default: Date.now
  },
  verification_status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Create a compound index for efficient queries
participantSchema.index({ email: 1, phone_number: 1 });

module.exports = mongoose.model('Participant', participantSchema);