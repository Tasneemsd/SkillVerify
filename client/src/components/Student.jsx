import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import logo2 from "../images/logo2.jpg";

// Temporary course + skill icons (replace with your own images if needed)
const defaultCourseImg =
  "https://cdn-icons-png.flaticon.com/512/906/906343.png"; // books icon
const defaultSkillImg =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; // skill person

const Student = () => {
  const [courses, setCourses] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("courses");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [myCourses, setMyCourses] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [skillLevel, setSkillLevel] = useState("Basic");

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const getInitials = (name = "") =>
    name ? name.split(" ").map((n) => n[0].toUpperCase()).join("") : "S";

  // Fetch student details
  useEffect(() => {
    if (!user?.email) return;
    API.get(`/student?email=${encodeURIComponent(user.email)}`)
      .then((res) => {
        setStudent(res.data);
        if (res.data.registeredCourses) {
          setMyCourses(res.data.registeredCourses.map((c) => c._id?.toString()));
        }
      })
      .catch((err) => {
        console.error("Fetch student error:", err);
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      });
  }, [user?.email, navigate]);

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
    API.get("/applications")
      .then((res) => setApplications(res.data))
      .catch((err) => {
        console.error("Applications fetch error:", err);
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      });
  }, [student?._id, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isCourseEnrolled = (course) => myCourses.includes(course._id?.toString());

  // Skill colors by level
  const levelColors = {
    Basic: "bg-red-100 text-red-700",
    Intermediate: "bg-yellow-100 text-yellow-700",
    Advanced: "bg-green-100 text-green-700",
  };

  // Add skill
  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    try {
      const res = await API.post("/student/skill", {
        studentId: student._id,
        skill: { name: newSkill, level: skillLevel },
      });
      setStudent(res.data); // updated student with skills
      setNewSkill("");
      setSkillLevel("Basic");
    } catch (err) {
      console.error("Add skill error:", err);
      alert("Failed to add skill");
    }
  };

  // Remove skill
  const handleRemoveSkill = async (skillName) => {
    try {
      const res = await API.delete(
        `/student/skill/${student._id}/${encodeURIComponent(skillName)}`
      );
      setStudent(res.data);
    } catch (err) {
      console.error("Remove skill error:", err);
      alert("Failed to remove skill");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center relative">
        <img
          src={logo2}
          alt="SkillVerify Logo"
          className="h-10 w-auto object-contain rounded-full"
        />
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">
            Welcome, {student?.name || user?.name || "Student"}
          </span>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md"
            >
              {getInitials(student?.name || user?.name)}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => setActiveTab("skill")}
                >
                  My Skills
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

      {/* 🔵 Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md p-8 mt-4 mx-4 rounded-lg flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
        {/* Left - Student Info */}
        <div className="z-10">
          <h2 className="text-3xl font-bold">
            {student?.name || "Student Name"}
          </h2>
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
            alt="Student Banner"
            className="h-40 object-contain"
          />
        </div>

        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/10 rounded-l-full"></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b mt-4 px-6 overflow-x-auto">
        {[
          { key: "courses", label: "Available Courses" },
          { key: "myCourses", label: "My Courses" },
          { key: "skill", label: "My Skills" },
          { key: "jobs", label: "Jobs & Internships" },
          { key: "applications", label: "My Applications" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 px-2 font-medium ${
              activeTab === tab.key
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
                className="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden"
              >
                <img
                  src={course.image || defaultCourseImg}
                  alt={course.courseName}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4 space-y-2">
                  <h3 className="text-xl font-bold">{course.courseName}</h3>
                  <p className="text-sm text-gray-600">
                    ⏳ {course.courseDuration || "6 months"} with LIVE sessions
                  </p>
                  <p className="text-sm text-gray-600">
                    📈 Highest salary:{" "}
                    <span className="font-semibold">
                      {course.highestSalary || "₹18 LPA"}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Fee:</span> ₹
                    {course.courseFee || "N/A"}
                  </p>
                </div>
                <div className="border-t p-4 flex justify-between items-center bg-gray-50">
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
                        const res = await API.post("/student/enroll", {
                          courseId: course._id,
                        });
                        if (res.data.success) {
                          alert("Enrolled successfully!");
                          setMyCourses((prev) => [
                            ...prev,
                            course._id.toString(),
                          ]);
                        }
                      } catch (err) {
                        console.error("Enrollment error:", err);
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

        {/* Skills */}
        {activeTab === "skill" && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">My Skills</h3>

            {/* Add Skill */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Enter skill"
                className="flex-1 border rounded px-3 py-2"
              />
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option>Basic</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>

            {/* Skill List */}
            <div className="flex flex-wrap gap-3">
              {student?.skills?.length ? (
                student.skills.map((s, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-sm ${levelColors[s.level]}`}
                  >
                    <img
                      src={defaultSkillImg}
                      alt="skill"
                      className="h-5 w-5"
                    />
                    <span>
                      {s.name} ({s.level})
                    </span>
                    <button
                      onClick={() => handleRemoveSkill(s.name)}
                      className="ml-2 text-xs text-gray-600 hover:text-black"
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No skills added yet.</p>
              )}
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
