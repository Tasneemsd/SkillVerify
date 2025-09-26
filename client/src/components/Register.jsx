import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api"; // your API instance

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    college: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    department: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

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
      // Prepare payload dynamically
      const payload = {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      if (form.role === "student") {
        payload.college = form.college;
        payload.phone = form.phone;
      } else if (form.role === "recruiter") {
        payload.company = form.company;
        payload.phone = form.phone;
      } else if (form.role === "admin") {
        payload.department = form.department;
      }

      await API.post("/register", payload);

      setSubmitted(true);
      setForm({
        firstName: "",
        lastName: "",
        college: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        company: "",
        department: "",
        role: "student",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-white to-indigo-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden">

        {/* Left Side - Illustration */}
        <div
          className="hidden md:flex flex-1 bg-cover bg-center min-h-[400px]"
          style={{
            backgroundImage:
              "url('https://storage.googleapis.com/joblist-content/hero-images/Work-Abroad-for-a-Year.png')",
          }}
        ></div>

        {/* Right Side - Form */}
        <div className="flex flex-col justify-start p-6 md:p-10 flex-1 overflow-y-auto">
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

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Role-Specific Fields */}
            {form.role === "student" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    College Name
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={form.college}
                    onChange={handleChange}
                    placeholder="e.g., Stanford University"
                    required
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                  />
                </div>
              </>
            )}

            {form.role === "recruiter" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="e.g., TechCorp"
                    required
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                  />
                </div>
              </>
            )}

            {form.role === "admin" && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="e.g., HR"
                  required
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                />
              </div>
            )}

            {/* Email & Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                I am a...
              </label>
              <div className="flex gap-3 flex-wrap">
                {["student", "recruiter", "admin"].map((role) => (
                  <label
                    key={role}
                    className={`px-4 py-2 border rounded-xl cursor-pointer flex-1 text-center capitalize min-w-[80px] transition ${
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
            </div>

            {/* Submit Button */}
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

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
