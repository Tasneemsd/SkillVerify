const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String },
  skills: [{ type: String }], // frontend sends skillsRequired -> mapped here
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter", required: true },
  postedByEmail: { type: String, required: true },
  postedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },

  // Optional fields with defaults
  type: { type: String, enum: ["Full-time", "Part-time", "Internship", "Contract", "Remote", "Other"], default: "Other" },
  company: { type: String, default: "" },
  stipend: { type: String, default: "" },
  requirements: { type: String, default: "" },
  responsibilities: { type: String, default: "" },
  perks: [{ type: String }],
  applyLink: { type: String, default: "" },
  deadline: { type: Date },
  jobMode: { type: String, enum: ["Onsite", "Remote", "Hybrid"], default: "Onsite" },
  duration: { type: String, default: "" },
  openings: { type: Number, default: 1 },
  experience: { type: String, default: "" },
  education: { type: String, default: "" },
  contactEmail: { type: String, default: "" },
  contactPhone: { type: String, default: "" },
});

module.exports = mongoose.model("Job", jobSchema);
