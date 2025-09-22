const express = require("express");
const Job = require("../models/Job");
const Recruiter = require("../models/Recruiter");
const jwt = require("jsonwebtoken");
const router = express.Router();

// PUT /api/jobs/:id - recruiter updates their own job (partial update)
router.put("/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "recruiter") return res.status(403).json({ message: "Only recruiters can update jobs" });
    const recruiter = await Recruiter.findOne({ email: decoded.email });
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (String(job.postedBy) !== String(recruiter._id)) {
      return res.status(403).json({ message: "You can only update your own jobs" });
    }
    // Only update provided fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) job[key] = req.body[key];
    });
    await job.save();
    res.json({ message: "Job updated successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Failed to update job", error: err.message });
  }
});

// DELETE /api/jobs/:id - recruiter deletes their own job
router.delete("/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "recruiter") return res.status(403).json({ message: "Only recruiters can delete jobs" });
    const recruiter = await Recruiter.findOne({ email: decoded.email });
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (String(job.postedBy) !== String(recruiter._id)) {
      return res.status(403).json({ message: "You can only delete your own jobs" });
    }
    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete job", error: err.message });
  }
});

// GET /api/jobs/mine - list jobs posted by the logged-in recruiter
router.get("/mine", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "recruiter") return res.status(403).json({ message: "Only recruiters can view their jobs" });
    const recruiter = await Recruiter.findOne({ email: decoded.email });
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });
    const jobs = await Job.find({ postedBy: recruiter._id }).sort({ postedAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your jobs", error: err.message });
  }
});

// POST /api/jobs - recruiter posts a job/internship
router.post("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "recruiter") return res.status(403).json({ message: "Only recruiters can post jobs" });
    const recruiter = await Recruiter.findOne({ email: decoded.email });
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });
    const job = new Job({
      ...req.body,
      postedBy: recruiter._id,
      postedByEmail: recruiter.email
    });
    await job.save();
    res.json({ message: "Job posted successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Failed to post job", error: err.message });
  }
});

// (Optional) GET /api/jobs - list all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

module.exports = router;
