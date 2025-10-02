// src/components/StudentProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FileText, Github, Linkedin, Globe, Upload, Edit, Save, X,
  GraduationCap, Briefcase, User, LogOut, Star
} from "lucide-react";
import API from "../api";

function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const fetchProfile = async () => {
      try {
        const res = await API.get("/student/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudent(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching student:", err);
        navigate("/login");
      }
    };

    fetchProfile();
  }, []);

  const handleResumeUpload = async () => {
    if (!resumeFile) return alert("Please choose a file");
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("resume", resumeFile);

      const token = localStorage.getItem("token");
      const res = await API.post("/student/upload-resume", formDataUpload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Resume uploaded successfully!");
      setStudent({ ...student, resumeUrl: res.data.resumeUrl });
    } catch (err) {
      console.error("Resume upload error:", err);
      alert("Failed to upload resume");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.put("/student/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudent(res.data);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Failed to update profile");
    }
  };

  if (!student) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
              <GraduationCap className="w-6 h-6" />
              <img src="/logos.png" alt="Logo" className="h-8 w-auto" />
            </Link>

            {/* Menu */}
            <div className="hidden md:flex gap-6">
              <Link to="/student/courses" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
                <Star className="w-4 h-4" /> Courses
              </Link>
              <Link to="/student/internships" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
                <Briefcase className="w-4 h-4" /> Internships
              </Link>
              <Link to="/student/profile" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
                <User className="w-4 h-4" /> Profile
              </Link>
            </div>

            {/* User Dropdown */}
            <div className="relative flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {student.name?.[0]}
              </div>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b">
                    <p className="font-semibold">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                  <Link
                    to="/student/profile"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/login");
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Page Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white shadow rounded-xl p-6 flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:w-1/3">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-blue-600">
              {student.name?.[0]}
            </div>

            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className="mt-4 px-3 py-1 border rounded-lg text-center"
              />
            ) : (
              <h2 className="text-2xl font-bold mt-4">{student.name}</h2>
            )}

            <p className="text-gray-600">
              {isEditing ? (
                <input
                  type="text"
                  name="branch"
                  value={formData.branch || ""}
                  onChange={handleChange}
                  className="px-2 py-1 border rounded-lg"
                />
              ) : (
                student.branch || "Student"
              )}
            </p>
            <p className="text-sm text-gray-500">
              {isEditing ? (
                <input
                  type="text"
                  name="college"
                  value={formData.college || ""}
                  onChange={handleChange}
                  className="px-2 py-1 border rounded-lg"
                />
              ) : (
                student.college
              )}
            </p>

            {/* Social Links */}
            <div className="flex gap-3 mt-4">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="github"
                    placeholder="GitHub URL"
                    value={formData.github || ""}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded-lg"
                  />
                  <input
                    type="text"
                    name="linkedin"
                    placeholder="LinkedIn URL"
                    value={formData.linkedin || ""}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded-lg"
                  />
                  <input
                    type="text"
                    name="leetcode"
                    placeholder="LeetCode URL"
                    value={formData.leetcode || ""}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded-lg"
                  />
                </>
              ) : (
                <>
                  {student.github && (
                    <a href={student.github} target="_blank" rel="noreferrer">
                      <Github className="w-6 h-6 text-gray-700 hover:text-black" />
                    </a>
                  )}
                  {student.linkedin && (
                    <a href={student.linkedin} target="_blank" rel="noreferrer">
                      <Linkedin className="w-6 h-6 text-blue-600 hover:text-blue-800" />
                    </a>
                  )}
                  {student.leetcode && (
                    <a href={student.leetcode} target="_blank" rel="noreferrer">
                      <Globe className="w-6 h-6 text-orange-600 hover:text-orange-800" />
                    </a>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-4 flex justify-between">
              Basic Information
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={saveProfile}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" /> Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 bg-gray-500 text-white rounded-lg flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg flex items-center gap-1"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
              )}
            </h3>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <p>
                <span className="font-semibold">Email:</span> {student.email}
              </p>
              <p>
                <span className="font-semibold">Graduation:</span>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    name="graduationYear"
                    value={formData.graduationYear || ""}
                    onChange={handleChange}
                    className="px-2 py-1 border rounded-lg"
                  />
                ) : (
                  student.graduationYear
                )}
              </p>
            </div>

            {/* Resume */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Resume</h3>
              {student.resumeUrl ? (
                <a
                  href={student.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <FileText className="w-4 h-4" /> Download Resume
                </a>
              ) : (
                <p className="text-gray-500">No resume uploaded</p>
              )}

              {isEditing && (
                <div className="flex gap-2 mt-3">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                  />
                  <button
                    onClick={handleResumeUpload}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" /> Upload
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white shadow rounded-xl p-6 mt-6">
          <h3 className="text-xl font-semibold mb-4">Skills</h3>

          {isEditing ? (
            <div className="space-y-3">
              {/* Current skills */}
              <div className="flex flex-wrap gap-2">
                {formData.skills?.map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 flex items-center gap-2"
                  >
                    {s.name} ({s.level})
                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          skills: formData.skills.filter((_, idx) => idx !== i),
                        })
                      }
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ❌
                    </button>
                  </span>
                ))}
              </div>

              {/* Add new skill */}
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Skill name"
                  className="border px-2 py-1 rounded-lg flex-1"
                  value={formData.newSkillName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, newSkillName: e.target.value })
                  }
                />
                <select
                  className="border px-2 py-1 rounded-lg"
                  value={formData.newSkillLevel || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, newSkillLevel: e.target.value })
                  }
                >
                  <option value="">Select level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.newSkillName || !formData.newSkillLevel) return;
                    setFormData({
                      ...formData,
                      skills: [
                        ...(formData.skills || []),
                        {
                          name: formData.newSkillName,
                          level: formData.newSkillLevel,
                        },
                      ],
                      newSkillName: "",
                      newSkillLevel: "",
                    });
                  }}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  ➕ Add
                </button>
              </div>
            </div>
          ) : (
            <>
              {student.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {student.skills.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700"
                    >
                      {s.name} ({s.level})
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skills added yet.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
