import React, { useState } from "react";
import { MdEmail } from "react-icons/md";

const studentsData = [
  {
    name: "Alice Johnson",
    course: "Computer Science",
    college: "Stanford University",
    year: 2025,
    verifiedSkills: 0,
    initials: "A",
  },
  {
    name: "Test Student",
    course: "Computer Science",
    college: "Stanford University",
    year: 2025,
    verifiedSkills: 0,
    initials: "T",
  },
  {
    name: "Workflow Test Student",
    course: "Computer Science",
    college: "MIT",
    year: 2025,
    verifiedSkills: 0,
    initials: "W",
  },
  {
    name: "Rajuu",
    course: "CSE",
    college: "RGUKT",
    year: 2026,
    verifiedSkills: 0,
    initials: "R",
  },
  {
    name: "ravi",
    course: "ECE",
    college: "RJY",
    year: 2026,
    verifiedSkills: 0,
    initials: "r",
  },
  {
    name: "rajuu",
    course: "ghdkh",
    college: "hgfvhk",
    year: 2026,
    verifiedSkills: 0,
    initials: "r",
  },
];

const Recruiter = () => {
  const [filters, setFilters] = useState({
    college: "",
    year: "",
    skills: "",
  });

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredStudents = studentsData.filter((student) => {
    return (
      (filters.college === "" ||
        student.college.toLowerCase().includes(filters.college.toLowerCase())) &&
      (filters.year === "" || student.year === parseInt(filters.year)) &&
      (filters.skills === "" || student.verifiedSkills > 0) // Adjust if you want skill name match
    );
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Search Verified Students</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            name="college"
            placeholder="Enter college name"
            className="border rounded px-4 py-2 flex-1"
            value={filters.college}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="year"
            placeholder="e.g., 2025"
            className="border rounded px-4 py-2 flex-1"
            value={filters.year}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="skills"
            placeholder="e.g., Python, SQL, React"
            className="border rounded px-4 py-2 flex-1"
            value={filters.skills}
            onChange={handleInputChange}
          />
          <button className="bg-black text-white px-4 py-2 rounded flex items-center gap-2">
            🔍 Search Students
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredStudents.map((student, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {student.initials}
              </div>
              <div>
                <h3 className="font-semibold">{student.name}</h3>
                <p className="text-gray-600">
                  {student.course} • {student.college}
                </p>
              </div>
            </div>
            <p className="text-gray-600 mb-2">Class of {student.year}</p>
            <p className="inline-block bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full mb-2">
              ✓ {student.verifiedSkills} Verified Skills
            </p>
            <h4 className="font-semibold mt-2">Verified Skills</h4>
            <p className="text-gray-500 mb-4">
              {student.verifiedSkills === 0
                ? "No verified skills yet"
                : "Skills listed here"}
            </p>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded w-full justify-center">
                <MdEmail /> Contact
              </button>
              <button className="border border-gray-300 rounded px-4 py-2 text-yellow-500 font-bold">
                ⭐
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recruiter;
