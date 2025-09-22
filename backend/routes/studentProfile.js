const express = require("express");
const Student = require("../models/Student");
const router = express.Router();
const jwt = require("jsonwebtoken");

// POST /api/student/profile - update student profile
router.post("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "student") return res.status(403).json({ message: "Only students can update profile" });
    const { email, ...updateFields } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ message: "Student not found" });
    // Use $set for partial update, supporting dot notation
    await Student.updateOne({ email }, { $set: updateFields });
    res.json({ message: "Profile updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
});

module.exports = router;
