const express = require("express");
const router = express.Router();
const axios = require("axios");
const { verifiedEmails } = require("../controllers/authController"); // shared set

const otpStore = new Map();

// Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes

// Send OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = generateOtp();
  const expiresAt = Date.now() + OTP_EXPIRY;
  otpStore.set(email, { otp, expiresAt });

  try {
    await axios.post(
      "https://api.sendinblue.com/v3/smtp/email",
      {
        sender: { email: process.env.SENDER_EMAIL, name: "SkillVerify" },
        to: [{ email }],
        subject: "Your OTP Code",
        htmlContent: `<h2>Email Verification</h2>
                      <p>Your OTP code is:</p>
                      <h1>${otp}</h1>
                      <p>Valid for 5 minutes.</p>`,
      },
      {
        headers: {
          "api-key": process.env.SENDINBLUE_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, message: "OTP sent successfully!" });
  } catch (err) {
    console.error("❌ Send OTP Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Verify OTP
router.post("/verify-otp", (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ message: "Email and OTP required" });

  const record = otpStore.get(email);
  if (!record) return res.status(400).json({ message: "No OTP sent to this email" });
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ message: "OTP expired. Request again." });
  }
  if (record.otp !== code) return res.status(400).json({ message: "Invalid OTP" });

  otpStore.delete(email);
  verifiedEmails.add(email); // mark as verified
  res.json({ success: true, message: "OTP verified successfully!" });
});

module.exports = router;
