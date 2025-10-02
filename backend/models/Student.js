const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  branch: { type: String },
  college: { type: String },
  graduationYear: { type: String },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }], // ✅ unified name
  skills: [
    {
      name: { type: String, required: true },
      level: { type: String, enum: ["Basic", "Intermediate", "Advanced"], default: "Basic" }
    }
  ],
  resumeUrl: { type: String },  // store uploaded resume link
github: { type: String },
linkedin: { type: String },
leetcode: { type: String },
portfolio: { type: String },

});

module.exports = mongoose.model("Student", studentSchema);
