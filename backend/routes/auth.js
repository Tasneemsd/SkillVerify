const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const passport = require("./config/passport");


// Register route
router.post('/register', register);

// Login route
router.post('/login', login);


// Google OAuth login
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    res.redirect(`${process.env.CLIENT_URL}/student?token=${token}`);
  }
);

module.exports = router;
