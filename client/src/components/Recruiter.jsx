import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // change if deployed

export default function Recruiter({ token }) {
  const [activeTab, setActiveTab] = useState("candidates");
  const [recruiter, setRecruiter] = useState(null);
  const [candidates, setCandidates] = useState([]);

  const [filters, setFilters] = useState({ year: "", skills: "", college: "" });
  const [suggestions, setSuggestions] = useState({
    year: [],
    skills: [],
    college: [],
  });
  const [showSuggestions, setShowSuggestions] = useState({
    year: false,
    skills: false,
    college: false,
  });

  // Auth headers
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  // Fetch recruiter profile
  useEffect(() => {
    const fetchRecruiter = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/recruiter/profile`, {
          headers: getAuthHeaders(),
        });
        setRecruiter(res.data);
      } catch (err) {
        console.error("FETCH RECRUITER ERROR:", err);
      }
    };
    fetchRecruiter();
  }, [token]);

  // Fetch candidates with filters
  const fetchCandidates = async () => {
    try {
      const params = {};
      if (filters.year) params.year = filters.year;
      if (filters.skills) params.skills = filters.skills;
      if (filters.college) params.college = filters.college;

      const res = await axios.get(`${BASE_URL}/recruiter/students`, {
        params,
        headers: getAuthHeaders(),
      });
      setCandidates(res.data || []);
    } catch (err) {
      console.error("FETCH CANDIDATES ERROR:", err);
      setCandidates([]);
    }
  };

  // Autocomplete fetch suggestions
  const fetchSuggestions = async (field, value) => {
    if (!value) {
      setSuggestions((prev) => ({ ...prev, [field]: [] }));
      return;
    }

    try {
      // You can adjust your API to return suggestions
      const res = await axios.get(`${BASE_URL}/recruiter/suggestions`, {
        params: { field, query: value },
        headers: getAuthHeaders(),
      });

      setSuggestions((prev) => ({
        ...prev,
        [field]: res.data || [],
      }));
    } catch (err) {
      console.error("FETCH SUGGESTIONS ERROR:", err);
    }
  };

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    fetchSuggestions(field, value);
    setShowSuggestions((prev) => ({ ...prev, [field]: true }));
  };

  const handleSuggestionClick = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setShowSuggestions((prev) => ({ ...prev, [field]: false }));
  };

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-4">
        <button
          className={`px-4 py-2 ${
            activeTab === "candidates"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("candidates")}
        >
          Candidates
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "profile"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
      </div>

      {/* Candidates Tab */}
      {activeTab === "candidates" && (
        <div className="bg-white shadow rounded-lg p-4 space-y-4">
          {/* Filter Form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Year */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <input
                type="number"
                placeholder="e.g. 2025"
                value={filters.year}
                onChange={(e) => handleInputChange("year", e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {showSuggestions.year && suggestions.year.length > 0 && (
                <ul className="absolute z-10 bg-white border w-full rounded-md mt-1 max-h-40 overflow-y-auto">
                  {suggestions.year.map((sug, idx) => (
                    <li
                      key={idx}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSuggestionClick("year", sug)}
                    >
                      {sug}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Skills */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Skills
              </label>
              <input
                type="text"
                placeholder="e.g. React"
                value={filters.skills}
                onChange={(e) => handleInputChange("skills", e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {showSuggestions.skills && suggestions.skills.length > 0 && (
                <ul className="absolute z-10 bg-white border w-full rounded-md mt-1 max-h-40 overflow-y-auto">
                  {suggestions.skills.map((sug, idx) => (
                    <li
                      key={idx}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSuggestionClick("skills", sug)}
                    >
                      {sug}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* College */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                College
              </label>
              <input
                type="text"
                placeholder="e.g. IIT Delhi"
                value={filters.college}
                onChange={(e) => handleInputChange("college", e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {showSuggestions.college && suggestions.college.length > 0 && (
                <ul className="absolute z-10 bg-white border w-full rounded-md mt-1 max-h-40 overflow-y-auto">
                  {suggestions.college.map((sug, idx) => (
                    <li
                      key={idx}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSuggestionClick("college", sug)}
                    >
                      {sug}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Filter Button */}
            <div>
              <button
                onClick={fetchCandidates}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Filter
              </button>
            </div>
          </div>

          {/* Candidate Results */}
          {candidates.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No candidates found. Try adjusting your filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidates.map((cand) => (
                <div
                  key={cand._id}
                  className="border rounded-lg p-4 flex flex-col"
                >
                  <h4 className="font-semibold text-gray-900">{cand.name}</h4>
                  <p className="text-gray-600">{cand.email}</p>
                  <p className="text-sm text-gray-500">
                    Course: {cand.course}, College: {cand.college}, Year:{" "}
                    {cand.year}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && recruiter && (
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold">{recruiter.name}</h2>
          <p className="text-gray-600">{recruiter.email}</p>
          <p className="text-gray-500">{recruiter.company}</p>
        </div>
      )}
    </div>
  );
}
