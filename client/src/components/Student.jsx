// src/components/Student.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  BookOpen,
  Bell,
  FileText,
  Award,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://skillverify.onrender.com/api";

const Student = () => {
  const [student, setStudent] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("userToken");

  const getAuthHeaders = () =>
    token ? { Authorization: `Bearer ${token}` } : {};

  // Fetch student data
  const fetchStudent = async () => {
    try {
      if (!user?.email) return;
      const res = await axios.get(
        `${BASE_URL}/student?email=${encodeURIComponent(user.email)}`,
        { headers: getAuthHeaders() }
      );
      setStudent(res.data);

      const coursesRes = await axios.get(`${BASE_URL}/courses`);
      setAllCourses(coursesRes.data);

      if (res.data._id) {
        const appsRes = await axios.get(
          `${BASE_URL}/applications?studentId=${res.data._id}`,
          { headers: getAuthHeaders() }
        );
        setApplications(appsRes.data || []);
      }
    } catch (err) {
      setError("Failed to load student data");
    }
  };

  const fetchNotifications = async () => {
    try {
      if (!student?._id) return;
      const res = await axios.get(
        `${BASE_URL}/notification?studentId=${student._id}`,
        { headers: getAuthHeaders() }
      );
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Notifications error:", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchStudent();
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (activeTab === "notifications") fetchNotifications();
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleEnroll = async (courseId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/student/enroll`,
        { courseId, email: user.email },
        { headers: getAuthHeaders() }
      );
      alert(res.data.message || "Enrolled successfully!");
      const course = allCourses.find((c) => c._id === courseId);
      if (course) {
        setStudent((prev) => ({
          ...prev,
          registeredCourses: [...(prev.registeredCourses || []), course],
        }));
      }
    } catch {
      alert("Failed to enroll");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/student/profile`,
        { email: student.email, ...student },
        { headers: getAuthHeaders() }
      );
      alert(res.data.message || "Profile updated!");
      setEditMode(false);
    } catch {
      alert("Profile update failed");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading student dashboard...</p>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-6">
          <div className="flex items-center">
            <User className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Student Dashboard
            </h1>
          </div>
          {student && (
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block text-sm text-gray-600">
                Welcome, {student.name}
              </span>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {student.name?.charAt(0)?.toUpperCase() || "S"}
                </span>
              </div>
              <button
                className="sm:hidden p-2 rounded-md border text-gray-600"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop */}
          <div className="hidden sm:flex space-x-8">
            {[
              { id: "profile", label: "Profile", icon: User },
              { id: "skills", label: "Skills", icon: Award },
              { id: "registeredCourses", label: "My Courses", icon: BookOpen },
              { id: "courses", label: "All Courses", icon: FileText },
              { id: "applications", label: "Applications", icon: FileText },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mobile */}
          {mobileMenuOpen && (
            <div className="sm:hidden flex flex-col space-y-2 py-2">
              {[
                { id: "profile", label: "Profile", icon: User },
                { id: "skills", label: "Skills", icon: Award },
                { id: "registeredCourses", label: "My Courses", icon: BookOpen },
                { id: "courses", label: "All Courses", icon: FileText },
                { id: "applications", label: "Applications", icon: FileText },
                { id: "notifications", label: "Notifications", icon: Bell },
                { id: "settings", label: "Settings", icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Profile */}
        {activeTab === "profile" && (
          <div className="bg-white p-6 rounded-lg shadow">
            {editMode ? (
              <div className="space-y-3">
                {["name", "rollNo", "college", "course", "year", "contactNumber"].map(
                  (field) => (
                    <input
                      key={field}
                      type={field === "year" ? "number" : "text"}
                      value={student[field] || ""}
                      onChange={(e) =>
                        setStudent({ ...student, [field]: e.target.value })
                      }
                      className="border p-2 rounded w-full"
                      placeholder={field}
                    />
                  )
                )}
                <button
                  onClick={handleUpdateProfile}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <p><strong>Name:</strong> {student.name}</p>
                <p><strong>College:</strong> {student.college}</p>
                <p><strong>Course:</strong> {student.course}</p>
                <p><strong>Year:</strong> {student.year}</p>
                <button
                  onClick={() => setEditMode(true)}
                  className="mt-3 bg-gray-200 px-4 py-2 rounded"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        )}

        {/* Skills */}
        {activeTab === "skills" && (
          <div className="bg-white p-6 rounded-lg shadow">
            {student?.skills?.length ? (
              student.skills.map((s, i) => (
                <div key={i} className="flex justify-between border-b py-2">
                  <span>{s.name}</span>
                  <span className={s.verified ? "text-green-600" : "text-red-600"}>
                    {s.verified ? "Verified" : "Not Verified"}
                  </span>
                </div>
              ))
            ) : (
              <p>No skills added yet</p>
            )}
          </div>
        )}

        {/* Courses */}
        {activeTab === "registeredCourses" && (
          <div className="bg-white p-6 rounded-lg shadow">
            {student?.registeredCourses?.length ? (
              student.registeredCourses.map((c) => (
                <div key={c._id} className="border-b py-2">
                  {c.courseName}
                </div>
              ))
            ) : (
              <p>No courses registered</p>
            )}
          </div>
        )}

        {activeTab === "courses" && (
          <div className="bg-white p-6 rounded-lg shadow space-y-3">
            {allCourses.map((c) => {
              const enrolled = student?.registeredCourses?.some((r) => r._id === c._id);
              return (
                <div
                  key={c._id}
                  className="flex justify-between border-b py-2 items-center"
                >
                  <span>{c.courseName}</span>
                  <button
                    onClick={() => handleEnroll(c._id)}
                    disabled={enrolled}
                    className={`px-3 py-1 rounded ${
                      enrolled
                        ? "bg-gray-400 text-white"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {enrolled ? "Enrolled" : "Enroll"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Applications */}
        {activeTab === "applications" && (
          <div className="bg-white p-6 rounded-lg shadow">
            {applications.length ? (
              applications.map((app) => (
                <div key={app._id} className="border-b py-2">
                  {app.jobTitle} - {app.status}
                </div>
              ))
            ) : (
              <p>No applications yet</p>
            )}
          </div>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <div className="bg-white p-6 rounded-lg shadow">
            {notifications.length ? (
              notifications.map((n) => (
                <div key={n._id} className="border-b py-2">
                  {n.message}
                </div>
              ))
            ) : (
              <p>No notifications</p>
            )}
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Student;
