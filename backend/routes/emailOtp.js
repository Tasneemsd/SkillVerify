const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { verifiedEmails } = require("../controllers/authController"); // 👈 import shared set

const otpStore = new Map();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpStore.set(email, { otp, expiresAt });

  try {
    await transporter.sendMail({
      from: `"SkillVerify" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "SkillVerify Email Verification Code",
      html: `<h2>Email Verification</h2>
             <p>Your OTP code is:</p>
             <h1>${otp}</h1>
             <p>This code is valid for 5 minutes.</p>`,
    });

    res.json({ success: true, message: "OTP sent successfully to your email" });
  } catch (err) {
    console.error("❌ Email OTP Send Error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code)
    return res.status(400).json({ message: "Email and OTP code required" });

  const record = otpStore.get(email);
  if (!record)
    return res.status(400).json({ message: "No OTP sent to this email" });

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ message: "OTP expired. Please request again." });
  }

  if (record.otp !== code)
    return res.status(400).json({ message: "Invalid OTP code" });

  otpStore.delete(email);
  verifiedEmails.add(email); // ✅ mark email as verified
  res.json({ success: true, message: "OTP verified successfully!" });
});

module.exports = router;
