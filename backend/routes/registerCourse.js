const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Course = require("../models/Course");
const jwt = require("jsonwebtoken");

// POST /api/student/enroll
router.post("/enroll", async (req, res) => {
  try {
    const { courseId } = req.body;

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (student.registeredCourses.includes(courseId))
      return res.status(400).json({ message: "Already registered" });

    student.registeredCourses.push(courseId);
    await student.save();

    res.json({ message: "Enrolled successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
