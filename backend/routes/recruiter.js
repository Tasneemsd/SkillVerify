const express = require("express");
const router = express.Router();
const Recruiter = require("../models/Recruiter"); // make sure model exists

// ✅ GET recruiter profile by email
router.get("/profile", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // normalize email to lowercase
    const recruiter = await Recruiter.findOne({ email: email.toLowerCase().trim() });

    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    res.json(recruiter);
  } catch (err) {
    console.error("Error fetching recruiter:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST /api/recruiter/profile - create or update recruiter
router.post("/profile", async (req, res) => {
  try {
    const { email, ...updateFields } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // find existing recruiter or create new
    const recruiter = await Recruiter.findOneAndUpdate(
      { email: normalizedEmail },
      { $set: { email: normalizedEmail, ...updateFields } },
      { new: true, upsert: true } // upsert = create if doesn't exist
    );

    res.json({
      message: "Recruiter profile saved successfully",
      recruiter,
    });
  } catch (err) {
    console.error("Error updating recruiter:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
