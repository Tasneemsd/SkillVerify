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

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-2xl"></div>
    ))}
  </div>
);

const normalizeUsers = (arr = []) =>
  (arr || []).map((u) => {
    const verified = u.verified ?? u.isVerified ?? false;
    let mockResult = u.mockResult;
    if (!mockResult && typeof u.mockInterviewScore === "number") {
      mockResult = u.mockInterviewScore >= 50 ? "Pass" : "Fail";
    }
    const _id = u._id ?? u.id ?? null;
    return {
      ...u,
      _id,
      verified,
      isVerified: verified,
      mockResult: mockResult ?? "N/A",
    };
  });

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

  const fetchAdmin = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setAdmin({ _id: user._id || "unknown", name: user.name || "Admin", email: user.email || "admin@example.com" });
      setSettings({ platformName: user.platformName || "SkillVerify" });
    } catch {
      setAdmin({ _id: "default", name: "Admin", email: "admin@example.com" });
      setSettings({ platformName: "SkillVerify" });
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/users`, { headers: getAuthHeaders() });
      const payload = res?.data ?? [];
      const arr = Array.isArray(payload) ? payload : payload.users ?? payload.data ?? [];
      setUsers(normalizeUsers(arr));
    } catch (err) {
      console.error("fetchUsers error:", err);
      setUsers([]);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/jobs`, { headers: getAuthHeaders() });
      const payload = res?.data ?? [];
      setJobs(Array.isArray(payload) ? payload : payload.jobs ?? payload.data ?? []);
    } catch (err) {
      console.error("fetchJobs error:", err);
      setJobs([]);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/courses-with-registrations`, { headers: getAuthHeaders() });
      const payload = res?.data ?? [];
      setCourses(Array.isArray(payload) ? payload : payload.courses ?? payload.data ?? []);
    } catch (err) {
      console.error("fetchCourses error:", err);
      setCourses([]);
    }
  };

  const fetchMockInterviews = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/mock-interviews`, { headers: getAuthHeaders() });
      const payload = res?.data ?? [];
      setMockInterviews(Array.isArray(payload) ? payload : payload.mockInterviews ?? payload.data ?? []);
    } catch (err) {
      console.error("fetchMockInterviews error:", err);
      setMockInterviews([]);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/applications`, { headers: getAuthHeaders() });
      const payload = res?.data ?? [];
      setApplications(Array.isArray(payload) ? payload : payload.applications ?? payload.data ?? []);
    } catch (err) {
      console.error("fetchApplications error:", err);
      setApplications([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchAdmin();
      await Promise.all([fetchUsers(), fetchJobs(), fetchCourses(), fetchMockInterviews(), fetchApplications()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleVerifyStudent = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const confirmVerification = async () => {
    try {
      if (!selectedStudent?._id) throw new Error("No student selected");
      await axios.post(`${BASE_URL}/admin/verify-student`, { studentId: selectedStudent._id }, { headers: getAuthHeaders() });
      setUsers(prev => prev.map(u => u._id === selectedStudent._id ? { ...u, verified: true, isVerified: true } : u));
      setShowModal(false);
      alert("Student verified!");
    } catch (err) {
      console.error("confirmVerification error:", err);
      alert("Failed to verify student.");
    }
  };

  const toggleRecruiterApproval = async (recruiterId) => {
    try {
      const recruiter = users.find(u => u._id === recruiterId);
      if (!recruiter) throw new Error("Recruiter not found");
      const newStatus = recruiter.status === "Approved" ? "Pending" : "Approved";
      await axios.post(`${BASE_URL}/admin/toggle-recruiter`, { recruiterId, status: newStatus }, { headers: getAuthHeaders() });
      setUsers(prev => prev.map(u => u._id === recruiterId ? { ...u, status: newStatus } : u));
    } catch (err) {
      console.error("toggleRecruiterApproval error:", err);
      alert("Failed to update recruiter status.");
    }
  };

  const updateInterviewStatus = async (interviewId, status) => {
    try {
      await axios.post(`${BASE_URL}/admin/update-interview`, { interviewId, status }, { headers: getAuthHeaders() });
      setMockInterviews(prev => prev.map(i => i._id === interviewId ? { ...i, status } : i));
    } catch (err) {
      console.error("updateInterviewStatus error:", err);
      alert("Failed to update interview status.");
    }
  };

  const updateApplicationStatus = async (appId, status) => {
    try {
      await axios.post(`${BASE_URL}/admin/update-application`, { appId, status }, { headers: getAuthHeaders() });
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
    } catch (err) {
      console.error("updateApplicationStatus error:", err);
      alert("Failed to update application status.");
    }
  };

  const students = users.filter(u => ["student", "Student"].includes(u.role));
  const recruiters = users.filter(u => ["recruiter", "Recruiter"].includes(u.role));

  const dashboardData = {
    totalStudents: students.length,
    verifiedStudents: students.filter(u => u.verified).length,
    pendingVerifications: students.filter(u => !u.verified).length,
    totalRecruiters: recruiters.length,
    applications: applications.length || jobs.length,
    completedInterviews: mockInterviews.filter(i => i.status === "Completed").length,
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp },
    { id: "students", label: "Students", icon: Users },
    { id: "nonVerified", label: "Non-Verified Students", icon: UserX },
    { id: "interviews", label: "Mock Interviews", icon: MessageSquare },
    { id: "recruiters", label: "Recruiters", icon: Briefcase },
    { id: "applications", label: "Applications", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const isLoading = loading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* ...Navigation, hero, tabs same as your code... */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
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

            {activeTab === "students" && <StudentsTab students={students} handleVerifyStudent={handleVerifyStudent} />}
            {activeTab === "nonVerified" && <NonVerifiedTab students={students} handleVerifyStudent={handleVerifyStudent} />}
            {activeTab === "recruiters" && <RecruitersTab recruiters={recruiters} toggleRecruiterApproval={toggleRecruiterApproval} />}
            {activeTab === "interviews" && <InterviewsTab mockInterviews={mockInterviews} updateInterviewStatus={updateInterviewStatus} />}
            {activeTab === "applications" && <ApplicationsTab applications={applications} updateApplicationStatus={updateApplicationStatus} />}
            {activeTab === "settings" && <SettingsTab settings={settings} setSettings={setSettings} />}
          </>
        )}
      </div>

      {/* Verify Modal */}
      {showModal && selectedStudent && (
        <VerifyModal student={selectedStudent} confirmVerification={confirmVerification} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default Admin;
