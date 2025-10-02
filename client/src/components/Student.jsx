// src/components/Student.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import {
  GraduationCap,
  Award,
  Plus,
  X,
  LogOut,
  Star,
  Clock,
  DollarSign,
  Briefcase,
  FileText,
} from "lucide-react";
import { getUserInitials } from "../utils/helpers";

function Student() {
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("courses");
  const [showDropdown, setShowDropdown] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("Basic");

  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return navigate("/login");

    fetchStudentByEmail(email);
    fetchCourses();
    fetchJobs();
  }, []);

  const fetchStudentByEmail = async (email) => {
    try {
      const res = await API.get(`/student/email/${encodeURIComponent(email)}`);
      const data = res.data;

      // Ensure enrolledCourses and skills arrays exist
      if (!data.enrolledCourses) data.enrolledCourses = [];
      if (!data.skills) data.skills = [];

      setStudent(data);
      fetchApplications(data._id);
    } catch (err) {
      console.error("Error fetching student:", err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
      setCourses([]);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      setJobs([]);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      setApplications([]);
    }
  };

  // Enroll course
  const handleEnroll = async (courseId) => {
    try {
      if (!student?._id) throw new Error("Student not loaded");

      const token = localStorage.getItem("token");
      const res = await API.post(
        "/student/enroll",
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("Enrolled successfully!");
        setStudent((prev) => ({
          ...prev,
          enrolledCourses: [...prev.enrolledCourses, courseId],
        }));
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      alert(err.response?.data?.message || err.message || "Enrollment failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isCourseEnrolled = (course) =>
    student?.enrolledCourses?.includes(course._id);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return alert("Enter skill name");
    const updatedSkills = [...student.skills, { name: newSkillName.trim(), level: newSkillLevel }];
    setStudent({ ...student, skills: updatedSkills });
    setNewSkillName("");
    setNewSkillLevel("Basic");
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = student.skills.filter((_, i) => i !== index);
    setStudent({ ...student, skills: updatedSkills });
  };

  const getSkillColor = (level) => {
    switch (level) {
      case "Basic": return "bg-red-100 text-red-700 border-red-300";
      case "Intermediate": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Advanced": return "bg-green-100 text-green-700 border-green-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!student) return <div>Failed to load student. <button onClick={() => navigate("/login")}>Login</button></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="flex justify-between items-center h-16 px-6">
          <img src="/logos.png" alt="Logo" className="h-16 w-auto" />
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm"
            >
              {getUserInitials()}
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-200 z-50">
                <div className="px-4 py-3 border-b">
                  <p className="font-semibold">{student.name}</p>
                  <p className="text-xs text-gray-500">{student.branch || "CSE"}</p>
                </div>
                <button onClick={() => { setActiveTab("skills"); setShowDropdown(false); }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Award className="w-4 h-4" /> My Skills
                </button>
                <button onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="flex gap-8 overflow-x-auto px-6">
          {["courses","myCourses","skills","jobs","applications"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 font-medium ${activeTab === tab ? "border-b-3 border-blue-600 text-blue-600" : "text-gray-600 border-b-3 border-transparent"}`}
            >
              {tab === "courses" ? "Available Courses" :
               tab === "myCourses" ? "My Courses" :
               tab === "skills" ? "My Skills" :
               tab === "jobs" ? "Jobs & Internships" :
               "My Applications"}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Available Courses */}
        {activeTab === "courses" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map(course => (
              <div key={course._id} className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4">
                  <h3 className="font-bold">{course.courseName}</h3>
                  <p>{course.courseDuration} course</p>
                </div>
                <div className="flex gap-2 p-4">
                  <button
                    disabled={isCourseEnrolled(course)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isCourseEnrolled(course) ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
                    onClick={() => handleEnroll(course._id)}
                  >
                    {isCourseEnrolled(course) ? "Enrolled" : "Enroll"}
                  </button>
                  <button
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
                    onClick={() => navigate(`/courseDetails/${course._id}`)}
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
          <div className="space-y-4">
            {courses.filter(c => isCourseEnrolled(c)).map(course => (
              <div key={course._id} className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center border border-gray-200">
                <div>
                  <h3 className="font-bold">{course.courseName}</h3>
                  <p>{course.courseDuration} course</p>
                </div>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => navigate(`/courseDetails/${course._id}`)}
                >
                  Know More
                </button>
              </div>
            ))}
            {student.enrolledCourses.length === 0 && <p>No courses enrolled yet.</p>}
          </div>
        )}

        {/* My Skills */}
        {activeTab === "skills" && (
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h2 className="font-bold text-xl mb-4">My Skills</h2>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="Skill name"
                value={newSkillName}
                onChange={e => setNewSkillName(e.target.value)}
                className="flex-1 border px-3 py-2 rounded-lg"
              />
              <select value={newSkillLevel} onChange={e => setNewSkillLevel(e.target.value)} className="border px-3 py-2 rounded-lg">
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <button onClick={handleAddSkill} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Add Skill</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {student.skills.map((skill, index) => (
                <div key={index} className={`p-4 rounded-lg border-2 flex justify-between items-center ${getSkillColor(skill.level)}`}>
                  <div>
                    <p className="font-semibold">{skill.name}</p>
                    <p className="text-sm">{skill.level}</p>
                  </div>
                  <button onClick={() => handleRemoveSkill(index)}><X /></button>
                </div>
              ))}
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
