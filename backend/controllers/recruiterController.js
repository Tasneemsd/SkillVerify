const Recruiter = require("../models/Recruiter");
const Student = require("../models/Student");

// GET /recruiter/jobs
exports.getJobs = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.user.id).populate("jobs");
    res.json(recruiter.jobs || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /recruiter/candidates
exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Student.find({ appliedJob: { $exists: true } });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /recruiter/create-job
exports.createJob = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.user.id);
    const newJob = { ...req.body, postedBy: recruiter._id };
    recruiter.jobs = recruiter.jobs ? [...recruiter.jobs, newJob] : [newJob];
    await recruiter.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /recruiter/update-profile
exports.updateProfile = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.user.id);
    Object.assign(recruiter, req.body);
    await recruiter.save();
    res.json({ message: "Profile updated", recruiter });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
