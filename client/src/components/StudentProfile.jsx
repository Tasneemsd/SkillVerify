// src/components/StudentProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FileText, Github, Linkedin, Globe, Upload, CreditCard as Edit, Save, X, GraduationCap, Briefcase, User, LogOut, Star } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl hover:opacity-80 transition-opacity">
              
              <img src="/logos.png" alt="Logo" className="h-38 w-auto" />
            </Link>

            

            {/* User Dropdown */}
            <div className="relative flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {student.name?.[0]}
              </div>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500 truncate">{student.email}</p>
                  </div>
                  <Link
                    to="/student/profile"
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-gray-700 transition-colors"
                  >
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/login");
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2.5 hover:bg-red-50 text-red-600 transition-colors"
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
        {/* Profile Header Card */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          {/* Cover Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>

          <div className="px-6 pb-6">
            {/* Profile Picture & Name Section */}
            <div className="flex flex-col md:flex-row gap-6 -mt-16 relative">
              {/* Left: Avatar & Basic Info */}
              <div className="flex flex-col items-center md:items-start md:w-1/3">
                <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-blue-600 bg-gradient-to-br from-blue-100 to-blue-50">
                  {student.name?.[0]}
                </div>

                <div className="mt-4 text-center md:text-left w-full">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xl font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Full Name"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
                  )}

                  <div className="mt-2">
                    {isEditing ? (
                      <input
                        type="text"
                        name="branch"
                        value={formData.branch || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Branch/Department"
                      />
                    ) : (
                      <p className="text-gray-700 font-medium">{student.branch || "Student"}</p>
                    )}
                  </div>

                  <div className="mt-1">
                    {isEditing ? (
                      <input
                        type="text"
                        name="college"
                        value={formData.college || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="College/University"
                      />
                    ) : (
                      <p className="text-sm text-gray-600">{student.college}</p>
                    )}
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-5 w-full">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Github className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <input
                          type="text"
                          name="github"
                          placeholder="GitHub profile URL"
                          value={formData.github || ""}
                          onChange={handleChange}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Linkedin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <input
                          type="text"
                          name="linkedin"
                          placeholder="LinkedIn profile URL"
                          value={formData.linkedin || ""}
                          onChange={handleChange}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <input
                          type="text"
                          name="leetcode"
                          placeholder="LeetCode profile URL"
                          value={formData.leetcode || ""}
                          onChange={handleChange}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3 justify-center md:justify-start">
                      {student.github && (
                        <a
                          href={student.github}
                          target="_blank"
                          rel="noreferrer"
                          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        >
                          <Github className="w-5 h-5 text-gray-700" />
                        </a>
                      )}
                      {student.linkedin && (
                        <a
                          href={student.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="w-10 h-10 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors"
                        >
                          <Linkedin className="w-5 h-5 text-blue-600" />
                        </a>
                      )}
                      {student.leetcode && (
                        <a
                          href={student.leetcode}
                          target="_blank"
                          rel="noreferrer"
                          className="w-10 h-10 rounded-full bg-orange-50 hover:bg-orange-100 flex items-center justify-center transition-colors"
                        >
                          <Globe className="w-5 h-5 text-orange-600" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Basic Information & Resume */}
              <div className="flex-1 md:mt-20">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button
                        onClick={saveProfile}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
                      >
                        <Save className="w-4 h-4" /> Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFormData(student);
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center gap-2 hover:bg-gray-600 transition-colors text-sm font-medium shadow-sm"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                    >
                      <Edit className="w-4 h-4" /> Edit Profile
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email Address</p>
                    <p className="text-sm text-gray-900">{student.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Graduation Year</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="graduationYear"
                        value={formData.graduationYear || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 2025"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{student.graduationYear || "Not specified"}</p>
                    )}
                  </div>
                </div>

                {/* Resume Section */}
                <div className="border-t border-gray-200 pt-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Resume</h3>
                  {student.resumeUrl ? (
                    <a
                      href={student.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                    >
                      <FileText className="w-4 h-4" /> View Resume
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No resume uploaded yet</p>
                  )}

                  {isEditing && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Resume</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setResumeFile(e.target.files[0])}
                          className="flex-1 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                        />
                        <button
                          onClick={handleResumeUpload}
                          disabled={!resumeFile}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm"
                        >
                          <Upload className="w-4 h-4" /> Upload
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mt-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900">Skills & Expertise</h2>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              {/* Current skills */}
              {formData.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium"
                    >
                      {s.name}
                      <span className="text-xs text-blue-600 font-normal">• {s.level}</span>
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            skills: formData.skills.filter((_, idx) => idx !== i),
                          })
                        }
                        className="text-blue-700 hover:text-red-600 transition-colors ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Add new skill */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3">Add New Skill</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Skill name (e.g., React, Python)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.newSkillName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, newSkillName: e.target.value })
                    }
                  />
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    value={formData.newSkillLevel || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, newSkillLevel: e.target.value })
                    }
                  >
                    <option value="">Proficiency level</option>
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
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm whitespace-nowrap"
                  >
                    Add Skill
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {student.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {student.skills.map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-4 py-2 text-sm rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium"
                    >
                      {s.name}
                      <span className="ml-2 text-xs text-blue-600 font-normal">• {s.level}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No skills added yet</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Add your first skill
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
