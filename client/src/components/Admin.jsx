import React, { useState, useEffect } from "react";
import axios from "axios";
import {
Briefcase, Users, UserCheck, UserX, FileText, MessageSquare, CheckCircle, XCircle, LogOut, Settings,
ChevronDown, Menu, X, TrendingUp
} from "lucide-react";


const BASE_URL = "https://skillverify.onrender.com/api";


const Admin = () => {
const [users, setUsers] = useState([]);
const [jobs, setJobs] = useState([]);
const [courses, setCourses] = useState([]);
const [admin, setAdmin] = useState(null);
const [settings, setSettings] = useState({ platformName: "" });
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [activeTab, setActiveTab] = useState("dashboard");
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const [dropdownOpen, setDropdownOpen] = useState(false);
const [newCourse, setNewCourse] = useState({ courseName: "", courseId: "", courseDuration: "", courseFee: 0, courseDescription: "", rating: 4.5, highestSalary: "", placementPartners: "" });
const [showModal, setShowModal] = useState(false);
const [selectedStudent, setSelectedStudent] = useState(null);


// --- Auth helpers ---
const getAuthToken = () => {
try { const user = JSON.parse(localStorage.getItem("user") || "{}"); return user.token || null; } catch { return null; }
};
const getAuthHeaders = () => { const token = getAuthToken(); return token ? { Authorization: `Bearer ${token}` } : {}; };


// --- Fetch data ---
const fetchAdmin = async () => {
try {
const user = JSON.parse(localStorage.getItem("user") || "{}");
if (!user.email) return;
setAdmin({ _id: user._id || "unknown", name: user.name || "Admin", email: user.email });
setSettings({ platformName: user.platformName || "SkillVerify" });
} catch { setAdmin({ _id: "default", name: "Admin", email: "admin@example.com" }); }
};


const fetchUsers = async () => { try { const res = await axios.get(`${BASE_URL}/admin/users`, { headers: getAuthHeaders() }); setUsers(res.data || []); } catch (err) { console.error(err); setUsers([]); } };
const fetchJobs = async () => { try { const res = await axios.get(`${BASE_URL}/admin/jobs`, { headers: getAuthHeaders() }); setJobs(res.data || []); } catch (err) { console.error(err); setJobs([]); } };
const fetchCourses = async () => { try { const res = await axios.get(`${BASE_URL}/courses`, { headers: getAuthHeaders() }); setCourses(res.data || []); } catch (err) { console.error(err); setCourses([]); } };


useEffect(() => {
const loadData = async () => { setLoading(true); await fetchAdmin(); await Promise.all([fetchUsers(), fetchJobs(), fetchCourses()]); setLoading(false); };
loadData();
}, []);


// --- Actions ---
const handleVerifyStudent = (student) => { setSelectedStudent(student); setShowModal(true); };
const confirmVerification = async () => {
try {
await axios.post(`${BASE_URL}/admin/verify-student`, { studentId: selectedStudent._id }, { headers: getAuthHeaders() });
setUsers(prev => prev.map(u => u._id === selectedStudent._id ? { ...u, verified: true } : u));
setShowModal(false); alert("Student verified!");
} catch (err) { console.error(err); alert("Failed to verify student."); }
};


const toggleRecruiterApproval = async (recruiterId) => {
try {
const recruiter = users.find(u => u._id === recruiterId);
const newStatus = recruiter.status === 'Approved' ? 'Pending' : 'Approved';
await axios.post(`${BASE_URL}/admin/toggle-recruiter`, { recruiterId, status: newStatus }, { headers: getAuthHeaders() });
setUsers(prev => prev.map(u => u._id === recruiterId ? { ...u, status: newStatus } : u));
} catch (err) { console.error(err); alert("Failed to update recruiter status."); }
};


const recruiters = users.filter(u => u.role === 'recruiter');
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50 backdrop-blur-lg bg - white /90 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Briefcase className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                PlacementHub
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <span className="font-medium text-gray-700">Admin</span>
                  <ChevronDown size={20} className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-gray-700">
                      <Settings size={18} />
                      <span>Settings</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-red-600">
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-3 space-y-2">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-gray-700 rounded-lg">
                <Settings size={18} />
                <span>Settings</span>
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-red-600 rounded-lg">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Welcome back, Admin 👋</h1>
              <p className="text-xl text-blue-100">Manage placements, students, and mock interviews efficiently.</p>
            </div>
            <div className="hidden md:block">
              <div className="w-64 h-64 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center">
                <TrendingUp size={120} className="text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-600 border-transparent hover:text-blue-600 hover:border-gray-300'
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <StatCard
                    title="Total Students"
                    value={dashboardData.totalStudents}
                    icon={Users}
                    gradient="from-blue-500 to-blue-600"
                  />
                  <StatCard
                    title="Verified Students"
                    value={dashboardData.verifiedStudents}
                    icon={UserCheck}
                    gradient="from-green-500 to-green-600"
                  />
                  <StatCard
                    title="Pending Verifications"
                    value={dashboardData.pendingVerifications}
                    icon={UserX}
                    gradient="from-orange-500 to-orange-600"
                  />
                  <StatCard
                    title="Total Recruiters"
                    value={dashboardData.totalRecruiters}
                    icon={Briefcase}
                    gradient="from-purple-500 to-purple-600"
                  />
                  <StatCard
                    title="Applications"
                    value={dashboardData.applications}
                    icon={FileText}
                    gradient="from-pink-500 to-pink-600"
                  />
                  <StatCard
                    title="Completed Interviews"
                    value={dashboardData.completedInterviews}
                    icon={MessageSquare}
                    gradient="from-teal-500 to-teal-600"
                  />
                </div>

                {/* Chart Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Student Verifications Over Time</h3>
                  <div className="h-64 flex items-end justify-around space-x-2">
                    {[65, 78, 85, 92, 88, 98].map((height, idx) => (
                      <div key={idx} className="flex flex-col items-center flex-1">
                        <div
                          className="w-full bg-gradient-to-t from-blue-600 to-indigo-600 rounded-t-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700"
                          style={{ height: `${height}%` }}
                        ></div>
                        <span className="text-xs text-gray-600 mt-2">Week {idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Manage Students</h2>
                  <p className="text-gray-600 mt-1">Verify students who passed mock interviews</p>
                </div>
                {students.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Users size={64} className="text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No students found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Mock Result</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {students.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{student.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                student.mockResult === 'Pass'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {student.mockResult === 'Pass' ? <CheckCircle size={14} className="mr-1" /> : <XCircle size={14} className="mr-1" />}
                                {student.mockResult}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                student.verified
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {student.verified ? 'Verified' : 'Pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {student.mockResult === 'Pass' && !student.verified && (
                                <button
                                  onClick={() => handleVerifyStudent(student)}
                                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                  <CheckCircle size={16} className="mr-2" />
                                  Verify
                                </button>
                              )}
                              {student.verified && (
                                <span className="text-green-600 font-medium flex items-center">
                                  <CheckCircle size={16} className="mr-2" />
                                  Verified
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Mock Interviews Tab */}
            {activeTab === 'interviews' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Manage Mock Interviews</h2>
                  <p className="text-gray-600 mt-1">Update interview results and track student performance</p>
                </div>
                {mockInterviews.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <MessageSquare size={64} className="text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No mock interviews found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Student Name</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {mockInterviews.map((interview) => (
                          <tr key={interview.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{interview.studentName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{interview.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                interview.status === 'Pass'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {interview.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={interview.status}
                                onChange={(e) => updateInterviewStatus(interview.id, e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              >
                                <option value="Pass">Pass</option>
                                <option value="Fail">Fail</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Recruiters Tab */}
            {activeTab === 'recruiters' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Manage Recruiters</h2>
                  <p className="text-gray-600 mt-1">Approve recruiter accounts and manage access</p>
                </div>
                {recruiters.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Briefcase size={64} className="text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No recruiters found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Company</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {recruiters.map((recruiter) => (
                          <tr key={recruiter.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{recruiter.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{recruiter.company}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                recruiter.status === 'Approved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {recruiter.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => toggleRecruiterApproval(recruiter.id)}
                                className={`inline-flex items-center px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                                  recruiter.status === 'Approved'
                                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                                }`}
                              >
                                {recruiter.status === 'Approved' ? 'Revoke' : 'Approve'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Job Applications</h2>
                  <p className="text-gray-600 mt-1">View all student applications and their status</p>
                </div>
                {applications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <FileText size={64} className="text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No applications found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Student Name</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Recruiter</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Job Title</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {applications.map((application) => (
                          <tr key={application.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{application.studentName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{application.recruiterName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{application.jobTitle}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                application.status === 'Accepted'
                                  ? 'bg-green-100 text-green-800'
                                  : application.status === 'Under Review'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {application.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Settings</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue="Admin User"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        defaultValue="admin@placementhub.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium">
                        Save Changes
                      </button>
                      <button className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium flex items-center justify-center">
                        <LogOut size={20} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Verification Modal */}
     {/* Verification Modal */}
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all scale-100">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
          <CheckCircle className="text-blue-600" size={40} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Verify Student</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to verify <span className="font-semibold text-gray-800">{selectedStudent?.name}</span>?
        </p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={confirmVerification}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            Confirm
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="px-6 py-3 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 rounded-xl hover:from-gray-400 hover:to-gray-500 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Admin;
