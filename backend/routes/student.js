const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Course = require("../models/Course");

// GET student by email
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const student = await Student.findOne({ email }).populate("registeredCourses");
    if (!student) return res.status(404).json({ message: "Student not found" });

    return res.status(200).json(student);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST enroll course
router.post("/enroll", async (req, res) => {
  try {
    const { courseId } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
    if (decoded.role !== "student")
      return res.status(403).json({ message: "Only students can enroll" });

    const student = await Student.findById(decoded.id);
    const course = await Course.findById(courseId);
    if (!student || !course) return res.status(404).json({ message: "Student or course not found" });

    // Prevent duplicate enrollment
    if (student.registeredCourses.some((c) => c.toString() === course._id.toString()))
      return res.status(400).json({ message: "Already enrolled" });

    student.registeredCourses.push(course._id);
    await student.save();

    return res.status(200).json({
      success: true,
      message: "Enrolled successfully",
      registeredCourses: student.registeredCourses,
      course,
    });
  } catch (err) {
    console.error("Enroll error:", err);
    return res.status(500).json({ message: "Enrollment failed", error: err.message });
  }
});

module.exports = router;
