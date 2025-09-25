// authController.js
const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');
const Admin = require('../models/Admin');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, rollNo, contactNumber, socialLinks, codingLinks, profilePicture } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if name or email exists in any collection
    const exists = await Promise.all([
      Student.findOne({ $or: [{ email: normalizedEmail }, { name }] }),
      Recruiter.findOne({ $or: [{ email: normalizedEmail }, { name }] }),
      Admin.findOne({ $or: [{ email: normalizedEmail }, { name }] })
    ]);

    if (exists.some(user => user)) {
      return res.status(409).json({ message: 'Name or email already exists as student, recruiter, or admin' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'student') {
      const student = new Student({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        rollNo,
        contactNumber,
        socialLinks,
        codingLinks,
        profilePicture,
        skills: []
      });
      await student.save();
      return res.status(201).json({ message: 'Student registered successfully', user: student });

    } else if (role === 'recruiter') {
      const recruiter = new Recruiter({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        companyName: "",
        position: "",
        phone: "",
        bio: ""
      });
      await recruiter.save();
      return res.status(201).json({ message: 'Recruiter registered successfully', user: recruiter });

    } else if (role === 'admin') {
      const admin = new Admin({ name, email: normalizedEmail, password: hashedPassword });
      await admin.save();
      return res.status(201).json({ message: 'Admin registered successfully', user: admin });

    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }
  } catch (err) {
    console.error("Register error:", err);
    if (err.code === 11000) return res.status(409).json({ message: 'Email already exists' });
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const normalizedEmail = email.toLowerCase().trim();

    let user = await Student.findOne({ email: normalizedEmail });
    let role = 'student';

    if (!user) {
      user = await Recruiter.findOne({ email: normalizedEmail });
      role = user ? 'recruiter' : null;
    }
    if (!user) {
      user = await Admin.findOne({ email: normalizedEmail });
      role = user ? 'admin' : null;
    }
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '2h' }
    );

    // Build user object for response
    let userObj = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role
    };

    if (role === 'student') {
      await user.populate({ path: "registeredCourses", select: "courseName courseId" });
      userObj = {
        ...userObj,
        rollNo: user.rollNo || "",
        contactNumber: user.contactNumber || "",
        socialLinks: user.socialLinks || {},
        codingLinks: user.codingLinks || {},
        profilePicture: user.profilePicture || "",
        skills: user.skills || [],
        registeredCourses: user.registeredCourses.map(c => ({
          _id: c._id,
          courseName: c.courseName,
          courseId: c.courseId
        }))
      };
    }

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: userObj
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
