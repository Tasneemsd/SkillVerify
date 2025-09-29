
const express = require("express");
const twilio = require("twilio");
const bcrypt = require("bcryptjs");
const User = require("../models/Student");
 // Adjust path if needed

const router = express.Router();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const SERVICE_SID = process.env.TWILIO_VERIFY_SID; // Put your Verify Service SID in .env

// ✅ Send OTP using Twilio Verify
router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number required" });

    const verification = await client.verify.v2.services(SERVICE_SID).verifications.create({
      to: phone,
      channel: "sms",
    });

    res.json({ success: true, status: verification.status });
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// ✅ Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, code, name, email, password } = req.body;

    if (!phone || !code) return res.status(400).json({ message: "Phone and OTP code required" });

    const check = await client.verify.v2.services(SERVICE_SID).verificationChecks.create({
      to: phone,
      code,
    });

    if (check.status === "approved") {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save user in DB
      const user = new User({ name, email, phone, password: hashedPassword });
      await user.save();

      return res.json({ success: true, message: "User registered successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
});

// ✅ Normal login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ success: true, message: "Login successful", user });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
