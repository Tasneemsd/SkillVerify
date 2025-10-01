import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { getAuthToken } from "../api";
import logo2 from "../images/logo2.png";

export default function Student() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("available");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const fetchStudentDetails = async () => {
    try {
      const token = getAuthToken();
      const res = await API.get("/student/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudent(res.data);
    } catch (err) {
      console.error("Error fetching student:", err);
    }
  };

  const getUserInitials = () => {
    const name = student?.name || "User";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={logo2} alt="Logo" className="h-8" />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm hover:bg-blue-700 transition"
              >
                {getUserInitials()}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border">
                  <button
                    onClick={() => navigate("/profile")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => navigate("/my-courses")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Courses
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 🔵 Hero Section (Internshala style) */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md p-8 mt-4 mx-4 rounded-lg flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
        {/* Left - Student Info */}
        <div className="z-10">
          <h2 className="text-3xl font-bold">{student?.name || "Student Name"}</h2>
          <p className="mt-2 text-lg font-medium">
            {student?.branch || "CSE"} • {student?.college || "Your College"}
          </p>
          <p className="text-sm mt-1 opacity-90">
            Class of {student?.graduationYear || "2026"}
          </p>
        </div>

        {/* Right - Illustration */}
        <div className="hidden md:block">
          <img
            src="https://internshala.com/static/images/pgc/hero-image.png"
            alt="Student Banner Illustration"
            className="h-44 object-contain animate-bounce"
          />
        </div>

        {/* Decorative Overlay */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/10 rounded-l-full"></div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex gap-4 border-b pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("available")}
            className={`pb-2 px-2 font-medium ${
              activeTab === "available"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Available Courses
          </button>
          <button
            onClick={() => setActiveTab("mycourses")}
            className={`pb-2 px-2 font-medium ${
              activeTab === "mycourses"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            My Courses
          </button>
          <button
            onClick={() => setActiveTab("progress")}
            className={`pb-2 px-2 font-medium ${
              activeTab === "progress"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Skill Progress
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`pb-2 px-2 font-medium ${
              activeTab === "jobs"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Jobs & Internships
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`pb-2 px-2 font-medium ${
              activeTab === "applications"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            My Applications
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b mt-4 px-6 overflow-x-auto">
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
            className={`pb-2 px-2 font-medium ${activeTab === tab.key
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="p-6">
        {/* Courses */}
        {activeTab === "courses" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden relative"
              >
                <div className="absolute top-3 left-0 bg-yellow-400 text-black text-xs px-3 py-1 font-semibold rounded-r-lg shadow">
                  Placement Course with AI ✨
                </div>

                <div className="bg-gradient-to-r from-purple-300 to-indigo-200 p-4 relative">
                  <h3 className="text-xl font-bold text-black-700">{course.courseName}</h3>
                  <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full shadow">
                    ⭐ {course.rating || 4.5}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <p className="text-gray-700 font-semibold">{course.courseName}</p>
                  <p className="text-sm text-gray-600">
                    ⏳ {course.courseDuration || "6 months"} with LIVE sessions
                  </p>
                  <p className="text-sm text-gray-600">
                    📈 Highest salary:{" "}
                    <span className="font-semibold">{course.highestSalary || "₹18 LPA"}</span>
                  </p>

                  <p className="text-sm text-gray-600">Placement partners:</p>
                  <div className="flex items-center gap-3 mt-1">
                    {course.placementPartners?.length ? (
                      course.placementPartners.map((partner, i) => (
                        <img key={i} src={partner.logo} alt={partner.name} className="h-6 object-contain" />
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">Top Companies</span>
                    )}
                  </div>

                  <p className="text-sm mt-2">
                    <span className="font-semibold">Fee:</span> ₹{course.courseFee || "N/A"}
                  </p>
                </div>

                <div className="border-t p-4 flex justify-between items-center bg-gray-50">
                  <span className="text-sm text-red-500 font-semibold">
                    Application closes today!
                  </span>
                  <div className="flex gap-2">
                    <button
                      className={`px-4 py-2 rounded text-white text-sm ${isCourseEnrolled(course)
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                        }`}
                      disabled={isCourseEnrolled(course)}
                      onClick={async () => {
                        if (isCourseEnrolled(course)) return;
                        try {
                          const res = await API.post("/student/enroll", { courseId: course._id });
                          if (res.data.success) {
                            alert("Enrolled successfully!");
                            setMyCourses((prev) => [...prev, course._id.toString()]);
                          }
                        } catch (err) {
                          console.error("Enrollment error:", err);
                          alert(err.response?.data?.message || "Enrollment failed");
                        }
                      }}
                    >
                      {isCourseEnrolled(course) ? "Enrolled" : "Enroll"}
                    </button>

                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      onClick={() => navigate(`/course/${c._id}`)} // ✅ changed /course to /courses
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
              Enrolled in <span className="font-semibold">{enrolledCourses}</span> out of {totalCourses} available courses
            </p>

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
                    <span className="text-xs text-gray-600">{c.progress || 40}% verified</span>
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
                  <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">Apply</button>
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
                      className={`text-sm ${a.status === "Accepted"
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

