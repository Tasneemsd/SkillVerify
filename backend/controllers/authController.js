const Student = require("../models/Student");
const Recruiter = require("../models/Recruiter");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const verifiedEmails = new Set();
module.exports.verifiedEmails = verifiedEmails;

// REGISTER
const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "All fields are required" });

    if (!verifiedEmails.has(email))
      return res
        .status(400)
        .json({ message: "Please verify your email before registering" });

    const existingUser =
      (await Student.findOne({ email })) ||
      (await Recruiter.findOne({ email })) ||
      (await Admin.findOne({ email }));

    if (existingUser)
      return res.status(409).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    if (role === "student")
      user = new Student({ name, email, phone, password: hashedPassword, skills: [] });
    else if (role === "recruiter")
      user = new Recruiter({ name, email, phone, password: hashedPassword });
    else if (role === "admin")
      user = new Admin({ name, email, phone, password: hashedPassword });
    else return res.status(400).json({ message: "Invalid role" });

    await user.save();
    verifiedEmails.delete(email);

    return res.status(201).json({
      message: `${role} registered successfully`,
      user: { _id: user._id, name, email, phone, role },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ LOGIN (fixed)
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role)
      return res.status(400).json({ success: false, message: "All fields are required" });

    let user;
    if (role === "student") user = await Student.findOne({ email });
    else if (role === "recruiter") user = await Recruiter.findOne({ email });
    else if (role === "admin") user = await Admin.findOne({ email });
    else return res.status(400).json({ success: false, message: "Invalid role" });

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true, // ✅ added
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = { register, login, verifiedEmails };
