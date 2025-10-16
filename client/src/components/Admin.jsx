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
  TrendingUp,
} from "lucide-react";

// Base API URL
const BASE_URL = "https://skillverify.onrender.com/api";

// ----- StatCard Component -----
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

// ----- Loading Skeleton -----
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-2xl"></div>
    ))}
  </div>
);

// ----- Normalize Users -----
const normalizeUsers = (arr = []) =>
  (arr || []).map((u) => {
    const verified = u.verified ?? u.isVerified ?? false;
    let mockResult = u.mockResult;
    if (!mockResult && typeof u.mockInterviewScore === "number") {
      mockResult = u.mockInterviewScore >= 50 ? "Pass" : "Fail";
    }
    const _id = u._id ?? u.id ?? null;
    return { ...u, _id, verified, isVerified: verified, mockResult: mockResult ?? "N/A" };
  });

// ----- Tab Components -----
const StudentsTab = ({ students, handleVerifyStudent }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {students.map((s) => (
      <div key={s._id} className="p-4 bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer">
        <h3 className="font-bold">{s.name}</h3>
        <p>{s.email}</p>
        <p>Status: {s.verified ? "Verified" : "Pending"}</p>
        {!s.verified && (
          <button
            onClick={() => handleVerifyStudent(s)}
            className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
          >
            Verify
          </button>
        )}
      </div>
    ))}
  </div>
);

const NonVerifiedTab = ({ students, handleVerifyStudent }) => {
  const nonVerified = students.filter((s) => !s.verified);
  return <StudentsTab students={nonVerified} handleVerifyStudent={handleVerifyStudent} />;
};

const RecruitersTab = ({ recruiters, toggleRecruiterApproval }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {recruiters.map((r) => (
      <div key={r._id} className="p-4 bg-white rounded-xl shadow hover:shadow-md transition">
        <h3 className="font-bold">{r.name}</h3>
        <p>{r.email}</p>
        <p>Status: {r.status || "Pending"}</p>
        <button
          onClick={() => toggleRecruiterApproval(r._id)}
          className="mt-2 px-3 py-1 bg-purple-500 text-white rounded"
        >
          Toggle Status
        </button>
      </div>
    ))}
  </div>
);

const InterviewsTab = ({ mockInterviews, updateInterviewStatus }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {mockInterviews.map((i) => (
      <div key={i._id} className="p-4 bg-white rounded-xl shadow hover:shadow-md transition">
        <h3 className="font-bold">{i.studentName || "Student"}</h3>
        <p>Status: {i.status || "Pending"}</p>
        <button
          onClick={() => updateInterviewStatus(i._id, "Completed")}
          className="mt-2 px-3 py-1 bg-teal-500 text-white rounded"
        >
          Mark Completed
        </button>
      </div>
    ))}
  </div>
);

const ApplicationsTab = ({ applications, updateApplicationStatus }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {applications.map((a) => (
      <div key={a._id} className="p-4 bg-white rounded-xl shadow hover:shadow-md transition">
        <h3 className="font-bold">{a.studentName || "Student"}</h3>
        <p>Job: {a.jobTitle || "N/A"}</p>
        <p>Status: {a.status || "Pending"}</p>
        <button
          onClick={() => updateApplicationStatus(a._id, "Accepted")}
          className="mt-2 px-3 py-1 bg-pink-500 text-white rounded"
        >
          Accept
        </button>
      </div>
    ))}
  </div>
);

const SettingsTab = ({ settings, setSettings }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <h3 className="font-bold mb-4">Platform Settings</h3>
    <input
      type="text"
      value={settings.platformName}
      onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
      className="border p-2 rounded w-full"
    />
  </div>
);

const VerifyModal = ({ student, confirmVerification, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl shadow max-w-sm w-full">
      <h3 className="font-bold text-lg mb-4">Verify Student</h3>
      <p>Are you sure you want to verify {student.name}?</p>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
        <button onClick={confirmVerification} className="px-4 py-2 bg-green-500 text-white rounded">Verify</button>
      </div>
    </div>
  </div>
);

// ----- Admin Component -----
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
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const getAuthToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.token || null;
    } catch { return null; }
  };

  const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}`, "Cache-Control": "no-cache" } : { "Cache-Control": "no-cache" };
  };

  const fetchAdminData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setAdmin({ _id: user._id, name: user.name, email: user.email });
      setSettings({ platformName: user.platformName || "SkillVerify" });
    } catch {
      setAdmin({ _id: "admin", name: "Admin", email: "admin@example.com" });
      setSettings({ platformName: "SkillVerify" });
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await fetchAdminData();

      const [usersRes, jobsRes, coursesRes, interviewsRes, appsRes] = await Promise.all([
        axios.get(`${BASE_URL}/admin/users?t=${Date.now()}`, { headers: getAuthHeaders() }),
        axios.get(`${BASE_URL}/admin/jobs?t=${Date.now()}`, { headers: getAuthHeaders() }),
        axios.get(`${BASE_URL}/admin/courses-with-registrations?t=${Date.now()}`, { headers: getAuthHeaders() }),
        axios.get(`${BASE_URL}/admin/mock-interviews?t=${Date.now()}`, { headers: getAuthHeaders() }),
        axios.get(`${BASE_URL}/admin/applications?t=${Date.now()}`, { headers: getAuthHeaders() }),
      ]);

      setUsers(normalizeUsers(usersRes.data?.users ?? usersRes.data ?? []));
      setJobs(jobsRes.data?.jobs ?? jobsRes.data ?? []);
      setCourses(coursesRes.data?.courses ?? coursesRes.data ?? []);
      setMockInterviews(interviewsRes.data?.mockInterviews ?? interviewsRes.data ?? []);
      setApplications(appsRes.data?.applications ?? appsRes.data ?? []);
    } catch (err) {
      console.error("fetchAllData error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const students = users.filter((u) => ["student", "Student"].includes(u.role));
  const recruiters = users.filter((u) => ["recruiter", "Recruiter"].includes(u.role));

  const dashboardData = {
    totalStudents: students.length,
    verifiedStudents: students.filter((u) => u.verified).length,
    pendingVerifications: students.filter((u) => !u.verified).length,
    totalRecruiters: recruiters.length,
    applications: applications.length || jobs.length,
    completedInterviews: mockInterviews.filter((i) => i.status === "Completed").length,
  };

  const handleVerifyStudent = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const confirmVerification = async () => {
    try {
      if (!selectedStudent?._id) throw new Error("No student selected");
      await axios.post(`${BASE_URL}/admin/verify-student`, { studentId: selectedStudent._id }, { headers: getAuthHeaders() });
      setUsers((prev) => prev.map((u) => (u._id === selectedStudent._id ? { ...u, verified: true, isVerified: true } : u)));
      setShowModal(false);
      alert("Student verified!");
    } catch (err) {
      console.error("confirmVerification error:", err);
      alert("Failed to verify student.");
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
      console.error("toggleRecruiterApproval error:", err);
      alert("Failed to update recruiter status.");
    }
  };

  const updateInterviewStatus = async (interviewId, status) => {
    try {
      await axios.post(`${BASE_URL}/admin/update-interview`, { interviewId, status }, { headers: getAuthHeaders() });
      setMockInterviews((prev) => prev.map((i) => (i._id === interviewId ? { ...i, status } : i)));
    } catch (err) {
      console.error("updateInterviewStatus error:", err);
      alert("Failed to update interview status.");
    }
  };

  const updateApplicationStatus = async (appId, status) => {
    try {
      await axios.post(`${BASE_URL}/admin/update-application`, { appId, status }, { headers: getAuthHeaders() });
      setApplications((prev) => prev.map((a) => (a._id === appId ? { ...a, status } : a)));
    } catch (err) {
      console.error("updateApplicationStatus error:", err);
      alert("Failed to update application status.");
    }
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "students", label: "Students" },
    { id: "nonVerified", label: "Non-Verified Students" },
    { id: "interviews", label: "Mock Interviews" },
    { id: "recruiters", label: "Recruiters" },
    { id: "applications", label: "Applications" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Tabs */}
      <div className="flex gap-2 p-4 bg-white shadow overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl font-semibold ${
              activeTab === t.id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
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
