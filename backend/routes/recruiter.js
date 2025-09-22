// routes/recruiter.js
const express = require("express");
const router = express.Router();

// GET recruiter profile by email
router.get("/profile", async (req, res) => {
  const { email } = req.query;
  // Replace with real DB query
  if (email === "recruiter@gmail.com") {
    return res.json({
      name: "Recruiter User",
      email: "recruiter@gmail.com",
      company: "SkillVerify",
    });
  }
  res.status(404).json({ message: "Recruiter not found" });
});

// GET all students
router.get("/students", async (req, res) => {
  // Replace with real DB fetch
  return res.json([
    { id: 1, name: "Alice", skills: ["React", "Node.js"] },
    { id: 2, name: "Bob", skills: ["Python", "Django"] },
  ]);
});

module.exports = router;
