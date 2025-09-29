// backend/routes/otp.js
const express = require("express");
const router = express.Router();
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

if (!accountSid || !authToken || !serviceSid) {
  console.error("❌ Twilio ENV vars missing. Check Render environment settings.");
}

const client = twilio(accountSid, authToken);

// Send OTP
router.post("/send-otp", async (req, res) => {
  let { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone number required" });

  // Ensure E.164 format
  if (!phone.startsWith("+")) {
    phone = `+91${phone}`; // 👈 default India, change as needed
  }

  try {
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: phone, channel: "sms" });

    res.json({ success: true, sid: verification.sid });
  } catch (err) {
    console.error("❌ OTP Send Error:", err.message, err.code, err.moreInfo);
    res.status(500).json({ error: err.message || "Failed to send OTP" });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  let { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ error: "Phone and code required" });

  if (!phone.startsWith("+")) {
    phone = `+91${phone}`;
  }

  try {
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: phone, code });

    res.json({ success: verificationCheck.status === "approved" });
  } catch (err) {
    console.error("❌ OTP Verify Error:", err.message, err.code, err.moreInfo);
    res.status(500).json({ error: err.message || "OTP verification failed" });
  }
});

module.exports = router;
