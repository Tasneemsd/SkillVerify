const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicates and optimize queries
favoriteSchema.index({ recruiterId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);