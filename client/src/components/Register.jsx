import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api"; // your API instance

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Send OTP to backend
  const sendOtp = async () => {
    try {
      setError("");
      await API.post("/otp/send-otp", { phone: form.phone });
      setOtpSent(true);
      setSuccess("OTP sent successfully to your phone");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await API.post("/register", {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        phone: form.phone,
        password: form.password,
        otp: form.otp, // verify OTP on backend
      });

      setSuccess("✅ Registration successful!");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        otp: "",
      });
      setOtpSent(false);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white w-full max-w-md shadow-lg rounded-lg p-6">
        
        {/* Google Register */}
        <button className="w-full border flex items-center justify-center py-2 rounded-md mb-4 hover:bg-gray-50 transition">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Register with Google
        </button>

        <div className="text-center text-gray-500 mb-4">OR</div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <div className="flex gap-2">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="flex-1 border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={sendOtp}
              disabled={!form.phone || otpSent}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-50"
            >
              {otpSent ? "OTP Sent" : "Send OTP"}
            </button>
          </div>
          {otpSent && (
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-md font-semibold transition"
          >
            {loading ? "Registering..." : "Register now"}
          </button>
        </form>

        {/* Error / Success */}
        {error && <p className="text-red-500 text-center mt-3">{error}</p>}
        {success && <p className="text-green-600 text-center mt-3">{success}</p>}

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already on Internshala?{" "}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
