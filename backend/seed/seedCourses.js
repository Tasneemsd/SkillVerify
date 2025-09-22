const Course = require("../models/Course");

async function seedCourses() {
  const count = await Course.countDocuments();
  if (count > 0) return; // Prevent duplicate seeding
  const courses = [
    { courseName: "Introduction to Programming", courseId: "CSE101", courseDuration: "3 months" },
    { courseName: "Data Structures", courseId: "CSE102", courseDuration: "4 months" },
    { courseName: "Algorithms", courseId: "CSE103", courseDuration: "4 months" },
    { courseName: "Database Systems", courseId: "CSE104", courseDuration: "3 months" },
    { courseName: "Operating Systems", courseId: "CSE105", courseDuration: "4 months" },
    { courseName: "Computer Networks", courseId: "CSE106", courseDuration: "3 months" },
    { courseName: "Web Development", courseId: "CSE107", courseDuration: "2 months" },
    { courseName: "Machine Learning", courseId: "CSE108", courseDuration: "5 months" },
    { courseName: "Artificial Intelligence", courseId: "CSE109", courseDuration: "5 months" },
    { courseName: "Cloud Computing", courseId: "CSE110", courseDuration: "3 months" },
  ];
  await Course.insertMany(courses);
  console.log("Dummy courses seeded");
}

module.exports = seedCourses;
