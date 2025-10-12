const Student = require("../models/Student");
const Recruiter = require("../models/Recruiter");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID1;

const client = twilio(accountSid, authToken);

// ===== REGISTER =====
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, code, role } = req.body;

    if (!name || !email || !phone || !password || !code || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ===== REAL OTP CHECK =====
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({
        to: phone.startsWith("+") ? phone : `+91${phone}`,
        code,
      });

    if (verificationCheck.status !== "approved") {
      return res.status(400).json({ message: "Invalid OTP" });
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

    // ===== CREATE USER =====
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

// ===== LOGIN =====
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    let user = await Student.findOne({ email });
    let role = "student";

    if (!user) {
      user = await Recruiter.findOne({ email });
      if (user) role = "recruiter";
    }
    if (!user) {
      user = await Admin.findOne({ email });
      if (user) role = "admin";
    }
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.password)
      return res.status(500).json({ message: "Password not set for this user" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "2h" }
    );

    let userObj = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role,
    };

    if (role === "recruiter") {
      userObj = {
        ...userObj,
        companyName: user.companyName || "",
        position: user.position || "",
        bio: user.bio || "",
      };
    }

    return res.status(200).json({ message: "Login successful", token, user: userObj });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
