// src/components/Student.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://skillverify.onrender.com/api";

const Student = () => {
  const [student, setStudent] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("skillProgress");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("userToken");

  const getAuthHeaders = () =>
    token ? { Authorization: `Bearer ${token}` } : {};

  // Fetch student + courses + applications
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center py-4">
          <h1 className="text-xl font-semibold text-gray-800">JobLens</h1>
          {student && (
            <div className="flex items-center space-x-6">
              <span className="text-gray-600">Welcome, {student.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
              {student?.name?.charAt(0) || "S"}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {student?.name}
              </h2>
              <p className="text-gray-500 text-sm">
                {student?.course} • {student?.college} • Class of {student?.year}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-600">
              Verified Skills (0)
            </p>
            <p className="text-sm text-gray-500">
              Complete the verification process to earn verified skill badges
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex space-x-8 border-b">
          {[
            { id: "skillProgress", label: "Skill Progress" },
            { id: "courses", label: "Available Courses" },
            { id: "jobs", label: "Jobs & Internships" },
            { id: "applications", label: "My Applications" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-1 py-3 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Skill Progress */}
        {activeTab === "skillProgress" && (
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
            <p className="font-semibold text-lg mb-3">
              Your Skill Verification Journey
            </p>
            <img
              src="https://cdn-icons-png.flaticon.com/512/1828/1828817.png"
              alt="skills"
              className="h-16 mb-3"
            />
            <p className="text-gray-500 text-sm">No Skills in Progress</p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
              Browse Courses
            </button>
          </div>
        )}

        {/* Courses */}
        {activeTab === "courses" && (
          <div className="grid md:grid-cols-3 gap-6">
            {allCourses.map((c) => (
              <div
                key={c._id}
                className="bg-white p-5 rounded-lg shadow flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {c.courseName}
                  </h3>
                  <p className="text-gray-500 text-sm mt-2">{c.description}</p>
                  <p className="text-green-600 font-semibold mt-3">
                    ₹{c.price}
                  </p>
                  <p className="text-gray-400 text-xs">{c.duration}</p>
                </div>
                <button className="mt-4 bg-blue-600 text-white py-2 rounded">
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Jobs */}
        {activeTab === "jobs" && (
          <div className="space-y-4">
            {applications.length ? (
              applications.map((job) => (
                <div
                  key={job._id}
                  className="bg-white p-6 rounded-lg shadow flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {job.title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {job.company} • {job.location}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      {job.description}
                    </p>
                    <div className="flex space-x-2 mt-3">
                      {job.skills?.map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm mt-2">
                      Salary: {job.salary}
                    </p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Apply
                  </button>
                </div>
              ))
            ) : (
              <p>No jobs available</p>
            )}
          </div>
        )}

        {/* Applications */}
        {activeTab === "applications" && (
          <div className="bg-white rounded-lg p-6 shadow">
            {applications.length ? (
              applications.map((app) => (
                <div
                  key={app._id}
                  className="flex justify-between border-b py-2"
                >
                  <span>{app.jobTitle}</span>
                  <span className="text-sm text-gray-500">{app.status}</span>
                </div>
              ))
            ) : (
              <p>No applications submitted yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Student;
