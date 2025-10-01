import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  Briefcase,
  Settings,
  BarChart3,
  ShieldCheck,
  Menu,
  X,
  BookOpen,
} from "lucide-react";

const BASE_URL = "https://skillverify.onrender.com/api";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [settings, setSettings] = useState({
    platformName: "",
  });

  const [newCourse, setNewCourse] = useState({
    courseName: "",
    courseId: "",
    courseDuration: "",
    courseFee: 0,
    courseDescription: "",
    rating: 4.5,
    highestSalary: "",
    placementPartners: "",
  });

  // ----- AUTH HELPERS -----
  const getAuthToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.token || null;
    } catch {
      return null;
    }
  };

  const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // ----- FETCH DATA -----
  const fetchAdmin = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.email) return;
      setAdmin({
        _id: user._id || "unknown",
        name: user.name || "Admin",
        email: user.email,
      });
      setSettings({ platformName: user.platformName || "SkillVerify" });
    } catch {
      setAdmin({ _id: "default", name: "Admin", email: "admin@example.com" });
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/users`, {
        headers: getAuthHeaders(),
      });
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/jobs`, {
        headers: getAuthHeaders(),
      });
      setJobs(res.data || []);
    } catch (err) {
      console.error(err);
      setJobs([]);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/courses`, {
        headers: getAuthHeaders(),
      });
      setCourses(res.data || []);
    } catch (err) {
      console.error(err);
      setCourses([]);
    }
  };

  // ----- UPDATE SETTINGS -----
  const updateSettings = async (e) => {
    e.preventDefault();
    try {
      if (!admin?.email) return alert("Admin email missing!");
      const payload = {
        email: admin.email,
        platformName: settings.platformName,
        name: admin.name,
      };
      const res = await axios.post(`${BASE_URL}/admin/settings`, payload, {
        headers: getAuthHeaders(),
      });
      setAdmin(res.data.admin || admin);
      alert("Settings updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update settings");
    }
  };

  // ----- ADD NEW COURSE -----
  const addCourse = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newCourse,
        placementPartners: newCourse.placementPartners
          .split(",")
          .map((p) => p.trim()),
      };
      const res = await axios.post(`${BASE_URL}/admin/create-course`, payload, {
        headers: getAuthHeaders(),
      });
      setCourses((prev) => [...prev, res.data]);
      setNewCourse({
        courseName: "",
        courseId: "",
        courseDuration: "",
        courseFee: 0,
        courseDescription: "",
        rating: 4.5,
        highestSalary: "",
        placementPartners: "",
      });
      alert("Course added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add course");
    }
  };

  // ----- INITIAL LOAD -----
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchAdmin();
      await Promise.all([fetchUsers(), fetchJobs(), fetchCourses()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading admin dashboard...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-6">
          <div className="flex items-center">
            <ShieldCheck className="h-8 w-8 text-purple-600 mr-3" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              SkillVerify
            </h1>
          </div>
          {admin && (
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block text-sm text-gray-600">
                Welcome, {admin.name}
              </span>
              <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {admin.name?.charAt(0)?.toUpperCase() || "A"}
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
          <div className="hidden sm:flex space-x-8">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "users", label: "Users", icon: Users },
              { id: "jobs", label: "Jobs", icon: Briefcase },
              { id: "courses", label: "Courses", icon: BookOpen },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? "border-purple-600 text-purple-600"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow flex items-center">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Courses</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <div className="bg-white shadow rounded-lg p-4">
            {users.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No users found</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users.map((user) => (
                  <div key={user._id} className="border rounded-lg p-4 flex flex-col">
                    <h4 className="font-semibold text-gray-900">{user.name}</h4>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      Role: {user.role}, College: {user.college || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Jobs */}
        {activeTab === "jobs" && (
          <div className="bg-white shadow rounded-lg p-4">
            {jobs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No jobs available</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <div key={job._id} className="border rounded-lg p-4 flex flex-col">
                    <h4 className="font-semibold text-gray-900">{job.title}</h4>
                    <p className="text-gray-600">{job.description}</p>
                    <p className="text-sm text-gray-500">Posted by: {job.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Courses */}
        {activeTab === "courses" && (
          <div className="bg-white shadow rounded-lg p-4 space-y-6">
            <form onSubmit={addCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Course Name" value={newCourse.courseName} onChange={(e) => setNewCourse({ ...newCourse, courseName: e.target.value })} className="border px-3 py-2 rounded-md" required />
              <input type="text" placeholder="Course ID" value={newCourse.courseId} onChange={(e) => setNewCourse({ ...newCourse, courseId: e.target.value })} className="border px-3 py-2 rounded-md" required />
              <input type="text" placeholder="Duration" value={newCourse.courseDuration} onChange={(e) => setNewCourse({ ...newCourse, courseDuration: e.target.value })} className="border px-3 py-2 rounded-md" required />
              <input type="number" placeholder="Fee" value={newCourse.courseFee} onChange={(e) => setNewCourse({ ...newCourse, courseFee: e.target.value })} className="border px-3 py-2 rounded-md" required />
              <input type="text" placeholder="Description" value={newCourse.courseDescription} onChange={(e) => setNewCourse({ ...newCourse, courseDescription: e.target.value })} className="border px-3 py-2 rounded-md" />
              <input type="number" placeholder="Rating" step="0.1" min="0" max="5" value={newCourse.rating} onChange={(e) => setNewCourse({ ...newCourse, rating: parseFloat(e.target.value) })} className="border px-3 py-2 rounded-md" />
              <input type="text" placeholder="Highest Salary" value={newCourse.highestSalary} onChange={(e) => setNewCourse({ ...newCourse, highestSalary: e.target.value })} className="border px-3 py-2 rounded-md" />
              <input type="text" placeholder="Placement Partners (comma-separated)" value={newCourse.placementPartners} onChange={(e) => setNewCourse({ ...newCourse, placementPartners: e.target.value })} className="border px-3 py-2 rounded-md" />
              <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-md">Add Course</button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <div key={course._id} className="border rounded-lg p-4 flex flex-col">
                  <h4 className="font-semibold text-gray-900">{course.courseName}</h4>
                  <p className="text-gray-600">{course.courseDescription}</p>
                  <p className="text-sm text-gray-500">
                    ID: {course.courseId}, Duration: {course.courseDuration}, Fee: ₹{course.courseFee}
                  </p>
                  <p className="text-sm text-gray-500">
                    Rating: {course.rating}★, Highest Salary: {course.highestSalary}
                  </p>
                  <p className="text-sm text-gray-500">
                    Placement Partners: {course.placementPartners.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div className="bg-white shadow rounded-lg p-4">
            <form onSubmit={updateSettings} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Platform Name</label>
                <input type="text" value={settings.platformName} onChange={(e) => setSettings({ ...settings, platformName: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md w-full sm:w-auto">Save Settings</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
