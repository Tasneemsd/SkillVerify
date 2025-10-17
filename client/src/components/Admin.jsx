import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();

  // ---------------- STATE ----------------
  const [activeTab, setActiveTab] = useState("students");
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------- HELPERS ----------------
  const BASE_URL = import.meta.env.VITE_API_URL || "https://skillverify.onrender.com/api";

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // 🧠 More robust extraction (handles nested or wrapped responses)
  const extractArray = (data, possibleKeys = []) => {
    if (Array.isArray(data)) return data;
    for (const key of ["students", "users", "data", ...possibleKeys]) {
      if (Array.isArray(data?.[key])) return data[key];
    }
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  // Normalize data to consistent structure (avoids missing props)
  const normalizeUsers = (arr) =>
    arr.map((u) => ({
      _id: u._id || u.id || "",
      name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim(),
      email: u.email || "",
      verified: u.isVerified || u.verified || false,
    }));

  // ---------------- FETCH FUNCTIONS ----------------
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/admin/students`, { headers: getAuthHeaders() });
      console.log("fetchStudents response:", res.data);
      const arr = extractArray(res.data);
      setStudents(normalizeUsers(arr));
    } catch (err) {
      console.error("fetchStudents error:", err.response || err);
      setStudents([]);
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/admin/companies`, { headers: getAuthHeaders() });
      console.log("fetchCompanies response:", res.data);
      setCompanies(extractArray(res.data));
    } catch (err) {
      console.error("fetchCompanies error:", err.response || err);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/admin/applications`, { headers: getAuthHeaders() });
      console.log("fetchApplications response:", res.data);
      setApplications(extractArray(res.data));
    } catch (err) {
      console.error("fetchApplications error:", err.response || err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- VERIFY FUNCTION ----------------
  const handleVerifyStudent = async (student) => {
    try {
      await axios.put(
        `${BASE_URL}/admin/verify/${student._id}`,
        {},
        { headers: getAuthHeaders() }
      );
      alert(`✅ ${student.name} verified successfully`);
      fetchStudents(); // refresh list
    } catch (err) {
      console.error("verify error:", err.response || err);
      alert("❌ Failed to verify student");
    }
  };

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    // Fetch relevant data only for active tab
    if (activeTab === "students") fetchStudents();
    else if (activeTab === "companies") fetchCompanies();
    else if (activeTab === "applications") fetchApplications();
  }, [activeTab]);

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Admin Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        {["students", "companies", "applications"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full font-medium transition ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white border text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ---------- STUDENTS TAB ---------- */}
      {activeTab === "students" && (
        <div className="overflow-auto">
          <h2 className="text-xl font-semibold mb-4">All Students</h2>

          {loading ? (
            <p className="text-gray-500 p-4">Loading students...</p>
          ) : students.length === 0 ? (
            <p className="text-gray-500 p-4">
              No students found or data still loading.
            </p>
          ) : (
            <table className="min-w-full bg-white rounded shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Verified</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((stu) => (
                  <tr key={stu._id || stu.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{stu.name || "—"}</td>
                    <td className="px-4 py-2">{stu.email || "—"}</td>
                    <td className="px-4 py-2">
                      {stu.verified ? "✅ Verified" : "❌ Not Verified"}
                    </td>
                    <td className="px-4 py-2">
                      {!stu.verified && (
                        <button
                          onClick={() => handleVerifyStudent(stu)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Verify
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ---------- COMPANIES TAB ---------- */}
      {activeTab === "companies" && (
        <div className="overflow-auto">
          <h2 className="text-xl font-semibold mb-4">Registered Companies</h2>
          {loading ? (
            <p className="text-gray-500 p-4">Loading companies...</p>
          ) : companies.length === 0 ? (
            <p className="text-gray-500 p-4">No companies found.</p>
          ) : (
            <table className="min-w-full bg-white rounded shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Company Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((comp) => (
                  <tr key={comp._id || comp.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{comp.name || "—"}</td>
                    <td className="px-4 py-2">{comp.email || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ---------- APPLICATIONS TAB ---------- */}
      {activeTab === "applications" && (
        <div className="overflow-auto">
          <h2 className="text-xl font-semibold mb-4">All Applications</h2>
          {loading ? (
            <p className="text-gray-500 p-4">Loading applications...</p>
          ) : applications.length === 0 ? (
            <p className="text-gray-500 p-4">No applications found.</p>
          ) : (
            <table className="min-w-full bg-white rounded shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Student</th>
                  <th className="px-4 py-2 text-left">Company</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id || app.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{app.student?.name || "—"}</td>
                    <td className="px-4 py-2">{app.company?.name || "—"}</td>
                    <td className="px-4 py-2">{app.status || "Pending"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
