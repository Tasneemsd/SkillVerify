const express = require("express");
const Job = require("../models/Job");
const Recruiter = require("../models/Recruiter");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Middleware to verify recruiter token
const verifyRecruiter = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "recruiter")
      return res.status(403).json({ message: "Only recruiters can perform this action" });

    req.recruiter = await Recruiter.findOne({ email: decoded.email });
    if (!req.recruiter) return res.status(404).json({ message: "Recruiter not found" });

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

// POST /api/jobs - recruiter posts a job/internship
router.post("/", verifyRecruiter, async (req, res) => {
  try {
    const { salary, stipend, type } = req.body;

    // Internship salary validation
    const finalSalary = Number(salary) || Number(stipend) || 0;
    if (type === "Internship" && finalSalary < 10000) {
      return res.status(400).json({ message: "Internship salary must be at least 10000" });
    }

    const job = new Job({
      ...req.body,
      salary: finalSalary,
      postedBy: req.recruiter._id,
      postedByEmail: req.recruiter.email,
    });

    await job.save();
    res.json({ message: "Job posted successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Failed to post job", error: err.message });
  }
});

// GET /api/jobs - list all jobs
router.get("/", async (req, res) => {
  try {
    let jobs = await Job.find().populate("postedBy", "name email");

    // Filter and map for frontend
    jobs = jobs
      .filter((job) => job.isActive) // only active jobs
      .map((job) => ({
        _id: job._id,
        title: job.title,
        description: job.description,
        type: job.type,
        company: job.postedBy.name || "Company",
        location: job.location,
        salary: job.salary || 0,
        skills: job.skillsRequired,
        postedBy: job.postedBy._id,
        postedByEmail: job.postedByEmail,
        postedAt: job.postedAt,
        isActive: job.isActive,
      }));

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
});

// GET /api/jobs/mine - list jobs posted by logged-in recruiter
router.get("/mine", verifyRecruiter, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.recruiter._id }).sort({ postedAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your jobs", error: err.message });
  }
});

// PUT /api/jobs/:id - recruiter updates their own job
router.put("/:id", verifyRecruiter, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (String(job.postedBy) !== String(req.recruiter._id)) {
      return res.status(403).json({ message: "You can only update your own jobs" });
    }

    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) job[key] = req.body[key];
    });

    // Validate internship salary
    if (job.type === "Internship" && job.salary < 10000) {
      return res.status(400).json({ message: "Internship salary must be at least 10000" });
    }

    await job.save();
    res.json({ message: "Job updated successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Failed to update job", error: err.message });
  }
});

// DELETE /api/jobs/:id - recruiter deletes their own job
router.delete("/:id", verifyRecruiter, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (String(job.postedBy) !== String(req.recruiter._id)) {
      return res.status(403).json({ message: "You can only delete your own jobs" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete job", error: err.message });
  }
});

module.exports = router;
