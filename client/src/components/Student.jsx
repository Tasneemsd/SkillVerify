import React, { useEffect, useState } from "react";
import API from "../api";

const Student = () => {
  const [courses, setCourses] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("available");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch student details
  useEffect(() => {
    if (!user?.email) return;
    API.get(`/student?email=${encodeURIComponent(user.email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setStudent(res.data))
      .catch((err) => console.error("Fetch student error:", err));
  }, [user?.email, token]);

  // Fetch courses
  useEffect(() => {
    API.get("/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Courses fetch error:", err));
  }, []);

  // Fetch jobs
  useEffect(() => {
    API.get("/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error("Jobs fetch error:", err));
  }, []);

  // Fetch applications
  useEffect(() => {
    if (!student?._id) return;
    API.get(`/applications?studentId=${student._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setApplications(res.data))
      .catch((err) => console.error("Applications fetch error:", err));
  }, [student?._id, token]);

  // Enroll
  const handleEnroll = async (courseId) => {
    try {
      const res = await API.post(
        "/student/enroll",
        { studentId: student._id, courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message || "Enrolled successfully ✅");
      setStudent((prev) => ({
        ...prev,
        registeredCourses: [...(prev?.registeredCourses || []), courseId],
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failed ❌");
    }
  };

  // Apply
  const handleApply = async (jobId) => {
    try {
      const res = await API.post(
        "/applications",
        { studentId: student._id, jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message || "Applied successfully ✅");
      setApplications((prev) => [...prev, res.data.application]);
    } catch (err) {
      alert(err.response?.data?.message || "Application failed ❌");
    }
  };

  // Render 3 images per card
  const renderImages = (images) => (
    <div className="flex gap-1 mb-2">
      {images?.slice(0, 3).map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt="thumbnail"
          className="w-1/3 h-24 object-cover rounded"
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar / Profile */}
      <div className="flex items-center justify-between p-4 bg-white shadow-md">
        <div>
          <h2 className="text-xl font-bold">{student?.name || "Student Name"}</h2>
          <p className="text-sm text-gray-500">{student?.email || "email@example.com"}</p>
          <p className="text-sm text-gray-500 capitalize">{student?.role || "student"}</p>
        </div>
        <div>
          <img
            src={student?.avatar || "https://via.placeholder.com/50"}
            alt="avatar"
            className="w-12 h-12 rounded-full border"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 justify-center mt-4 mb-6">
        {["available", "enrolled", "applied"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {tab === "available"
              ? "Available"
              : tab === "enrolled"
              ? "My Courses"
              : "My Applications"}
          </button>
        ))}
      </div>

      {/* Grid content */}
      <div className="p-4 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === "available" &&
          [...courses, ...jobs].map((item) => {
            const isCourse = item.courseName;
            return (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow hover:shadow-lg p-4"
              >
                {renderImages(item.images)}
                <h3 className="font-bold text-lg">{isCourse ? item.courseName : item.title}</h3>
                <p className="text-sm text-gray-600">{isCourse ? item.courseDescription : item.description}</p>
                {isCourse ? (
                  <>
                    <p className="text-sm">Duration: {item.courseDuration}</p>
                    <p className="text-sm">Fee: ₹{item.courseFee}</p>
                    <button
                      className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => handleEnroll(item._id)}
                    >
                      Enroll
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm">Location: {item.location}</p>
                    <p className="text-sm">Salary: {item.salary}</p>
                    <button
                      className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={() => handleApply(item._id)}
                    >
                      Apply Job
                    </button>
                  </>
                )}
              </div>
            );
          })}

        {activeTab === "enrolled" &&
          (student?.registeredCourses?.length ? (
            student.registeredCourses.map((courseId) => {
              const course = courses.find((c) => c._id === courseId);
              return (
                <div
                  key={courseId}
                  className="bg-white rounded-lg shadow hover:shadow-lg p-4"
                >
                  {renderImages(course?.images)}
                  <h3 className="font-bold text-lg">{course?.courseName}</h3>
                  <p className="text-sm">{course?.courseDescription}</p>
                  <p className="text-sm">Duration: {course?.courseDuration}</p>
                  <p className="text-sm">Fee: ₹{course?.courseFee}</p>
                </div>
              );
            })
          ) : (
            <p className="col-span-full text-center">No courses enrolled yet.</p>
          ))}

        {activeTab === "applied" &&
          (applications.length ? (
            applications.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-lg shadow hover:shadow-lg p-4"
              >
                {renderImages(app.images)}
                <h3 className="font-bold text-lg">{app.jobTitle}</h3>
                <p className="text-sm">Company: {app.company}</p>
                <p className="text-sm">Status: {app.status}</p>
                <p className="text-sm">
                  Applied On: {new Date(app.appliedOn).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center">No job applications yet.</p>
          ))}
      </div>
    </div>
  );
};

export default Student;
