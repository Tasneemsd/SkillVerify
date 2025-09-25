const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Courses
router.get('/courses-with-registrations', adminController.getCoursesWithRegistrations);
router.post('/create-course', adminController.createCourse);

// Students
router.get('/students-with-skills', adminController.getAllStudentsWithSkills);
router.post('/verify-skill', adminController.verifyStudentSkill);

// Jobs
router.get('/jobs', adminController.getAllJobs);

// Optional: Get admin details
router.get('/by-email', adminController.getAdminByEmail);

module.exports = router;
