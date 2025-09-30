// src/components/Student.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://skillverify.onrender.com/api";

const Student = () => {
  const [student, setStudent] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("skills");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("userToken");

  const getAuthHeaders = () =>
    token ? { Authorization: `Bearer ${token}` } : {};

  // Fetch data
  const fetchStudent = async () => {
    try {
      if (!user?.email) return;
      const res = await axios.get(
        `${BASE_URL}/student?email=${encodeURIComponent(user.email)}`,
        { headers: getAuthHeaders() }
      );
      setStudent(res.data);

      const coursesRes = await axios.get(`${BASE_URL}/courses`);
      setAllCourses(coursesRes.data);

      // Dummy jobs for UI
      setJobs([
        {
          _id: "1",
          title: "Software Engineer - Full Stack",
          company: "StartupXYZ",
          location: "Mumbai, India",
          description:
            "Full-stack development role working on cutting-edge products. Opportunity to work with modern tech stack and grow your career.",
          skills: ["Python", "React", "SQL"],
          salary: "₹6-8 LPA",
        },
        {
          _id: "2",
          title: "Data Analyst Intern",
          company: "Analytics Pro",
          location: "Delhi, India",
          description:
            "Analyze business data and generate insights using SQL, Python and BI tools.",
          skills: ["Python", "SQL", "Excel"],
          salary: "Stipend",
        },
      ]);

      if (res.data._id) {
        const appsRes = await axios.get(
          `${BASE_URL}/applications?studentId=${res.data._id}`,
          { headers: getAuthHeaders() }
        );
        setApplications(appsRes.data || []);
      }
    } catch (err) {
      setError("Failed to load student data");
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchStudent();
      setLoading(false);
    };
    load();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading student dashboard...</p>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">JobLens</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 text-sm">
              Welcome, {student?.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Student Card */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white border rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold">{student?.name}</h2>
          <p className="text-gray-600">
            {student?.course} • {student?.college} • Class of {student?.year}
          </p>
          <p className="mt-2 text-gray-800 font-medium">
            Verified Skills ({student?.skills?.length || 0})
          </p>
          <p className="text-sm text-gray-500">
            Complete the verification process to earn verified skill badges
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b mt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-8">
          {[
            { id: "skills", label: "Skill Progress" },
            { id: "courses", label: "Available Courses" },
            { id: "jobs", label: "Jobs & Internships" },
            { id: "applications", label: "My Applications" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-4 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Skill Progress */}
        {activeTab === "skills" && (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-lg font-semibold mb-4">
              Your Skill Verification Journey
            </h2>
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-gray-600">No Skills in Progress</p>
              <p className="text-sm text-gray-500">
                Enroll in a course to start your skill verification journey
              </p>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
                Browse Courses
              </button>
            </div>
          </div>
        )}

        {/* Available Courses */}
        {activeTab === "courses" && (
          <div className="bg-white p-6 rounded-lg shadow">
            {allCourses.length ? (
              allCourses.map((c) => (
                <div key={c._id} className="border-b py-3">
                  <h3 className="font-semibold">{c.courseName}</h3>
                  <p className="text-sm text-gray-600">{c.description}</p>
                </div>
              ))
            ) : (
              <p>No courses available</p>
            )}
          </div>
        )}

        {/* Jobs & Internships */}
        {activeTab === "jobs" && (
          <div className="bg-white p-6 rounded-lg shadow space-y-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="border rounded-lg p-4 flex flex-col justify-between shadow"
              >
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-600">
                  {job.company} • {job.location}
                </p>
                <p className="mt-2 text-gray-700">{job.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {job.skills.map((s, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-sm font-medium">{job.salary}</p>
                <button className="mt-4 self-end bg-blue-600 text-white px-4 py-2 rounded">
                  Apply
                </button>
              </div>
            ))}
          </div>
        )}

        {/* My Applications */}
        {activeTab === "applications" && (
          <div className="bg-white p-6 rounded-lg shadow">
            {applications.length ? (
              applications.map((app) => (
                <div key={app._id} className="border-b py-2">
                  {app.jobTitle} - {app.status}
                </div>
              ))
            ) : (
              <p>No applications yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Student;
