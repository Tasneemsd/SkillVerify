const express = require("express");
const Student = require("../models/Student");
const router = express.Router();
const jwt = require("jsonwebtoken");

// routes/studentProfile.js
router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "student")
      return res.status(403).json({ message: "Only students can access profile" });

    const student = await Student.findById(decoded.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});


module.exports = router;
