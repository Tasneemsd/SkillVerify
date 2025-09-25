import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Mail, MapPin, GraduationCap, Calendar, Star, Users, Building } from 'lucide-react';

const BASE_API_URL = 'https://skillverify.onrender.com/api';

const Recruiter = ({ user, onLogout }) => {
  const [recruiter, setRecruiter] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [contactingStudent, setContactingStudent] = useState(null);

  // Get unique values for filters
  const uniqueSkills = [...new Set(students.flatMap(student => student.skills || []))];
  const uniqueYears = [...new Set(students.map(student => student.year).filter(Boolean))];
  const uniqueColleges = [...new Set(students.map(student => student.college).filter(Boolean))];

  useEffect(() => {
    fetchRecruiterData();
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, selectedSkills, selectedYear, selectedCollege]);

  const fetchRecruiterData = async () => {
    try {
      if (!user || !user.email) {
        setError('No recruiter logged in');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${BASE_API_URL}/recruiter/profile?email=${user.email}`);
      setRecruiter(response.data);
    } catch (err) {
      console.error('Error fetching recruiter data:', err);
      setError('Failed to load recruiter profile');
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/recruiter/students`);
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Skills filter
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(student =>
        selectedSkills.every(skill => student.skills?.includes(skill))
      );
    }

    // Year filter
    if (selectedYear) {
      filtered = filtered.filter(student => student.year === selectedYear);
    }

    // College filter
    if (selectedCollege) {
      filtered = filtered.filter(student => student.college === selectedCollege);
    }

    setFilteredStudents(filtered);
  };

  const handleContactStudent = async (studentEmail, studentName) => {
    try {
      setContactingStudent(studentEmail);
      
      if (!user || !user.email) {
        alert('Please log in to contact students');
        return;
      }

      const response = await axios.post(`${BASE_API_URL}/recruiter/contact-student`, {
        recruiterEmail: user.email,
        studentEmail: studentEmail,
        message: `Hello ${studentName}, I'm interested in your profile and would like to discuss potential opportunities.`
      });

      if (response.data.success) {
        alert('Message sent successfully!');
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Error contacting student:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setContactingStudent(null);
    }
  };

  const toggleSkillFilter = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {recruiter?.name || 'Recruiter Dashboard'}
                </h1>
                <p className="text-gray-600">{recruiter?.company || 'SkillVerify Platform'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{filteredStudents.length} Students</span>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Year Filter */}
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">All Years</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* College Filter */}
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
              >
                <option value="">All Colleges</option>
                {uniqueColleges.map(college => (
                  <option key={college} value={college}>{college}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSkills([]);
                  setSelectedYear('');
                  setSelectedCollege('');
                }}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Skills Filter */}
          {uniqueSkills.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Filter by Skills:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {uniqueSkills.slice(0, 10).map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkillFilter(skill)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedSkills.includes(skill)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
                {uniqueSkills.length > 10 && (
                  <span className="px-3 py-1 text-sm text-gray-500">
                    +{uniqueSkills.length - 10} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Year Filter */}
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">All Years</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* College Filter */}
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
              >
                <option value="">All Colleges</option>
                {uniqueColleges.map(college => (
                  <option key={college} value={college}>{college}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSkills([]);
                  setSelectedYear('');
                  setSelectedCollege('');
                }}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Skills Filter */}
          {uniqueSkills.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center space-x-2 mb-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Filter by Skills:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {uniqueSkills.slice(0, 10).map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkillFilter(skill)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedSkills.includes(skill)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
                {uniqueSkills.length > 10 && (
                  <span className="px-3 py-1 text-sm text-gray-500">
                    +{uniqueSkills.length - 10} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Students Grid */}
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div key={student.id || student.email} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                <div className="p-6">
                  {/* Student Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {student.name || 'Anonymous Student'}
                      </h3>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                    <button
                      onClick={() => handleContactStudent(student.email, student.name)}
                      disabled={contactingStudent === student.email}
                      className="ml-4 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      title="Contact Student"
                    >
                      {contactingStudent === student.email ? (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <Mail className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Student Details */}
                  <div className="space-y-3">
                    {student.college && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <GraduationCap className="w-4 h-4" />
                        <span>{student.college}</span>
                      </div>
                    )}
                    
                    {student.year && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{student.year}</span>
                      </div>
                    )}

                    {student.location && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{student.location}</span>
                      </div>
                    )}

                    {student.gpa && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Star className="w-4 h-4" />
                        <span>GPA: {student.gpa}</span>
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  {student.skills && student.skills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {student.skills.slice(0, 4).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {student.skills.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{student.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recruiter;