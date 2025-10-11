import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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
        otp: form.otp,
        role: form.role,
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
        role: "student",
      });
      setOtpSent(false);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-2">
      <div className="w-full max-w-sm bg-white shadow-md rounded-xl p-6">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Create Account</h2>
          <p className="text-sm text-gray-500">
            Join as{" "}
            <span className="font-medium">
              {form.role.charAt(0).toUpperCase() + form.role.slice(1)}
            </span>
          </p>
        </div>

        {/* Google Register */}
        <button className="w-full border flex items-center justify-center py-1.5 rounded-md mb-3 hover:bg-gray-50 transition text-sm">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-4 h-4 mr-2"
          />
          Register with Google
        </button>

        <div className="text-center text-gray-400 text-xs mb-3">OR</div>

        {/* Role Selection */}
        <div className="flex justify-around mb-3 text-sm">
          {["student", "recruiter", "admin"].map((roleOption) => (
            <label
              key={roleOption}
              className="flex items-center gap-1 cursor-pointer"
            >
              <input
                type="radio"
                name="role"
                value={roleOption}
                checked={form.role === roleOption}
                onChange={handleChange}
                className="accent-indigo-500 w-3 h-3"
              />
              {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
            </label>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
              className="border px-2 py-1.5 rounded-md focus:ring-1 focus:ring-indigo-400 focus:outline-none text-sm"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
              className="border px-2 py-1.5 rounded-md focus:ring-1 focus:ring-indigo-400 focus:outline-none text-sm"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border px-2 py-1.5 rounded-md focus:ring-1 focus:ring-indigo-400 focus:outline-none text-sm"
          />

          <div className="flex gap-1.5">
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="flex-1 border px-2 py-1.5 rounded-md focus:ring-1 focus:ring-indigo-400 focus:outline-none text-sm"
            />
            <button
              type="button"
              onClick={sendOtp}
              disabled={!form.phone || otpSent}
              className="px-3 py-1.5 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-50 text-sm"
            >
              {otpSent ? "Sent" : "Send OTP"}
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
              className="w-full border px-2 py-1.5 rounded-md focus:ring-1 focus:ring-indigo-400 focus:outline-none text-sm"
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border px-2 py-1.5 rounded-md focus:ring-1 focus:ring-indigo-400 focus:outline-none text-sm"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border px-2 py-1.5 rounded-md focus:ring-1 focus:ring-indigo-400 focus:outline-none text-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-1.5 rounded-md font-medium text-sm"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        {error && <p className="text-red-500 text-center text-xs mt-2">{error}</p>}
        {success && (
          <p className="text-green-600 text-center text-xs mt-2">{success}</p>
        )}

        <p className="text-center text-xs text-gray-500 mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
