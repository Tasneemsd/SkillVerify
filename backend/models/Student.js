const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  college: { type: String },
  year: { type: Number },
  course: { type: String },
  rollNo: { type: String },
  phone: { type: String },

  profilePicture: { type: String },

  // Skills
  skills: [{
    name: { type: String, required: true },
    verified: { type: Boolean, default: false }
  }],
  verifiedSkillsCount: { type: Number, default: 0 },

  // Registered courses
  registeredCourses: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Course" }
  ],

  // Job applications
  applications: [
    {
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
      jobTitle: String,
      company: String,
      status: { type: String, default: "Applied" },
      appliedOn: { type: Date, default: Date.now }
    }
  ],

  socialLinks: {
    facebook: String,
    github: String,
    linkedin: String,
    instagram: String
  },
  codingLinks: {
    leetcode: String,
    hackerrank: String,
    codeforces: String,
    codechef: String
  },
});

module.exports = mongoose.model('Student', studentSchema);
