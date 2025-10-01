const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  branch: { type: String },
  college: { type: String },
  graduationYear: { type: String },
  registeredCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  skills: [{ type: String }],
});

module.exports = mongoose.model("Student", studentSchema);
