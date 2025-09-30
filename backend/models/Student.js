const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  college: { type: String },
  year: { type: Number },
  course: { type: String },
  skills: [{ type: String }],
  verifiedSkillsCount: { type: Number, default: 0 },
  isFavorite: { type: Boolean, default: false },
  isShortlisted: { type: Boolean, default: false },
  avatar: { type: String },
phone: { type: String },
  registeredCourses: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Course" }
  ],
  rollNo: { type: String },
  phone: { type: String },
  socialLinks: {
    facebook: { type: String },
    github: { type: String },
    linkedin: { type: String },
    instagram: { type: String }
  },
  codingLinks: {
    leetcode: { type: String },
    hackerrank: { type: String },
    codeforces: { type: String },
    codechef: { type: String }
  },
  profilePicture: { type: String },
  skills: [{
    name: { type: String, required: true },
    verified: { type: Boolean, default: false }
  }],
});

module.exports = mongoose.model('Student', studentSchema);
