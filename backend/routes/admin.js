const express = require('express');
const adminController = require('../controllers/adminController');
const Application = require("../models/Application");
const Job = require("../models/Job");
const router = express.Router();

// ===============================
// 🏫 COURSE MANAGEMENT
// ===============================
router.post('/create-course', adminController.createCourse);
router.get('/courses-with-registrations', adminController.getCoursesWithRegistrations);
router.get('/registrations/:courseId', adminController.getRegistrationsForCourse);
router.get('/jobs', adminController.getAllJobs);
// ===============================
// 👨‍🎓 STUDENT MANAGEMENT
// ===============================
router.get('/students', adminController.getAllStudents);

router.get('/students-with-skills', adminController.getAllStudentsWithSkills);
router.post('/verify-skill', adminController.verifyStudentSkill);

// ===============================
// 🎯 MOCK INTERVIEW & BADGE
// ===============================
router.post('/schedule-mock', adminController.scheduleMockInterview);
router.post('/verify-student-badge', adminController.verifyStudentAndAwardBadge); // ✅ NEW: verify + badge
router.get('/mock-interviews', adminController.getAllMockInterviews);

// ===============================
// 👩‍💼 VERIFIED STUDENTS (Recruiter View)
// ===============================
router.get('/verified-students', adminController.getVerifiedStudents);

// ===============================
// 🧑‍💼 RECRUITER MANAGEMENT
// ===============================
router.get('/recruiters', adminController.getAllRecruiters);
router.post('/toggle-recruiter', adminController.toggleRecruiterApproval);

// ===============================
// 📊 DASHBOARD & REPORTS
// ===============================
router.get('/reports', adminController.generateReports);
router.get('/applications',adminController.getAllApplications);
router.get('/job-applications/:jobId', adminController.getApplicationsForJob);

// ===============================
// ✅ EXPORT ROUTER
// ===============================
module.exports = router;
