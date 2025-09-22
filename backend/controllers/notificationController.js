const Notification = require('../models/Notification');
const Student = require('../models/Student');

// Student requests skill verification (book interview)
exports.requestSkillVerification = async (req, res) => {
  try {
    const { studentId } = req.body;
    if (!studentId) return res.status(400).json({ message: 'Student ID required' });
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    // Prevent duplicate pending requests
    const existing = await Notification.findOne({ student: studentId, type: 'skill_verification_request', status: 'pending' });
    if (existing) return res.status(400).json({ message: 'You have already applied for a meeting. Please wait for admin response.' });
    // Create notification for admin, include skills
    const skillsList = Array.isArray(student.skills) && student.skills.length > 0
      ? student.skills.map(s => `${s.name}${s.verified ? ' (verified)' : ''}`).join(', ')
      : 'No skills listed';
    const message = `${student.name} (${student.email}) is requesting skill verification.\nSkills: ${skillsList}`;
    await Notification.create({
      type: 'skill_verification_request',
      student: student._id,
      message,
      status: 'pending'
    });
    res.json({ message: 'Request sent to admin' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send request' });
  }
};
// Admin accepts a meeting request (with interview details)
exports.acceptMeetingRequest = async (req, res) => {
  try {
    const { notificationId, interviewDate, interviewTime, meetingLink, adminMessage } = req.body;
    if (!interviewDate || !interviewTime || !meetingLink) {
      return res.status(400).json({ message: 'Interview date, time, and meeting link are required.' });
    }
    const notification = await Notification.findById(notificationId);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    if (notification.status !== 'pending') return res.status(400).json({ message: 'Request already processed' });
    notification.status = 'accepted';
    notification.interviewDate = interviewDate;
    notification.interviewTime = interviewTime;
    notification.meetingLink = meetingLink;
    notification.adminMessage = adminMessage || '';
    await notification.save();
    res.json({ message: 'Meeting request accepted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to accept request' });
  }
};

// Admin rejects a meeting request
exports.rejectMeetingRequest = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const notification = await Notification.findById(notificationId);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    if (notification.status !== 'pending') return res.status(400).json({ message: 'Request already processed' });
    notification.status = 'rejected';
    await notification.save();
    res.json({ message: 'Meeting request rejected' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reject request' });
  }
};

// Admin fetches notifications
exports.getNotifications = async (req, res) => {
  try {
    const { studentId } = req.query;
    const filter = studentId ? { student: studentId } : {};
    const notifications = await Notification.find(filter).populate('student', 'name email').sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

// Admin marks notification as read
exports.markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const notification = await Notification.findById(notificationId);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    notification.read = true;
    await notification.save();
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update notification' });
  }
};
