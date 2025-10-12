const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  status: { type: String, enum: ["Applied", "Interview", "Hired", "Rejected"], default: "Applied" },
  appliedOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Application", applicationSchema);
