const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registeredCourses: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Course" }
  ],
  rollNo: { type: String },
  contactNumber: { type: String },
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
