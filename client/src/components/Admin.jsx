import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "..api/baseUrl";


const API = axios.create({ baseURL: BASE_URL });

const Admin = () => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState({});
  const [settings, setSettings] = useState({});
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [applications, setApplications] = useState([]);
  const [mockInterviews, setMockInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Utility ---
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const normalizeUsers = (arr) => {
    return arr.map((u) => ({
      ...u,
      role: u.role || "student",
      email: u.email || "unknown",
    }));
  };

  // --- Fetch Admin ---
  const fetchAdmin = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setAdmin({
        _id: user._id || "unknown",
        name: user.name || "Admin",
        email: user.email || "admin@example.com",
      });
      setSettings({ platformName: user.platformName || "SkillVerify" });
    } catch (err) {
      console.error("Error loading admin:", err);
      setAdmin({ _id: "default", name: "Admin", email: "admin@example.com" });
      setSettings({ platformName: "SkillVerify" });
    }
  };

  // --- Fetch Users ---
  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users", { headers: getAuthHeaders() });
      const data = res.data;
      const arr = Array.isArray(data) ? data : data.users || data.data || [];
      setUsers(normalizeUsers(arr));
    } catch (err) {
      console.error("Error fetching users:", err);
      alert(err.response?.data?.message || err.message || "Failed to fetch users");
      setUsers([]);
    }
  };

  // --- Fetch Jobs ---
  const fetchJobs = async () => {
    try {
      const res = await API.get("/admin/jobs", { headers: getAuthHeaders() });
      const data = res.data;
      const arr = Array.isArray(data) ? data : data.jobs || data.data || [];
      setJobs(arr || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      alert(err.response?.data?.message || err.message || "Failed to fetch jobs");
      setJobs([]);
    }
  };

  // --- Fetch Courses ---
  const fetchCourses = async () => {
    try {
      const res = await API.get("/admin/courses-with-registrations", {
        headers: getAuthHeaders(),
      });
      const data = res.data;
      const arr = Array.isArray(data) ? data : data.courses || data.data || [];
      setCourses(arr || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      alert(err.response?.data?.message || err.message || "Failed to fetch courses");
      setCourses([]);
    }
  };

  // --- Fetch Applications ---
  const fetchApplications = async () => {
    try {
      const res = await API.get("/admin/applications", {
        headers: getAuthHeaders(),
      });
      const data = res.data;
      const arr = Array.isArray(data)
        ? data
        : data.applications || data.data || [];
      setApplications(arr || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
      alert(err.response?.data?.message || err.message || "Failed to fetch applications");
      setApplications([]);
    }
  };

  // --- Fetch Mock Interviews ---
  const fetchMockInterviews = async () => {
    try {
      const res = await API.get("/admin/mock-interviews", {
        headers: getAuthHeaders(),
      });
      const data = res.data;
      const arr = Array.isArray(data)
        ? data
        : data.mockInterviews || data.data || [];
      setMockInterviews(arr || []);
    } catch (err) {
      console.error("Error fetching mock interviews:", err);
      alert(err.response?.data?.message || err.message || "Failed to fetch mock interviews");
      setMockInterviews([]);
    }
  };

  // --- Load All Data ---
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchAdmin();
        await Promise.all([
          fetchUsers(),
          fetchJobs(),
          fetchCourses(),
          fetchApplications(),
          fetchMockInterviews(),
        ]);
      } catch (err) {
        console.error("Error loading admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // --- Logout ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // --- UI ---
  if (loading) {
    return <div className="admin-loading">Loading Admin Dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>{settings.platformName || "SkillVerify"} Admin Dashboard</h1>
        <div className="admin-info">
          <span>{admin.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="admin-content">
        <section>
          <h2>Users</h2>
          <p>Total: {users.length}</p>
        </section>

        <section>
          <h2>Jobs</h2>
          <p>Total: {jobs.length}</p>
        </section>

        <section>
          <h2>Courses</h2>
          <p>Total: {courses.length}</p>
        </section>

        <section>
          <h2>Applications</h2>
          <p>Total: {applications.length}</p>
        </section>

        <section>
          <h2>Mock Interviews</h2>
          <p>Total: {mockInterviews.length}</p>
        </section>
      </div>
    </div>
  );
};

export default Admin;
