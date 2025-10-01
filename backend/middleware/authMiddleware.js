const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Admin = require("../models/Admin");
const Recruiter = require("../models/Recruiter");

/**
 * General auth middleware to verify JWT token.
 * Attaches `req.user` with decoded info.
 * Blocks access if token missing/invalid.
 */
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
    req.user = decoded; // { id, email, role }

    // Optional: Fetch full user from DB based on role
    if (decoded.role === "student") {
      req.userDetails = await Student.findById(decoded.id);
    } else if (decoded.role === "admin") {
      req.userDetails = await Admin.findById(decoded.id);
    } else if (decoded.role === "recruiter") {
      req.userDetails = await Recruiter.findById(decoded.id);
    }

    if (!req.userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/**
 * Role-based middleware.
 * Usage: roleMiddleware("student") or roleMiddleware("admin", "recruiter")
 */
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied for your role" });
    }
    next();
  };
};

module.exports = {
  authMiddleware
};
