import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Users,
  PlusCircle,
  AlertCircle,
  BarChart3,
  Settings,
} from "lucide-react";
import API from "./api";

const Recruiter = () => {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [recruiter, setRecruiter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  // New job form
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    skillsRequired: "",
  });

  // Settings form
  const [settings, setSettings] = useState({
    companyName: "",
    email: "",
  });

  // Fetch recruiter profile
  const fetchRecruiter = async () => {
    try {
      const res = await API.get("/recruiter/profile");
      setRecruiter(res.data);
      setSettings({ companyName: res.data.companyName || "", email: res.data.email || "" });
    } catch (err) {
      console.error(err);
      setError("Failed to load recruiter profile");
    }
  };

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const res = await API.get("/recruiter/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      setJobs([]);
    }
  };

  // Fetch candidates
  const fetchCandidates = async () => {
    try {
      const res = await API.get("/recruiter/candidates");
      setCandidates(res.data);
    } catch (err) {
      console.error(err);
      setCandidates([]);
    }
  };

  // Create job
  const createJob = async (e) => {
    e.preventDefault();
    try {
      const jobData = { ...newJob, skillsRequired: newJob.skillsRequired.split(",").map(s => s.trim()) };
      await API.post("/recruiter/jobs", jobData);
      alert("Job created!");
      setNewJob({ title: "", description: "", location: "", salary: "", skillsRequired: "" });
      fetchJobs();
      setActiveTab("jobs");
    } catch (err) {
      console.error(err);
      alert("Failed to create job");
    }
  };

  // Update profile
  const updateSettings = async (e) => {
    e.preventDefault();
    try {
      await API.post("/recruiter/profile", { ...settings });
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchRecruiter();
      await Promise.all([fetchJobs(), fetchCandidates()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
            </div>
            {recruiter && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {recruiter.name}</span>
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{recruiter.name?.charAt(0)?.toUpperCase() || "R"}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
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
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 ${
                  activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                <p className="text-sm font-medium text-gray-600">Candidates</p>
                <p className="text-2xl font-bold text-gray-900">{candidates.length}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Posted Jobs</h3>
            {jobs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No jobs posted yet</p>
            ) : (
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <div key={job._id} className="border rounded-lg p-4">
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

        {activeTab === "candidates" && (
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Candidates</h3>
            {candidates.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No candidates found</p>
            ) : (
              <div className="grid gap-4">
                {candidates.map((cand) => (
                  <div key={cand._id} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900">{cand.name}</h4>
                    <p className="text-gray-600">{cand.email}</p>
                    {cand.appliedJob && <p className="text-sm text-gray-500">Applied for: {cand.appliedJob}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "postjob" && (
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Post New Job</h3>
            <form onSubmit={createJob} className="space-y-4">
              {["title", "description", "location", "salary", "skillsRequired"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field === "skillsRequired" ? "Required Skills (comma separated)" : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {field === "description" ? (
                    <textarea
                      required
                      rows={3}
                      value={newJob[field]}
                      onChange={(e) => setNewJob({ ...newJob, [field]: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <input
                      type={field === "salary" ? "text" : "text"}
                      required
                      value={newJob[field]}
                      onChange={(e) => setNewJob({ ...newJob, [field]: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                </div>
              ))}
              <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Post Job
              </button>
            </form>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recruiter Settings</h3>
            <form onSubmit={updateSettings} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                Update Profile
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recruiter;
