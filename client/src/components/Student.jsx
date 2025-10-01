import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://skillverify.onrender.com/api";

const Student = () => {
  const [courses, setCourses] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("available"); // "available" | "enrolled" | "applied"

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch student details by email
  useEffect(() => {
    if (!user?.email) return;
    axios
      .get(`${API_BASE}/student?email=${encodeURIComponent(user.email)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStudent(res.data))
      .catch((err) => console.error("Fetch student error:", err));
  }, [user?.email]);

  // Fetch all courses
  useEffect(() => {
    axios
      .get(`${API_BASE}/courses`)
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Courses fetch error:", err));
  }, []);

  // Fetch all jobs
  useEffect(() => {
    axios
      .get(`${API_BASE}/jobs`)
      .then((res) => setJobs(res.data))
      .catch((err) => console.error("Jobs fetch error:", err));
  }, []);

  // Fetch applications for this student
  useEffect(() => {
    if (!student?._id) return;
    axios
      .get(`${API_BASE}/applications?studentId=${student._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setApplications(res.data))
      .catch((err) => console.error("Applications fetch error:", err));
  }, [student?._id]);

  // Enroll in course
  const handleEnroll = async (courseId) => {
    try {
      const res = await axios.post(
        `${API_BASE}/student/enroll`,
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

  // Apply for job
  const handleApply = async (jobId) => {
    try {
      const res = await axios.post(
        `${API_BASE}/applications`,
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
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("available")}
          className={`px-4 py-2 rounded ${
            activeTab === "available" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Available
        </button>
        <button
          onClick={() => setActiveTab("enrolled")}
          className={`px-4 py-2 rounded ${
            activeTab === "enrolled" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          My Courses
        </button>
        <button
          onClick={() => setActiveTab("applied")}
          className={`px-4 py-2 rounded ${
            activeTab === "applied" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          My Applications
        </button>
      </div>

      {/* Available */}
      {activeTab === "available" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="border p-4 rounded-lg shadow hover:shadow-lg"
            >
              <h3 className="font-bold text-lg">{course.courseName}</h3>
              <p className="text-sm text-gray-600">
                {course.courseDescription}
              </p>
              <p className="text-sm">Duration: {course.courseDuration}</p>
              <p className="text-sm">Fee: ₹{course.courseFee}</p>
              <button
                className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => handleEnroll(course._id)}
              >
                Enroll
              </button>
            </div>
          ))}

          {jobs.map((job) => (
            <div
              key={job._id}
              className="border p-4 rounded-lg shadow hover:shadow-lg"
            >
              <h3 className="font-bold text-lg">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.description}</p>
              <p className="text-sm">Location: {job.location}</p>
              <p className="text-sm">Salary: {job.salary}</p>
              <button
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => handleApply(job._id)}
              >
                Apply Job
              </button>
            </div>
          ))}
        </div>
      )}

      {/* My Courses */}
      {activeTab === "enrolled" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {student?.registeredCourses?.length ? (
            student.registeredCourses.map((courseId) => {
              const course = courses.find((c) => c._id === courseId);
              return (
                <div
                  key={courseId}
                  className="border p-4 rounded-lg shadow hover:shadow-lg"
                >
                  <h3 className="font-bold text-lg">{course?.courseName}</h3>
                  <p className="text-sm">{course?.courseDescription}</p>
                  <p className="text-sm">Duration: {course?.courseDuration}</p>
                  <p className="text-sm">Fee: ₹{course?.courseFee}</p>
                </div>
              );
            })
          ) : (
            <p>No courses enrolled yet.</p>
          )}
        </div>
      )}

      {/* My Applications */}
      {activeTab === "applied" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.length ? (
            applications.map((app) => (
              <div
                key={app._id}
                className="border p-4 rounded-lg shadow hover:shadow-lg"
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
            <p>No job applications yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Student;
