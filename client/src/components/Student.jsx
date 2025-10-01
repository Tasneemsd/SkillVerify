import React, { useEffect, useState } from "react";
import API from "../api";

const Student = () => {
  const [courses, setCourses] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("skill");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

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

  // Enroll
  const handleEnroll = async (courseId) => {
    try {
      const res = await API.post(
        "/student/enroll",
        { studentId: student._id, courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message || "Enrolled successfully ✅");
      setStudent((prev) => ({
        ...prev,
        registeredCourses: [...(prev?.registeredCourses || []), courseId],
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failed ❌");
    }
  };

  // Apply
  const handleApply = async (jobId) => {
    try {
      const res = await API.post(
        "/applications",
        { studentId: student._id, jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message || "Applied successfully ✅");
      setApplications((prev) => [...prev, res.data.application]);
    } catch (err) {
      alert(err.response?.data?.message || "Application failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white shadow-md p-6">
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
            className={`pb-2 px-2 font-medium ${
              activeTab === tab.key
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

        {/* Available Courses */}
        {activeTab === "courses" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow hover:shadow-lg p-4"
              >
                <h3 className="font-bold text-lg">{course.courseName}</h3>
                <p className="text-sm text-gray-600">{course.courseDescription}</p>
                <p className="text-sm mt-2">₹{course.courseFee}</p>
                <p className="text-sm">{course.courseDuration} hours</p>
                <button
                  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => handleEnroll(course._id)}
                >
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Jobs & Internships */}
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
                <button
                  className="self-center bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => handleApply(job._id)}
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        )}

        {/* My Applications */}
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
