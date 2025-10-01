import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    education: "",
    graduationYear: ""
  });

  useEffect(() => {
    API.get(`/courses/${id}`)
      .then(res => setCourse(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApply = async () => {
    try {
      await API.post("/applications", { courseId: id, ...formData });
      alert("Applied successfully!");
    } catch (err) {
      alert("Application failed");
    }
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">{course.courseName}</h2>
      <p className="text-gray-600">{course.courseDescription}</p>
      <p className="mt-2">Duration: {course.courseDuration}</p>
      <p>Fee: ₹{course.courseFee}</p>
      <p>Highest Salary Offered: {course.highestSalary}</p>

      <div className="mt-6 bg-white p-4 rounded shadow-md">
        <h3 className="font-semibold mb-2">Apply Now</h3>
        <input name="firstName" placeholder="First Name" className="border p-2 w-full mb-2" onChange={handleChange} />
        <input name="lastName" placeholder="Last Name" className="border p-2 w-full mb-2" onChange={handleChange} />
        <input name="phone" placeholder="Phone" className="border p-2 w-full mb-2" onChange={handleChange} />
        <input name="education" placeholder="Education" className="border p-2 w-full mb-2" onChange={handleChange} />
        <input name="graduationYear" placeholder="Graduation Year" className="border p-2 w-full mb-2" onChange={handleChange} />

        <button onClick={handleApply} className="bg-blue-600 text-white px-4 py-2 rounded">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;
