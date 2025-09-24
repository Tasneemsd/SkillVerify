import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api"; // 👈 import API

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    college: "",
    year: "",
    skills: "",
    company: "",
    designation: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSubmitted(false);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Prepare payload based on role
      let payload = {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        password: form.password,
        role: form.role,
        phone: form.phone,
      };

      if (form.role === "student") {
        payload.college = form.college;
        payload.year = form.year;
        payload.skills = form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      } else if (form.role === "recruiter") {
        payload.company = form.company;
        payload.designation = form.designation;
      }

      await API.post("/register", payload);

      setSubmitted(true);
      setForm({
        firstName: "",
        lastName: "",
        college: "",
        year: "",
        skills: "",
        company: "",
        designation: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student",
      });

      setTimeout(() => navigate("/login"), 2000); // optional redirect
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-white to-indigo-50 p-4 overflow-hidden">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden h-full ">

        {/* Left Side - Illustration */}
        <div
          className="hidden md:flex flex-1 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://storage.googleapis.com/joblist-content/hero-images/Work-Abroad-for-a-Year.png')",
          }}
        ></div>

        {/* Right Side - Register Form */}
        <div className="flex flex-col justify-center p-8 md:p-10 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Create Your Account
            </h2>
            <div className="w-16 h-1 bg-indigo-500 mx-auto mt-2 rounded-full"></div>
            <p className="mt-2 text-gray-500 text-sm md:text-base">
              Register to find jobs or hire professionals
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First + Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First Name"
                required
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                required
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>

            {/* Student Fields */}
            {form.role === "student" && (
              <>
                <input
                  type="text"
                  name="college"
                  value={form.college}
                  onChange={handleChange}
                  placeholder="College Name"
                  required
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
                <input
                  type="text"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  placeholder="Year of Study (e.g., 3rd Year)"
                  required
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
                <input
                  type="text"
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="Skills (comma separated)"
                  required
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </>
            )}

            {/* Recruiter Fields */}
            {form.role === "recruiter" && (
              <>
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Company Name"
                  required
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
                <input
                  type="text"
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  placeholder="Designation"
                  required
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </>
            )}

            {/* Phone */}
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />

            {/* Password + Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>

            {/* Role Selection */}
            <div className="flex gap-3 flex-wrap">
              {["student", "recruiter", "admin"].map((role) => (
                <label
                  key={role}
                  className={`px-4 py-2 border rounded-xl cursor-pointer flex-1 text-center capitalize min-w-[80px] ${
                    form.role === role
                      ? "bg-indigo-50 border-indigo-500 text-indigo-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={form.role === role}
                    onChange={handleChange}
                    className="hidden"
                  />
                  {role}
                </label>
              ))}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-semibold transition duration-200 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {/* Messages */}
          {submitted && (
            <div className="mt-4 text-green-600 font-medium text-center">
              ✅ Registration successful!
            </div>
          )}
          {error && (
            <div className="mt-4 text-red-600 font-medium text-center">
              ❌ {error}
            </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
