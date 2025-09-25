const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  salary: String,
  skillsRequired: [{ type: String }],
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter", required: true },
  postedByEmail: { type: String, required: true },
  postedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("Job", jobSchema);
