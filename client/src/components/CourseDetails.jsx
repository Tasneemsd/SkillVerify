import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
  API.get(`/courses/id/${id}`)

      .then((res) => {
        setCourse(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Course fetch error:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center p-10">Loading course details...</div>;
  }

  if (!course) {
    return <div className="text-center p-10 text-red-500">Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Section */}
      <div className="bg-gradient-to-b from-[#3b007b] to-[#2b0060] text-white px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <span className="bg-white text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
            Government-certified
          </span>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-yellow-400">★</span>
            <span className="font-semibold">{course.rating || 4.5}</span>
          </div>

          <h1 className="text-3xl font-bold mt-4">{course.courseName}</h1>
          <p className="text-sm text-gray-200 mt-2">Updated in May ‘25</p>

          <ul className="mt-4 space-y-1 text-sm text-gray-100">
            <li>✅ Get placed with {course.salaryRange || "₹3–10 LPA"} salary</li>
            <li>✅ Course fee refund if not placed</li>
          </ul>

          {/* Pricing Section */}
          <div className="bg-white text-gray-900 p-5 rounded-lg mt-6 inline-block shadow-md">
            <p className="font-semibold text-sm text-purple-700">
              {course.courseDuration || "6 months"} online course with LIVE sessions
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
                  Save ₹
                  {(course.originalFee || 45000) - course.courseFee} • Valid for today
                </p>
              </div>
            </div>
          </div>

          {/* Placement logos */}
          <p className="text-sm mt-6">Our learners get placed at</p>
          <div className="flex gap-4 mt-2 flex-wrap">
            {course.placementPartners?.length ? (
              course.placementPartners.map((partner, i) => (
                <span
                  key={i}
                  className="bg-white text-gray-800 px-3 py-1 rounded shadow text-sm"
                >
                  {partner.name}
                </span>
              ))
            ) : (
              <span className="text-gray-200">+250 more hiring partners</span>
            )}
          </div>
        </div>
      </div>

      {/* Apply Form */}
      <div className="max-w-6xl mx-auto px-6 -mt-12">
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h3 className="text-lg font-bold mb-4">Interested? Apply Now</h3>
          <form className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" className="border p-2 rounded" />
            <input type="text" placeholder="Last Name (Optional)" className="border p-2 rounded" />
            <input type="text" placeholder="Phone number" className="border p-2 rounded md:col-span-2" />
            <select className="border p-2 rounded">
              <option>Select degree</option>
            </select>
            <select className="border p-2 rounded">
              <option>Select year</option>
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded md:col-span-2">
              Apply now
            </button>
          </form>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-6xl mx-auto px-6 mt-10">
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
            <p className="text-gray-500">No reviews available.</p>
          )}
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="bg-yellow-100 text-center py-2 mt-10 text-sm font-semibold">
        🚨 Urgent! Course fees will increase by ₹12,000 soon. Apply now.
      </div>

      <div className="flex justify-center gap-4 py-6">
        <button className="bg-gray-200 px-4 py-2 rounded">Download brochure</button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Apply now
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;
