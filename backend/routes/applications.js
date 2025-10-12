const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Application = require("../models/Application");
const Job = require("../models/Job"); // Make sure this exists

// POST - Apply for a job
router.post("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
    if (decoded.role !== "student")
      return res.status(403).json({ message: "Only students can apply" });

    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ message: "Job ID required" });

    // Fetch job details
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check if already applied
    const existingApp = await Application.findOne({
      student: decoded.id,
      jobTitle: job.title,
      company: job.company,
    });
    if (existingApp)
      return res.status(400).json({ message: "Already applied for this job" });

    // Create application
    const application = await Application.create({
      student: decoded.id,
      jobTitle: job.title,
      company: job.company,
      status: "applied",
      appliedOn: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Applied successfully",
      application,
    });
  } catch (err) {
    console.error("Application error:", err);
    return res
      .status(500)
      .json({ message: "Application failed", error: err.message });
  }
});

// GET - Fetch student applications
router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
    if (decoded.role !== "student")
      return res.status(403).json({ message: "Only students can fetch applications" });

    // Fetch applications
    const applications = await Application.find({ student: decoded.id });
    return res.status(200).json(applications);
  } catch (err) {
    console.error("Fetch applications error:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch applications", error: err.message });
  }
});

module.exports = router;
