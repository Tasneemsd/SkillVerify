const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, email, role }
      return next();
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
  }
  req.user = null;
  next();
};

module.exports = authMiddleware;
