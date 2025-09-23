const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // contains { id, email, role }
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  // No token provided → continue (frontend fallback can use ?email=)
  req.user = null;
  next();
};

module.exports = authMiddleware;
