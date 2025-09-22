const express = require("express");
const Course = require("../models/Course");
const router = express.Router();

// GET /api/courses - get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

module.exports = router;
