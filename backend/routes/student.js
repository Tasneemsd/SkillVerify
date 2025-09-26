const express = require("express");
const Student = require("../models/Student");
const Course = require("../models/Course");
const Application = require("../models/Application"); // Job applications
const router = express.Router();

// --- REGISTER STUDENT ---
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, college, year, skills } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email, and password are required" });

    // Check if student already exists
    let existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    // Prepare skills array
    const skillsArray = (skills || []).map(s => ({ name: s, verified: false }));

    const newStudent = new Student({
      name,
      email,
      password, // TODO: hash password before saving for production
      college: college || "",
      year: year || "",
      skills: skillsArray,
      registeredCourses: [],
    });

    await newStudent.save();

    res.status(201).json({ message: "Student registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- ENROLL IN COURSE ---
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

// --- GET STUDENT INFO ---
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });

    const student = await Student.findOne({ email }).populate("registeredCourses");
    if (!student) return res.status(404).json({ message: "Student not found" });

    const applications = await Application.find({ student: student._id });

    res.json({
      _id: student._id,   // ✅ add this
      name: student.name,
      email: student.email,
      rollNo: student.rollNo || "",
      contactNumber: student.contactNumber || "",
      college: student.college || "",
      year: student.year || "",
      socialLinks: student.socialLinks || {},
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
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch student" });
  }
});


module.exports = router;
