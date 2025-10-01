const express = require("express");
const Application = require("../models/Application");
const Job = require("../models/Job");
const Student = require("../models/Student");
const jwt = require("jsonwebtoken");
const router = express.Router();

// GET /api/applications?studentId=... - get all applications for a student
router.get("/", async (req, res) => {
  try {
    const { studentId } = req.query;
    if (!studentId) return res.status(400).json({ message: "studentId required" });

    const applications = await Application.find({ student: studentId });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications", error: err.message });
  }
});

// POST /api/applications - student applies for a job
router.post("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "student") return res.status(403).json({ message: "Only students can apply" });

    const student = await Student.findOne({ email: decoded.email });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ message: "Job ID required" });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Prevent duplicate applications
    const existing = await Application.findOne({
      student: student._id,
      jobTitle: job.title,
      company: job.company
    });
    if (existing) return res.status(409).json({ message: "Already applied to this job" });

    // Save application with job details
    const app = new Application({
      student: student._id,
      jobTitle: job.title,
      company: job.company
    });

    await app.save();
    res.json({ success: true, message: "Applied successfully ✅", application: app });
  } catch (err) {
    res.status(500).json({ message: "Failed to apply", error: err.message });
  }
});

module.exports = router;
