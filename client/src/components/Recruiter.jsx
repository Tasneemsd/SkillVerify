import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdEmail } from "react-icons/md";

const Recruiter = ({ token }) => {
  const [recruiter, setRecruiter] = useState(null);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ college: "", year: "", skills: "" });
  const [loadingRecruiter, setLoadingRecruiter] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [errorRecruiter, setErrorRecruiter] = useState("");
  const [errorStudents, setErrorStudents] = useState("");

  const fetchRecruiter = async () => {
    try {
      setLoadingRecruiter(true);
      setErrorRecruiter("");

      const res = await axios.get(
        `https://skillverify.onrender.com/api/recruiter/profile?email=${encodeURIComponent("recruiter@gmail.com")}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRecruiter(res.data);
    } catch (err) {
      console.error("Recruiter AxiosError", err);
      setErrorRecruiter(err.response?.data?.message || "Failed to fetch recruiter info");
    } finally {
      setLoadingRecruiter(false);
    }
  };


  // Fetch students
  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      setErrorStudents("");

      const res = await axios.get("https://skillverify.onrender.com/api/recruiter/students", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStudents(res.data.students || []);
    } catch (err) {
      console.error("Students AxiosError", err);
      setErrorStudents(err.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    fetchRecruiter();
    fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredStudents = students.filter((student) => {
    return (
      (filters.college === "" ||
        student.college.toLowerCase().includes(filters.college.toLowerCase())) &&
      (filters.year === "" || student.year === parseInt(filters.year)) &&
      (filters.skills === "" ||
        (student.skills && student.skills.join(", ").toLowerCase().includes(filters.skills.toLowerCase())))
    );
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">Recruiter Dashboard</h1>

        {loadingRecruiter ? (
          <p>Loading...</p>
        ) : errorRecruiter ? (
          <p className="text-red-500">{errorRecruiter}</p>
        ) : recruiter ? (
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
              {recruiter.name[0]}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">{recruiter.name}</span>
              <span className="text-sm text-gray-300">{recruiter.companyName}</span>
            </div>
          </div>
        ) : (
          <p>No recruiter info</p>
        )}
      </nav>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow m-6">
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
          <button
            className="bg-black text-white px-4 py-2 rounded flex items-center gap-2"
            onClick={fetchStudents}
          >
            🔍 Search Students
          </button>
        </div>
      </div>

      {/* Loading/Error Students */}
      {loadingStudents && <p className="text-center text-gray-500">Loading students...</p>}
      {errorStudents && <p className="text-center text-red-500">{errorStudents}</p>}

      {/* Students Grid */}
      {!loadingStudents && !errorStudents && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 m-6">
          {filteredStudents.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">No students found.</p>
          ) : (
            filteredStudents.map((student) => (
              <div key={student._id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {student.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-gray-600">
                      {student.course} • {student.college}
                    </p>
                    <p className="text-gray-600">{student.email}</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-2">Class of {student.year}</p>
                <p className="inline-block bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full mb-2">
                  ✓ {student.verifiedSkills} Verified Skills
                </p>

                <h4 className="font-semibold mt-2">Verified Skills</h4>
                <p className="text-gray-500 mb-4">
                  {student.skills && student.skills.length > 0
                    ? student.skills.join(", ")
                    : "No verified skills yet"}
                </p>

                <div className="flex gap-2">
                  <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded w-full justify-center">
                    <MdEmail /> Contact
                  </button>
                  <button className="border border-gray-300 rounded px-4 py-2 text-yellow-500 font-bold w-full">
                    ⭐ Favorite
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Recruiter;
