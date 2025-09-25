import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, BookOpen, Briefcase, CheckCircle, PlusCircle, AlertCircle, BarChart3 } from 'lucide-react';

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

  // Get authentication token from localStorage
  const getAuthToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.token || null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  };

  // Get authentication headers
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch admin details from localStorage with fallback
  const fetchAdmin = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // If no user data in localStorage, create a default admin
      if (!user.email) {
        console.warn('No admin credentials found in localStorage, using default admin');
        setAdmin({
          _id: 'default-admin',
          name: 'Default Admin',
          email: 'admin@example.com',
          role: 'admin'
        });
        return;
      }

      // Create admin object from localStorage (no admin profile endpoint needed)
      setAdmin({
        _id: user._id || user.id || 'unknown',
        name: user.name || 'Admin User',
        email: user.email,
        role: user.role || 'admin'
      });
    } catch (error) {
      console.error('Error setting up admin:', error.message);
      // Don't set error state, just use default admin
      setAdmin({
        _id: 'default-admin',
        name: 'Default Admin',
        email: 'admin@example.com',
        role: 'admin'
      });
    }
  };

  // Fetch courses with registrations
  const fetchCoursesWithRegistrations = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/courses-with-registrations`, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses with registrations:', error.message);
      // Don't set error state, just use empty array
      setCourses([]);
    }
  };

  // Fetch students with skills
  const fetchStudentsWithSkills = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/students-with-skills`, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students with skills:', error.message);
      // Don't set error state, just use empty array
      setStudents([]);
    }
  };

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/jobs`, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error.message);
      // Don't set error state, just use empty array
      setJobs([]);
    }
  };

  // Create new course
  const createCourse = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        courseName: newCourse.title,
        courseId: `COURSE_${Date.now()}`, // Generate unique course ID
        courseDuration: newCourse.duration,
        courseFee: 0, // Default fee, you can add this to the form if needed
        courseDescription: newCourse.description
      };
      
      const response = await axios.post(`${BASE_URL}/admin/create-course`, courseData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      });
      
      alert('Course created successfully!');
      setNewCourse({ title: '', description: '', duration: '', prerequisites: '' });
      fetchCoursesWithRegistrations(); // Refresh courses list
    } catch (error) {
      console.error('Error creating course:', error);
      alert(`Failed to create course: ${error.response?.data?.message || error.message}`);
    }
  };

  // Verify skill
  const verifySkill = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/admin/verify-skill`, {
        studentId: skillVerification.studentId,
        skillName: skillVerification.skillName
      }, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      });
      
      alert('Skill verification updated successfully!');
      setSkillVerification({ studentId: '', skillName: '', verified: false });
      fetchStudentsWithSkills(); // Refresh students list
    } catch (error) {
      console.error('Error verifying skill:', error);
      alert(`Failed to verify skill: ${error.response?.data?.message || error.message}`);
    }
  };

  // Load all data on component mount
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

  // Show loading state
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

  // Only show error state for critical errors, not network issues
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Add network status indicator
  const hasNetworkIssues = courses.length === 0 && students.length === 0 && jobs.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Network Status Banner */}
      {hasNetworkIssues && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Unable to connect to the backend server. Some features may not work properly.
                Please check your internet connection or try again later.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            {admin && (
              <div className="flex items-center space-x-4">
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

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
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
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Verified Skills</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {students.reduce((acc, student) => acc + (student.skills?.length || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Courses with Registrations</h3>
              <div className="grid gap-4">
                {courses.map((course) => (
                  <div key={course._id} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900">{course.courseName}</h4>
                    <p className="text-gray-600 mt-1">{course.courseDescription}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Duration: {course.courseDuration} | Fee: ${course.courseFee}
                      </span>
                      <span className="text-sm text-gray-500">
                        Registrations: {course.registrations || 0}
                      </span>
                    </div>
                  </div>
                ))}
                {courses.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    {hasNetworkIssues ? 'Unable to load courses - check network connection' : 'No courses available'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Students with Skills</h3>
              <div className="grid gap-4">
                {students.map((student) => (
                  <div key={student._id} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900">{student.name}</h4>
                    <p className="text-gray-600">{student.email}</p>
                    {student.rollNo && (
                      <p className="text-sm text-gray-500">Roll No: {student.rollNo}</p>
                    )}
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Skills:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {student.skills && student.skills.length > 0 ? (
                          student.skills.map((skill, index) => (
                            <span 
                              key={index} 
                              className={`px-2 py-1 rounded-full text-xs ${
                                skill.verified 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {skill.name || skill} {skill.verified && '✓'}
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
                  <p className="text-gray-500 text-center py-8">
                    {hasNetworkIssues ? 'Unable to load students - check network connection' : 'No students found'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Available Jobs</h3>
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <div key={job._id} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900">{job.title}</h4>
                    <p className="text-gray-600">{job.companyName}</p>
                    <p className="text-sm text-gray-500">Location: {job.location}</p>
                    <p className="text-sm text-gray-500">Salary: {job.salary}</p>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Requirements:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {job.skillsRequired && job.skillsRequired.length > 0 ? (
                          job.skillsRequired.map((req, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                              {req}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">No requirements listed</span>
                        )}
                      </div>
                    </div>
                    {job.postedBy && (
                      <p className="text-xs text-gray-400 mt-2">
                        Posted by: {job.postedBy.name}
                      </p>
                    )}
                  </div>
                ))}
                {jobs.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    {hasNetworkIssues ? 'Unable to load jobs - check network connection' : 'No jobs available'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create Course Form */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Create New Course</h3>
                <form onSubmit={createCourse} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Course Name</label>
                    <input
                      type="text"
                      required
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      required
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Duration</label>
                    <input
                      type="text"
                      required
                      value={newCourse.duration}
                      onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                      placeholder="e.g., 4 weeks"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Course
                  </button>
                </form>
              </div>
            </div>

            {/* Skill Verification Form */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Verify Student Skill</h3>
                <form onSubmit={verifySkill} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Student ID</label>
                    <input
                      type="text"
                      required
                      value={skillVerification.studentId}
                      onChange={(e) => setSkillVerification({ ...skillVerification, studentId: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Skill Name</label>
                    <input
                      type="text"
                      required
                      value={skillVerification.skillName}
                      onChange={(e) => setSkillVerification({ ...skillVerification, skillName: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Verify Skill
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;