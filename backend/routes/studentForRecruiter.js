const express = require("express");
const Student = require("../models/Student"); // make sure you have Student model
const router = express.Router();

// GET /api/recruiter/students
// Optional query params: college, year, skills
router.get("/students", async (req, res) => {
  try {
    const { college, year, skills } = req.query;

    let query = {};

    if (college) query.college = { $regex: college, $options: "i" };
    if (year) query.year = parseInt(year);
    if (skills) query["skills.verified"] = true; // Only students with verified skills

    const students = await Student.find(query).select(
      "name course college year skills initials email"
    );

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

module.exports = router;
