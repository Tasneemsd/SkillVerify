const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const jwt = require("jsonwebtoken");

// ✅ GET student profile using JWT
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided or invalid format" });
    }

    const token = authHeader.split(" ")[1].replace(/"/g, "");
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const student = await Student.findById(decoded.id).populate("registeredCourses");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json(student);
  } catch (err) {
    console.error("❌ Student /me fetch error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ GET student by email (fallback for cases when JWT not sent)
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const student = await Student.findOne({ email }).populate("registeredCourses");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json(student);
  } catch (err) {
    console.error("❌ Student by email fetch error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
