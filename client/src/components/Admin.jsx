import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Briefcase,
  Users,
  UserCheck,
  UserX,
  FileText,
  MessageSquare,
  CheckCircle,
  XCircle,
  LogOut,
  Settings,
  ChevronDown,
  Menu,
  X,
  TrendingUp,
} from "lucide-react";

const BASE_URL = "https://skillverify.onrender.com/api";

// --- Helper Component ---
const StatCard = ({ title, value, icon: Icon, gradient }) => (
  <div className={`bg-gradient-to-r ${gradient} text-white rounded-2xl p-6 shadow-lg`}>
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium opacity-80">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <Icon size={32} className="opacity-80" />
    </div>
  </div>
);

// --- Loading Skeleton ---
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-2xl"></div>
    ))}
  </div>
);

// --- Main Admin Component ---
const Admin = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [mockInterviews, setMockInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [settings, setSettings] = useState({ platformName: "" });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // --- Auth Helpers ---
  const getAuthToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.token || null;
    } catch {
      return null;
    }
  };

  const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // --- Fetch Functions ---
  const fetchAdmin = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.email) return;
      setAdmin({ _id: user._id || "unknown", name: user.name || "Admin", email: user.email });
      setSettings({ platformName: user.platformName || "SkillVerify" });
    } catch {
      setAdmin({ _id: "default", name: "Admin", email: "admin@example.com" });
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/users`, { headers: getAuthHeaders() });
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/jobs`, { headers: getAuthHeaders() });
      setJobs(res.data || []);
    } catch (err) {
      console.error(err);
      setJobs([]);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/courses`, { headers: getAuthHeaders() });
      setCourses(res.data || []);
    } catch (err) {
      console.error(err);
      setCourses([]);
    }
  };

  const fetchMockInterviews = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/mock-interviews`, { headers: getAuthHeaders() });
      setMockInterviews(res.data || []);
    } catch (err) {
      console.error(err);
      setMockInterviews([]);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/applications`, { headers: getAuthHeaders() });
      setApplications(res.data || []);
    } catch (err) {
      console.error(err);
      setApplications([]);
    }
  };

  // --- Load All Data ---
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchAdmin();
      await Promise.all([fetchUsers(), fetchJobs(), fetchCourses(), fetchMockInterviews(), fetchApplications()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // --- Actions ---
  const handleVerifyStudent = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const confirmVerification = async () => {
    try {
      await axios.post(
        `${BASE_URL}/admin/verify-student`,
        { studentId: selectedStudent._id },
        { headers: getAuthHeaders() }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === selectedStudent._id ? { ...u, verified: true } : u))
      );
      setShowModal(false);
      alert("Student verified!");
    } catch (err) {
      console.error(err);
      alert("Failed to verify student.");
    }
  };

  const toggleRecruiterApproval = async (recruiterId) => {
    try {
      const recruiter = users.find((u) => u._id === recruiterId);
      const newStatus = recruiter.status === "Approved" ? "Pending" : "Approved";
      await axios.post(
        `${BASE_URL}/admin/toggle-recruiter`,
        { recruiterId, status: newStatus },
        { headers: getAuthHeaders() }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === recruiterId ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update recruiter status.");
    }
  };

  const updateInterviewStatus = async (interviewId, status) => {
    try {
      await axios.post(
        `${BASE_URL}/admin/update-interview`,
        { interviewId, status },
        { headers: getAuthHeaders() }
      );
      setMockInterviews((prev) =>
        prev.map((i) => (i._id === interviewId ? { ...i, status } : i))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update interview status.");
    }
  };

  const updateApplicationStatus = async (appId, status) => {
    try {
      await axios.post(
        `${BASE_URL}/admin/update-application`,
        { appId, status },
        { headers: getAuthHeaders() }
      );
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status } : a))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update application status.");
    }
  };

  // --- Derived Data ---
  const students = users.filter((u) => u.role === "student");
  const recruiters = users.filter((u) => u.role === "recruiter");

  const dashboardData = {
    totalStudents: students.length,
    verifiedStudents: students.filter((u) => u.verified).length,
    pendingVerifications: students.filter((u) => !u.verified).length,
    totalRecruiters: recruiters.length,
    applications: jobs.length,
    completedInterviews: Math.floor(users.length * 0.7),
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp },
    { id: "students", label: "Students", icon: Users },
    { id: "interviews", label: "Mock Interviews", icon: MessageSquare },
    { id: "recruiters", label: "Recruiters", icon: Briefcase },
    { id: "applications", label: "Applications", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const isLoading = loading;

  // --- Render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* --- Navigation --- */}
      <nav className="bg-white shadow-md sticky top-0 z-50 backdrop-blur-lg border-b border-gray-200">
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

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <span className="font-medium text-gray-700">{admin?.name || "Admin"}</span>
                  <ChevronDown
                    size={20}
                    className={`text-gray-500 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
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
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
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

      {/* --- Hero Section --- */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                Welcome back, {admin?.name || "Admin"} 👋
              </h1>
              <p className="text-xl text-blue-100">{admin?.email}</p>
            </div>
            <div className="hidden md:block">
              <div className="w-64 h-64 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center">
                <TrendingUp size={120} className="text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Tabs Navigation --- */}
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
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-600 border-transparent hover:text-blue-600 hover:border-gray-300"
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

      {/* --- Main Content --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Dashboard */}
            {activeTab === "dashboard" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Students" value={dashboardData.totalStudents} icon={Users} gradient="from-blue-500 to-blue-600" />
                <StatCard title="Verified Students" value={dashboardData.verifiedStudents} icon={UserCheck} gradient="from-green-500 to-green-600" />
                <StatCard title="Pending Verifications" value={dashboardData.pendingVerifications} icon={UserX} gradient="from-orange-500 to-orange-600" />
                <StatCard title="Total Recruiters" value={dashboardData.totalRecruiters} icon={Briefcase} gradient="from-purple-500 to-purple-600" />
                <StatCard title="Applications" value={dashboardData.applications} icon={FileText} gradient="from-pink-500 to-pink-600" />
                <StatCard title="Completed Interviews" value={dashboardData.completedInterviews} icon={MessageSquare} gradient="from-teal-500 to-teal-600" />
              </div>
            )}

            {/* Students */}
            {activeTab === "students" && (
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
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Mock Result
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {students.map((student) => (
                          <tr key={student._id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{student.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${student.mockResult === "Pass"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                  }`}
                              >
                                {student.mockResult === "Pass" ? <CheckCircle size={14} className="mr-1" /> : <XCircle size={14} className="mr-1" />}
                                {student.mockResult}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${student.verified ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                                  }`}
                              >
                                {student.verified ? "Verified" : "Pending"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {student.mockResult === "Pass" && !student.verified && (
                                <button
                                  onClick={() => handleVerifyStudent(student)}
                                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                  <CheckCircle size={16} className="mr-2" />
                                  Verify
                                </button>
                              )}
                              {student.verified && (
                                <span className="text-gray-500 font-medium">Already Verified</span>
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

            {/* Recruiters */}
            {activeTab === "recruiters" && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Manage Recruiters</h2>
                  <p className="text-gray-600 mt-1">Approve or reject recruiters</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recruiters.map((recruiter) => (
                        <tr key={recruiter._id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{recruiter.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">{recruiter.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${recruiter.status === "Approved" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                }`}
                            >
                              {recruiter.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleRecruiterApproval(recruiter._id)}
                              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                              {recruiter.status === "Approved" ? "Set Pending" : "Approve"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Settings */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Platform Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Platform Name</label>
                    <input
                      type="text"
                      value={settings.platformName}
                      onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {activeTab === "interviews" && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Mock Interviews</h2>
            <p className="text-gray-600 mt-1">Update interview status for students</p>
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Interviewer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockInterviews.map((interview) => (
                    <tr key={interview._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{interview.studentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{interview.interviewerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{new Date(interview.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${interview.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : interview.status === "Scheduled"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {interview.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => updateInterviewStatus(interview._id, "Completed")}
                          className="inline-flex items-center px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors mr-2"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => updateInterviewStatus(interview._id, "Cancelled")}
                          className="inline-flex items-center px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                        >
                          Cancel
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
      {activeTab === "applications" && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Applications</h2>
            <p className="text-gray-600 mt-1">Manage job applications from students</p>
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Job</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{app.studentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{app.jobTitle}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{new Date(app.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${app.status === "Selected"
                              ? "bg-green-100 text-green-800"
                              : app.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => updateApplicationStatus(app._id, "Selected")}
                          className="inline-flex items-center px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors mr-2"
                        >
                          Select
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(app._id, "Rejected")}
                          className="inline-flex items-center px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                        >
                          Reject
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


      {/* --- Verify Modal --- */}
      {showModal && selectedStudent && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-96 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Verify Student</h2>
            <p className="mb-6">
              Are you sure you want to verify <span className="font-semibold">{selectedStudent.name}</span>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmVerification}
                className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
