import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

// --- StatCard Component ---
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

const Admin = () => {
  const navigate = useNavigate();
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
      const rawToken = localStorage.getItem("token");
      if (rawToken) return rawToken;
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user?.token || null;
    } catch {
      return null;
    }
  };
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // --- Data Helpers ---
  const extractArray = (data, possibleKeys = []) => {
    if (Array.isArray(data)) return data;
    for (const key of possibleKeys) {
      if (Array.isArray(data[key])) return data[key];
    }
    return [];
  };
  const normalizeUsers = (users) => {
    return users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified || false,
      status: user.status || "Pending",
      mockResult: user.mockResult || "—",
    }));
  };

  // --- Fetch Functions ---
  const fetchAdmin = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setAdmin({
        _id: user._id || "unknown",
        name: user.name || "Admin",
        email: user.email || "admin@example.com",
      });
      setSettings({ platformName: user.platformName || "SkillVerify" });
    } catch {
      setAdmin({ _id: "default", name: "Admin", email: "admin@example.com" });
      setSettings({ platformName: "SkillVerify" });
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/students`, { headers: getAuthHeaders() });
      const arr = extractArray(res.data);
      setUsers(normalizeUsers(arr));
    } catch (err) {
      console.error("fetchUsers error:", err.response || err);
      setUsers([]);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/jobs`, { headers: getAuthHeaders() });
      setJobs(extractArray(res.data));
    } catch (err) {
      console.error("fetchJobs error:", err.response || err);
      setJobs([]);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/courses-with-registrations`, { headers: getAuthHeaders() });
      setCourses(extractArray(res.data, ["courses"]));
    } catch (err) {
      console.error("fetchCourses error:", err.response || err);
      setCourses([]);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const fetchMockInterviews = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/mock-interviews`, { headers: getAuthHeaders() });
      setMockInterviews(extractArray(res.data, ["mockInterviews"]));
    } catch (err) {
      console.error("fetchMockInterviews error:", err.response || err);
      setMockInterviews([]);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/applications`, { headers: getAuthHeaders() });
      setApplications(extractArray(res.data, ["applications"]));
    } catch (err) {
      console.error("fetchApplications error:", err.response || err);
      setApplications([]);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  // --- Load All Data ---
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchAdmin();
        await Promise.allSettled([
          fetchUsers(),
          fetchJobs(),
          fetchCourses(),
          fetchMockInterviews(),
          fetchApplications(),
        ]);
      } catch (err) {
        console.error("loadData error:", err);
      } finally {
        setLoading(false);
      }
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
      if (!selectedStudent?._id) throw new Error("No student selected");
      await axios.post(`${BASE_URL}/admin/verify-student`, { studentId: selectedStudent._id }, { headers: getAuthHeaders() });
      setUsers((prev) =>
        prev.map((u) => (u._id === selectedStudent._id ? { ...u, verified: true } : u))
      );
      setShowModal(false);
      alert("Student verified!");
    } catch (err) {
      console.error(err.response || err);
      alert(err.response?.data?.message || "Failed to verify student.");
    }
  };
  const updateApplicationStatus = async (appId, status) => {
    try {
      await axios.post(`${BASE_URL}/admin/update-application`, { appId, status }, { headers: getAuthHeaders() });
      setApplications((prev) => prev.map((a) => (a._id === appId ? { ...a, status } : a)));
    } catch (err) {
      console.error(err.response || err);
      alert(err.response?.data?.message || "Failed to update application status.");
    }
  };
  const toggleRecruiterApproval = async (recruiterId) => {
    try {
      const recruiter = users.find((u) => u._id === recruiterId);
      if (!recruiter) throw new Error("Recruiter not found");
      const newStatus = recruiter.status === "Approved" ? "Pending" : "Approved";
      await axios.post(`${BASE_URL}/admin/toggle-recruiter`, { recruiterId, status: newStatus }, { headers: getAuthHeaders() });
      setUsers((prev) => prev.map((u) => (u._id === recruiterId ? { ...u, status: newStatus } : u)));
    } catch (err) {
      console.error(err.response || err);
      alert(err.response?.data?.message || "Failed to update recruiter status.");
    }
  };
  const updateInterviewStatus = async (interviewId, status) => {
    try {
      await axios.post(`${BASE_URL}/admin/update-interview`, { interviewId, status }, { headers: getAuthHeaders() });
      setMockInterviews((prev) => prev.map((i) => (i._id === interviewId ? { ...i, status } : i)));
    } catch (err) {
      console.error(err.response || err);
      alert(err.response?.data?.message || "Failed to update interview status.");
    }
  };

  // --- Derived Data ---
  const students = users.filter((u) => u.role?.toLowerCase() === "student");
  const recruiters = users.filter((u) => u.role?.toLowerCase() === "recruiter");
  const verifiedStudents = students.filter(u => u.verified);
  const nonVerifiedStudents = students.filter(u => !u.verified);

  const dashboardData = {
    totalStudents: students.length,
    verifiedStudents: verifiedStudents.length,
    pendingVerifications: nonVerifiedStudents.length,
    totalRecruiters: recruiters.length,
    applications: applications.length,
    completedInterviews: mockInterviews.filter(i => i.status === "Completed").length,
  };

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp },
    { id: "students", label: "Students", icon: Users },
    { id: "nonVerified", label: "Non-Verified Students", icon: UserX },
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "interviews", label: "Mock Interviews", icon: MessageSquare },
    { id: "recruiters", label: "Recruiters", icon: Briefcase },
    { id: "applications", label: "Applications", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* --- Navbar --- */}
      <nav className="bg-white shadow-md sticky top-0 z-50 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl hover:opacity-80 transition-opacity">
                <img src="/logos.png" alt="Logo" className="h-12 w-auto" />
              </Link>
            </div>

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
                  <ChevronDown size={20} className={`text-gray-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
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

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

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
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Welcome back, {admin?.name || "Admin"} 👋</h1>
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

      <div className="flex flex-1">
        {/* --- Sidebar --- */}
        <aside className="w-64 bg-white shadow-md p-4 hidden md:block">
          <h1 className="text-xl font-bold mb-6">{settings.platformName || "SkillVerify"}</h1>
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 w-full p-2 rounded hover:bg-gray-200 ${activeTab === tab.id ? "bg-gray-200 font-semibold" : ""
                  }`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* --- Main Content --- */}
        <main className="flex-1 p-6 overflow-auto">
          {loading ? <LoadingSkeleton /> : (
            <>
              {activeTab === "dashboard" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StatCard title="Total Students" value={dashboardData.totalStudents} icon={Users} gradient="from-blue-400 to-blue-600" />
                  <StatCard title="Verified Students" value={dashboardData.verifiedStudents} icon={UserCheck} gradient="from-green-400 to-green-600" />
                  <StatCard title="Pending Verification" value={dashboardData.pendingVerifications} icon={UserX} gradient="from-yellow-400 to-yellow-600" />
                  <StatCard title="Total Recruiters" value={dashboardData.totalRecruiters} icon={Briefcase} gradient="from-purple-400 to-purple-600" />
                  <StatCard title="Applications" value={dashboardData.applications} icon={FileText} gradient="from-pink-400 to-pink-600" />
                  <StatCard title="Completed Interviews" value={dashboardData.completedInterviews} icon={CheckCircle} gradient="from-teal-400 to-teal-600" />
                </div>
              )}
              {/* Students Tab */}
              {activeTab === "students" && (
                <div className="overflow-auto">
                  <h2 className="text-xl font-semibold mb-4">All Students</h2>
                  <table className="min-w-full bg-white rounded shadow">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Verified</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((stu) => (
                        <tr key={stu._id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2">{stu.name}</td>
                          <td className="px-4 py-2">{stu.email}</td>
                          <td className="px-4 py-2">{stu.verified ? "✅" : "❌"}</td>
                          <td className="px-4 py-2">
                            {!stu.verified && (
                              <button
                                onClick={() => handleVerifyStudent(stu)}
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                              >
                                Verify
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Non-Verified Students Tab */}
              {activeTab === "nonVerified" && (
                <div className="overflow-auto">
                  <h2 className="text-xl font-semibold mb-4">Non-Verified Students</h2>
                  <table className="min-w-full bg-white rounded shadow">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nonVerifiedStudents.map((stu) => (
                        <tr key={stu._id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2">{stu.name}</td>
                          <td className="px-4 py-2">{stu.email}</td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleVerifyStudent(stu)}
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                            >
                              Verify
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Candidates Tab */}
              {activeTab === "candidates" && (
                <div className="overflow-auto">
                  <h2 className="text-xl font-semibold mb-4">Candidates</h2>
                  <table className="min-w-full bg-white rounded shadow">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Application Status</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr key={app._id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2">{app.studentName}</td>
                          <td className="px-4 py-2">{app.email}</td>
                          <td className="px-4 py-2">{app.status}</td>
                          <td className="px-4 py-2">
                            {app.status !== "Approved" && (
                              <button
                                onClick={() => updateApplicationStatus(app._id, "Approved")}
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                              >
                                Approve
                              </button>
                            )}
                            {app.status !== "Rejected" && (
                              <button
                                onClick={() => updateApplicationStatus(app._id, "Rejected")}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                              >
                                Reject
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Recruiters Tab */}
              {activeTab === "recruiters" && (
                <div className="overflow-auto">
                  <h2 className="text-xl font-semibold mb-4">Recruiters</h2>
                  <table className="min-w-full bg-white rounded shadow">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recruiters.map((rec) => (
                        <tr key={rec._id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2">{rec.name}</td>
                          <td className="px-4 py-2">{rec.email}</td>
                          <td className="px-4 py-2">{rec.status}</td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => toggleRecruiterApproval(rec._id)}
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            >
                              {rec.status === "Approved" ? "Revoke" : "Approve"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Mock Interviews Tab */}
              {activeTab === "interviews" && (
                <div className="overflow-auto">
                  <h2 className="text-xl font-semibold mb-4">Mock Interviews</h2>
                  <table className="min-w-full bg-white rounded shadow">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2">Candidate</th>
                        <th className="px-4 py-2">Job</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockInterviews.map((i) => (
                        <tr key={i._id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2">{i.candidateName}</td>
                          <td className="px-4 py-2">{i.jobTitle}</td>
                          <td className="px-4 py-2">{i.status}</td>
                          <td className="px-4 py-2">
                            {i.status !== "Completed" && (
                              <button
                                onClick={() => updateInterviewStatus(i._id, "Completed")}
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                              >
                                Complete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              )}

            </>
          )}
        </main>
      </div>

      {/* --- Verify Student Modal --- */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-semibold mb-4">Verify Student</h2>
            <p>Are you sure you want to verify <strong>{selectedStudent.name}</strong>?</p>
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
              <button onClick={confirmVerification} className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600">Verify</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
