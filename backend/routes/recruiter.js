const express = require("express");
const router = express.Router();
const Recruiter = require("../models/Recruiter");
const Job = require("../models/Job");
const Student = require("../models/Student");
const jwt = require("jsonwebtoken");

// Middleware to verify recruiter JWT
const verifyRecruiter = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "recruiter") return res.status(403).json({ message: "Only recruiters allowed" });
    req.recruiterEmail = decoded.email;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

// GET /api/recruiter/profile
router.get("/profile", verifyRecruiter, async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ email: req.recruiterEmail });
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });
    res.json(recruiter);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/recruiter/profile - create/update profile
router.post("/profile", verifyRecruiter, async (req, res) => {
  try {
    const { name, companyName, position, phone, bio } = req.body;
    const recruiter = await Recruiter.findOneAndUpdate(
      { email: req.recruiterEmail },
      { $set: { name, companyName, position, phone, bio } },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ message: "Profile saved", recruiter });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Email already exists" });
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/recruiter/jobs - jobs posted by this recruiter
router.get("/jobs", verifyRecruiter, async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ email: req.recruiterEmail });
    const jobs = await Job.find({ postedBy: recruiter._id }).sort({ postedAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
});

// POST /api/recruiter/jobs - post new job
router.post("/jobs", verifyRecruiter, async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ email: req.recruiterEmail });
    const job = new Job({ ...req.body, postedBy: recruiter._id, postedByEmail: recruiter.email });
    await job.save();
    res.json({ message: "Job posted successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Failed to post job", error: err.message });
  }
});

// GET /api/recruiter/candidates - all students
router.get("/candidates", verifyRecruiter, async (req, res) => {
  try {
    const students = await Student.find().select("name email appliedJob skills");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch candidates", error: err.message });
  }
});

module.exports = router;
