const express = require("express");
const Student = require("../models/Student"); // Make sure Student model exists
const router = express.Router();

// GET /api/recruiter/students
// Optional query params: college, year, skills
router.get("/students", async (req, res) => {
  try {
    const { college, year, skills } = req.query;

    let query = {};

    // Filter by college
    if (college) query.college = { $regex: college, $options: "i" };
    // Filter by year
    if (year) query.year = parseInt(year);
    // Only students with verified skills
    if (skills) query["skills.verified"] = true;

    // Fetch students
    const students = await Student.find(query).select(
      "name course college year skills initials email"
    );

    res.json(students);
  } catch (err) {
    console.error("FETCH STUDENTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch students", error: err.message });
  }
});

module.exports = router;
