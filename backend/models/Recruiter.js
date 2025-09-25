const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  companyName: String,
  position: String,
  phone: String,
  bio: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Recruiter", recruiterSchema);
