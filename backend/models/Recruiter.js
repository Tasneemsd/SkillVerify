const mongoose = require('mongoose');

const recruiterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyName: { type: String },
  position: { type: String },
  contactNumber: { type: String },
  profilePicture: { type: String },
  // Add more fields as needed
});

module.exports = mongoose.model('Recruiter', recruiterSchema);