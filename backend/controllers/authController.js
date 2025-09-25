const Student = require("../models/Student");
const Recruiter = require("../models/Recruiter");
const Admin = require("../models/Admin");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===== REGISTER =====
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // Check existing email in all collections
    const exists = await Student.findOne({ email }) ||
                   await Recruiter.findOne({ email }) ||
                   await Admin.findOne({ email });

    if (exists) return res.status(409).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "student") {
      const student = new Student({ name, email, password: hashedPassword, skills: [] });
      await student.save();
      return res.status(201).json({ message: "Student registered successfully", user: student });
    } 
    else if (role === "recruiter") {
      const recruiter = new Recruiter({ name, email, password: hashedPassword });
      await recruiter.save();
      return res.status(201).json({ message: "Recruiter registered successfully", user: recruiter });
    } 
    else if (role === "admin") {
      const admin = new Admin({ name, email, password: hashedPassword });
      await admin.save();
      return res.status(201).json({ message: "Admin registered successfully", user: admin });
    } 
    else {
      return res.status(400).json({ message: "Invalid role" });
    }
  } catch (err) {
    console.error("REGISTER ERROR:", err.message);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ===== LOGIN =====
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await Student.findOne({ email });
    let role = "student";

    if (!user) {
      user = await Recruiter.findOne({ email });
      role = user ? "recruiter" : null;
    }
    if (!user) {
      user = await Admin.findOne({ email });
      role = user ? "admin" : null;
    }
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "2h" }
    );

    const userObj = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role,
      ...(role === "recruiter" && {
        companyName: user.companyName,
        position: user.position,
        phone: user.phone,
        bio: user.bio
      })
    };

    return res.status(200).json({ message: "Login successful", token, user: userObj });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    return res.status(500).json({ message: "Server error block ", error: err.message });
  }
};
