// src/components/Recruiter.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Briefcase,
  Users,
  PlusCircle,
  BarChart3,
  Settings,
  Menu,
  X,
  Download,
  Mail,
  Check,
  Search,
} from "lucide-react";

const BASE_URL = "https://skillverify.onrender.com/api"; // keep your original

const Recruiter = () => {
  // data
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [recruiter, setRecruiter] = useState(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [error, setError] = useState(null);

  // new - filters
  const [filters, setFilters] = useState({
    location: "",
    skills: "",
    college: "",
    minScore: 0,
    query: "",
  });

  // ----- AUTH HELPERS (same pattern as yours) -----
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

  // ----- Fetch recruiter info from localStorage -----
  const fetchRecruiterLocal = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.email) return;
      setRecruiter({
        _id: user._id || "unknown",
        name: user.name || "Recruiter",
        email: user.email,
        companyName: user.companyName || "",
      });
    } catch {
      // fallback
      setRecruiter({
        _id: "default",
        name: "Recruiter",
        email: "recruiter@example.com",
      });
    }
  };

  // ----- Fetch Jobs -----
  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/recruiter/jobs`, {
        headers: getAuthHeaders(),
      });
      setJobs(res.data || []);
    } catch (err) {
      console.error("FETCH JOBS ERROR:", err);
      setJobs([]);
    }
  };

  // ----- Fetch Verified Candidates -----
  // backend should accept query params: verified=true, skills, college, minScore, location
  const fetchCandidates = async (appliedFilters = {}) => {
    try {
      // build params object - only send non-empty values
      const params = { verified: true };
      if (appliedFilters.location) params.location = appliedFilters.location;
      if (appliedFilters.skills) params.skills = appliedFilters.skills;
      if (appliedFilters.college) params.college = appliedFilters.college;
      if (typeof appliedFilters.minScore === "number" && appliedFilters.minScore > 0)
        params.minScore = appliedFilters.minScore;
      if (appliedFilters.query) params.q = appliedFilters.query;

      const res = await axios.get(`${BASE_URL}/recruiter/students`, {
        headers: getAuthHeaders(),
        params,
      });

      // Expecting an array of student objects
      setCandidates(Array.isArray(res.data) ? res.data : res.data.students || []);
    } catch (err) {
      console.error("FETCH CANDIDATES ERROR:", err);
      setCandidates([]);
    }
  };

  // ----- Invite Candidate -----
  const inviteCandidate = async (studentId) => {
    try {
      // If your backend uses a different route adjust below accordingly
      const res = await axios.post(
        `${BASE_URL}/recruiter/invite`,
        { studentId },
        { headers: getAuthHeaders() }
      );
      if (res.data?.success) {
        alert("Invitation sent successfully!");
      } else {
        alert(res.data?.message || "Invitation request sent (no success flag).");
      }
    } catch (err) {
      console.error("INVITE ERROR:", err);
      alert(err.response?.data?.message || "Failed to send invite");
    }
  };

  // ----- View Resume -----
  const viewResume = (url) => {
    if (!url) return alert("Resume not available");
    window.open(url, "_blank", "noopener");
  };

  // ----- Download Resume -----
  const downloadResume = async (url, filename = "resume.pdf") => {
    if (!url) return alert("Resume not available");
    try {
      // attempt direct download by creating anchor (if URL allows CORS)
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("DOWNLOAD ERROR:", err);
      alert("Could not download resume directly.");
    }
  };

  // ----- Effects: initial load -----
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      fetchRecruiterLocal();
      await Promise.all([fetchJobs(), fetchCandidates(filters)]);
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- When filters change, refetch from backend (for authoritative filtering) -----
  useEffect(() => {
    // fetch server-filtered list
    // small debounce to avoid too many requests
    const t = setTimeout(() => {
      fetchCandidates(filters);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.location, filters.skills, filters.college, filters.minScore, filters.query]);

  // ----- Client-side safety filter / search (applies on top of server results) -----
  const filteredCandidates = useMemo(() => {
    const q = (filters.query || "").toLowerCase().trim();
    return candidates.filter((c) => {
      // Ensure verified flag true (double-check client-side)
      if (!c.verified) return false;

      // location filter
      if (filters.location && c.location) {
        if (!c.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      } else if (filters.location && !c.location) return false;

      // college filter
      if (filters.college && c.college) {
        if (!c.college.toLowerCase().includes(filters.college.toLowerCase())) return false;
      } else if (filters.college && !c.college) return false;

      // skills filter - check any skill includes string
      if (filters.skills) {
        const wantSkills = filters.skills
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean);
        const studentSkills = (c.skills || []).map((s) => (typeof s === "string" ? s.toLowerCase() : (s.name || "").toLowerCase()));
        const matches = wantSkills.every((ws) => studentSkills.some((ss) => ss.includes(ws)));
        if (!matches) return false;
      }

      // minScore check
      if (filters.minScore && typeof c.academicScore === "number") {
        if (c.academicScore < filters.minScore) return false;
      } else if (filters.minScore && typeof c.academicScore !== "number") return false;

      // query search across name / email / skills
      if (q) {
        const inName = (c.name || "").toLowerCase().includes(q);
        const inEmail = (c.email || "").toLowerCase().includes(q);
        const inSkills = (c.skills || []).some((s) =>
          (typeof s === "string" ? s.toLowerCase() : (s.name || "").toLowerCase()).includes(q)
        );
        if (!inName && !inEmail && !inSkills) return false;
      }

      return true;
    });
  }, [candidates, filters]);

  // ----- Small handlers -----
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleMinScoreChange = (e) => {
    setFilters((prev) => ({ ...prev, minScore: Number(e.target.value) }));
  };

  const handleClearFilters = () => {
    setFilters({ location: "", skills: "", college: "", minScore: 0, query: "" });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading recruiter dashboard...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-5">
          <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl hover:opacity-80 transition-opacity">
            <img src="/logos.png" alt="Logo" className="h-10 w-auto" />
            <span className="hidden md:inline">SkillVerify</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-gray-600">Welcome, {recruiter?.name || "Recruiter"}</span>
            <div className="h-9 w-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
              {recruiter?.name?.charAt(0)?.toUpperCase() || "R"}
            </div>

            <button
              className="sm:hidden p-2 rounded-md border text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden sm:flex space-x-8">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "jobs", label: "Jobs", icon: Briefcase },
              { id: "candidates", label: "Candidates", icon: Users },
              { id: "postjob", label: "Post Job", icon: PlusCircle },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 ${activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          {mobileMenuOpen && (
            <div className="sm:hidden flex flex-col space-y-2 py-2">
              {[
                { id: "dashboard", label: "Dashboard", icon: BarChart3 },
                { id: "jobs", label: "Jobs", icon: Briefcase },
                { id: "candidates", label: "Candidates", icon: Users },
                { id: "postjob", label: "Post Job", icon: PlusCircle },
                { id: "settings", label: "Settings", icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === tab.id ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Jobs Posted</p>
                <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified Candidates</p>
                <p className="text-2xl font-bold text-gray-900">{candidates.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Jobs */}
        {activeTab === "jobs" && (
          <div className="bg-white shadow rounded-lg p-4">
            {jobs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No jobs posted yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <div key={job._id} className="border rounded-lg p-4 flex flex-col">
                    <h4 className="font-semibold text-gray-900">{job.title}</h4>
                    <p className="text-gray-600">{job.description}</p>
                    <p className="text-sm text-gray-500">Location: {job.location}</p>
                    <p className="text-sm text-gray-500">Salary: {job.salary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Candidates (polished) */}
        {activeTab === "candidates" && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Candidate list */}
            <div className="bg-white shadow rounded-lg p-6 flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Verified Candidates</h3>
                <div className="flex items-center gap-2">
                  <input
                    name="query"
                    value={filters.query}
                    onChange={handleFilterChange}
                    placeholder="Search name / skill / email"
                    className="px-3 py-2 border rounded-md w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleClearFilters}
                    className="px-3 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
                    title="Clear filters"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {filteredCandidates.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Users className="mx-auto w-12 h-12 text-gray-300 mb-4" />
                  <p>No verified candidates match your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCandidates.map((cand) => (
                    <div key={cand._id} className="border rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{cand.name}</h4>
                            <p className="text-sm text-gray-600">{cand.email}</p>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center text-green-700 bg-green-50 px-2 py-1 rounded-full text-xs font-semibold">
                              <Check className="w-3 h-3 mr-1" /> Verified by Admin
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-500 mt-2">
                          College: {cand.college || "-"} • Branch: {cand.branch || "-"}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {(cand.skills || []).slice(0, 6).map((skill, i) => {
                            const skillText = typeof skill === "string" ? skill : skill.name || "";
                            return (
                              <span key={i} className="inline-block bg-blue-50 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                                {skillText}
                              </span>
                            );
                          })}
                          {cand.skills && cand.skills.length > 6 && (
                            <span className="inline-block text-xs text-gray-500 px-2 py-1">+{cand.skills.length - 6}</span>
                          )}
                        </div>

                        <p className="text-sm text-gray-500 mt-3">Academic Score: {cand.academicScore ?? "N/A"}%</p>
                      </div>

                      <div className="flex items-center justify-between mt-4 border-t pt-3">
                        <button
                          onClick={() => inviteCandidate(cand._id)}
                          className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                        >
                          <Mail className="w-4 h-4 inline-block mr-2" /> Invite
                        </button>

                        <div className="flex gap-2">
                          <button
                            onClick={() => viewResume(cand.resumeUrl)}
                            className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200"
                          >
                            <Search className="w-4 h-4 inline-block mr-2" /> View
                          </button>
                          <button
                            onClick={() => downloadResume(cand.resumeUrl, `${cand.name || "resume"}.pdf`)}
                            className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                          >
                            <Download className="w-4 h-4 inline-block mr-2" /> Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Filters panel */}
            <aside className="bg-white shadow rounded-lg p-6 w-full lg:w-96">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Filters</h4>
                <button onClick={handleClearFilters} className="text-sm text-gray-500 hover:underline">Reset</button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Applicant’s location</label>
                  <input
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="e.g. Gurugram"
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
                  <input
                    name="skills"
                    value={filters.skills}
                    onChange={handleFilterChange}
                    placeholder="e.g. Java, React"
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">College</label>
                  <input
                    name="college"
                    value={filters.college}
                    onChange={handleFilterChange}
                    placeholder="e.g. IIT Bombay"
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum academic performance</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    name="minScore"
                    value={filters.minScore}
                    onChange={handleMinScoreChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>{filters.minScore}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Post Job */}
        {activeTab === "postjob" && (
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-gray-500">Post job UI lives here (your existing implementation).</p>
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-gray-500">Settings UI (your existing implementation).</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recruiter;
