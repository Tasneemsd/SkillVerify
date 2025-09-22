import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Student() {
  const [activeTab, setActiveTab] = useState("skills");
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

  // Fetch student, courses, applications
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch student
        const studentRes = await axios.get(`${API_URL}?email=${encodeURIComponent(studentEmail)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const studentData = studentRes.data;
        setStudent(studentData);

        // Fetch all courses
        const coursesRes = await axios.get(COURSES_URL);
        setAllCourses(coursesRes.data);

        // Fetch applications (only after student._id exists)
        if (studentData._id) {
          const appsRes = await axios.get(`${APP_URL}/${studentData._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setApplications(appsRes.data || []);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (studentEmail) fetchData();
  }, [studentEmail, token]);

  // Fetch notifications when notifications tab is active
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${NOTIF_URL}?studentEmail=${studentEmail}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
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
      {
        courseId,
        email: studentEmail, // <-- send email too
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert(res.data.message || "Enrolled successfully!");

    const enrolledCourse = allCourses.find(c => c._id === courseId);
    if (enrolledCourse) {
      setStudent(prev => ({
        ...prev,
        registeredCourses: [...(prev.registeredCourses || []), enrolledCourse],
      }));
    }
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to enroll. Try again.");
  }
};


  const handleViewDetails = (course) => {
    alert(`Course Details:\n\n${course.courseName}\nID: ${course.courseId}\nDuration: ${course.courseDuration}`);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-blue-600">SkillVerify</h1>
        <div className="text-gray-600 flex items-center gap-2">
          Welcome, <span className="font-semibold">{student?.name || "Student"}</span>
          <button
            onClick={handleLogout}
            className="ml-4 text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Profile */}
      <div className="max-w-5xl mx-auto mt-6 px-4 sm:px-0">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="bg-blue-500 text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-bold">
            {student?.name ? student.name.charAt(0) : "S"}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-semibold text-gray-800">{student?.name || "Student Name"}</h2>
            <p className="text-gray-600">
              {student?.rollNo || "Roll No N/A"} • {student?.contactNumber || "No Contact"} • Class of 2026
            </p>
            <p className="mt-1 text-sm text-gray-600 font-medium">
              Verified Skills ({student?.skills?.filter((s) => s.verified).length || 0})
            </p>
            <p className="text-gray-500 text-sm">
              Complete the verification process to earn verified skill badges
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto mt-6 border-b border-gray-200 px-4 sm:px-0">
        <div className="flex flex-wrap gap-4">
          {["skills", "registeredCourses", "courses", "notifications", "applications"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
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

        {/* Skills */}
        {activeTab === "skills" && student?.skills?.length > 0 && (
          <div className="flex flex-col gap-4">
            {student.skills.map((skill, idx) => (
              <div key={idx} className="bg-white border rounded-lg shadow p-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">{skill.name}</h3>
                <p className={skill.verified ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                  {skill.verified ? "✔ Verified" : "❌ Not Verified"}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Registered Courses */}
        {activeTab === "registeredCourses" && (
          <div>
            {student?.registeredCourses?.length > 0 ? (
              <div className="flex flex-col gap-4">
                {student.registeredCourses.map(course => (
                  <div key={course._id} className="bg-white rounded-xl shadow p-5 flex justify-between items-center hover:shadow-lg transition">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{course.courseName}</h3>
                      <p className="text-gray-600 mt-1">ID: {course.courseId}</p>
                    </div>
                    <button onClick={() => handleViewDetails(course)} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition">
                      Details
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">You have not registered for any courses yet.</p>
            )}
          </div>
        )}

        {/* Available Courses */}
        {activeTab === "courses" && (
          <div className="flex flex-col gap-6">
            {allCourses.map(course => {
              const isRegistered = student?.registeredCourses?.some(c => c._id === course._id);
              return (
                <div key={course._id} className="bg-white rounded-xl shadow p-5 flex justify-between items-center hover:shadow-lg transition">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{course.courseName}</h3>
                    <p className="text-gray-600 mt-1">
                      ID: {course.courseId} • Duration: {course.courseDuration}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!isRegistered ? (
                      <button onClick={() => handleEnroll(course._id)} className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition">
                        Enroll
                      </button>
                    ) : (
                      <button className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium cursor-not-allowed">
                        Enrolled
                      </button>
                    )}
                    <button onClick={() => handleViewDetails(course)} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition">
                      Details
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <div>
            {notifications.length > 0 ? (
              <div className="flex flex-col gap-4">
                {notifications.map(notif => (
                  <div key={notif._id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                    <div>
                      <p className="text-gray-700">{notif.message}</p>
                      {notif.adminMessage && <p className="text-sm text-gray-500 mt-1">Admin: {notif.adminMessage}</p>}
                    </div>
                    <p className="text-gray-400 text-sm">{new Date(notif.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No notifications</p>
            )}
          </div>
        )}

        {/* Applications */}
        {activeTab === "applications" && (
          <div>
            {applications?.length > 0 ? (
              <div className="flex flex-col gap-4">
                {applications.map(app => (
                  <div key={app._id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center hover:shadow-md transition">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{app.jobTitle}</h3>
                      <p className="text-gray-600">{app.company}</p>
                      <p className="text-sm mt-1 text-gray-500">Applied on: {new Date(app.appliedOn).toLocaleDateString()}</p>
                    </div>
                    <p className={`font-medium ${app.status === "hired" ? "text-green-600" : app.status === "rejected" ? "text-red-600" : "text-yellow-600"}`}>
                      {app.status}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No applications found</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
