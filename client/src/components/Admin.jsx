import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("courses"); // courses | jobs
  const [showForm, setShowForm] = useState(false);

  // ✅ Always arrays
  const Adm_URL = "http://localhost:5000/api/student";
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [adminName, setAdminName] = useState("Admin");

  // Course form
  const [courseForm, setCourseForm] = useState({
    courseName: "",
    courseId: "",
    courseDuration: "",
    courseFee: "",
    courseDescription: "",
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchCourses(),
          fetchStudents(),
          fetchJobs(),
          fetchAdmin(),
        ]);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ✅ Fetch admin name
  const fetchAdmin = async () => {
    try {
      const res = await axios.get(`${Adm_URL}?email=${encodeURIComponent(studentEmail)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdminName(res.data);
    } catch (err) {
      console.warn("Could not fetch admin details, falling back...");
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setAdminName(parsed?.name || "Admin");
      }
    }
  };

  // ✅ Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get("/api/admin/courses-with-registrations");
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch courses", err);
      setCourses([]);
    }
  };

  // ✅ Fetch students
  const fetchStudents = async () => {
    try {
      const res = await axios.get("/api/admin/students-with-skills");
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch students", err);
      setStudents([]);
    }
  };

  // ✅ Fetch jobs
  const fetchJobs = async () => {
    try {
      const res = await axios.get("/api/admin/jobs");
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
      setJobs([]);
    }
  };

  // ✅ Student search
  const handleSearch = () => {
    const found = students.find(
      (s) => s.name?.toLowerCase() === searchQuery.toLowerCase()
    );
    setSelectedStudent(found || null);
  };

  // ✅ Approve skill
  const handleApprove = async (skillName) => {
    if (!selectedStudent) return;
    try {
      await axios.post("/api/admin/verify-skill", {
        studentId: selectedStudent._id,
        skillName,
      });
      await fetchStudents();
      setSelectedStudent((prev) => ({
        ...prev,
        skills: prev.skills.map((s) =>
          s.name === skillName ? { ...s, verified: true } : s
        ),
      }));
    } catch (err) {
      console.error("Failed to verify skill", err);
    }
  };

  // ✅ Create course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/create-course", courseForm);
      await fetchCourses();
      setShowForm(false);
      setCourseForm({
        courseName: "",
        courseId: "",
        courseDuration: "",
        courseFee: "",
        courseDescription: "",
      });
    } catch (err) {
      console.error("Failed to create course", err);
    }
  };

  // ====== UI ======
  if (loading) {
    return <p className="text-center p-6">Loading dashboard...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-red-500 p-6">
        {error}. Please refresh.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 text-white font-bold p-2 rounded-md">SV</div>
          <h1 className="text-xl font-semibold">SkillVerify Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {adminName}</span>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex justify-center mt-4">
        <div className="flex bg-gray-100 rounded-md overflow-hidden">
          <button
            onClick={() => setActiveTab("courses")}
            className={`px-6 py-2 font-medium ${activeTab === "courses"
                ? "bg-white shadow text-black"
                : "text-gray-500 hover:text-black"
              }`}
          >
            Manage Courses
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-6 py-2 font-medium ${activeTab === "jobs"
                ? "bg-white shadow text-black"
                : "text-gray-500 hover:text-black"
              }`}
          >
            Manage Jobs
          </button>
        </div>
      </div>

      <div className="px-6 mt-6">
        {/* ===== COURSES ===== */}
        {activeTab === "courses" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Courses</h2>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                + Add Course
              </button>
            </div>

            {/* Course Cards */}
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {courses.map((course, i) => (
                  <div
                    key={i}
                    className="bg-white p-4 rounded-lg shadow border flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-semibold">{course.courseName}</h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {course.courseDescription}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-green-600 font-semibold">
                        ₹{course.courseFee}
                      </span>
                      <span className="px-3 py-1 border rounded text-sm bg-gray-50">
                        {course.registrations || 0} registrations
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No courses available</p>
            )}

            {/* Course Form */}
            {showForm && (
              <div className="bg-white p-6 rounded-lg shadow border mb-6">
                <h2 className="text-lg font-semibold mb-4">Create New Course</h2>
                <form className="space-y-4" onSubmit={handleCreateCourse}>
                  <input
                    type="text"
                    value={courseForm.courseName}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, courseName: e.target.value })
                    }
                    placeholder="Course Title"
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    value={courseForm.courseId}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, courseId: e.target.value })
                    }
                    placeholder="Course ID"
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    value={courseForm.courseDuration}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        courseDuration: e.target.value,
                      })
                    }
                    placeholder="Duration"
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    type="number"
                    value={courseForm.courseFee}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, courseFee: e.target.value })
                    }
                    placeholder="Fee"
                    className="w-full border rounded px-3 py-2"
                  />
                  <textarea
                    rows="3"
                    value={courseForm.courseDescription}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        courseDescription: e.target.value,
                      })
                    }
                    placeholder="Description"
                    className="w-full border rounded px-3 py-2"
                  />
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                    >
                      Create Course
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Students */}
            <div className="bg-white p-6 rounded-lg shadow border">
              <h2 className="text-lg font-semibold mb-4">Manage Students</h2>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student by name"
                  className="flex-1 border rounded px-3 py-2"
                />
                <button
                  onClick={handleSearch}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Search
                </button>
              </div>
              {selectedStudent ? (
                <div className="border p-4 rounded bg-gray-50">
                  <h3 className="font-semibold text-lg">{selectedStudent.name}</h3>
                  <p className="text-gray-600 mt-1">Skills:</p>
                  <ul className="list-disc pl-5 text-sm text-gray-700 mb-3">
                    {selectedStudent.skills?.map((skill, i) => (
                      <li key={i}>
                        {skill.name}{" "}
                        {skill.verified ? (
                          <span className="text-green-600">(Verified)</span>
                        ) : (
                          <button
                            onClick={() => handleApprove(skill.name)}
                            className="ml-2 text-sm bg-green-600 text-white px-2 py-1 rounded"
                          >
                            Verify
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500">No student selected</p>
              )}
            </div>
          </>
        )}

        {/* ===== JOBS ===== */}
        {activeTab === "jobs" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Jobs</h2>
            {jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job, i) => (
                  <div
                    key={i}
                    className="bg-white p-4 rounded-lg shadow border flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {job.description}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-4 text-sm">
                      <span className="text-blue-600">{job.company}</span>
                      <span className="text-gray-500">
                        Posted by {job.postedBy?.name || "Admin"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No jobs available</p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="flex justify-end px-6 py-4">
        <span className="text-sm text-gray-500 flex items-center gap-1">
          Koder Spark<span className="font-bold">Pvt Ltd</span>
        </span>
      </footer>
    </div>
  );
}
