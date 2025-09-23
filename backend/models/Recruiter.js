const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  company: String,
  position: String,
  phone: String,
  bio: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Recruiter", recruiterSchema);
