const Student = require("../models/Student");
const Recruiter = require("../models/Recruiter");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// temporary in-memory verified emails (shared with emailOtp.js)
const verifiedEmails = new Set();
module.exports.verifiedEmails = verifiedEmails;

// ===== REGISTER =====
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, code, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if email was verified
    if (!verifiedEmails.has(email)) {
      return res
        .status(400)
        .json({ message: "Please verify your email before registering" });
    }

    // ===== CHECK EMAIL DUPLICATE =====
    const existingUser =
      (await Student.findOne({ email })) ||
      (await Recruiter.findOne({ email })) ||
      (await Admin.findOne({ email }));

    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // ===== HASH PASSWORD =====
    const hashedPassword = await bcrypt.hash(password, 10);

    // ===== CREATE USER BASED ON ROLE =====
    let user;
    if (role === "student") {
      user = new Student({ name, email, phone, password: hashedPassword, skills: [] });
    } else if (role === "recruiter") {
      user = new Recruiter({ name, email, phone, password: hashedPassword });
    } else if (role === "admin") {
      user = new Admin({ name, email, phone, password: hashedPassword });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    await user.save();

    // remove email from verified set after registration
    verifiedEmails.delete(email);

    return res.status(201).json({
      message: `${role} registered successfully`,
      user: { _id: user._id, name, email, phone, role },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    if (err.code === 11000) {
      return res.status(409).json({ message: "Duplicate email detected" });
    }
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
