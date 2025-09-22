const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  status: { type: String, enum: ["applied", "interview", "hired", "rejected"], default: "applied" },
  appliedOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Application", applicationSchema);
