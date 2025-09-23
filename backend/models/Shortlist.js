const mongoose = require('mongoose');

const shortlistSchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true,
    index: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  notes: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicates and optimize queries
shortlistSchema.index({ recruiterId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Shortlist', shortlistSchema);