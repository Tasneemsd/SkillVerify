import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { getAuthToken } from "../api";
import logo2 from "../images/logo2.jpg";

const CourseDetails = () => {
  const { id } = useParams(); // courseId from route
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = getAuthToken();

  const getInitials = (name = "") =>
    name ? name.split(" ").map((n) => n[0].toUpperCase()).join("") : "S";

  useEffect(() => {
    if (!id) return;
    API.get(`/courses/${id}`)
      .then((res) => setCourse(res.data))
      .catch((err) => console.error("Course fetch error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!token) return navigate("/login");

    try {
      await API.post(
        "/student/enroll",
        { courseId: course._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Enrollment successful!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Enrollment failed!");
    }
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center relative">
        <img src={logo2} alt="SkillVerify Logo" className="h-16 w-auto object-contain" />
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">Welcome, {user?.name || "Student"}</span>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md"
            >
              {getInitials(user?.name)}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => navigate("/student")}
                >
                  Dashboard
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero / Header */}
      <div className="bg-gradient-to-b from-purple-700 to-indigo-800 text-white px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <span className="bg-white text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
            Government-certified
          </span>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-yellow-400">★</span>
            <span className="font-semibold">{course.rating || 4.5}</span>
          </div>

          <h1 className="text-4xl font-bold mt-4">{course.courseName}</h1>
          <p className="text-sm text-gray-200 mt-2">
            Updated on {new Date(course.updatedOn).toDateString()}
          </p>

          <ul className="mt-4 space-y-1 text-sm text-gray-100">
            <li>✅ Get placed with {course.highestSalary || "₹3–10 LPA"}</li>
            <li>✅ Course fee refund if not placed</li>
          </ul>

          {/* Pricing Box */}
          <div className="bg-white text-gray-900 p-6 rounded-lg mt-6 inline-block shadow-md">
            <p className="font-semibold text-sm text-purple-700">
              {course.courseDuration} online course with LIVE sessions
            </p>
            <div className="flex items-center justify-between mt-2">
              <div>
                <p className="text-sm font-semibold">
                  Batch starts: <span className="text-green-600">Today</span>
                </p>
                <span className="text-xs text-red-500">Limited seats</span>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-800">
                  ₹{course.courseFee}{" "}
                  <span className="line-through text-gray-400 text-sm">
                    ₹{course.originalFee || "45,000"}
                  </span>
                </p>
                <p className="text-xs text-green-600">
                  Save ₹{(course.originalFee || 45000) - course.courseFee} • Valid today
                </p>
              </div>
            </div>
          </div>

          {/* Placement Logos */}
          <p className="text-sm mt-6">Our learners get placed at</p>
          <div className="flex gap-3 mt-2 flex-wrap">
            {course.placementPartners?.length ? (
              course.placementPartners.map((partner, i) => (
                <span
                  key={i}
                  className="bg-white text-gray-800 px-3 py-1 rounded shadow text-sm"
                >
                  {partner}
                </span>
              ))
            ) : (
              <span className="text-gray-200">+250 more hiring partners</span>
            )}
          </div>
        </div>
      </div>

      {/* Apply Form */}
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h3 className="text-lg font-bold mb-4">Interested? Apply Now</h3>
          <form className="grid md:grid-cols-2 gap-4" onSubmit={handleEnroll}>
            <input type="text" placeholder="First Name" className="border p-2 rounded" />
            <input type="text" placeholder="Last Name (Optional)" className="border p-2 rounded" />
            <input type="text" placeholder="Phone number" className="border p-2 rounded md:col-span-2" />
            <select className="border p-2 rounded">
              <option>Select degree</option>
              <option>B.Tech</option>
              <option>M.Tech</option>
              <option>B.Sc</option>
            </select>
            <select className="border p-2 rounded">
              <option>Select year</option>
              <option>2024</option>
              <option>2025</option>
              <option>2026</option>
            </select>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded md:col-span-2"
            >
              Apply now
            </button>
          </form>
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-6xl mx-auto px-6 mt-12">
        <h3 className="text-xl font-bold mb-4">Reviews from placed learners</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {course.reviews?.length ? (
            course.reviews.map((review, i) => (
              <div key={i} className="bg-white p-5 rounded-lg shadow">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">★</span>
                  <span>{review.rating}</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    Placed in {review.year}
                  </span>
                </div>
                <p className="mt-3 text-sm text-gray-700">{review.text}</p>
                <p className="mt-3 font-semibold text-sm">{review.name}</p>
                <p className="text-xs text-gray-500">{review.role}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="bg-yellow-100 text-center py-2 mt-10 text-sm font-semibold">
        🚨 Hurry! Course fees will increase soon. Apply now.
      </div>

      {/* Brochure + Apply Buttons */}
      <div className="flex justify-center gap-4 py-6">
        <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
          Download Brochure
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={handleEnroll}
        >
          Apply now
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;
