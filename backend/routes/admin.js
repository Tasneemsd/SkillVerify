const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

// Existing routes...
router.post('/create-course', adminController.createCourse);
router.get('/courses-with-registrations', adminController.getCoursesWithRegistrations);
router.get('/registrations/:courseId', adminController.getRegistrationsForCourse);
router.get('/students-with-skills', adminController.getAllStudentsWithSkills);
router.post('/verify-skill', adminController.verifyStudentSkill);
router.get('/jobs', adminController.getAllJobs);
router.post('/schedule-mock', adminController.scheduleMockInterview);

router.post('/verify-student', adminController.verifyStudent);
router.get('/verified-students', adminController.getVerifiedStudents);

router.get('/recruiters', adminController.getAllRecruiters);
router.post('/approve-recruiter', adminController.approveRecruiter);

router.get('/candidates', adminController.getCandidates);

// --- NEW ROUTES FOR FRONTEND ---
router.get('/users', adminController.getAllUsers); // returns all users
router.get('/mock-interviews', adminController.getAllMockInterviews); // returns all mock interviews
router.get('/applications', adminController.getAllApplications); // returns all job applications


router.post('/update-interview', adminController.updateInterviewStatus); // update interview status
router.post('/update-application', adminController.updateApplicationStatus); // update application status
router.post('/toggle-recruiter', adminController.toggleRecruiterApproval); // approve/reject recruiter

module.exports = router;
