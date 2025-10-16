const Course = require('../models/Course');
const Student = require('../models/Student');
const Job = require('../models/Job');
const Notification = require('../models/Notification');
const Application = require('../models/Application');

// =======================================
// Existing Working Code (Untouched)
// =======================================

exports.updateInterviewStatus = async (req, res) => {
  try {
    const { studentId, status } = req.body;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.mockInterviewStatus = status;
    await student.save();

    res.json({ message: 'Interview status updated', student });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update interview status' });
  }
};

// Get all courses with number of registered students
exports.getCoursesWithRegistrations = async (req, res) => {
  try {
    const courses = await Course.find();
    const courseData = await Promise.all(courses.map(async (course) => {
      const count = await Student.countDocuments({ registeredCourses: course._id });
      return {
        _id: course._id,
        courseName: course.courseName,
        courseId: course.courseId,
        courseDuration: course.courseDuration,
        courseFee: course.courseFee,
        courseDescription: course.courseDescription,
        registrations: count
      };
    }));
    res.json(courseData);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch courses with registrations' });
  }
};

// Admin creates a new course
exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseId, courseDuration, courseFee, courseDescription } = req.body;
    if (!courseName || !courseId || !courseDuration || courseFee === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const exists = await Course.findOne({ courseId });
    if (exists) return res.status(400).json({ message: 'Course ID already exists' });
    const course = new Course({ courseName, courseId, courseDuration, courseFee, courseDescription });
    await course.save();
    res.json({ message: 'Course created', course });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create course' });
  }
};

// Get students registered for a specific course
exports.getRegistrationsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const students = await Student.find({ registeredCourses: courseId }, 'name email rollNo contactNumber skills profilePicture');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch registrations' });
  }
};

// Get all students with their skills
exports.getAllStudentsWithSkills = async (req, res) => {
  try {
    const students = await Student.find({}, 'name email rollNo contactNumber skills profilePicture');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch students' });
  }
};

// Verify a student's skill
exports.verifyStudentSkill = async (req, res) => {
  try {
    const { studentId, skillName } = req.body;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    let updated = false;
    student.skills = student.skills.map(skill => {
      if (skill.name === skillName) {
        updated = true;
        return { ...skill.toObject(), verified: true };
      }
      return skill;
    });

    if (!updated) return res.status(400).json({ message: 'Skill not found' });
    await student.save();

    await Notification.create({
      type: 'skill_verified',
      student: student._id,
      message: `Your skill '${skillName}' has been verified by admin.`,
      status: 'accepted',
      skillName
    });

    res.json({ message: 'Skill verified', skills: student.skills });
  } catch (err) {
    res.status(500).json({ message: 'Failed to verify skill' });
  }
};

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name email');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { jobId, studentId, status } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const application = job.appliedBy.find(app => {
      const studentIdInApp = app.student?._id?.toString() || app.student?.toString() || app.toString();
      return studentIdInApp === studentId;
    });

    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = status;
    await job.save();

    res.json({ message: 'Application status updated successfully', job });
  } catch (err) {
    console.error('Error in updateApplicationStatus:', err);
    res.status(500).json({ message: 'Failed to update application status', error: err.message });
  }
};

// =======================================
// ✅ New Logic: Mock Interview & Verification
// =======================================

// Admin schedules mock interview for a student
exports.scheduleMockInterview = async (req, res) => {
  try {
    const { studentId, date } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.mockInterviewScheduled = true;
    student.mockInterviewDate = date;
    student.paymentDone = true; // assuming payment is verified by admin
    await student.save();

    await Notification.create({
      type: 'mock_interview_scheduled',
      student: student._id,
      message: `Your mock interview has been scheduled on ${new Date(date).toLocaleString()}.`
    });

    res.json({ message: 'Mock interview scheduled successfully', student });
  } catch (err) {
    res.status(500).json({ message: 'Failed to schedule mock interview' });
  }
};

// Admin verifies a student after mock interview
exports.verifyStudent = async (req, res) => {
  try {
    const { studentId, mockInterviewScore } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.mockInterviewScore = mockInterviewScore;
    student.isVerified = mockInterviewScore >= 70; // verification condition
    await student.save();

    await Notification.create({
      type: 'student_verified',
      student: student._id,
      message: student.isVerified
        ? 'Congratulations! You have been verified based on your mock interview performance.'
        : 'Unfortunately, your mock interview did not meet the verification criteria.'
    });

    res.json({
      message: student.isVerified
        ? 'Student verified successfully.'
        : 'Student not verified (low score).',
      verified: student.isVerified,
      student
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to verify student' });
  }
};

// Get all verified students (for recruiters)
exports.getVerifiedStudents = async (req, res) => {
  try {
    const students = await Student.find({ isVerified: true }, 'name email branch college skills mockInterviewScore');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch verified students' });
  }
};
// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Student.find({}, 'name email rollNo contactNumber skills isVerified mockInterviewScore');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Get all mock interviews (students with mock interviews scheduled)
exports.getAllMockInterviews = async (req, res) => {
  try {
    const students = await Student.find({ mockInterviewScheduled: true }, 'name email mockInterviewDate mockInterviewScore');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch mock interviews' });
  }
};




// Update application status for a job
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { jobId, studentId, status } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    const application = job.appliedBy.find(app => app.student.toString() === studentId);      
    if (!application) return res.status(404).json({ message: 'Application not found' });
    application.status = status;
    await job.save();
    res.json({ message: 'Application status updated', job });
  } catch (err) {   
    res.status(500).json({ message: 'Failed to update application status' });
  }
} ;

// Approve or reject a recruiter    
exports.toggleRecruiterApproval = async (req, res) => {
  try {
    const { recruiterId, approve } = req.body;
    const Recruiter = require('../models/Recruiter');   

    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) return res.status(404).json({ message: 'Recruiter not found' });
    recruiter.isApproved = approve;
    await recruiter.save();
    res.json({ message: `Recruiter ${approve ? 'approved' : 'rejected'}`, recruiter });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update recruiter status' });
  }   
};  

exports.getAllApplications = async (req, res) => {
  try {
    // Try to populate either direct refs or nested
    const jobs = await Job.find()
      .populate({
        path: "appliedBy",
        populate: { path: "student", select: "name email" },
      })
      .populate("postedBy", "name email");

    const applications = [];

    jobs.forEach(job => {
      if (Array.isArray(job.appliedBy)) {
        job.appliedBy.forEach(app => {
          // Handle both schema styles
          const student = app.student || app;
          applications.push({
            jobTitle: job.title || "Untitled",
            jobId: job._id,
            studentName: student?.name || "Unknown",
            studentEmail: student?.email || "Unknown",
            status: app.status || "pending",
          });
        });
      }
    });

    res.json(applications);
  } catch (err) {
    console.error("Error in getAllApplications:", err);
    res.status(500).json({ message: "Failed to fetch applications", error: err.message });
  }
};
