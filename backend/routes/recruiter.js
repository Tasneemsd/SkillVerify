const express = require("express");
const router = express.Router();
const Recruiter = require("../models/Recruiter");
const Job = require("../models/Job");

// ===== GET recruiter profile by email =====
router.get("/profile", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });
    const recruiter = await Recruiter.findOne({ email: email.toLowerCase().trim() });
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });
    res.json(recruiter);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ===== POST recruiter profile (create/update) =====
router.post("/profile", async (req, res) => {
  try {
    const { email, name, companyName, position, phone, bio } = req.body;
    if (!email || !name) return res.status(400).json({ message: "Name & email required" });

    const recruiter = await Recruiter.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { name, companyName, position, phone, bio },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ message: "Profile saved successfully", recruiter });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Email already exists" });
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ===== GET jobs posted by recruiter =====
router.get("/jobs", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });

    const recruiter = await Recruiter.findOne({ email: email.toLowerCase().trim() });
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });

    const jobs = await Job.find({ postedBy: recruiter._id }).sort({ postedAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
});

// ===== POST new job =====
router.post("/create-job", async (req, res) => {
  try {
    const { email, title, description, location, salary, skillsRequired } = req.body;
    if (!email || !title || !description || !location) {
      return res.status(400).json({ message: "Email, title, description, location required" });
    }

    const recruiter = await Recruiter.findOne({ email: email.toLowerCase().trim() });
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });

    const job = new Job({
      title,
      description,
      location,
      salary,
      skillsRequired,
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
