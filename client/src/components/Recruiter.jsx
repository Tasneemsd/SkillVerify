import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, Filter, Mail, Users, Building, GraduationCap, Calendar, Star 
} from 'lucide-react';

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

  useEffect(() => {
    fetchRecruiterData();
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, selectedSkills, selectedYear, selectedCollege]);

  const fetchRecruiterData = async () => {
    try {
      if (!user?.email) throw new Error('No recruiter logged in');
      const res = await axios.get(`${BASE_API_URL}/recruiter/profile?email=${user.email}`);
      setRecruiter(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load recruiter profile');
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${BASE_API_URL}/recruiter/students`);
      setStudents(res.data);
      setFilteredStudents(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedSkills.length) {
      filtered = filtered.filter(s => selectedSkills.every(skill => s.skills?.includes(skill)));
    }

    if (selectedYear) filtered = filtered.filter(s => s.year === selectedYear);
    if (selectedCollege) filtered = filtered.filter(s => s.college === selectedCollege);

    setFilteredStudents(filtered);
  };

  const handleContactStudent = async (email, name) => {
    try {
      if (!user?.email) return alert('Please login first');
      setContactingStudent(email);

      const res = await axios.post(`${BASE_API_URL}/recruiter/contact-student`, {
        recruiterEmail: user.email,
        studentEmail: email,
        message: `Hello ${name}, I am interested in your profile.`,
      });

      alert(res.data.success ? 'Message sent!' : 'Failed to send message');
    } catch (err) {
      console.error(err);
      alert('Error sending message');
    } finally {
      setContactingStudent(null);
    }
  };

  const toggleSkillFilter = skill =>
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );

  const uniqueSkills = [...new Set(students.flatMap(s => s.skills || []))];
  const uniqueYears = [...new Set(students.map(s => s.year).filter(Boolean))];
  const uniqueColleges = [...new Set(students.map(s => s.college).filter(Boolean))];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <p className="text-red-600 mb-4">{error}</p>
      <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Retry</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{recruiter?.name || 'Recruiter Dashboard'}</h1>
            <p className="text-gray-600">{recruiter?.company || 'SkillVerify'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="w-4 h-4" /> <span>{filteredStudents.length} Students</span>
          </div>
          <button onClick={onLogout} className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">Logout</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
          >
            <option value="">All Years</option>
            {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={selectedCollege}
            onChange={e => setSelectedCollege(e.target.value)}
          >
            <option value="">All Colleges</option>
            {uniqueColleges.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            onClick={() => { setSearchTerm(''); setSelectedSkills([]); setSelectedYear(''); setSelectedCollege(''); }}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Clear Filters
          </button>
        </div>

        {/* Skills Filter */}
        {uniqueSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {uniqueSkills.map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkillFilter(skill)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedSkills.includes(skill) ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        )}

        {/* Students Grid */}
        {filteredStudents.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No Students Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map(student => (
              <div key={student.id || student.email} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{student.name || 'Anonymous'}</h3>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>
                  <button
                    onClick={() => handleContactStudent(student.email, student.name)}
                    disabled={contactingStudent === student.email}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {contactingStudent === student.email ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : <Mail className="w-4 h-4" />}
                  </button>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  {student.college && <div className="flex items-center"><GraduationCap className="w-4 h-4 mr-1" />{student.college}</div>}
                  {student.year && <div className="flex items-center"><Calendar className="w-4 h-4 mr-1" />Year {student.year}</div>}
                  {student.gpa && <div className="flex items-center"><Star className="w-4 h-4 mr-1" />GPA: {student.gpa}</div>}
                </div>

                {student.skills?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {student.skills.slice(0, 4).map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{skill}</span>
                    ))}
                    {student.skills.length > 4 && <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">+{student.skills.length - 4} more</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Recruiter;
