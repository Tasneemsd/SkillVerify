const Student = require("../models/Student");
const Recruiter = require("../models/Recruiter");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser =
      (await Student.findOne({ email })) ||
      (await Recruiter.findOne({ email })) ||
      (await Admin.findOne({ email }));
    if (existingUser)
      return res.status(409).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    if (role === "student") user = new Student({ name, email, password: hashedPassword });
    else if (role === "recruiter") user = new Recruiter({ name, email, password: hashedPassword });
    else if (role === "admin") user = new Admin({ name, email, password: hashedPassword });
    else return res.status(400).json({ message: "Invalid role" });

    await user.save();
    return res.status(201).json({ message: `${role} registered successfully`, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email & password required" });

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

    let userObj = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role,
    };

    if (role === "recruiter") {
      userObj = {
        ...userObj,
        companyName: user.companyName || "",
        phone: user.phone || "",
      };
    }

    return res.status(200).json({ message: "Login successful", token, user: userObj });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
