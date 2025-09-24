const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config({ path: "./.env" });

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing. Check your .env file.");
  process.exit(1);
} else {
  console.log("✅ Loaded MONGO_URI from .env");
}

// Connect to MongoDB
connectDB();

// Seed dummy courses (optional)
const seedCourses = require("./seed/seedCourses");
seedCourses();

const app = express();

// ✅ CORS setup for dev + prod
app.use(
  cors({
    origin: [
      "http://localhost:5173",         // local dev frontend
      "https://skill-verify.vercel.app", // deployed frontend
      "https://skillverify.onrender.com" // if needed
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Allow preflight requests globally
app.options("*", cors());

// Parse JSON bodies
app.use(express.json({ limit: "10mb" }));

// --- ROUTES ---
// Authentication
app.use("/api", require("./routes/auth"));

// Courses
app.use("/api/courses", require("./routes/courses"));
app.use("/api/register-course", require("./routes/registerCourse"));

// Student routes
app.use("/api/student", require("./routes/student")); // general student routes, including /register
app.use("/api/student/profile", require("./routes/studentProfile")); 
app.use("/api/student/register-course", require("./routes/registerCourse")); // course enroll

// Jobs & applications
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/applications", require("./routes/applications"));

// Recruiter & admin
app.use("/api/recruiter", require("./routes/recruiter"));
app.use("/api/admin", require("./routes/admin"));

// Notifications
app.use("/api/notification", require("./routes/notification"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
