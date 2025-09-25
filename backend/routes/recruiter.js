const express = require("express");
const router = express.Router();
const Recruiter = require("../models/Recruiter");

// GET recruiter profile
router.get("/profile", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const recruiter = await Recruiter.findOne({ email: email.toLowerCase().trim() });
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });

    res.json(recruiter);
  } catch (err) {
    console.error("Error fetching recruiter:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /profile - create or update recruiter
router.post("/profile", async (req, res) => {
  try {
    const { email, name, companyName, position, phone, bio } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const normalizedEmail = email.toLowerCase().trim();

    const recruiter = await Recruiter.findOneAndUpdate(
      { email: normalizedEmail },
      { $set: { name, email: normalizedEmail, companyName, position, phone, bio } },
      { new: true, upsert: true, runValidators: true } // ✅ upsert creates new if not exists
    );

    res.json({ message: "Recruiter profile saved successfully", recruiter });
  } catch (err) {
    console.error("Error updating recruiter:", err.message);

    // Handle duplicate key error gracefully
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
