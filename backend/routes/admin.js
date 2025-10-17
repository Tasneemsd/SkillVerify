const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// COURSE ROUTES
router.post('/create-course', adminController.createCourse);
router.get('/courses-with-registrations', adminController.getCoursesWithRegistrations);
router.get('/registrations/:courseId', adminController.getRegistrationsForCourse);

// JOB ROUTES
router.get('/jobs', adminController.getAllJobs);

// STUDENT ROUTES
router.get('/students', adminController.getAllStudents);
router.get('/students-with-skills', adminController.getAllStudentsWithSkills);
router.post('/verify-skill', adminController.verifyStudentSkill);

// MOCK INTERVIEWS & BADGES
router.post('/schedule-mock', adminController.scheduleMockInterview);
router.post('/verify-student-badge', adminController.verifyStudentAndAwardBadge);
router.get('/mock-interviews', adminController.getAllMockInterviews);

// VERIFIED STUDENTS
router.get('/verified-students', adminController.getVerifiedStudents);

// RECRUITER ROUTES
router.get('/recruiters', adminController.getAllRecruiters);
router.post('/toggle-recruiter', adminController.toggleRecruiterApproval);

// DASHBOARD & REPORTS
router.get('/reports', adminController.generateReports);

// APPLICATIONS
router.get('/job-applications/:jobId', adminController.getApplicationsForJob);

module.exports = router;
router.get("/applications", getApplications);