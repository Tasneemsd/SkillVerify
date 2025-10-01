const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// 🔹 GET student by email
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
    console.error("❌ Student fetch error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
