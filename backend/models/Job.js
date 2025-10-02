const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  salary: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        // If internship, enforce minimum 10000
        if (this.type === "Internship" && v < 10000) return false;
        return true;
      },
      message: "Internship salary must be at least 10,000",
    },
  },
  type: { 
    type: String, 
    enum: ["Full-time", "Part-time", "Internship"], 
    required: true 
  },
  skillsRequired: [{ type: String }],
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter", required: true },
  postedByEmail: { type: String, required: true },
  postedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("Job", jobSchema);
