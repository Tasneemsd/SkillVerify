const Course = require('../models/Course');
const Student = require('../models/Student');
const Job = require('../models/Job');
const Application = require("../models/Application");
const Notification = require('../models/Notification');
const Recruiter = require('../models/Recruiter');

// ===============================
// 🏫 COURSE MANAGEMENT
// ===============================

// ➕ Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseId, courseDuration, courseFee, courseDescription } = req.body;
    if (!courseName || !courseId || !courseDuration || courseFee === undefined) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existing = await Course.findOne({ courseId });
    if (existing) return res.status(400).json({ message: 'Course ID already exists.' });

    const newCourse = await Course.create({
      courseName,
      courseId,
      courseDuration,
      courseFee,
      courseDescription,
    });

    res.status(201).json({ message: 'Course created successfully.', course: newCourse });
  } catch (err) {
    res.status(500).json({ message: 'Error creating course.', error: err.message });
  }
};
// Get all jobs (Admin) with applied students info
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('postedBy', 'name email company') // recruiter info
      .populate('appliedBy.student', 'name email rollNo skills profilePicture') // applied students
      .sort({ postedAt: -1 });

    const data = jobs.map(job => ({
      _id: job._id,
      title: job.title,
      description: job.description,
      location: job.location,
      type: job.type,
      salary: job.salary,
      stipend: job.stipend,
      skillsRequired: job.skillsRequired,
      postedBy: job.postedBy
        ? {
          _id: job.postedBy._id,
          name: job.postedBy.name,
          email: job.postedBy.email,
          company: job.postedBy.company,
        }
        : null,
      postedAt: job.postedAt,
      isActive: job.isActive,
      appliedStudents: job.appliedBy.map(a => ({
        studentId: a.student._id,
        name: a.student.name,
        email: a.student.email,
        rollNo: a.student.rollNo,
        skills: a.student.skills,
        profilePicture: a.student.profilePicture,
        status: a.status,
        appliedAt: a.appliedAt,
      })),
    }));

    res.json(data);
  } catch (err) {
    console.error("Get jobs error:", err);
    res.status(500).json({ message: 'Failed to fetch jobs', error: err.message });
  }
};

// Get all applications for a specific job
exports.getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ jobId })
      .populate('studentId', 'name email rollNo contactNumber skills profilePicture')
      .populate('jobId', 'title postedByEmail type')
      .sort({ appliedOn: -1 });

    const data = applications.map(app => ({
      _id: app._id,
      studentId: app.studentId._id,
      studentName: app.studentId.name,
      studentEmail: app.studentId.email,
      studentRollNo: app.studentId.rollNo,
      studentContact: app.studentId.contactNumber,
      studentSkills: app.studentId.skills,
      studentProfilePicture: app.studentId.profilePicture,
      jobId: app.jobId._id,
      jobTitle: app.jobId.title,
      company: app.jobId.postedByEmail,
      jobType: app.jobId.type,
      status: app.status,
      appliedOn: app.appliedOn,
    }));

    res.json(data);
  } catch (err) {
    console.error("Get applications for job error:", err);
    res.status(500).json({ message: 'Failed to fetch applications', error: err.message });
  }
};
exports.getApplications = async (req, res) => {
  try {
    const apps = await Application.find()
      .populate("studentId", "name email rollNo contactNumber skills profilePicture")
      .populate("jobId", "title postedByEmail type");

    const data = apps.map(app => ({
      _id: app._id,
      studentId: app.studentId._id,
      studentName: app.studentId.name,
      studentEmail: app.studentId.email,
      studentRollNo: app.studentId.rollNo,
      studentContact: app.studentId.contactNumber,
      studentSkills: app.studentId.skills,
      studentProfilePicture: app.studentId.profilePicture,
      jobId: app.jobId._id,
      jobTitle: app.jobId.title,
      company: app.jobId.postedByEmail,
      jobType: app.jobId.type,
      status: app.status,
      appliedOn: app.appliedOn,
    }));

    res.json(data);
  } catch (err) {
    console.error("Get all applications error:", err);
    res.status(500).json({ message: "Failed to fetch applications", error: err.message });
  }
};

// 📋 Get all courses with student registration count
exports.getCoursesWithRegistrations = async (req, res) => {
  try {
    const courses = await Course.find();
    const data = await Promise.all(
      courses.map(async (course) => {
        const count = await Student.countDocuments({ registeredCourses: course._id });
        return { ...course.toObject(), registrations: count };
      })
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch course data.', error: err.message });
  }
};

// 👩‍🎓 Get students registered for a specific course
exports.getRegistrationsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const students = await Student.find(
      { registeredCourses: courseId },
      'name email rollNo contactNumber skills profilePicture'
    );
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch students.', error: err.message });
  }
};

// ===============================
// 👨‍🎓 STUDENT MANAGEMENT
// ===============================

// 📋 Get all students (verified + unverified)
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find(
      {},
      'name email rollNo contactNumber branch college skills isVerified mockInterviewScore badge profilePicture mockInterviewDate paymentDone'
    ).sort({ name: 1 }); // Sort alphabetically
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch students.', error: err.message });
  }
};

// Get all students with skills (for listing/filter)
exports.getAllStudentsWithSkills = async (req, res) => {
  try {
    const students = await Student.find({}, 'name email rollNo contactNumber skills profilePicture');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students.', error: err.message });
  }
};

// ✅ Verify student skill manually (by Admin)
exports.verifyStudentSkill = async (req, res) => {
  try {
    const { studentId, skillName } = req.body;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found.' });

    let skillUpdated = false;
    student.skills = student.skills.map((s) => {
      if (s.name === skillName) {
        skillUpdated = true;
        return { ...s.toObject(), verified: true };
      }
      return s;
    });

    if (!skillUpdated) return res.status(400).json({ message: 'Skill not found.' });

    await student.save();

    await Notification.create({
      type: 'skill_verified',
      student: student._id,
      message: `Your skill '${skillName}' has been verified by the admin.`,
    });

    res.json({ message: 'Skill verified successfully.', skills: student.skills });
  } catch (err) {
    res.status(500).json({ message: 'Failed to verify skill.', error: err.message });
  }
};

// ===============================
// 🎯 MOCK INTERVIEW + BADGE MANAGEMENT
// ===============================

// 📅 Schedule mock interview (admin-level for paid mocks)
exports.scheduleMockInterview = async (req, res) => {
  try {
    const { studentId, date } = req.body;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found.' });

    student.mockInterviewScheduled = true;
    student.mockInterviewDate = date;
    student.paymentDone = true; // paid mock confirmation
    await student.save();

    await Notification.create({
      type: 'mock_interview_scheduled',
      student: student._id,
      message: `Your mock interview has been scheduled on ${new Date(date).toLocaleString()}.`,
    });

    res.json({ message: 'Mock interview scheduled successfully.', student });
  } catch (err) {
    res.status(500).json({ message: 'Failed to schedule mock interview.', error: err.message });
  }
};

// 🏆 Verify student based on mock interview result
exports.verifyStudentAndAwardBadge = async (req, res) => {
  try {
    const { studentId, mockInterviewScore } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Update mock interview score and verification info
    student.mockInterviewScore = mockInterviewScore;
    student.isVerified = mockInterviewScore >= 70; // ✅ verified if score ≥ 70
    student.verifiedBy = "Admin";
    student.verificationDate = new Date();

    await student.save();

    // Optionally send a notification (if Notification model exists)
    if (typeof Notification !== "undefined") {
      await Notification.create({
        type: "student_verified",
        student: student._id,
        message: student.isVerified
          ? "🎉 Congratulations! You have been verified based on your mock interview performance."
          : "⚠️ Your performance did not meet the verification criteria.",
      });
    }

    res.json({
      message: student.isVerified
        ? "✅ Student verified successfully."
        : "❌ Student not verified (low score).",
      student,
    });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ message: "Failed to verify student.", error: err.message });
  }
};


// 📃 Get all mock interviews scheduled
exports.getAllMockInterviews = async (req, res) => {
  try {
    const interviews = await Student.find(
      { mockInterviewScheduled: true },
      'name email mockInterviewDate mockInterviewScore isVerified badge'
    );
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch mock interviews.', error: err.message });
  }
};

// ===============================
// 👩‍💼 VERIFIED STUDENTS → RECRUITER PORTAL
// ===============================

// Get all verified students (visible to recruiters)
exports.getVerifiedStudents = async (req, res) => {
  try {
    const verified = await Student.find(
      { isVerified: true },
      'name email branch college skills mockInterviewScore badge profilePicture'
    );
    res.json(verified);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching verified students.', error: err.message });
  }
};

// ===============================
// 🧑‍💼 RECRUITER MANAGEMENT
// ===============================

exports.getAllRecruiters = async (req, res) => {
  try {
    const recruiters = await Recruiter.find({}, 'name email company isApproved');
    res.json(recruiters);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recruiters.', error: err.message });
  }
};

exports.toggleRecruiterApproval = async (req, res) => {
  try {
    const { recruiterId, approve } = req.body;
    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) return res.status(404).json({ message: 'Recruiter not found.' });

    recruiter.isApproved = approve;
    await recruiter.save();

    res.json({
      message: `Recruiter ${approve ? 'approved' : 'rejected'} successfully.`,
      recruiter,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update recruiter status.', error: err.message });
  }
};

// ===============================
// 📊 DASHBOARD REPORTS
// ===============================

exports.generateReports = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const verifiedStudents = await Student.countDocuments({ isVerified: true });
    const totalRecruiters = await Recruiter.countDocuments();
    const totalJobs = await Job.countDocuments();

    res.json({ totalStudents, verifiedStudents, totalRecruiters, totalJobs });
  } catch (err) {
    res.status(500).json({ message: 'Error generating reports.', error: err.message });
  }
};
