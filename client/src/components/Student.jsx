import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import logo2 from '../images/logo2.jpg';

const Student = () => {
  const [courses, setCourses] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("courses");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [myCourses, setMyCourses] = useState([]);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const getInitials = (name = "") =>
    name ? name.split(" ").map((n) => n[0].toUpperCase()).join("") : "";

  // Fetch student details
  useEffect(() => {
    if (!user?.email) return;
    API.get(`/student?email=${encodeURIComponent(user.email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setStudent(res.data);
        if (res.data.registeredCourses) {
          setMyCourses(
            res.data.registeredCourses.map((c) => (c._id ? c._id : c.toString()))
          );
        }
      })
      .catch((err) => console.error("Fetch student error:", err));
  }, [user?.email, token]);

  // Fetch courses
  useEffect(() => {
    API.get("/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Courses fetch error:", err));
  }, []);

  // Fetch jobs
  useEffect(() => {
    API.get("/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error("Jobs fetch error:", err));
  }, []);

  // Fetch applications
  useEffect(() => {
    if (!student?._id) return;
    API.get(`/applications?studentId=${student._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setApplications(res.data))
      .catch((err) => console.error("Applications fetch error:", err));
  }, [student?._id, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isCourseEnrolled = (course) =>
    myCourses.includes(course._id?.toString());

  // -------- Skill Progress Calculation --------
  const totalCourses = courses.length;
  const enrolledCourses = courses.filter((c) => isCourseEnrolled(c)).length;
  const progress =
    totalCourses > 0 ? Math.round((enrolledCourses / totalCourses) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center relative">
        <img src={logo2} alt="SkillVerify Logo" className="h-10 w-auto" />

        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">

            Welcome, {student?.name || user?.name || "Student"}
          </span>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md focus:outline-none"
            >
              {getInitials(student?.name || user?.name || "S")}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => setActiveTab("skill")}
                >
                  My Profile
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Profile Header */}
      <div className="bg-white shadow-md p-6 mt-4 mx-4 rounded-lg flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
          {getInitials(student?.name || user?.name || "S")}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{student?.name || "Student Name"}</h2>
          <p className="text-gray-600">
            {student?.branch || "CSE"} • {student?.college || "NEC"} • Class of{" "}
            {student?.graduationYear || "2026"}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b mt-4 px-6">
        {[
          { key: "courses", label: "Available Courses" },
          { key: "myCourses", label: "My Courses" },
          { key: "skill", label: "Skill Progress" },
          { key: "jobs", label: "Jobs & Internships" },
          { key: "applications", label: "My Applications" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 px-2 font-medium ${
              activeTab === tab.key
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Available Courses */}
        {activeTab === "courses" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden relative"
              >
                {/* Ribbon */}
                <div className="absolute top-3 left-0 bg-yellow-400 text-black text-xs px-3 py-1 font-semibold rounded-r-lg shadow">
                  Placement Course with AI ✨
                </div>

                {/* Header */}
                <div className="bg-gradient-to-r from-purple-300 to-indigo-200 p-4 relative">
                  <h3 className="text-xl font-bold text-black-500">
                  
                  {course.courseName} 
                  </h3>
                  <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full shadow">
                    ⭐ {course.rating || 4.5}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <p className="text-gray-700 font-semibold">
                    {course.courseName} 
                  </p>
                  <p className="text-sm text-gray-600">
                    ⏳ {course.courseDuration || "6 months"} with LIVE sessions
                  </p>
                  <p className="text-sm text-gray-600">
                    📈 Highest salary:{" "}
                    <span className="font-semibold">
                      {course.highestSalary || "₹18 LPA"}
                    </span>
                  </p>

                  {/* Placement Partner Logos */}
                  <p className="text-sm text-gray-600">Placement partners:</p>
                  <div className="flex items-center gap-3 mt-1">
                    {course.placementPartners?.length ? (
                      course.placementPartners.map((partner, i) => (
                        <img
                          key={i}
                          src={partner.logo}
                          alt={partner.name}
                          className="h-6 object-contain"
                        />
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">Top Companies</span>
                    )}
                  </div>

                  <p className="text-sm mt-2">
                    <span className="font-semibold">Fee:</span> ₹
                    {course.courseFee || "N/A"}
                  </p>
                </div>

                {/* Footer */}
                <div className="border-t p-4 flex justify-between items-center bg-gray-50">
                  <span className="text-sm text-red-500 font-semibold">
                    Application closes today!
                  </span>
                  <div className="flex gap-2">
                    <button
                      className={`px-4 py-2 rounded text-white text-sm ${
                        isCourseEnrolled(course)
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                      disabled={isCourseEnrolled(course)}
                      onClick={async () => {
                        if (isCourseEnrolled(course)) return;
                        try {
                          const res = await API.post(
                            "/student/enroll",
                            { courseId: course.courseId },
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          if (res.data.success) {
                            alert("Enrolled successfully!");
                            setMyCourses((prev) => [...prev, course._id]);
                          }
                        } catch (err) {
                          console.error(err);
                          alert(
                            err.response?.data?.message || "Enrollment failed"
                          );
                        }
                      }}
                    >
                      {isCourseEnrolled(course) ? "Enrolled" : "Enroll"}
                    </button>

                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      onClick={() => navigate(`/course/${course._id}`)}
                    >
                      Know More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Courses */}
        {activeTab === "myCourses" && (
          <div>
            <h3 className="text-lg font-bold mb-4">My Enrolled Courses</h3>
            {myCourses.length === 0 ? (
              <p className="text-gray-500">No courses enrolled yet.</p>
            ) : (
              <ul className="space-y-2">
                {courses
                  .filter((c) => isCourseEnrolled(c))
                  .map((c) => (
                    <li
                      key={c._id}
                      className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
                    >
                      <span>{c.courseName}</span>
                      <button
                        onClick={() => navigate(`/course/${c._id}`)}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        )}

        {/* Skill Progress */}
        {activeTab === "skill" && (
          <div className="mt-10 max-w-lg mx-auto text-center bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-bold">Your Skill Verification Journey</h3>
            <p className="mt-2 text-gray-600">
              Enrolled in <span className="font-semibold">{enrolledCourses}</span>{" "}
              out of {totalCourses} available courses
            </p>

            {/* Progress Bar */}
            <div className="mt-4 w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-blue-600 h-4 text-xs text-white text-center transition-all"
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            </div>

            {enrolledCourses === 0 && (
              <p className="text-gray-500 mt-2">
                Enroll in a course to start your skill verification journey
              </p>
            )}

            {/* Per-course skill progress */}
            <div className="mt-6 space-y-4 text-left">
              {courses
                .filter((c) => isCourseEnrolled(c))
                .map((c) => (
                  <div key={c._id}>
                    <p className="font-medium">{c.courseName}</p>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full"
                        style={{ width: `${c.progress || 40}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">
                      {c.progress || 40}% verified
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Jobs */}
        {activeTab === "jobs" && (
          <div>
            <h3 className="text-lg font-bold mb-4">Available Jobs & Internships</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="p-4 bg-white shadow rounded-lg hover:shadow-lg"
                >
                  <h4 className="font-semibold">{job.title}</h4>
                  <p className="text-sm text-gray-600">{job.company}</p>
                  <p className="text-sm">📍 {job.location}</p>
                  <p className="text-sm">💰 {job.salary}</p>
                  <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applications */}
        {activeTab === "applications" && (
          <div>
            <h3 className="text-lg font-bold mb-4">My Applications</h3>
            {applications.length === 0 ? (
              <p className="text-gray-500">You haven’t applied yet.</p>
            ) : (
              <ul className="space-y-2">
                {applications.map((a) => (
                  <li
                    key={a._id}
                    className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
                  >
                    <span>{a.jobTitle}</span>
                    <span
                      className={`text-sm ${
                        a.status === "Accepted"
                          ? "text-green-600"
                          : a.status === "Rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {a.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Student;
