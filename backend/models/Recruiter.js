const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  companyName: String,   // ✅ matches frontend
  position: String,
  phone: String,
  bio: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Recruiter", recruiterSchema);
