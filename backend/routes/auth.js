const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const twilio = require("twilio");
const bcrypt = require("bcryptjs");
const User = require("../models/Student");

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

// In-memory OTP store { phone: { otp, email, password, createdAt } }
const otpStore = {};

// -------------------
// Normal Register + Login
// -------------------
router.post("/register", register);
router.post("/login", login);

// -------------------
// Send OTP
// -------------------
router.post("/send-otp", async (req, res) => {
  const { phone, email, password } = req.body;
  if (!phone || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[phone] = { otp, email, password, createdAt: Date.now() };

    // Auto-delete after 5 min
    setTimeout(() => {
      if (otpStore[phone] && Date.now() - otpStore[phone].createdAt > 5 * 60 * 1000) {
        delete otpStore[phone];
      }
    }, 5 * 60 * 1000);

    await client.messages.create({
      body: `Your OTP is ${otp}`,
      to: phone,
      from: process.env.TWILIO_PHONE,
    });

    res.json({ message: "OTP sent successfully ✅" });
  } catch (err) {
    console.error("OTP send error:", err.message);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
});

// -------------------
// Verify OTP
// -------------------
router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
  const entry = otpStore[phone];
  if (!entry) return res.status(400).json({ message: "No OTP request found" });

  if (Date.now() - entry.createdAt > 5 * 60 * 1000) {
    delete otpStore[phone];
    return res.status(400).json({ message: "OTP expired" });
  }

  if (entry.otp != otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  try {
    const hashedPassword = await bcrypt.hash(entry.password, 10);
    const newUser = new User({
      email: entry.email,
      phone,
      password: hashedPassword,
    });
    await newUser.save();

    delete otpStore[phone];
    res.json({ message: "Registration successful ✅" });
  } catch (err) {
    res.status(500).json({ message: "Failed to register", error: err.message });
  }
});

module.exports = router;
