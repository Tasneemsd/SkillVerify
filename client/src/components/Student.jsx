import React, { useState } from "react";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("skills");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">SkillVerify</h1>
        <div className="text-gray-600">
          Welcome, <span className="font-semibold">Banu</span>
          <button className="ml-4 hover:text-blue-600">Logout</button>
        </div>
      </header>

      {/* Profile Section */}
      <div className="max-w-5xl mx-auto mt-6">
        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
          {/* Avatar */}
          <div className="bg-blue-500 text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-bold">
            r
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Banu</h2>
            <p className="text-gray-600">ghdkh • hgvfhvk • Class of 2026</p>
            <p className="mt-1 text-sm text-gray-600 font-medium">
              Verified Skills (0)
            </p>
            <p className="text-gray-500 text-sm">
              Complete the verification process to earn verified skill badges
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto mt-6 border-b border-gray-200">
        <div className="flex gap-6">
          {["skills", "courses", "jobs", "applications"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab === "skills" && "Skill Progress"}
              {tab === "courses" && "Available Courses"}
              {tab === "jobs" && "Jobs & Internships"}
              {tab === "applications" && "My Applications"}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto mt-6 bg-white rounded-xl shadow p-10 text-center">
        {activeTab === "skills" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your Skill Verification Journey
            </h2>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3079/3079165.png"
              alt="Books"
              className="w-20 mx-auto mb-4"
            />
            <p className="text-lg font-semibold text-gray-700">
              No Skills in Progress
            </p>
            <p className="text-gray-500 mb-6">
              Enroll in a course to start your skill verification journey
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
              Browse Courses
            </button>
          </div>
        )}

        {activeTab === "courses" && (
          <p className="text-gray-600">📚 Available Courses will appear here</p>
        )}

        {activeTab === "jobs" && (
          <p className="text-gray-600">💼 Jobs & Internships will appear here</p>
        )}

        {activeTab === "applications" && (
          <p className="text-gray-600">📝 Your Applications will appear here</p>
        )}
      </div>
    </div>
  );
}
