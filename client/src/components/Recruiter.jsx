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
  CheckCircle2,
  FileText,
  Code,
  Building2,
  TrendingUp,
  Target,
  X,
  LogOut
} from "lucide-react";

/**
 * Full single-file Recruiter.jsx
 * - Preserves your UI, state shape, and API interactions.
 * - Fixes runtime issues: axios import, missing fetchStudents, setUsers -> setStudents,
 *   consistent use of student._id, added useNavigate and LogOut import.
 *
 * Notes:
 * - I intentionally minimized logic changes. I only fixed things that would cause runtime errors.
 * - If you want any endpoint changed to a specific route, tell me and I'll adapt it.
 */

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

  // Utilities
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

  // Auth helpers
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

  // Fetch students (main list used in UI)
  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Try recruiter-specific endpoint first (keeps parity with your earlier code)
      const res = await axios.get(`${BASE_URL}/recruiter/students`, {
        headers: getAuthHeaders(),
      });
      const arr = extractArray(res.data, ["students", "users"]);
      const normalized = normalizeUsers(arr);
      setStudents(normalized);
      setFilteredStudents(normalized);
      // also set candidates for any older logic that uses it
      setCandidates(normalized);
    } catch (err) {
      console.error("fetchStudents error:", err?.response || err);
      // fallback: try admin/students or public endpoint if needed
      try {
        const alt = await axios.get(`${BASE_URL}/admin/students`, {
          headers: getAuthHeaders(),
        });
        const arr2 = extractArray(alt.data);
        const normalized2 = normalizeUsers(arr2);
        setStudents(normalized2);
        setFilteredStudents(normalized2);
        setCandidates(normalized2);
      } catch (err2) {
        console.error("fetchStudents fallback error:", err2?.response || err2);
        setStudents([]);
        setFilteredStudents([]);
        setCandidates([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Kept your separate fetchCandidates (backwards compat)
  const fetchCandidates = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/recruiter/students`, {
        headers: getAuthHeaders(),
      });
      console.log("fetchCandidates response:", res.data);
      const arr = extractArray(res.data, ["students", "users"]);
      const normalized = normalizeUsers(arr);
      setCandidates(normalized);
      // keep students consistent
      setStudents(normalized);
      setFilteredStudents(normalized);
    } catch (err) {
      console.error("fetchCandidates error:", err?.response || err);
      if (err?.response?.status === 401) navigate("/login");
      setCandidates([]);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students, filters, activeTab]);

  // Toggle shortlist (keeps your relative endpoint usage; uses student._id consistently)
  const toggleShortlist = async (studentId, currentStatus) => {
    try {
      // preserve your original relative fetch path
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

  // Toggle interview (keeps your relative path as in your original code)
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

  // Update recruiter notes (keeps your relative path)
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="flex items-center gap-2 text-blue-600 font-bold text-xl hover:opacity-80 transition-opacity"
            >
              <img src="/logos.png" alt="Logo" className="h-48 w-auto" />
            </Link>

            {/* Profile Section */}
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
                    <p className="font-semibold text-gray-800">
                      {recruiter?.name || "Recruiter"}
                    </p>
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
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex-1 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Recruiter Portal</h1>
              <p className="text-xl text-blue-100 mb-2">
                Discover verified, talented students ready for internships and jobs
              </p>
              <p className="text-blue-200">
                Search through profiles, filter by skills, and connect with top performers
              </p>
            </div>
            <div className="flex-shrink-0">
              <Users className="w-32 h-32 md:w-40 md:h-40 text-blue-300 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl shadow-lg border border-blue-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Advanced Search</h2>
                  <p className="text-blue-100 text-sm">
                    Find the perfect candidate with precision filters
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-all shadow-md hover:shadow-lg"
              >
                {showFilters ? (
                  <>
                    <X className="w-4 h-4" />
                    Hide Filters
                  </>
                ) : (
                  <>
                    <Filter className="w-4 h-4" />
                    Show Filters
                  </>
                )}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Skills */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Code className="w-5 h-5 text-blue-600" />
                    </div>
                    <label className="text-sm font-semibold text-gray-800">
                      Technical Skills
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., React, Python, AWS, Docker"
                    value={filters.skills}
                    onChange={(e) => handleFilterChange("skills", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-2">Separate multiple skills with commas</p>
                </div>

                {/* College */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Building2 className="w-5 h-5 text-green-600" />
                    </div>
                    <label className="text-sm font-semibold text-gray-800">College / University</label>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., IIT, NIT, BITS"
                    value={filters.college}
                    onChange={(e) => handleFilterChange("college", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-2">Search by college name</p>
                </div>

                {/* Branch */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-purple-600" />
                    </div>
                    <label className="text-sm font-semibold text-gray-800">Branch / Department</label>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., Computer Science, Mechanical"
                    value={filters.branch}
                    onChange={(e) => handleFilterChange("branch", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-2">Filter by engineering branch</p>
                </div>

                {/* Graduation Year */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <label className="text-sm font-semibold text-gray-800">Year of Graduation</label>
                  </div>
                  <input
                    type="number"
                    placeholder="e.g., 2025, 2026"
                    value={filters.yearOfGraduation}
                    onChange={(e) => handleFilterChange("yearOfGraduation", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-2">Expected graduation year</p>
                </div>
              </div>

              {/* Score Range */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 mb-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800">Mock Interview Score Range</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Minimum Score</label>
                    <input
                      type="number"
                      placeholder="0"
                      min="0"
                      max="100"
                      value={filters.minScore}
                      onChange={(e) => handleFilterChange("minScore", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Maximum Score</label>
                    <input
                      type="number"
                      placeholder="100"
                      min="0"
                      max="100"
                      value={filters.maxScore}
                      onChange={(e) => handleFilterChange("maxScore", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-3">Filter candidates by their mock interview performance (0-100)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Location */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <label className="text-sm font-semibold text-gray-800">Location / City</label>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., Delhi, Mumbai, Bangalore"
                    value={filters.location}
                    onChange={(e) => handleFilterChange("location", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-2">Current location of candidates</p>
                </div>

                {/* Badges */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Award className="w-5 h-5 text-yellow-600" />
                    </div>
                    <label className="text-sm font-semibold text-gray-800">Badges & Achievements</label>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., Top Performer, Hackathon Winner"
                    value={filters.badges}
                    onChange={(e) => handleFilterChange("badges", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-2">Separate multiple badges with commas</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-600">{filteredStudents.length}</span> candidates found
                </div>
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "all" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  All Students ({candidates.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab("shortlisted")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "shortlisted" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Shortlisted ({students.filter((s) => s.shortlisted).length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab("interview")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "interview" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Interview Scheduled ({students.filter((s) => s.interview_scheduled).length})
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            <p className="mt-4 text-gray-600">Loading students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">No students found</p>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student._id || student.id}
                student={student}
                onToggleShortlist={toggleShortlist}
                onToggleInterview={toggleInterview}
                onUpdateNotes={updateNotes}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* StudentCard component (keeps your UI & actions)                            */
/* -------------------------------------------------------------------------- */
function StudentCard({ student, onToggleShortlist, onToggleInterview, onUpdateNotes }) {
  const [notes, setNotes] = useState(student.recruiter_notes || "");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const id = student._id || student.id;

  const handleSaveNotes = () => {
    onUpdateNotes(id, notes);
    setIsEditingNotes(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <img
            src={student.profile_picture || student.profilePicture || "/default-avatar.png"}
            alt={student.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.roll_number}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onToggleShortlist(id, student.shortlisted)}
                  className={`p-2 rounded-lg transition-colors ${
                    student.shortlisted ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                  title={student.shortlisted ? "Remove from shortlist" : "Add to shortlist"}
                >
                  <Star className={`w-5 h-5 ${student.shortlisted ? "fill-current" : ""}`} />
                </button>
                <button
                  onClick={() => onToggleInterview(id, student.interview_scheduled)}
                  className={`p-2 rounded-lg transition-colors ${
                    student.interview_scheduled ? "bg-green-100 text-green-600 hover:bg-green-200" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                  title={student.interview_scheduled ? "Interview scheduled" : "Schedule interview"}
                >
                  <Calendar className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {student.email}
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {student.contact}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <GraduationCap className="w-4 h-4" />
              <span className="font-medium">{student.college}</span>
            </div>
            <p className="text-sm text-gray-500 ml-6">{student.branch}</p>
            <p className="text-sm text-gray-500 ml-6">Class of {student.year_of_graduation}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">{student.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
              <Briefcase className="w-4 h-4" />
              <span className="text-xs">{student.availability}</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Verified Skills</h4>
          <div className="flex flex-wrap gap-2">
            {(student.verified_skills || []).map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Soft Skills</h4>
          <div className="flex flex-wrap gap-2">
            {(student.soft_skills || []).map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {(student.badges || []).length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Badges</h4>
            <div className="flex flex-wrap gap-2">
              {(student.badges || []).map((badge, index) => (
                <span key={index} className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  <Award className="w-3 h-3" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">CGPA</p>
            <p className="text-2xl font-bold text-gray-900">{student.cgpa}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Mock Interview Score</p>
            <p className="text-2xl font-bold text-blue-600">{student.mock_interview_score}/100</p>
          </div>
        </div>

        {(student.projects || []).length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Projects</h4>
            <div className="space-y-2">
              {(student.projects || []).map((project, index) => (
                <a key={index} href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline">
                  <ExternalLink className="w-4 h-4" />
                  {project.title}
                </a>
              ))}
            </div>
          </div>
        )}

        {student.internship_preferences && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Internship Preferences</h4>
            <p className="text-sm text-gray-600">{student.internship_preferences}</p>
          </div>
        )}

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Recruiter Notes</h4>
          {isEditingNotes ? (
            <div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                rows="3"
                placeholder="Add internal notes about this candidate..."
              />
              <div className="flex gap-2 mt-2">
                <button onClick={handleSaveNotes} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Save
                </button>
                <button onClick={() => { setNotes(student.recruiter_notes || ""); setIsEditingNotes(false); }} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div onClick={() => setIsEditingNotes(true)} className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors min-h-[60px]">
              {notes || "Click to add notes..."}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {student.resume_link && (
            <a href={student.resume_link} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Download Resume
            </a>
          )}
          {student.portfolio_link && (
            <a href={student.portfolio_link} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
              <ExternalLink className="w-4 h-4" />
              Portfolio
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default Recruiter;
