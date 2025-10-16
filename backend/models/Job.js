const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  type: {
    type: String,
    enum: ["Full-time", "Part-time", "Internship"],
    required: true
  },
  salary: {
    type: Number,
    required: function () {
      return this.type !== "Internship";
    },
    validate: {
      validator: function (v) {
        if (this.type === "Internship" && v != null && v < 10000) return false;
        return true;
      },
      message: "Internship salary must be at least 10,000 if provided",
    },
  },
  stipend: {
    type: Number,
    required: function () {
      return this.type === "Internship";
    },
    validate: {
      validator: function (v) {
        if (this.type === "Internship" && v < 1000) return false;
        return true;
      },
      message: "Internship stipend must be at least 1,000",
    },
  },
  skillsRequired: [{ type: String }],
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter", required: true },
  postedByEmail: { type: String, required: true },
  postedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },

  // ✅ Add this section
  appliedBy: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
      appliedAt: { type: Date, default: Date.now },
    }
  ]
});



module.exports = mongoose.model("Job", jobSchema);
