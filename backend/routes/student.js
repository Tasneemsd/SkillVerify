const express = require("express");
const Student = require("../models/Student");
const Course = require("../models/Course");
const Application = require("../models/Application"); // Job applications
const router = express.Router();

// Enroll in course
router.post("/enroll", async (req, res) => {
  try {
    const { courseId, email } = req.body; // frontend sends email
    if (!email) return res.status(400).json({ message: "Student email required" });

    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (!student.registeredCourses.includes(courseId)) {
      student.registeredCourses.push(courseId);
      await student.save();
    }

    res.json({ message: "Enrolled successfully!", registeredCourses: student.registeredCourses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET student info
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });

    const student = await Student.findOne({ email }).populate({ path: "registeredCourses" });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const applications = await Application.find({ student: student._id });

    res.json({
      name: student.name,
      email: student.email,
      rollNo: student.rollNo || "",
      contactNumber: student.contactNumber || "",
      skills: student.skills || [],
      registeredCourses: student.registeredCourses.map(c => ({
        _id: c._id,
        courseName: c.courseName,
        courseId: c.courseId,
      })),
      applications: applications.map(app => ({
        _id: app._id,
        jobTitle: app.jobTitle,
        company: app.company,
        status: app.status,
        appliedOn: app.appliedOn,
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch student" });
  }
});

module.exports = router;
