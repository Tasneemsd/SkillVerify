const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const recruiterRoutes = require('./routes/recruiterRoutes');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

// Seed dummy courses
const seedCourses = require('./seed/seedCourses');
seedCourses();



const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
const cors = require("cors");

app.use(cors({
  origin: ["https://skill-verify.vercel.app/"], // your frontend domain
  credentials: true
}));


// Routes
app.use('/api', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/register-course', require('./routes/registerCourse'));
app.use('/api/student', require('./routes/student'));          // profile update
app.use('/api/student', require('./routes/studentProfile'));   // fetch one/all students
app.use("/api/student", require("./routes/registerCourse"));   // enroll in course
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/recruiter', require('./routes/recruiter'));
app.use('/api/admin', require('./routes/admin'));

app.use("/api/recruiter", recruiterRoutes);
app.use('/api/notification', require('./routes/notification'));
app.use("/api/notification", require("./routes/notification"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
