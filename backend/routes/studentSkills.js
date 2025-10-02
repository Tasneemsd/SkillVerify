// routes/studentSkills.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

// ✅ Add a skill
router.post("/add", async (req, res) => {
  try {
    const { name, level } = req.body;

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret");

    const student = await Student.findById(decoded.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.skills.push({ name, level });
    await student.save();

    res.json({ success: true, skills: student.skills });
  } catch (err) {
    console.error("Skill add error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Remove a skill by index
router.delete("/remove/:index", async (req, res) => {
  try {
    const index = parseInt(req.params.index);

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret");

    const student = await Student.findById(decoded.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (index >= 0 && index < student.skills.length) {
      student.skills.splice(index, 1);
      await student.save();
    }

    res.json({ success: true, skills: student.skills });
  } catch (err) {
    console.error("Skill remove error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
