const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./.env" });

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing. Check your .env file.");
  process.exit(1);
} else {
  console.log("✅ MONGO_URI loaded");
}

// Connect to MongoDB
connectDB();

// Seed dummy courses (optional)
const seedCourses = require("./seed/seedCourses");
seedCourses();

const app = express();

// Enable CORS for frontend
app.use(
  cors({
    origin: ["https://skill-verify.vercel.app"], // frontend domain
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/courses", require("./routes/courses"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/student", require("./routes/student"));
app.use("/api/razorpay", require("./routes/razorpayRoutes"));


app.use("/api/student/profile", require("./routes/studentProfile"));
app.use("/api/student/register-course", require("./routes/registerCourse"));
app.use("/api/student/enroll", require("./routes/studentEnroll"));
app.use("/api/recruiter", require("./routes/recruiter"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/notification", require("./routes/notification"));
app.use("/api/email-otp", require("./routes/emailOtp"));
app.use("/api/student/skills", require("./routes/studentSkills"));
app.use("/api/auth", require("./routes/auth"));

// Default error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
