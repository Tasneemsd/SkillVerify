const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");

const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./.env" });

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing. Check your .env file.");
  process.exit(1);
} else {
  console.log("✅ MONGO_URI loaded");
}

connectDB();

// Seed dummy courses (optional, safe to remove in production)
const seedCourses = require("./seed/seedCourses");
seedCourses();

const app = express();

// ✅ Allow frontend
app.use(
  cors({
    origin: ["https://skill-verify.vercel.app" ], // frontend domain
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(
  session({ secret: "secretkey", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use("/api", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/register-course", require("./routes/registerCourse"));
app.use("/api/student", require("./routes/student"));
app.use("/api/student/profile", require("./routes/studentProfile"));
app.use("/api/student/register-course", require("./routes/registerCourse"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/recruiter", require("./routes/recruiter"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/notification", require("./routes/notification"));
app.use("/api/otp", require("./routes/otp"));
/* app.use("/api/skills", require("./routes/skills"));
app.use("/api/verify-skill", require("./routes/verifySkill"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/payments", require("./routes/payments"));
app.use("/")
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
