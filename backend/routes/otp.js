// otp.js
const express = require('express');
const router = express.Router();
const twilio = require('twilio');

// Use environment variables (never hardcode secrets!)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

const client = twilio(accountSid, authToken);

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body; // frontend must send { phone: "+91xxxxxxx" }
    if (!phone) return res.status(400).json({ error: 'Phone number required' });

    const verification = await client.verify.v2.services(serviceSid)
      .verifications.create({ to: phone, channel: 'sms' });

    res.status(200).json({ success: true, status: verification.status });
  } catch (err) {
    console.error('OTP Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ error: 'Phone and code required' });

    const verificationCheck = await client.verify.v2.services(serviceSid)
      .verificationChecks.create({ to: phone, code });

    if (verificationCheck.status === 'approved') {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (err) {
    console.error('OTP Verify Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
