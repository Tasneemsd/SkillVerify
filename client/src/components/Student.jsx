// src/components/Student.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Student() {
  const [activeTab, setActiveTab] = useState("profile");
  const [student, setStudent] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL = "https://skillverify.onrender.com/api/student";
  const COURSES_URL = "https://skillverify.onrender.com/api/courses";
  const APP_URL = "https://skillverify.onrender.com/api/applications";
  const NOTIF_URL = "https://skillverify.onrender.com/api/notification";

  const user = JSON.parse(localStorage.getItem("user"));
  const studentEmail = user?.email;
  const token = localStorage.getItem("userToken");

  // Redirect if not logged in
  useEffect(() => {
    if (!studentEmail) navigate("/login");
  }, [studentEmail, navigate]);

  // Fetch student profile, courses, applications
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // ✅ Student profile
        const studentRes = await axios.get(
          `${API_URL}?email=${encodeURIComponent(studentEmail)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudent(studentRes.data);

        // ✅ All courses
        const coursesRes = await axios.get(COURSES_URL);
        setAllCourses(coursesRes.data);

        // ✅ Applications by student email
        const appsRes = await axios.get(
          `${APP_URL}?studentEmail=${encodeURIComponent(studentEmail)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setApplications(appsRes.data || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (studentEmail) fetchData();
  }, [studentEmail, token]);

  // Fetch notifications when tab active
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${NOTIF_URL}?studentEmail=${studentEmail}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications(res.data || []);
      } catch (err) {
        console.error("Error fetching notifications:", err.response?.data || err.message);
      }
    };

    if (activeTab === "notifications") fetchNotifications();
  }, [activeTab, studentEmail, token]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  const handleEnroll = async (courseId) => {
    try {
      const res = await axios.post(
        `${API_URL}/enroll`,
        { courseId, email: studentEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message || "Enrolled successfully!");

      // Update student state locally
      const enrolledCourse = allCourses.find((c) => c._id === courseId);
      if (enrolledCourse) {
        setStudent((prev) => ({
          ...prev,
          registeredCourses: [...(prev.registeredCourses || []), enrolledCourse],
        }));
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to enroll. Try again.");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/profile`,
        { email: student.email, ...student },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message || "Profile updated!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed. Try again.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-10 gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-600">SkillVerify</h1>
        <div className="text-gray-600 flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <span>
            Welcome, <span className="font-semibold">{student?.name || "Student"}</span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto mt-6 border-b border-gray-200 px-4 sm:px-0 overflow-x-auto">
        <div className="flex flex-nowrap gap-3 sm:gap-4">
          {[
            "profile",
            "skills",
            "registeredCourses",
            "courses",
            "notifications",
            "applications",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 text-sm sm:text-base font-medium border-b-2 transition ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab === "profile" && "Profile"}
              {tab === "skills" && "Skill Progress"}
              {tab === "registeredCourses" && "Registered Courses"}
              {tab === "courses" && "Available Courses"}
              {tab === "notifications" && "Notifications"}
              {tab === "applications" && "Applications"}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto mt-6 px-4 sm:px-0 space-y-6">
        {/* Profile */}
        {activeTab === "profile" && student && (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            {/* Profile Form */}
            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={student.profilePicture || "https://via.placeholder.com/120"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border"
              />
              <div className="flex-1 space-y-3">
                {["name", "rollNo", "college", "course", "year", "contactNumber"].map((field) => (
                  <input
                    key={field}
                    type={field === "year" ? "number" : "text"}
                    value={student[field] || ""}
                    onChange={(e) => setStudent({ ...student, [field]: e.target.value })}
                    className="border p-2 rounded w-full"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  />
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-semibold text-gray-800">Social Links</h3>
              {["facebook", "github", "linkedin", "instagram"].map((key) => (
                <input
                  key={key}
                  type="url"
                  value={student?.socialLinks?.[key] || ""}
                  onChange={(e) =>
                    setStudent({
                      ...student,
                      socialLinks: { ...student.socialLinks, [key]: e.target.value },
                    })
                  }
                  className="border p-2 rounded w-full mt-2"
                  placeholder={`${key} link`}
                />
              ))}
            </div>

            {/* Coding Links */}
            <div>
              <h3 className="font-semibold text-gray-800">Coding Profiles</h3>
              {["leetcode", "hackerrank", "codeforces", "codechef"].map((key) => (
                <input
                  key={key}
                  type="url"
                  value={student?.codingLinks?.[key] || ""}
                  onChange={(e) =>
                    setStudent({
                      ...student,
                      codingLinks: { ...student.codingLinks, [key]: e.target.value },
                    })
                  }
                  className="border p-2 rounded w-full mt-2"
                  placeholder={`${key} link`}
                />
              ))}
            </div>

            <button
              onClick={handleUpdateProfile}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Skills */}
        {activeTab === "skills" && (
          <div>
            {student?.skills?.length > 0 ? (
              <div className="flex flex-col gap-4">
                {student.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="bg-white border rounded-lg shadow p-4 flex justify-between items-center"
                  >
                    <span className="font-semibold">{skill.name}</span>
                    <span className={skill.verified ? "text-green-600" : "text-red-500"}>
                      {skill.verified ? "✔ Verified" : "❌ Not Verified"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills added yet.</p>
            )}
          </div>
        )}

        {/* Registered Courses */}
        {activeTab === "registeredCourses" && (
          <div>
            {student?.registeredCourses?.length > 0 ? (
              student.registeredCourses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white p-4 rounded-lg shadow flex justify-between mb-2"
                >
                  <div>
                    <h3 className="font-semibold">{course.courseName}</h3>
                    <p className="text-gray-600">{course.courseId}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Not registered in any course.</p>
            )}
          </div>
        )}

        {/* Available Courses */}
        {activeTab === "courses" && (
          <div>
            {allCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white p-4 rounded-lg shadow flex justify-between mb-3"
              >
                <div>
                  <h3 className="font-semibold">{course.courseName}</h3>
                  <p className="text-gray-600">{course.courseId}</p>
                </div>
                <button
                  onClick={() => handleEnroll(course._id)}
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  Enroll
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <div>
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div key={n._id} className="bg-white p-3 shadow rounded mb-2">
                  <p>{n.message}</p>
                  {n.adminMessage && (
                    <p className="text-sm text-gray-500">{n.adminMessage}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No notifications</p>
            )}
          </div>
        )}

        {/* Applications */}
        {activeTab === "applications" && (
          <div>
            {applications.length > 0 ? (
              applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white p-3 shadow rounded mb-2 flex justify-between"
                >
                  <div>
                    <h3 className="font-semibold">{app.jobTitle}</h3>
                    <p className="text-gray-500">{app.company}</p>
                  </div>
                  <span
                    className={
                      app.status === "hired"
                        ? "text-green-600"
                        : app.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }
                  >
                    {app.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No applications</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
