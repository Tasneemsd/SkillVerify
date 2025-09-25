/* const express = require("express");
const router = express.Router();
const { authMiddleware } = require("..routes/auth");
const {
  getJobs,
  getCandidates,
  createJob, 
  updateProfile,
} = require("../controllers/recruiterController");

router.get("/jobs", authMiddleware("recruiter"), getJobs);
router.get("/candidates", authMiddleware("recruiter"), getCandidates);
router.post("/create-job", authMiddleware("recruiter"), createJob);
router.post("/update-profile", authMiddleware("recruiter"), updateProfile);

module.exports = router;
 */