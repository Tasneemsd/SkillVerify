const express = require("express");
const router = express.Router();
const Recruiter = require("../models/Recruiter");
const Job = require("../models/Job");
const Student = require("../models/Student"); // <- Add this
const jwt = require("jsonwebtoken");

// ===== GET recruiter profile by email =====
router.get("/profile", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const recruiter = await Recruiter.findOne({ email: email.toLowerCase().trim() });
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });

    res.json(recruiter);
  } catch (err) {
    console.error("PROFILE ERROR:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ===== POST create/update recruiter profile =====
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
    console.error("PROFILE SAVE ERROR:", err.message);
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
    console.error("GET JOBS ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
});

// ===== POST create new job =====
router.post("/create-job", async (req, res) => {
  try {
    const { email, title, description, location, salary, skillsRequired } = req.body;
    if (!email || !title || !description || !location)
      return res.status(400).json({ message: "Email, title, description, location required" });

    const recruiter = await Recruiter.findOne({ email: email.toLowerCase().trim() });
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });

    const job = new Job({
      title,
      description,
      location,
      salary,
      skills: skillsRequired || [],
      postedBy: recruiter._id,
      postedByEmail: recruiter.email
    });

    await job.save();
    res.json({ message: "Job created successfully", job });
  } catch (err) {
    console.error("CREATE JOB ERROR:", err.message);
    res.status(500).json({ message: "Failed to create job", error: err.message });
  }
});

// ===== GET students/candidates =====
router.get("/students", async (req, res) => {
  try {
    const { college, year, skills } = req.query;

    let query = {};
    if (college) query.college = { $regex: college, $options: "i" };
    if (year) query.year = parseInt(year);
    if (skills) query["skills.verified"] = true; // only verified skills

    const students = await Student.find(query).select(
      "name course college year skills email initials"
    );

    res.json(students);
  } catch (err) {
    console.error("FETCH STUDENTS ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch students", error: err.message });
  }
});

module.exports = router;
