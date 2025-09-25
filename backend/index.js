const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load env vars explicitly from .env
dotenv.config({ path: "./.env" });

// Debug log to confirm env is loaded
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing. Check your .env file placement and syntax.");
  process.exit(1);
} else {
  console.log("✅ Loaded MONGO_URI from .env");
}

// Connect to MongoDB
connectDB();

// Seed dummy courses
const seedCourses = require("./seed/seedCourses");
seedCourses();

const app = express();

// CORS setup
app.use(
  cors({
    origin: ["https://skill-verify.vercel.app"], // your frontend domain
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/register-course", require("./routes/registerCourse"));
app.use("/api/student", require("./routes/student")); // general student routes
app.use("/api/student/profile", require("./routes/studentProfile")); // fetch one/all students
app.use("/api/student/register-course", require("./routes/registerCourse")); // enroll
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/recruiter", require("./routes/recruiter"));
/* app.use("/api/recruiters", require("./routes/recruiterRoutes")); */
app.use("/api/admin", require("./routes/admin"));
app.use("/api/notification", require("./routes/notification"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
