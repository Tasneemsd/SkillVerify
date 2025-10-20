import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  MapPin,
  GraduationCap,
  Award,
  Download,
  Star,
  Briefcase,
  Mail,
  Phone,
  ExternalLink,
  Filter,
  Users,
  Calendar,
  X,
  LogOut,
  TrendingUp,
  Building2,
  Code
} from "lucide-react";

function Recruiter() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    skills: "",
    college: "",
    branch: "",
    yearOfGraduation: "",
    minScore: "",
    maxScore: "",
    location: "",
    badges: "",
  });

  const BASE_URL = "https://skillverify.onrender.com/api";

  const extractArray = (data, possibleKeys = []) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    const common = ["students", "users", "data", "items", ...possibleKeys];
    for (const k of common) {
      if (Array.isArray(data[k])) return data[k];
    }
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.data)) return data.data.data;
    return [];
  };

  const normalizeUsers = (arr = []) =>
    arr.map((u) => ({
      _id: u._id || u.id || u._id?.toString?.() || "",
      name:
        u.name ||
        `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
        u.fullName ||
        "",
      email: u.email || u.username || "",
      role: u.role || u.type || "student",
      verified: u.isVerified ?? u.verified ?? false,
      mockResult: u.mockResult || u.result || u.mock_status || "—",
      status: u.status || "Pending",
      ...u,
    }));

  const getAuthToken = () => {
    try {
      const rawToken = localStorage.getItem("token");
      if (rawToken) return rawToken;
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user?.token || null;
    } catch {
      return null;
    }
  };

  const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const [candidates, setCandidates] = useState([]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/recruiter/students`, {
        headers: getAuthHeaders(),
      });
      const arr = extractArray(res.data, ["students", "users"]);
      const normalized = normalizeUsers(arr);
      setStudents(normalized);
      setFilteredStudents(normalized);
      setCandidates(normalized);
    } catch (err) {
      console.error("fetchStudents error:", err?.response || err);
      setStudents([]);
      setFilteredStudents([]);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [students, filters, activeTab]);

  const toggleShortlist = async (studentId, currentStatus) => {
    try {
      await fetch(`/api/students/${studentId}/shortlist`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shortlisted: !currentStatus }),
      });
      setStudents((prev) =>
        prev.map((s) =>
          (s._id || s.id) === studentId ? { ...s, shortlisted: !currentStatus } : s
        )
      );
    } catch (err) {
      console.error("toggleShortlist error:", err);
    }
  };

  const toggleInterview = async (studentId, currentStatus) => {
    try {
      await fetch(`/students/${studentId}/interview`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interview_scheduled: !currentStatus }),
      });
      setStudents((prev) =>
        prev.map((s) =>
          (s._id || s.id) === studentId
            ? { ...s, interview_scheduled: !currentStatus }
            : s
        )
      );
    } catch (err) {
      console.error("toggleInterview error:", err);
    }
  };

  const updateNotes = async (studentId, notes) => {
    try {
      await fetch(`/students/${studentId}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recruiter_notes: notes }),
      });
      setStudents((prev) =>
        prev.map((s) =>
          (s._id || s.id) === studentId ? { ...s, recruiter_notes: notes } : s
        )
      );
    } catch (err) {
      console.error("updateNotes error:", err);
    }
  };

  const applyFilters = () => {
    let filtered = [...students];

    if (activeTab === "shortlisted") {
      filtered = filtered.filter((s) => s.shortlisted);
    } else if (activeTab === "interview") {
      filtered = filtered.filter((s) => s.interview_scheduled);
    }

    if (filters.skills) {
      const skillsArray = filters.skills.toLowerCase().split(",").map((s) => s.trim());
      filtered = filtered.filter((student) =>
        (student.verified_skills || []).some((sk) =>
          skillsArray.some((needle) => sk.toLowerCase().includes(needle))
        )
      );
    }

    if (filters.college) {
      filtered = filtered.filter(
        (student) =>
          (student.college || "").toLowerCase().includes(filters.college.toLowerCase())
      );
    }

    if (filters.branch) {
      filtered = filtered.filter(
        (student) =>
          (student.branch || "").toLowerCase().includes(filters.branch.toLowerCase())
      );
    }

    if (filters.yearOfGraduation) {
      filtered = filtered.filter(
        (student) => Number(student.year_of_graduation) === Number(filters.yearOfGraduation)
      );
    }

    if (filters.minScore) {
      filtered = filtered.filter(
        (student) => Number(student.mock_interview_score) >= Number(filters.minScore)
      );
    }

    if (filters.maxScore) {
      filtered = filtered.filter(
        (student) => Number(student.mock_interview_score) <= Number(filters.maxScore)
      );
    }

    if (filters.location) {
      filtered = filtered.filter((student) =>
        (student.location || "").toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.badges) {
      const badgesArray = filters.badges.toLowerCase().split(",").map((b) => b.trim());
      filtered = filtered.filter((student) =>
        (student.badges || []).some((b) =>
          badgesArray.some((needle) => b.toLowerCase().includes(needle))
        )
      );
    }

    setFilteredStudents(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const [showDropdown, setShowDropdown] = useState(false);
  const recruiter = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const getUserInitials = (name) => {
    if (!name) return "R";
    const names = name.split(" ");
    const initials = names.map((n) => n.charAt(0).toUpperCase()).join("");
    return initials.slice(0, 2);
  };

  const clearFilters = () => {
    setFilters({
      skills: "",
      college: "",
      branch: "",
      yearOfGraduation: "",
      minScore: "",
      maxScore: "",
      location: "",
      badges: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-2 sm:px-4 lg:px-8">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-2 sm:px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <img src="/logos.png" alt="Logo" className="h-10 sm:h-12" />
          </Link>
          <div className="relative flex items-center gap-3">
            <div className="hidden sm:block">
              <p className="text-gray-700 font-medium">
                Welcome, <span className="font-bold">{recruiter?.name || "Student"}</span>
              </p>
            </div>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm hover:bg-blue-700 transition-all duration-200"
            >
              {getUserInitials(recruiter?.name)}
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                <div className="px-4 py-3 border-b">
                  <p className="font-semibold text-gray-800">{recruiter?.name || "Recruiter"}</p>
                  <p className="text-sm text-gray-500">{recruiter?.email}</p>
                </div>
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
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Recruiter Portal</h1>
              <p className="text-base sm:text-lg text-blue-100 mb-2">
                Discover verified, talented students ready for internships and jobs
              </p>
              <p className="text-sm sm:text-base text-blue-200">
                Filter, shortlist, and schedule interviews easily
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <Users className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 text-blue-300 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-2">
          <input
            type="text"
            placeholder="Skills"
            value={filters.skills}
            onChange={(e) => handleFilterChange("skills", e.target.value)}
            className="w-full sm:w-48 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <input
            type="text"
            placeholder="College"
            value={filters.college}
            onChange={(e) => handleFilterChange("college", e.target.value)}
            className="w-full sm:w-48 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <input
            type="text"
            placeholder="Branch"
            value={filters.branch}
            onChange={(e) => handleFilterChange("branch", e.target.value)}
            className="w-full sm:w-48 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <button
            onClick={clearFilters}
            className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Student Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {loading ? (
          <p className="text-center col-span-full text-gray-500">Loading students...</p>
        ) : filteredStudents.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">No students found.</p>
        ) : (
          filteredStudents.map((student) => (
            <div
              key={student._id}
              className="bg-white rounded-lg shadow p-4 sm:p-6 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-800 truncate">{student.name}</p>
                {student.verified && (
                  <span className="text-green-600 text-xs font-medium">Verified</span>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">{student.email}</p>
              <p className="text-sm text-gray-600">Skills: {(student.verified_skills || []).join(", ")}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <button
                  onClick={() => toggleShortlist(student._id, student.shortlisted)}
                  className={`px-3 py-1 rounded text-white text-xs ${
                    student.shortlisted ? "bg-green-600" : "bg-gray-400"
                  }`}
                >
                  Shortlist
                </button>
                <button
                  onClick={() => toggleInterview(student._id, student.interview_scheduled)}
                  className={`px-3 py-1 rounded text-white text-xs ${
                    student.interview_scheduled ? "bg-blue-600" : "bg-gray-400"
                  }`}
                >
                  Interview
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="h-16"></div>
    </div>
  );
}

export default Recruiter;
