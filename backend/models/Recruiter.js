const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  companyName: { type: String, default: "" },
  position: { type: String, default: "" },
  phone: { type: String, default: "" },
  bio: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Recruiter", recruiterSchema);
