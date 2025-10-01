import React, { useEffect, useState } from "react";
import API from "../api";

const Student = () => {
  const [courses, setCourses] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("skill");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Function to get initials
  const getInitials = (name = "") => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0].toUpperCase())
      .join("");
  };

  // Fetch student details
  useEffect(() => {
    if (!user?.email) return;
    API.get(`/student?email=${encodeURIComponent(user.email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setStudent(res.data))
      .catch((err) => console.error("Fetch student error:", err));
  }, [user?.email, token]);

  // Fetch courses
  useEffect(() => {
    API.get("/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Courses fetch error:", err));
  }, []);

  // Fetch jobs
  useEffect(() => {
    API.get("/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error("Jobs fetch error:", err));
  }, []);

  // Fetch applications
  useEffect(() => {
    if (!student?._id) return;
    API.get(`/applications?studentId=${student._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setApplications(res.data))
      .catch((err) => console.error("Applications fetch error:", err));
  }, [student?._id, token]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center relative">
        <img
          src="client\src\images\image.png"
          alt="We Hire Today"
          className="h-10 w-auto"
        />

        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">
            Welcome, {student?.name || user?.name || "Student"}
          </span>

          {/* Profile Circle */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md focus:outline-none"
            >
              {getInitials(student?.name || user?.name || "S")[0]}
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => setActiveTab("profile")}
                >
                  My Profile
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Profile Header */}
      <div className="bg-white shadow-md p-6 mt-4 mx-4 rounded-lg flex items-center gap-6">
        {/* Big Profile Circle */}
        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
          {getInitials(student?.name || user?.name || "S")}
        </div>

        <div>
          <h2 className="text-2xl font-bold">{student?.name || "Student Name"}</h2>
          <p className="text-gray-600">
            {student?.branch || "CSE"} • {student?.college || "NEC"} • Class of{" "}
            {student?.graduationYear || "2026"}
          </p>
          <div className="mt-2">
            <p className="font-semibold">Verified Skills (0)</p>
            <p className="text-sm text-gray-500">
              Complete the verification process to earn verified skill badges
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b mt-4 px-6">
        {[
          { key: "skill", label: "Skill Progress" },
          { key: "courses", label: "Available Courses" },
          { key: "jobs", label: "Jobs & Internships" },
          { key: "applications", label: "My Applications" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 px-2 font-medium ${activeTab === tab.key
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Skill Progress */}
        {activeTab === "skill" && (
          <div className="text-center mt-10">
            <h3 className="text-lg font-bold">Your Skill Verification Journey</h3>
            <p className="mt-2 text-gray-600">No Skills in Progress</p>
            <p className="text-gray-500">
              Enroll in a course to start your skill verification journey
            </p>
            <button
              onClick={() => setActiveTab("courses")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Browse Courses
            </button>
          </div>
        )}

        {/* Courses */}
        {activeTab === "courses" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow hover:shadow-lg p-4"
              >
                <h3 className="font-bold text-lg">{course.courseName}</h3>
                <p className="text-sm text-gray-600">
                  {course.courseDescription}
                </p>
                <p className="text-sm mt-2">₹{course.courseFee}</p>
                <p className="text-sm">{course.courseDuration} hours</p>
                <button
                  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => alert("Enroll API here")}
                >
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Jobs */}
        {activeTab === "jobs" && (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-lg shadow hover:shadow-lg p-4 flex justify-between"
              >
                <div>
                  <h3 className="font-bold text-lg">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
                  <p className="text-sm">Location: {job.location}</p>
                  <p className="text-sm">Salary: {job.salary}</p>
                  <div className="flex gap-2 mt-2">
                    {job.skills?.map((s, i) => (
                      <span
                        key={i}
                        className="bg-gray-200 text-xs px-2 py-1 rounded"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="self-center bg-blue-600 text-white px-3 py-1 rounded">
                  Apply
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Applications */}
        {activeTab === "applications" && (
          <div className="space-y-4">
            {applications.length ? (
              applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white rounded-lg shadow hover:shadow-lg p-4"
                >
                  <h3 className="font-bold text-lg">{app.jobTitle}</h3>
                  <p className="text-sm">Company: {app.company}</p>
                  <p className="text-sm">Status: {app.status}</p>
                  <p className="text-sm">
                    Applied On: {new Date(app.appliedOn).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">
                No job applications yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Student;
