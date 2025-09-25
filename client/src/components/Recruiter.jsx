import React, { useState, useEffect, useCallback } from "react";
import {
  Search, Filter, Download, Mail, Heart, BookmarkPlus,
  Users, GraduationCap, Calendar, Star, ChevronDown, ChevronUp,
  User, Building, Loader2, AlertCircle
} from "lucide-react";

const API_BASE_URL = "https://skillverify.onrender.com/api";

const Recruiter = () => {
  // States
  const [recruiter, setRecruiter] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ college: "", year: "", skills: "" });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch recruiter details
  const fetchRecruiterDetails = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/recruiter/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if you have authentication
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch recruiter details: ${response.status}`);
      }

      const data = await response.json();
      setRecruiter(data.recruiter || data);
    } catch (err) {
      console.error('Error fetching recruiter details:', err);
      // Set default recruiter if API fails
      setRecruiter({
        name: "Recruiter",
        email: "recruiter@company.com",
        companyName: "Company",
        avatar: ""
      });
    }
  }, []);

  // Fetch students
  const fetchStudents = useCallback(async () => {
    try {
      setStudentsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/student/profile/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if you have authentication
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch students: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different possible response structures
      let studentsData = [];
      if (data.students) {
        studentsData = data.students;
      } else if (Array.isArray(data)) {
        studentsData = data;
      } else if (data.data && Array.isArray(data.data)) {
        studentsData = data.data;
      }
      
      // Add local state for favorites and shortlisted, ensure required fields exist
      const studentsWithLocalState = studentsData.map((student) => ({
        _id: student._id || student.id,
        name: student.name || "Unknown Student",
        email: student.email || "No email",
        college: student.college || "Unknown College",
        year: student.year || 1,
        course: student.course || "Unknown Course",
        skills: student.skills || [],
        verifiedSkillsCount: student.verifiedSkillsCount || 0,
        avatar: student.avatar || "",
        isFavorite: false,
        isShortlisted: false,
      }));
      
      setStudents(studentsWithLocalState);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(`Failed to load students: ${err.message}`);
    } finally {
      setStudentsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchRecruiterDetails(),
          fetchStudents()
        ]);
      } catch (err) {
        console.error('Error initializing data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [fetchRecruiterDetails, fetchStudents]);

  // Filtered students
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCollege = filters.college
      ? student.college.toLowerCase().includes(filters.college.toLowerCase())
      : true;
    const matchesYear = filters.year ? String(student.year) === filters.year : true;
    const matchesSkills = filters.skills
      ? student.skills && student.skills.some((s) =>
          s.toLowerCase().includes(filters.skills.toLowerCase())
        )
      : true;
    return matchesSearch && matchesCollege && matchesYear && matchesSkills;
  });

  // Handlers
  const handleFavoriteToggle = useCallback((id) => {
    setStudents((prev) =>
      prev.map((s) =>
        s._id === id ? { ...s, isFavorite: !s.isFavorite } : s
      )
    );
  }, []);

  const handleShortlistToggle = useCallback((id) => {
    setStudents((prev) =>
      prev.map((s) =>
        s._id === id ? { ...s, isShortlisted: !s.isShortlisted } : s
      )
    );
  }, []);

  const handleContactStudent = useCallback(async (id, name) => {
    try {
      // You can implement actual messaging functionality here
      // For now, showing a simple alert
      alert(`Message sent to ${name}`);
      
      // Example API call for contacting student:
      // const response = await fetch(`${API_BASE_URL}/recruiter/contact-student`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({ studentId: id, message: 'Hello!' }),
      //   credentials: 'include'
      // });
    } catch (err) {
      console.error('Error contacting student:', err);
      alert('Failed to send message. Please try again.');
    }
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({ college: "", year: "", skills: "" });
    setSearchTerm("");
  }, []);

  // Retry data fetch
  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchRecruiterDetails();
    fetchStudents();
  }, [fetchRecruiterDetails, fetchStudents]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !recruiter && students.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {recruiter?.avatar ? (
            <img
              src={recruiter.avatar}
              alt={recruiter.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{recruiter?.name || 'Loading...'}</h1>
            <div className="flex items-center text-gray-600 mt-1">
              <Building className="h-4 w-4 mr-2" />
              {recruiter?.companyName || 'Loading...'}
            </div>
            <div className="text-sm text-gray-500 mt-1">{recruiter?.email || 'Loading...'}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{students.length}</div>
          <div className="text-sm text-gray-500">Total Students</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </button>
            {(searchTerm || filters.college || filters.year || filters.skills) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">College</label>
              <input
                type="text"
                placeholder="Filter by college..."
                value={filters.college}
                onChange={(e) => setFilters({ ...filters, college: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Years</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
              <input
                type="text"
                placeholder="e.g., React, Node.js, Python"
                value={filters.skills}
                onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Students Grid */}
      <div className="bg-white rounded-lg shadow-sm">
        {studentsLoading ? (
          <div className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading students...</p>
          </div>
        ) : error && students.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchStudents()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry Loading Students
            </button>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {students.length === 0 ? 'No students available.' : 'No students match your search criteria.'}
            </p>
            {(searchTerm || filters.college || filters.year || filters.skills) && (
              <button
                onClick={clearFilters}
                className="mt-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                Clear filters to see all students
              </button>
            )}
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div
                key={student._id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {student.avatar ? (
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleFavoriteToggle(student._id)}
                      className={`p-2 rounded-lg transition-colors ${
                        student.isFavorite
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${student.isFavorite ? "fill-current" : ""}`}
                      />
                    </button>
                    <button
                      onClick={() => handleShortlistToggle(student._id)}
                      className={`p-2 rounded-lg transition-colors ${
                        student.isShortlisted
                          ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <BookmarkPlus
                        className={`h-4 w-4 ${student.isShortlisted ? "fill-current" : ""}`}
                      />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    {student.college}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Year {student.year} • {student.course}
                  </div>
                  {student.verifiedSkillsCount > 0 && (
                    <div className="flex items-center text-sm text-green-600">
                      <Star className="h-4 w-4 mr-2" />
                      {student.verifiedSkillsCount} verified skills
                    </div>
                  )}
                </div>
                {student.skills && student.skills.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {student.skills.slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {student.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{student.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                <button
                  onClick={() => handleContactStudent(student._id, student.name)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Student
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recruiter;