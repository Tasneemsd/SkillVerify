const express = require("express");
const router = express.Router();

// Example: Get recruiter profile by email
router.get("/profile", async (req, res) => {
  try {
    const { email } = req.query;
    // find recruiter in DB
    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }
    res.json(recruiter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Example: Get all students for recruiter
router.get("/students", async (req, res) => {
  try {
    const students = await Student.find(); // or filter by recruiterId if needed
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;