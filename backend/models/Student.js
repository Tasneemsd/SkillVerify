const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  college: { type: String },
  year: { type: Number },
  course: { type: String },
  skills: [{
    name: { type: String, required: true },
    verified: { type: Boolean, default: false }
  }],
  registeredCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  rollNo: { type: String },
  phone: { type: String },
  socialLinks: { facebook: String, github: String, linkedin: String, instagram: String },
  codingLinks: { leetcode: String, hackerrank: String, codeforces: String, codechef: String },
  profilePicture: { type: String }
});

module.exports = mongoose.model('Student', studentSchema);
