import React, { useState, useEffect } from "react";
import {
  Search, Filter, Download, Mail, Heart, BookmarkPlus,
  Users, GraduationCap, Calendar, Star, ChevronDown, ChevronUp,
  User, Building
} from "lucide-react";

const Recruiter = () => {
  // Dummy recruiter data
  const recruiter = {
    name: "John Doe",
    email: "john@company.com",
    companyName: "TechCorp",
    avatar: "",
  };

  // Dummy students
  const dummyStudents = [
    {
      _id: "1",
      name: "Alice Johnson",
      email: "alice@student.com",
      college: "ABC University",
      year: 3,
      course: "Computer Science",
      skills: ["React", "Node.js", "Python", "MongoDB"],
      verifiedSkillsCount: 2,
      avatar: "",
      isFavorite: false,
      isShortlisted: false,
    },
    {
      _id: "2",
      name: "Bob Smith",
      email: "bob@student.com",
      college: "XYZ College",
      year: 2,
      course: "Information Technology",
      skills: ["Java", "Spring", "SQL"],
      verifiedSkillsCount: 1,
      avatar: "",
      isFavorite: true,
      isShortlisted: false,
    },
  ];

  // States
  const [students, setStudents] = useState(dummyStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ college: "", year: "", skills: "" });
  const [showFilters, setShowFilters] = useState(false);

  // Filtered students
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCollege = filters.college
      ? student.college.toLowerCase().includes(filters.college.toLowerCase())
      : true;
    const matchesYear = filters.year ? String(student.year) === filters.year : true;
    const matchesSkills = filters.skills
      ? student.skills.some((s) =>
          s.toLowerCase().includes(filters.skills.toLowerCase())
        )
      : true;
    return matchesSearch && matchesCollege && matchesYear && matchesSkills;
  });

  // Handlers
  const handleFavoriteToggle = (id) => {
    setStudents((prev) =>
      prev.map((s) =>
        s._id === id ? { ...s, isFavorite: !s.isFavorite } : s
      )
    );
  };

  const handleShortlistToggle = (id) => {
    setStudents((prev) =>
      prev.map((s) =>
        s._id === id ? { ...s, isShortlisted: !s.isShortlisted } : s
      )
    );
  };

  const handleContactStudent = (id, name) => {
    alert(`Message sent to ${name}`);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {recruiter.avatar ? (
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
            <h1 className="text-2xl font-bold">{recruiter.name}</h1>
            <div className="flex items-center text-gray-600 mt-1">
              <Building className="h-4 w-4 mr-2" />
              {recruiter.companyName}
            </div>
            <div className="text-sm text-gray-500 mt-1">{recruiter.email}</div>
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
              placeholder="Search students..."
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
        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No students found.</p>
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
                    <Calendar className="h-4 w-4 mr-2" />Year {student.year} • {student.course}
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
