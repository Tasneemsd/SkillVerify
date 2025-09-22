const express = require("express");
const Notification = require("../models/Notification");
const router = express.Router();

// GET /api/notification?studentEmail=...
router.get("/", async (req, res) => {
  try {
    const { studentEmail } = req.query;
    if (!studentEmail) return res.status(400).json({ message: "Student email required" });

    const notifications = await Notification.find({ studentEmail }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

module.exports = router;
