// src/components/Student.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, BookOpen, FileText, Award, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://skillverify.onrender.com/api";

const Student = () => {
  const [student, setStudent] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("skills");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchStudent();
      setLoading(false);
    };
    load();
  }, []);

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
              SkillVerify
            </h1>
          </div>
          {student && (
            <div className="flex items-center space-x-4 relative">
              <span className="hidden sm:block text-sm text-gray-600">
                Welcome, {student.name}
              </span>
              <div
                className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="text-white text-sm font-medium">
                  {student.name?.charAt(0)?.toUpperCase() || "S"}
                </span>
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 mt-36 w-48 bg-white border rounded-lg shadow-md z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
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

      {/* Profile Section (always visible, not a tab anymore) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">My Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-800">{student.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">College</p>
              <p className="font-medium text-gray-800">{student.college}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Course</p>
              <p className="font-medium text-gray-800">{student.course}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Year</p>
              <p className="font-medium text-gray-800">{student.year}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Roll No</p>
              <p className="font-medium text-gray-800">{student.rollNo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact</p>
              <p className="font-medium text-gray-800">{student.contactNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden sm:flex space-x-8">
            {[
              { id: "skills", label: "Skills", icon: Award },
              { id: "registeredCourses", label: "My Courses", icon: BookOpen },
              { id: "courses", label: "All Courses", icon: FileText },
              { id: "applications", label: "Applications", icon: FileText },
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
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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

        {/* Registered Courses */}
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

        {/* All Courses */}
        {activeTab === "courses" && (
          <div className="bg-white p-6 rounded-lg shadow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses.map((c) => {
              const enrolled = student?.registeredCourses?.some((r) => r._id === c._id);
              return (
                <div key={c._id} className="border rounded-lg p-4 flex flex-col justify-between shadow">
                  <div>
                    <h3 className="text-lg font-semibold">{c.courseName}</h3>
                    <p className="text-gray-600 mt-2">{c.description}</p>
                    <p className="mt-2 text-sm"><strong>Cost:</strong> ₹{c.cost || "Free"}</p>
                    <p className="text-sm"><strong>Duration:</strong> {c.duration || "N/A"}</p>
                  </div>
                  <button
                    onClick={() => handleEnroll(c._id)}
                    disabled={enrolled}
                    className={`mt-4 w-full px-3 py-2 rounded ${
                      enrolled
                        ? "bg-gray-400 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {enrolled ? "Enrolled" : "Enroll Now"}
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
      </div>
    </div>
  );
};

export default Student;
