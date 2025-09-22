const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');
const Admin = require('../models/Admin');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ================= REGISTER =================
exports.register = async (req, res) => {
  const { name, email, password, role, rollNo, contactNumber, socialLinks, codingLinks, profilePicture } = req.body;
  try {
    // Check if name or email exists in any collection
    const studentExists = await Student.findOne({ $or: [{ email }, { name }] });
    const recruiterExists = await Recruiter.findOne({ $or: [{ email }, { name }] });
    const adminExists = await Admin.findOne({ $or: [{ email }, { name }] });

    if (studentExists || recruiterExists || adminExists) {
      return res.status(409).json({ message: 'Name or email already exists as student, recruiter, or admin' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'student') {
      const student = new Student({
        name,
        email,
        password: hashedPassword,
        rollNo,
        contactNumber,
        socialLinks,
        codingLinks,
        profilePicture,
        skills: []
      });
      await student.save();

      return res.status(201).json({ message: 'Student registered successfully', student });
    } 
    else if (role === 'recruiter') {
      const recruiter = new Recruiter({ name, email, password: hashedPassword });
      await recruiter.save();
      return res.status(201).json({ message: 'Recruiter registered successfully' });
    } 
    else if (role === 'admin') {
      const admin = new Admin({ name, email, password: hashedPassword });
      await admin.save();
      return res.status(201).json({ message: 'Admin registered successfully' });
    } 
    else {
      return res.status(400).json({ message: 'Invalid role' });
    }
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ================= LOGIN =================
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
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '2h' }
    );

    let userObj = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role
    };

    if (role === "student") {
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
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
