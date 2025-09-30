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
      {/* Navbar */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-14">
          <h1 className="text-lg font-bold text-gray-900">JobLens</h1>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-700">Welcome, {student?.name}</span>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Student card */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white border p-4">
          <h2 className="text-base font-semibold">{student?.name}</h2>
          <p className="text-gray-600 text-sm">
            {student?.course} • {student?.college} • Class of {student?.year}
          </p>
          <p className="mt-2 text-gray-800 text-sm font-medium">
            Verified Skills ({student?.skills?.length || 0})
          </p>
          <p className="text-xs text-gray-500">
            Complete the verification process to earn verified skill badges
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b mt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-6">
          {[
            { id: "skills", label: "Skill Progress" },
            { id: "courses", label: "Available Courses" },
            { id: "jobs", label: "Jobs & Internships" },
            { id: "applications", label: "My Applications" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeTab === "skills" && (
          <div className="bg-white border p-6 text-center">
            <h2 className="text-base font-semibold mb-3">
              Your Skill Verification Journey
            </h2>
            <p className="text-gray-600 text-sm">No Skills in Progress</p>
            <p className="text-xs text-gray-500 mt-1">
              Enroll in a course to start your skill verification journey
            </p>
            <button className="mt-4 bg-blue-600 text-white text-sm px-4 py-2">
              Browse Courses
            </button>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="bg-white border p-6">
            {allCourses.length ? (
              allCourses.map((c) => (
                <div key={c._id} className="py-2 border-b last:border-0">
                  <h3 className="font-semibold text-sm">{c.courseName}</h3>
                  <p className="text-xs text-gray-600">{c.description}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">No courses available</p>
            )}
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="bg-white border p-6 space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="border p-4">
                <h3 className="font-semibold text-base">{job.title}</h3>
                <p className="text-xs text-gray-600">
                  {job.company} • {job.location}
                </p>
                <p className="mt-2 text-sm text-gray-700">{job.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {job.skills.map((s, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-xs font-medium">{job.salary}</p>
                <button className="mt-3 bg-blue-600 text-white text-xs px-3 py-1.5">
                  Apply
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "applications" && (
          <div className="bg-white border p-6">
            {applications.length ? (
              applications.map((app) => (
                <div key={app._id} className="py-2 border-b last:border-0">
                  <p className="text-sm">
                    {app.jobTitle} -{" "}
                    <span className="font-medium">{app.status}</span>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">No applications yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Student;
