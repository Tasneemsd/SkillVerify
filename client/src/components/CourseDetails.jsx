import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

const CourseDetails = () => {
  const { id } = useParams(); // id = courseId from route
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await API.get(`/courses/id/${id}`); // ✅ fetch by courseId
        setCourse(res.data);
      } catch (err) {
        console.error("Course fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading course details...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <p className="text-lg">Course not found ❌</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-300 to-indigo-200 p-6 relative">
          <h1 className="text-2xl font-bold text-purple-700">
            Become a {course.courseName} Developer
          </h1>
          <span className="absolute top-6 right-6 bg-orange-500 text-white text-xs px-3 py-1 rounded-full shadow">
            ⭐ {course.rating || 4.5}
          </span>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-gray-700">{course.courseDescription || "No description provided."}</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">⏳ Duration</p>
              <p className="font-semibold">{course.courseDuration}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">💰 Fee</p>
              <p className="font-semibold">₹{course.courseFee}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">📈 Highest Salary</p>
              <p className="font-semibold">{course.highestSalary}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">🏢 Placement Partners</p>
              {course.placementPartners?.length ? (
                <ul className="list-disc list-inside text-gray-700">
                  {course.placementPartners.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Top Companies</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-between items-center bg-gray-50">
          <span className="text-sm text-red-500 font-semibold">
            Application closes soon!
          </span>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Enroll Now
            </button>
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
