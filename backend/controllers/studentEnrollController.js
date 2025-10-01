const Student = require("../models/Student");
const Course = require("../models/Course");

// ✅ Enroll in a course
exports.enrollCourse = async (req, res) => {
  try {
    const { id, courseId } = req.params;

    const student = await Student.findById(id);
    const course = await Course.findById(courseId);

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    if (student.courses.includes(course._id)) {
      return res.status(400).json({ msg: "Already enrolled in this course" });
    }

    student.courses.push(course._id);
    await student.save();

    res.status(200).json({
      msg: "Enrolled successfully",
      courses: student.courses,
    });
  } catch (err) {
    console.error("❌ Enroll error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Remove enrolled course
exports.removeCourse = async (req, res) => {
  try {
    const { id, courseId } = req.params;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    // Remove course from student's courses
    student.courses = student.courses.filter(
      (c) => c.toString() !== courseId
    );
    await student.save();

    res.status(200).json({
      msg: "Course removed successfully",
      courses: student.courses,
    });
  } catch (err) {
    console.error("❌ Remove error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
