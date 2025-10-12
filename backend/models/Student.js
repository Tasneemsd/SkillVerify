const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Academic Info
    branch: { type: String },
    college: { type: String },
    graduationYear: { type: Number },

    // Courses
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],

    // Skills
    skills: [
      {
        name: { type: String, required: true },
        level: {
          type: String,
          enum: ["Basic", "Intermediate", "Advanced"],
          default: "Basic",
        },
      },
    ],

    // Profile Links
    resumeUrl: { type: String },
    github: { type: String },
    linkedin: { type: String },
    leetcode: { type: String },
    portfolio: { type: String },

    // Mock Interview
    mockInterviewScheduled: { type: Boolean, default: false },
    mockInterviewDate: { type: Date },
    mockInterviewScore: { type: Number, default: 0 },
    paymentDone: { type: Boolean, default: false },

    // Verification & Admin
    isVerified: { type: Boolean, default: false },
    verifiedBy: { type: String },
    verificationFeedback: { type: String },
    verificationDate: { type: Date },

    // Role-based access
    role: { type: String, enum: ["student", "admin", "recruiter"], default: "student" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
