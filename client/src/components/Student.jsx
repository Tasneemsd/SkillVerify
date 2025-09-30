// Student.jsx
import { useState, useEffect } from "react";
import axios from "axios";

export default function Student() {
  const [tab, setTab] = useState("courses");
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [jobs, setJobs] = useState([]);

  // get token from localStorage
  const token = localStorage.getItem("token");

  // fetch all courses
  useEffect(() => {
    if (tab === "courses") {
      axios.get("/api/courses")
        .then((res) => setCourses(res.data))
        .catch((err) => console.error("Courses fetch error:", err));
    }
  }, [tab]);

  // fetch my enrolled courses
  useEffect(() => {
    if (tab === "mycourses") {
      axios.get("/api/student/my-courses", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => setMyCourses(res.data))
        .catch((err) => console.error("MyCourses fetch error:", err));
    }
  }, [tab, token]);

  // fetch jobs
  useEffect(() => {
    if (tab === "jobs") {
      axios.get("/api/recruiter/jobs")
        .then((res) => setJobs(res.data))
        .catch((err) => console.error("Jobs fetch error:", err));
    }
  }, [tab]);

  // handle enroll
  const handleEnroll = async (courseId) => {
    try {
      const res = await axios.post(
        "/api/student/enroll",
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failed");
    }
  };

  return (
    <div className="p-6">
      {/* Tab Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${tab === "courses" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("courses")}
        >
          📚 Courses
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === "mycourses" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("mycourses")}
        >
          🎓 My Courses
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === "jobs" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("jobs")}
        >
          💼 Jobs/Internships
        </button>
      </div>

      {/* All Courses */}
      {tab === "courses" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Courses</h2>
          {courses.length === 0 ? (
            <p>No courses available.</p>
          ) : (
            courses.map((c) => (
              <div key={c._id} className="border p-4 mb-4 rounded-lg shadow">
                <h3 className="text-lg font-bold">{c.courseName}</h3>
                <p><b>ID:</b> {c.courseId}</p>
                <p><b>Duration:</b> {c.courseDuration}</p>
                <p><b>Price:</b> ₹{c.courseFee}</p>
                <p><b>Description:</b> {c.courseDescription || "No description"}</p>
                <button
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
                  onClick={() => handleEnroll(c._id)}
                >
                  Enroll
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* My Courses */}
      {tab === "mycourses" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">My Enrolled Courses</h2>
          {myCourses.length === 0 ? (
            <p>You haven't enrolled in any courses yet.</p>
          ) : (
            myCourses.map((mc) => (
              <div key={mc._id} className="border p-4 mb-4 rounded-lg shadow">
                <h3 className="text-lg font-bold">{mc.courseName}</h3>
                <p><b>ID:</b> {mc.courseId}</p>
                <p><b>Duration:</b> {mc.courseDuration}</p>
                <p><b>Price:</b> ₹{mc.courseFee}</p>
                <p><b>Description:</b> {mc.courseDescription}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Jobs/Internships */}
      {tab === "jobs" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Jobs & Internships</h2>
          {jobs.length === 0 ? (
            <p>No jobs available.</p>
          ) : (
            jobs.map((j) => (
              <div key={j._id} className="border p-4 mb-4 rounded-lg shadow">
                <h3 className="text-lg font-bold">{j.title}</h3>
                <p>{j.description}</p>
                <p><b>Location:</b> {j.location}</p>
                <p><b>Salary:</b> {j.salary || "Not specified"}</p>
                <p><b>Skills Required:</b> {j.skillsRequired?.join(", ") || "None"}</p>
                <p><b>Posted By:</b> {j.postedByEmail}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
