const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
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
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'replied'],
    default: 'sent'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

contactSchema.index({ recruiterId: 1, createdAt: -1 });
contactSchema.index({ studentId: 1, createdAt: -1 });

module.exports = mongoose.model('Contact', contactSchema);