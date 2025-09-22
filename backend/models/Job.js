const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["Full-time", "Part-time", "Internship", "Contract", "Remote", "Other"], required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String },
  stipend: { type: String },
  description: { type: String, required: true },
  requirements: { type: String },
  responsibilities: { type: String },
  skills: [{ type: String }],
  perks: [{ type: String }],
  applyLink: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter", required: true },
  postedByEmail: { type: String, required: true },
  postedAt: { type: Date, default: Date.now },
  deadline: { type: Date },
  isActive: { type: Boolean, default: true },
  jobMode: { type: String, enum: ["Onsite", "Remote", "Hybrid"], default: "Onsite" },
  duration: { type: String },
  openings: { type: Number, default: 1 },
  experience: { type: String },
  education: { type: String },
  contactEmail: { type: String },
  contactPhone: { type: String },
  // Add more fields as needed
});

module.exports = mongoose.model("Job", jobSchema);
