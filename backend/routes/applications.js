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
    const existing = await Application.findOne({ job: jobId, student: student._id });
    if (existing) return res.status(409).json({ message: "Already applied to this job" });

    const app = new Application({ job: jobId, student: student._id });
    await app.save();
    res.json({ message: "Application submitted", application: app });
  } catch (err) {
    res.status(500).json({ message: "Failed to apply", error: err.message });
  }
});

// GET /api/applications/job/:jobId - recruiter gets applications for a job
router.get("/job/:jobId", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "recruiter") return res.status(403).json({ message: "Only recruiters can view applications" });

    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (String(job.postedBy) !== String(decoded.id))
      return res.status(403).json({ message: "You can only view applications for your own jobs" });

    const applications = await Application.find({ job: job._id }).populate("student");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications", error: err.message });
  }
});

// PATCH /api/applications/:id/status - recruiter updates application status
router.patch("/:id/status", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "recruiter") return res.status(403).json({ message: "Only recruiters can update status" });

    const { status } = req.body;
    if (!["accepted", "rejected"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const app = await Application.findById(req.params.id).populate("job");
    if (!app) return res.status(404).json({ message: "Application not found" });

    if (String(app.job.postedBy) !== String(decoded.id))
      return res.status(403).json({ message: "You can only update applications for your own jobs" });

    app.status = status;
    await app.save();
    res.json({ message: "Status updated", application: app });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
});

module.exports = router;
