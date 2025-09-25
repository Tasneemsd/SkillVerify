import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("courses"); // courses | jobs
  const [showForm, setShowForm] = useState(false);

  // Data
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState(null);
  const [courseError, setCourseError] = useState(null);
  const [studentError, setStudentError] = useState(null);

  const [adminName, setAdminName] = useState("Admin");

  // Loading states
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState({});

  // Course form
  const [courseForm, setCourseForm] = useState({
    courseName: "",
    courseId: "",
    courseDuration: "",
    courseFee: "",
    courseDescription: "",
  });

  // Read user/token safely
  const getStoredUser = () => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const storedUser = getStoredUser();
  const token = storedUser?.token || localStorage.getItem("token") || null;
  const studentEmail = storedUser?.email || "";

  // Fetch functions
  const fetchCourses = useCallback(async () => {
    try {
      const res = await axios.get("/api/admin/courses-with-registrations");
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setCourses([]);
      setGlobalError("Failed to fetch courses");
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await axios.get("/api/admin/students-with-skills");
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setStudents([]);
      setGlobalError("Failed to fetch students");
    }
  }, []);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await axios.get("/api/admin/jobs");
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setJobs([]);
      setGlobalError("Failed to fetch jobs");
    }
  }, []);

  const fetchAdmin = useCallback(async () => {
    try {
      if (storedUser?.name) {
        setAdminName(storedUser.name);
        return;
      }
      if (!studentEmail || !token) return;

      const res = await axios.get(`/api/admin/by-email?email=${encodeURIComponent(studentEmail)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const nameFromRes = res?.data?.name || res?.data?.adminName || res?.data;
      setAdminName(typeof nameFromRes === "string" ? nameFromRes : JSON.stringify(nameFromRes));
    } catch {
      if (storedUser) setAdminName(storedUser.name || "Admin");
    }
  }, [studentEmail, token, storedUser]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchCourses(), fetchStudents(), fetchJobs()]);
        await fetchAdmin();
      } catch {
        setGlobalError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [fetchCourses, fetchStudents, fetchJobs, fetchAdmin]);

  // Handlers
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSelectedStudent(null);
      setStudentError(null);
      return;
    }
    const q = searchQuery.trim().toLowerCase();
    const found = students.find((s) => (s.name || "").toLowerCase().includes(q));
    setSelectedStudent(found || null);
    setStudentError(!found ? "No student found with that name" : null);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedStudent(null);
    setStudentError(null);
  };

  const handleApprove = async (skillName) => {
    if (!selectedStudent) {
      setStudentError("No student selected.");
      return;
    }
    try {
      setLoadingSkills((prev) => ({ ...prev, [skillName]: true }));
      await axios.post("/api/admin/verify-skill", {
        studentId: selectedStudent._id,
        skillName,
      });
      await fetchStudents();
      setSelectedStudent((prev) => ({
        ...prev,
        skills: (prev.skills || []).map((s) =>
          s.name === skillName ? { ...s, verified: true } : s
        ),
      }));
      setStudentError(null);
    } catch {
      setStudentError("Failed to verify skill. Try again.");
    } finally {
      setLoadingSkills((prev) => ({ ...prev, [skillName]: false }));
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const { courseName, courseId } = courseForm;
    if (!courseName.trim() || !courseId.trim()) {
      setCourseError("Course title and ID are required.");
      return;
    }
    try {
      setActionLoading(true);
      const payload = { ...courseForm, courseFee: courseForm.courseFee ? Number(courseForm.courseFee) : 0 };
      await axios.post("/api/admin/create-course", payload);
      await fetchCourses();
      setShowForm(false);
      setCourseForm({ courseName: "", courseId: "", courseDuration: "", courseFee: "", courseDescription: "" });
      setCourseError(null);
    } catch {
      setCourseError("Failed to create course. Try again.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p className="text-center p-6">Loading dashboard...</p>;

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
            className={`px-6 py-2 font-medium ${activeTab === "courses" ? "bg-white shadow text-black" : "text-gray-500 hover:text-black"}`}
          >
            Manage Courses
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-6 py-2 font-medium ${activeTab === "jobs" ? "bg-white shadow text-black" : "text-gray-500 hover:text-black"}`}
          >
            Manage Jobs
          </button>
        </div>
      </div>

      <div className="px-6 mt-6">
        {globalError && (
          <div className="mb-4 text-center text-red-600">
            {globalError}
            <button onClick={() => setGlobalError(null)} className="ml-3 px-2 py-1 bg-gray-100 border rounded text-sm">x</button>
          </div>
        )}

        {/* COURSES */}
        {activeTab === "courses" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Courses</h2>
              <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800">+ Add Course</button>
            </div>

            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {courses.map((course, i) => (
                  <div key={course._id || course.courseId || i} className="bg-white p-4 rounded-lg shadow border flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold">{course.courseName}</h3>
                      <p className="text-gray-500 text-sm mt-1">{course.courseDescription}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-green-600 font-semibold">₹{course.courseFee ?? 0}</span>
                      <span className="px-3 py-1 border rounded text-sm bg-gray-50">{course.registrations || 0} registrations</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-500">No courses available</p>}

            {showForm && (
              <div className="bg-white p-6 rounded-lg shadow border mb-6">
                <h2 className="text-lg font-semibold mb-4">Create New Course</h2>
                {courseError && <p className="text-red-600 mb-2">{courseError}</p>}
                <form className="space-y-4" onSubmit={handleCreateCourse}>
                  <input type="text" placeholder="Course Title" value={courseForm.courseName} onChange={(e) => setCourseForm({ ...courseForm, courseName: e.target.value })} className="w-full border rounded px-3 py-2" />
                  <input type="text" placeholder="Course ID" value={courseForm.courseId} onChange={(e) => setCourseForm({ ...courseForm, courseId: e.target.value })} className="w-full border rounded px-3 py-2" />
                  <input type="text" placeholder="Duration" value={courseForm.courseDuration} onChange={(e) => setCourseForm({ ...courseForm, courseDuration: e.target.value })} className="w-full border rounded px-3 py-2" />
                  <input type="number" placeholder="Fee" value={courseForm.courseFee} onChange={(e) => setCourseForm({ ...courseForm, courseFee: e.target.value })} className="w-full border rounded px-3 py-2" />
                  <textarea rows="3" placeholder="Description" value={courseForm.courseDescription} onChange={(e) => setCourseForm({ ...courseForm, courseDescription: e.target.value })} className="w-full border rounded px-3 py-2" />
                  <div className="flex gap-3">
                    <button type="submit" disabled={actionLoading} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-60">
                      {actionLoading ? "Creating..." : "Create Course"}
                    </button>
                    <button type="button" onClick={() => { setShowForm(false); setCourseForm({ courseName: "", courseId: "", courseDuration: "", courseFee: "", courseDescription: "" }); setCourseError(null); }} className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* STUDENTS */}
            <div className="bg-white p-6 rounded-lg shadow border">
              <h2 className="text-lg font-semibold mb-4">Manage Students</h2>
              <div className="flex gap-3 mb-4">
                <input type="text" placeholder="Search student by name (partial)" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 border rounded px-3 py-2" />
                <button onClick={handleSearch} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Search</button>
                <button onClick={handleClearSearch} className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200">Clear</button>
              </div>
              {studentError && <p className="text-red-600 mb-2">{studentError}</p>}
              {selectedStudent ? (
                <div className="border p-4 rounded bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedStudent.name}</h3>
                      <p className="text-gray-600 mt-1">Skills:</p>
                    </div>
                    <div>
                      <button onClick={() => setSelectedStudent(null)} className="px-2 py-1 text-sm border rounded bg-white">Close</button>
                    </div>
                  </div>
                  <ul className="list-disc pl-5 text-sm text-gray-700 mb-3 mt-2">
                    {(selectedStudent.skills || []).length === 0 && <li className="text-gray-500">No skills listed</li>}
                    {(selectedStudent.skills || []).map((skill, i) => (
                      <li key={skill._id || skill.name || i} className="mt-1">
                        {skill.name}{" "}
                        {skill.verified ? (
                          <span className="text-green-600">(Verified)</span>
                        ) : (
                          <button onClick={() => handleApprove(skill.name)} disabled={loadingSkills[skill.name]} className="ml-2 text-sm bg-green-600 text-white px-2 py-1 rounded disabled:opacity-60">
                            {loadingSkills[skill.name] ? "Verifying..." : "Verify"}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : <p className="text-gray-500">No student selected</p>}
            </div>
          </>
        )}

        {/* JOBS */}
        {activeTab === "jobs" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Jobs</h2>
            {jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job, i) => (
                  <div key={job._id || `${job.title}-${i}`} className="bg-white p-4 rounded-lg shadow border flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-gray-500 text-sm mt-1">{job.description}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4 text-sm">
                      <span className="text-blue-600">{job.company}</span>
                      <span className="text-gray-500">Posted by {job.postedBy?.name || "Admin"}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-500">No jobs available</p>}
          </div>
        )}
      </div>

      <footer className="flex justify-end px-6 py-4">
        <span className="text-sm text-gray-500 flex items-center gap-1">
          Koder Spark<span className="font-bold">Pvt Ltd</span>
        </span>
      </footer>
    </div>
  );
}
