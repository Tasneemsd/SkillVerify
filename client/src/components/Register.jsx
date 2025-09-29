import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api"; // 👈 your axios instance

export default function RegisterModal({ isOpen, onClose }) {
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

  if (!isOpen) return null;

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

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create Your Account</h2>
          <div className="w-12 h-1 bg-indigo-500 mx-auto mt-2 rounded-full"></div>
          <p className="mt-2 text-gray-500 text-sm">
            Register to find jobs or hire professionals
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Role Specific Fields */}
          {form.role === "student" && (
            <>
              <input
                type="text"
                name="college"
                value={form.college}
                onChange={handleChange}
                placeholder="College Name"
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
            </>
          )}

          {form.role === "recruiter" && (
            <>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company Name"
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
            </>
          )}

          {form.role === "admin" && (
            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="Department"
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
          )}

          {/* Email & Password */}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Role Selection */}
          <div className="flex gap-3 justify-center">
            {["student", "recruiter", "admin"].map((role) => (
              <label
                key={role}
                className={`px-4 py-2 border rounded-lg cursor-pointer capitalize transition ${
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
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* Messages */}
        {submitted && (
          <div className="mt-3 text-green-600 font-medium text-center">
            ✅ Registration successful!
          </div>
        )}
        {error && (
          <div className="mt-3 text-red-600 font-medium text-center">
            ❌ {error}
          </div>
        )}

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
