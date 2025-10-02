// src/components/Student.jsx
import { useState, useEffect } from "react";
import {
  GraduationCap,
  MapPin,
  DollarSign,
  FileText,
  Award,
  Plus,
  Star,
  X,
  LogOut,
  Clock,       // ✅ Added
  Briefcase,   // ✅ Added
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { getUserInitials } from "../utils/helpers";

function Student() {
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("courses");
  const [showDropdown, setShowDropdown] = useState(false);
  const [courses, setCourses] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("Basic");

  const navigate = useNavigate();

  // Load initial data
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return navigate("/login");

    fetchStudentByEmail(email);
    fetchCourses();
    fetchJobs();
  }, []);

  // Fetch student
  const fetchStudentByEmail = async (email) => {
    try {
      const res = await API.get(`/student/email/${encodeURIComponent(email)}`);
      const studentData = res.data;

      studentData.enrolledCourses = studentData.enrolledCourses || [];
      studentData.skills = studentData.skills || [];

      setStudent(studentData);
      fetchApplications();
    } catch (err) {
      console.error("Error fetching student:", err);
      alert(err.response?.data?.message || err.message || "Failed to fetch student");
      setStudent(null);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCourses([]);
    }
  };

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
    }
  };

  // Fetch applications
  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setApplications([]);
    }
  };

  // Enroll
  const handleEnroll = async (courseId) => {
    try {
      if (!student?._id) throw new Error("Student not loaded");
      if (student?.enrolledCourses?.includes(courseId)) return;

      const token = localStorage.getItem("token");
      const res = await API.post(
        `/student/enroll`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("Enrolled successfully!");
        setStudent((prev) => ({
          ...prev,
          enrolledCourses: [...(prev.enrolledCourses || []), courseId],
        }));
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      alert(err.response?.data?.message || err.message || "Enrollment failed");
    }
  };

  // Skills
  const handleAddSkill = () => {
    if (!newSkillName.trim()) return alert("Please enter a skill name");
    const updatedSkills = [
      ...(student.skills || []),
      { name: newSkillName.trim(), level: newSkillLevel },
    ];
    setStudent({ ...student, skills: updatedSkills });
    setNewSkillName("");
    setNewSkillLevel("Basic");
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = (student.skills || []).filter((_, i) => i !== index);
    setStudent({ ...student, skills: updatedSkills });
  };

  const getSkillColor = (level) => {
    switch (level) {
      case "Basic":
        return "bg-red-100 text-red-700 border-red-300";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Advanced":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isCourseEnrolled = (course) =>
    student?.enrolledCourses?.includes(course._id);

  const enrolledCourses = student?.enrolledCourses?.length || 0;
  const totalCourses = courses.length;
  const progress = totalCourses ? Math.round((enrolledCourses / totalCourses) * 100) : 0;

  // Loading
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <GraduationCap className="w-16 h-16 text-blue-600 animate-pulse" />
        <p className="text-gray-600 mt-2">Loading...</p>
      </div>
    );

  if (!student)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-red-600 text-lg mb-4">Failed to load student profile.</p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <img src="/logos.png" alt="Logo" className="h-20 md:h-24 w-auto object-contain" />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm hover:bg-blue-700 transition-all duration-200"
              >
                {getUserInitials()}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b">
                    <p className="font-semibold text-gray-800">{student?.name || "Student"}</p>
                    <p className="text-xs text-gray-500">{student?.branch || "CSE"}</p>
                  </div>
                  <button
                    onClick={() => { setActiveTab("skills"); setShowDropdown(false); }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Award className="w-4 h-4" /> My Skills
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="z-10 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Welcome, {student?.name ? student.name.split(" ")[0] : "Student"}!
              </h1>
              <p className="text-xl md:text-2xl font-medium mb-3">Ready to kickstart your career?</p>
              <p className="text-lg opacity-95 mb-6">
                Explore courses, enhance your skills, and land your dream job.
              </p>
              <button
                onClick={() => setActiveTab("courses")}
                className="bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-lg hover:bg-yellow-500 transition-all duration-200 shadow-lg"
              >
                Explore Courses
              </button>
            </div>
            <div className="hidden md:block mt-6 md:mt-0">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
                <div className="w-64 h-64 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <FileText className="w-32 h-32 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b-slate-50 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto">
            {[
              { key: "courses", label: "Available Courses" },
              { key: "myCourses", label: "My Courses" },
              { key: "skills", label: "My Skills" },
              { key: "jobs", label: "Jobs & Internships" },
              { key: "applications", label: "My Applications" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-2 font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.key
                    ? "border-b-3 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-blue-600 border-b-3 border-transparent"
                }`}
                style={{ borderBottomWidth: "3px" }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>


      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Available Courses */}
        {activeTab === "courses" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Placement Guarantee Courses we offer
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
                >
                  <div className="relative">
                    <div className="absolute top-3 left-0 bg-yellow-400 text-gray-900 text-xs px-3 py-1 font-bold rounded-r-lg shadow z-10">
                      New
                    </div>
                    <div className="bg-gradient-to-br from-purple-200 via-blue-200 to-indigo-200 p-6 pt-12 relative h-40 flex items-center justify-center">
                      <div className="text-center">
                        <GraduationCap className="w-16 h-16 text-blue-600 mx-auto mb-2" />
                      </div>
                      <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" />
                        {course.rating}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-2 min-h-[3.5rem]">
                      {course.courseName}
                    </h3>

                    <div className="text-xs text-gray-600 bg-green-50 px-2 py-1 rounded inline-block">
                      with guaranteed job
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{course.courseDuration} course</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span>Get confirmed {course.highestSalary} salary</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span>1.08 Lac+ jobs/internships posted on Internshala</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-red-600 font-semibold">
                        Application closes today!
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isCourseEnrolled(course)
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        disabled={isCourseEnrolled(course)}
                        onClick={() => handleEnroll(course._id)}
                      >
                        {isCourseEnrolled(course) ? "Enrolled" : "Enroll"}
                      </button>
                      <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold transition-all duration-200 onClick={() => navigate(`/courses/${course._id}`)}>">
                       Know More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Courses */}
        {activeTab === "myCourses" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              My Enrolled Courses
            </h2>
            {enrolledCourses === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow">
                <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No courses enrolled yet.</p>
                <button
                  onClick={() => setActiveTab("courses")}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {courses
                  .filter((c) => isCourseEnrolled(c))
                  .map((course) => (
                    <div
                      key={course._id}
                      className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-all duration-200 border border-gray-200 flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {course.courseName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{course.courseDuration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span>{course.rating}</span>
                          </div>
                        </div>
                      </div>
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-all duration-200">
                        View
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* My Skills */}
        {activeTab === "skills" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-lg rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">My Skills</h2>
              </div>

              {/* Add Skill Section */}
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Skill</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Enter skill name (e.g., React, Python)"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <button
                    onClick={handleAddSkill}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-all duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Skill
                  </button>
                </div>
              </div>

              {/* Skills List */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Skills</h3>
                {!student?.skills || student.skills.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>No skills added yet. Add your first skill above!</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {student.skills.map((skill, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 flex justify-between items-center ${getSkillColor(
                          skill.level
                        )}`}
                      >
                        <div>
                          <p className="font-semibold text-lg">{skill.name}</p>
                          <p className="text-sm opacity-80">{skill.level}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveSkill(index)}
                          className="p-2 hover:bg-white/50 rounded-full transition-all duration-200"
                          title="Remove skill"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Skill Level Legend */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-gray-800 mb-2">Skill Level Guide:</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Basic - Learning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>Intermediate - Proficient</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Advanced - Expert</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Jobs & Internships */}
        {activeTab === "jobs" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Don’t just learn. Get an Internship + Stipend guaranteed. If we fail, we pay you back.
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-all duration-200 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800 flex-1">
                      {job.title}
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                      {job.type}
                    </span>
                  </div>

                  <p className="text-gray-700 font-semibold mb-3">{job.company}</p>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-green-600">{job.salary}</span>
                    </div>
                  </div>

                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-all duration-200">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Applications */}
        {activeTab === "applications" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              My Applications
            </h2>
            {applications.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">You haven't applied yet.</p>
                <button
                  onClick={() => setActiveTab("jobs")}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Browse Jobs
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app._id}
                    className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-all duration-200 border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {app.jobTitle}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Applied on {new Date(app.appliedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${app.status === "Accepted"
                          ? "bg-green-100 text-green-700"
                          : app.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Student;
