import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("courses"); // courses | jobs
  const [showForm, setShowForm] = useState(false);

  // Always arrays
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

  // small action loading state (for approve / create etc)
  const [actionLoading, setActionLoading] = useState(false);

  // read user/token safely from localStorage
  const getStoredUser = () => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  };

  const storedUser = getStoredUser();
  const token = storedUser?.token || localStorage.getItem("token") || null;
  const studentEmail = storedUser?.email || "";

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchCourses(), fetchStudents(), fetchJobs()]);
        // fetch admin name (after other fetches or from localStorage)
        await fetchAdmin();
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch admin name: prefer localStorage, fallback to API only if email/token exist
  const fetchAdmin = async () => {
    try {
      const stored = getStoredUser();
      if (stored?.name) {
        setAdminName(stored.name);
        return;
      }

      // if we have an email + token, try an API fetch (endpoint may vary in your backend)
      if (!studentEmail || !token) {
        // nothing to fetch — keep Admin default
        return;
      }

      // NOTE: adjust endpoint if your backend expects a different route.
      const res = await axios.get(`/api/admin/by-email?email=${encodeURIComponent(studentEmail)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // set from response safely
      const nameFromRes = res?.data?.name || res?.data?.adminName || res?.data;
      setAdminName(typeof nameFromRes === "string" ? nameFromRes : JSON.stringify(nameFromRes));
    } catch (err) {
      console.warn("Could not fetch admin details, falling back to localStorage...");
      const storedUser = getStoredUser();
      if (storedUser) setAdminName(storedUser.name || "Admin");
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get("/api/admin/courses-with-registrations");
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch courses", err);
      setCourses([]);
    }
  };

  // Fetch students
  const fetchStudents = async () => {
    try {
      const res = await axios.get("/api/admin/students-with-skills");
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch students", err);
      setStudents([]);
    }
  };

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const res = await axios.get("/api/admin/jobs");
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
      setJobs([]);
    }
  };

  // Student search (partial, case-insensitive)
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSelectedStudent(null);
      return;
    }
    const q = searchQuery.trim().toLowerCase();
    const found = students.find((s) => (s.name || "").toLowerCase().includes(q));
    setSelectedStudent(found || null);
    if (!found) setError("No student found with that name (partial matches allowed).");
    else setError(null);
  };

  // Clear search / selection
  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedStudent(null);
    setError(null);
  };

  // Approve skill
  const handleApprove = async (skillName) => {
    if (!selectedStudent) {
      setError("No student selected.");
      return;
    }
    try {
      setActionLoading(true);
      await axios.post("/api/admin/verify-skill", {
        studentId: selectedStudent._id,
        skillName,
      });
      // refresh students list and update selectedStudent locally for immediate feedback
      await fetchStudents();
      setSelectedStudent((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          skills: (prev.skills || []).map((s) =>
            s.name === skillName ? { ...s, verified: true } : s
          ),
        };
      });
      setError(null);
    } catch (err) {
      console.error("Failed to verify skill", err);
      setError("Failed to verify skill. Try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Create course with small validation
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const { courseName, courseId, courseFee } = courseForm;
    if (!courseName.trim() || !courseId.trim()) {
      setError("Course title and ID are required.");
      return;
    }
    try {
      setActionLoading(true);
      // ensure fee is number (backend may handle this)
      const payload = {
        ...courseForm,
        courseFee: courseForm.courseFee ? Number(courseForm.courseFee) : 0,
      };
      await axios.post("/api/admin/create-course", payload);
      await fetchCourses();
      setShowForm(false);
      setCourseForm({
        courseName: "",
        courseId: "",
        courseDuration: "",
        courseFee: "",
        courseDescription: "",
      });
      setError(null);
    } catch (err) {
      console.error("Failed to create course", err);
      setError("Failed to create course. Try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // ====== UI ======
  if (loading) {
    return <p className="text-center p-6">Loading dashboard...</p>;
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
        {/* show any error */}
        {error && (
          <div className="mb-4 text-center text-red-600">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-3 px-2 py-1 bg-gray-100 border rounded text-sm"
            >
              x
            </button>
          </div>
        )}

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
                {courses.map((course, i) => {
                  const key = course._id || course.courseId || i;
                  return (
                    <div
                      key={key}
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
                          ₹{course.courseFee ?? 0}
                        </span>
                        <span className="px-3 py-1 border rounded text-sm bg-gray-50">
                          {course.registrations || 0} registrations
                        </span>
                      </div>
                    </div>
                  );
                })}
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
                      disabled={actionLoading}
                      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-60"
                    >
                      {actionLoading ? "Creating..." : "Create Course"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setCourseForm({
                          courseName: "",
                          courseId: "",
                          courseDuration: "",
                          courseFee: "",
                          courseDescription: "",
                        });
                      }}
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
                  placeholder="Search student by name (partial)"
                  className="flex-1 border rounded px-3 py-2"
                />
                <button
                  onClick={handleSearch}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Search
                </button>
                <button
                  onClick={handleClearSearch}
                  className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
                >
                  Clear
                </button>
              </div>
              {selectedStudent ? (
                <div className="border p-4 rounded bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedStudent.name}</h3>
                      <p className="text-gray-600 mt-1">Skills:</p>
                    </div>
                    <div>
                      <button
                        onClick={() => setSelectedStudent(null)}
                        className="px-2 py-1 text-sm border rounded bg-white"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  <ul className="list-disc pl-5 text-sm text-gray-700 mb-3 mt-2">
                    {(selectedStudent.skills || []).length === 0 && (
                      <li className="text-gray-500">No skills listed</li>
                    )}
                    {(selectedStudent.skills || []).map((skill, i) => (
                      <li key={skill._id || skill.name || i} className="mt-1">
                        {skill.name}{" "}
                        {skill.verified ? (
                          <span className="text-green-600">(Verified)</span>
                        ) : (
                          <button
                            onClick={() => handleApprove(skill.name)}
                            className="ml-2 text-sm bg-green-600 text-white px-2 py-1 rounded disabled:opacity-60"
                            disabled={actionLoading}
                          >
                            {actionLoading ? "Verifying..." : "Verify"}
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
                {jobs.map((job, i) => {
                  const key = job._id || `${job.title}-${i}`;
                  return (
                    <div
                      key={key}
                      className="bg-white p-4 rounded-lg shadow border flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-gray-500 text-sm mt-1">{job.description}</p>
                      </div>
                      <div className="flex justify-between items-center mt-4 text-sm">
                        <span className="text-blue-600">{job.company}</span>
                        <span className="text-gray-500">
                          Posted by {job.postedBy?.name || "Admin"}
                        </span>
                      </div>
                    </div>
                  );
                })}
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
