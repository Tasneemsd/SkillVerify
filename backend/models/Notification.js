const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., 'skill_verification_request'
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  interviewDate: { type: String },
  interviewTime: { type: String },
  meetingLink: { type: String },
  adminMessage: { type: String },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notification', notificationSchema);
