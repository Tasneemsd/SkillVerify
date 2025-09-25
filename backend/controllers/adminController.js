const Course = require('../models/Course');
const Student = require('../models/Student');
const Job = require('../models/Job');

// Get all courses with number of registered students
exports.getCoursesWithRegistrations = async (req, res) => {
  try {
    const courses = await Course.find();
    // For each course, count students registered
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

    // Create notification for the student
    const Notification = require('../models/Notification');
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
