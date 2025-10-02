import { useState, useEffect } from "react";
import {
  GraduationCap,
  MapPin,
  DollarSign,
  Clock,
  Star,
  Briefcase,
  FileText,
  User,
  LogOut,
  Award,
  Plus,
  X,
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
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");

    if (!token || !userEmail) return navigate("/login");

    fetchStudentDetails(userEmail, token);
    fetchCourses();
    fetchJobs();
  }, []);

  // Fetch student by email
  const fetchStudentDetails = async (email, token) => {
    try {
      const res = await API.get(`/student/email/${encodeURIComponent(email)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStudent(res.data);
      fetchApplications(res.data._id);
    } catch (err) {
      console.error("Error fetching student:", err);
      alert(err.response?.data?.message || err.message || "Failed to fetch student");
      setLoading(false);
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
      alert(err.response?.data?.message || "Failed to fetch courses");
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
      alert(err.response?.data?.message || "Failed to fetch jobs");
      setJobs([]);
    }
  };

  // Fetch student applications
  const fetchApplications = async (studentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/applications/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
      alert(err.response?.data?.message || "Failed to fetch applications");
      setApplications([]);
    }
  };

  // Enroll in course
  const handleEnroll = async (courseId) => {
    try {
      if (!student?._id) throw new Error("Student not loaded");

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
          enrolledCourses: [...prev.enrolledCourses, courseId],
        }));
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      alert(err.response?.data?.message || err.message || "Enrollment failed");
    }
  };

  // Skill management
  const handleAddSkill = () => {
    if (!newSkillName.trim()) return alert("Please enter a skill name");
    if (student) {
      const updatedSkills = [...student.skills, { name: newSkillName.trim(), level: newSkillLevel }];
      setStudent({ ...student, skills: updatedSkills });
      setNewSkillName("");
      setNewSkillLevel("Basic");
    }
  };

  const handleRemoveSkill = (index) => {
    if (student) {
      const updatedSkills = student.skills.filter((_, i) => i !== index);
      setStudent({ ...student, skills: updatedSkills });
    }
  };

  const getSkillColor = (level) => {
    switch (level) {
      case "Basic": return "bg-red-100 text-red-700 border-red-300";
      case "Intermediate": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Advanced": return "bg-green-100 text-green-700 border-green-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const isCourseEnrolled = (course) =>
    student?.enrolledCourses?.includes(course._id);

  const enrolledCourses = student?.enrolledCourses?.length || 0;
  const totalCourses = courses.length;
  const progress = totalCourses ? Math.round((enrolledCourses / totalCourses) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <GraduationCap className="w-16 h-16 text-blue-600 animate-pulse" />
        <p className="text-gray-600 mt-2">Loading...</p>
      </div>
    );
  }

  if (!student) {
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
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-100 to-white px-4">
      <div className="bg-white w-full max-w-md shadow-2xl rounded-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500">
            Login as{" "}
            <span className="font-semibold capitalize">{form.role}</span>
          </p>
        </div>

        {/* Google Login */}
        <button className="w-full border flex items-center justify-center py-2 rounded-md mb-4 hover:bg-gray-50 transition font-medium">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Continue with Google
        </button>

        <div className="text-center text-gray-400 mb-4">OR</div>

        {/* Role Selection */}
        <div className="flex justify-around mb-6">
          {["student", "recruiter", "admin"].map((roleOption) => (
            <label key={roleOption} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value={roleOption}
                checked={form.role === roleOption}
                onChange={handleChange}
                className="accent-indigo-500"
              />
              {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
            </label>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />

          <div className="flex items-center justify-between text-sm text-gray-500">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-indigo-500" /> Remember me
            </label>
            <a href="#" className="hover:text-indigo-600">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-md font-semibold transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-3">{error}</p>}
        {success && <p className="text-green-600 text-center mt-3">{success}</p>}

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
