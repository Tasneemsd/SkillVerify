
const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();
// POST /api/admin/create-course
router.post('/create-course', adminController.createCourse);

// GET /api/admin/courses-with-registrations
router.get('/courses-with-registrations', adminController.getCoursesWithRegistrations);

// GET /api/admin/registrations/:courseId
router.get('/registrations/:courseId', adminController.getRegistrationsForCourse);

// GET /api/admin/students-with-skills
router.get('/students-with-skills', adminController.getAllStudentsWithSkills);

// POST /api/admin/verify-skill
router.post('/verify-skill', adminController.verifyStudentSkill);

// GET /api/admin/jobs
router.get('/jobs', adminController.getAllJobs);

module.exports = router;
