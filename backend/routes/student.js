// routes/students.js
const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const jwt = require("jsonwebtoken");

// ------------------- Helper: Auth Middleware -------------------
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided or invalid format" });
    }

    const token = authHeader.split(" ")[1].replace(/"/g, "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
    req.studentId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ------------------- GET Student Profile -------------------
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.studentId).populate("enrolledCourses");
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.status(200).json(student);
  } catch (err) {
    console.error("❌ Student /me fetch error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------- GET by Email -------------------
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const student = await Student.findOne({ email }).populate("enrolledCourses");
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.status(200).json(student);
  } catch (err) {
    console.error("❌ Student by email fetch error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/email/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const student = await Student.findOne({ email }).populate("enrolledCourses");
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.status(200).json(student);
  } catch (err) {
    console.error("❌ Student /email/:email fetch error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------- Enroll in Course -------------------
router.post("/enroll", authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ message: "Course ID is required" });

    const student = await Student.findById(req.studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (student.enrolledCourses.includes(courseId))
      return res.status(400).json({ message: "Already enrolled in this course" });

    student.enrolledCourses.push(courseId);
    await student.save();

    res.status(200).json({ success: true, student, course: courseId });
  } catch (err) {
    console.error("❌ Enroll error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------- Add Skill -------------------
router.post("/skills/add", authMiddleware, async (req, res) => {
  try {
    const { name, level } = req.body;
    if (!name) return res.status(400).json({ message: "Skill name is required" });

    const student = await Student.findById(req.studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.skills.push({ name, level });
    await student.save();

    res.status(200).json({ skills: student.skills });
  } catch (err) {
    console.error("❌ Add skill error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------- Remove Skill -------------------
router.delete("/skills/remove/:index", authMiddleware, async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const student = await Student.findById(req.studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (index < 0 || index >= student.skills.length)
      return res.status(400).json({ message: "Invalid skill index" });

    student.skills.splice(index, 1);
    await student.save();

    res.status(200).json({ skills: student.skills });
  } catch (err) {
    console.error("❌ Remove skill error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------- Schedule Paid Mock Interview -------------------
router.post("/mock-interview/schedule", authMiddleware, async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) return res.status(400).json({ message: "Interview date is required" });

    const student = await Student.findById(req.studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Only allow scheduling if payment is done
    if (!student.paymentDone) {
      return res.status(400).json({ message: "Payment not completed for mock interview" });
    }

    student.mockInterviewScheduled = true;
    student.mockInterviewDate = new Date(date);

    await student.save();

    res.status(200).json({
      message: "Mock interview scheduled successfully",
      mockInterviewScheduled: student.mockInterviewScheduled,
      mockInterviewDate: student.mockInterviewDate,
    });
  } catch (err) {
    console.error("❌ Mock interview scheduling error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/verify-payment-success", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.user.id,
      { isVerified: true },
      { new: true }
    );
    res.json({ success: true, student });
  } catch (err) {
    console.error("Verify payment update error:", err);
    res.status(500).json({ message: "Failed to update verification status" });
  }
});


module.exports = router;
