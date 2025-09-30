const express = require("express");
const router = express.Router();
const {
  registerStudent,
  loginStudent,
} = require("../controllers/authController");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// -------------------- Email/Password --------------------
router.post("/register", registerStudent);
router.post("/login", loginStudent);

// -------------------- Google OAuth --------------------
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.redirect(`${process.env.CLIENT_URL}/google-success?token=${token}`);
  }
);

module.exports = router;
