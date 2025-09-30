const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// -------------------- Email/Password --------------------
router.post("/register", register);
router.post("/login", login);

// -------------------- Google OAuth --------------------
// Step 1: redirect user to Google login
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Google callback -> issue JWT + redirect to frontend
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Redirect to React app -> /google-success?token=xxxx
    res.redirect(`${process.env.CLIENT_URL}/google-success?token=${token}`);
  }
);

module.exports = router;
