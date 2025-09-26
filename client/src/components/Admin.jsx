import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, BookOpen, Briefcase, CheckCircle,
  PlusCircle, AlertCircle, BarChart3
} from 'lucide-react';

// Use absolute URL for your backend
const BASE_URL = "https://skillverify.onrender.com/api";

const Admin = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // New course form
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    duration: '',
    prerequisites: ''
  });

  // Skill verification form
  const [skillVerification, setSkillVerification] = useState({
    studentId: '',
    skillName: '',
    verified: false
  });

  const getAuthToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.token || null;
    } catch {
      return null;
    }
  };
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchAdmin = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.email) {
        setAdmin({
          _id: 'default-admin',
          name: 'Default Admin',
          email: 'admin@example.com',
          role: 'admin'
        });
        return;
      }
      setAdmin({
        _id: user._id || user.id || 'unknown',
        name: user.name || 'Admin User',
        email: user.email,
        role: user.role || 'admin'
      });
    } catch {
      setAdmin({
        _id: 'default-admin',
        name: 'Default Admin',
        email: 'admin@example.com',
        role: 'admin'
      });
    }
  };

  const fetchCoursesWithRegistrations = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/courses-with-registrations`, {
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' }
      });
      setCourses(res.data);
    } catch {
      setCourses([]);
    }
  };

  const fetchStudentsWithSkills = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/students-with-skills`, {
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' }
      });
      setStudents(res.data);
    } catch {
      setStudents([]);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/jobs`, {
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' }
      });
      setJobs(res.data);
    } catch {
      setJobs([]);
    }
  };

  const createCourse = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        courseName: newCourse.title,
        courseId: `COURSE_${Date.now()}`,
        courseDuration: newCourse.duration,
        courseFee: 0,
        courseDescription: newCourse.description
      };
      await axios.post(`${BASE_URL}/admin/create-course`, courseData, {
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' }
      });
      alert('Course created successfully!');
      setNewCourse({ title: '', description: '', duration: '', prerequisites: '' });
      fetchCoursesWithRegistrations();
    } catch (err) {
      alert(`Failed to create course: ${err.response?.data?.message || err.message}`);
    }
  };

  const verifySkill = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/admin/verify-skill`, {
        studentId: skillVerification.studentId,
        skillName: skillVerification.skillName
      }, {
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' }
      });
      alert('Skill verification updated successfully!');
      setSkillVerification({ studentId: '', skillName: '', verified: false });
      fetchStudentsWithSkills();
    } catch (err) {
      alert(`Failed to verify skill: ${err.response?.data?.message || err.message}`);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchAdmin();
      await Promise.all([
        fetchCoursesWithRegistrations(),
        fetchStudentsWithSkills(),
        fetchJobs()
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const hasNetworkIssues = courses.length === 0 && students.length === 0 && jobs.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {hasNetworkIssues && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
            <p className="ml-3 text-sm text-yellow-700">
              Unable to connect to the backend server. Some features may not work properly.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-6 gap-4 sm:gap-0">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            {admin && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Welcome, {admin.name}</span>
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {admin.name?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-4 sm:space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'courses', label: 'Courses', icon: BookOpen },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'jobs', label: 'Jobs', icon: Briefcase },
              { id: 'actions', label: 'Actions', icon: PlusCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center whitespace-nowrap px-3 py-3 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-1.5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Cards */}
            <div className="bg-white p-6 rounded-lg shadow flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold">{courses.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow flex items-center">
              <Briefcase className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Available Jobs</p>
                <p className="text-2xl font-bold">{jobs.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow flex items-center">
              <CheckCircle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Verified Skills</p>
                <p className="text-2xl font-bold">
                  {students.reduce((acc, s) => acc + (s.skills?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <h3 className="text-lg font-medium mb-4">Courses with Registrations</h3>
            <div className="grid gap-4">
              {courses.map((c) => (
                <div key={c._id} className="border rounded-lg p-4">
                  <h4 className="font-semibold">{c.courseName}</h4>
                  <p className="text-gray-600 mt-1">{c.courseDescription}</p>
                  <div className="mt-2 flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500 gap-1">
                    <span>Duration: {c.courseDuration} | Fee: ${c.courseFee}</span>
                    <span>Registrations: {c.registrations || 0}</span>
                  </div>
                </div>
              ))}
              {courses.length === 0 && (
                <p className="text-gray-500 text-center py-8">No courses available</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <h3 className="text-lg font-medium mb-4">Students with Skills</h3>
            <div className="grid gap-4">
              {students.map((s) => (
                <div key={s._id} className="border rounded-lg p-4">
                  <h4 className="font-semibold">{s.name}</h4>
                  <p className="text-gray-600">{s.email}</p>
                  {s.rollNo && <p className="text-sm text-gray-500">Roll No: {s.rollNo}</p>}
                  <div className="mt-2">
                    <p className="text-sm font-medium">Skills:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {s.skills && s.skills.length > 0 ? (
                        s.skills.map((sk, i) => (
                          <span
                            key={i}
                            className={`px-2 py-1 rounded-full text-xs ${
                              sk.verified
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {sk.name || sk} {sk.verified && '✓'}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">No skills verified</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {students.length === 0 && (
                <p className="text-gray-500 text-center py-8">No students found</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <h3 className="text-lg font-medium mb-4">Available Jobs</h3>
            <div className="grid gap-4">
              {jobs.map((job) => (
                <div key={job._id} className="border rounded-lg p-4">
                  <h4 className="font-semibold">{job.title}</h4>
                  <p className="text-gray-600">{job.companyName}</p>
                  <p className="text-sm text-gray-500">Location: {job.location}</p>
                  <p className="text-sm text-gray-500">Salary: {job.salary}</p>
                  <div className="mt-2">
                    <p className="text-sm font-medium">Requirements:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {job.skillsRequired?.map((req, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                  {job.postedBy && (
                    <p className="text-xs text-gray-400 mt-2">Posted by: {job.postedBy.name}</p>
                  )}
                </div>
              ))}
              {jobs.length === 0 && (
                <p className="text-gray-500 text-center py-8">No jobs available</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create Course */}
            <div className="bg-white shadow rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-medium mb-4">Create New Course</h3>
              <form onSubmit={createCourse} className="space-y-4">
                <input
                  type="text"
                  placeholder="Course Name"
                  required
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
                <textarea
                  placeholder="Description"
                  required
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                  rows={3}
                />
                <input
                  type="text"
                  placeholder="Duration (e.g., 4 weeks)"
                  required
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Course
                </button>
              </form>
            </div>

            {/* Verify Skill */}
            <div className="bg-white shadow rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-medium mb-4">Verify Student Skill</h3>
              <form onSubmit={verifySkill} className="space-y-4">
                <input
                  type="text"
                  placeholder="Student ID"
                  required
                  value={skillVerification.studentId}
                  onChange={(e) =>
                    setSkillVerification({ ...skillVerification, studentId: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Skill Name"
                  required
                  value={skillVerification.skillName}
                  onChange={(e) =>
                    setSkillVerification({ ...skillVerification, skillName: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Verify Skill
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
