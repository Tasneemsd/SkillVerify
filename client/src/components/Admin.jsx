import React, { useState } from "react";

export default function Admin() {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const courses = [
    { title: "Resume Building", desc: "Learn to create professional resumes that get noticed", price: "₹500", status: "Active" },
    { title: "Aptitude Prep", desc: "Master quantitative and logical reasoning skills", price: "₹500", status: "Active" },
    { title: "Python Basics", desc: "Learn Python programming from scratch", price: "₹500", status: "Active" },
    { title: "SQL Basics", desc: "Master database querying with SQL", price: "₹500", status: "Active" },
    { title: "Communication Skills", desc: "Improve your professional communication abilities", price: "₹500", status: "Active" },
    { title: "Test Course", desc: "A test course for API testing", price: "₹500", status: "Active" },
  ];

  const students = [
    { id: 1, name: "Arjun Kumar", skills: ["Python", "SQL"], approved: false },
    { id: 2, name: "Meera Singh", skills: ["Communication", "Resume Writing"], approved: false },
    { id: 3, name: "Rahul Verma", skills: ["Aptitude", "Problem Solving"], approved: true },
  ];

  // Handle student search
  const handleSearch = () => {
    const found = students.find(
      (s) => s.name.toLowerCase() === searchQuery.toLowerCase()
    );
    setSelectedStudent(found || null);
  };

  // Handle approving skills
  const handleApprove = () => {
    if (selectedStudent) {
      setSelectedStudent({ ...selectedStudent, approved: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 text-white font-bold p-2 rounded-md">SV</div>
          <h1 className="text-xl font-semibold">SkillVerify Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, Tasneem</span>
          <button className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200">
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex justify-center mt-4">
        <div className="flex bg-gray-100 rounded-md overflow-hidden">
          <button className="px-6 py-2 bg-white shadow rounded-l-md font-medium">
            Manage Courses
          </button>
          <button className="px-6 py-2 text-gray-500 hover:text-black">
            Manage Jobs
          </button>
        </div>
      </div>

      {/* Courses Section */}
      <div className="px-6 mt-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {courses.map((course, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow border flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold">{course.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{course.desc}</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-green-600 font-semibold">
                  {course.price}
                </span>
                <span className="px-3 py-1 border rounded text-sm bg-gray-50">
                  {course.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Create New Course Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow border mb-6">
            <h2 className="text-lg font-semibold mb-4">Create New Course</h2>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Course Content
                </label>
                <textarea
                  rows="3"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter course content"
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Create Course
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Student Management */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-4">Manage Students</h2>

          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student by name"
              className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Search
            </button>
          </div>

          {selectedStudent ? (
            <div className="border p-4 rounded bg-gray-50">
              <h3 className="font-semibold text-lg">{selectedStudent.name}</h3>
              <p className="text-gray-600 mt-1">Skills:</p>
              <ul className="list-disc pl-5 text-sm text-gray-700 mb-3">
                {selectedStudent.skills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
              <p className="text-sm mb-3">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    selectedStudent.approved ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {selectedStudent.approved ? "Approved" : "Pending"}
                </span>
              </p>
              {!selectedStudent.approved && (
                <button
                  onClick={handleApprove}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Approve Skills
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No student selected</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="flex justify-end px-6 py-4">
        <span className="text-sm text-gray-500 flex items-center gap-1">
          Made with <span className="font-bold">Emergent</span>
        </span>
      </footer>
    </div>
  );
}
