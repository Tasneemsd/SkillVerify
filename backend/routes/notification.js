const express = require("express");
const Notification = require("../models/Notification");
const router = express.Router();

// GET /api/notification?studentId=...
router.get("/", async (req, res) => {
  try {
    const { studentId } = req.query;
    if (!studentId) return res.status(400).json({ message: "studentId required" });

    const notifications = await Notification.find({ student: studentId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

module.exports = router;
