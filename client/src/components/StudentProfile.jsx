// src/components/StudentProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Github, Linkedin, Globe, Upload } from "lucide-react";
import API from "../api";

function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
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
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const token = localStorage.getItem("token");
      const res = await API.post("/student/upload-resume", formData, {
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

  if (!student) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white shadow rounded-xl p-6 flex flex-col md:flex-row gap-6">
        <div className="flex flex-col items-center md:w-1/3">
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-blue-600">
            {student.name?.[0]}
          </div>
          <h2 className="text-2xl font-bold mt-4">{student.name}</h2>
          <p className="text-gray-600">{student.branch || "Student"}</p>
          <p className="text-sm text-gray-500">{student.college}</p>

          {/* Social Links */}
          <div className="flex gap-3 mt-4">
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
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <p><span className="font-semibold">Email:</span> {student.email}</p>
            <p><span className="font-semibold">Branch:</span> {student.branch}</p>
            <p><span className="font-semibold">College:</span> {student.college}</p>
            <p><span className="font-semibold">Graduation:</span> {student.graduationYear}</p>
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
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white shadow rounded-xl p-6 mt-6">
        <h3 className="text-xl font-semibold mb-4">Skills</h3>
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
      </div>
    </div>
  );
}

export default StudentProfile;
