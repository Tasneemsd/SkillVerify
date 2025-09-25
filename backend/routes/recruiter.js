const express = require("express");
const router = express.Router();
const Recruiter = require("../models/Recruiter");
const Job = require("../models/Job");
const jwt = require("jsonwebtoken");

// ===== GET recruiter profile =====
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "recruiter") return res.status(403).json({ message: "Not authorized" });

    const recruiter = await Recruiter.findOne({ email: decoded.email });
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });

    res.json(recruiter);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ===== POST recruiter profile (create/update) =====
router.post("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "recruiter") return res.status(403).json({ message: "Not authorized" });

    const { name, companyName, position, phone, bio } = req.body;

    const recruiter = await Recruiter.findOneAndUpdate(
      { email: decoded.email },
      { name, companyName, position, phone, bio },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ message: "Profile updated successfully", recruiter });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Email already exists" });
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ===== GET jobs posted by recruiter =====
router.get("/jobs", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "recruiter") return res.status(403).json({ message: "Not authorized" });

    const recruiter = await Recruiter.findOne({ email: decoded.email });
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });

    const jobs = await Job.find({ postedBy: recruiter._id }).sort({ postedAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
});

// ===== POST create job =====
router.post("/create-job", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "recruiter") return res.status(403).json({ message: "Not authorized" });

    const recruiter = await Recruiter.findOne({ email: decoded.email });
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });

    const { title, description, location, salary, skillsRequired } = req.body;
    if (!title || !description || !location) return res.status(400).json({ message: "Missing required fields" });

    const job = new Job({
      title,
      description,
      location,
      salary,
      skills: skillsRequired ? skillsRequired.split(",").map(s => s.trim()) : [],
      postedBy: recruiter._id,
      postedByEmail: recruiter.email
    });

    await job.save();
    res.json({ message: "Job created successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Failed to create job", error: err.message });
  }
});

module.exports = router;
