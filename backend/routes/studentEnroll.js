// routes/studentEnroll.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Course = require("../models/Course");

// Enroll student in a course
router.post("/", async (req, res) => {
  try {
    const { courseId } = req.body;

    // Token check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided or invalid format" });
    }
    const token = authHeader.split(" ")[1].replace(/"/g, "");

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    if (decoded.role !== "student") {
      return res.status(403).json({ success: false, message: "Only students can enroll" });
    }

    const student = await Student.findById(decoded.id);
    const course = await Course.findById(courseId);
    if (!student || !course) {
      return res.status(404).json({ success: false, message: "Student or course not found" });
    }

    // Initialize enrolledCourses array if not exists
    if (!student.enrolledCourses) student.enrolledCourses = [];

    if (student.enrolledCourses.some((c) => c.toString() === course._id.toString())) {
      return res.status(400).json({ success: false, message: "You are already enrolled in this course" });
    }

    student.enrolledCourses.push(course._id);
    await student.save();

    return res.status(200).json({
      success: true,
      message: "Enrolled successfully",
      enrolledCourses: student.enrolledCourses,
      course,
    });
  } catch (err) {
    console.error("Enroll error:", err);
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again later." });
  }
});

module.exports = router;
