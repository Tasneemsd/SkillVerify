// ✅ Register.jsx (fixed)
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API, { sendEmailOtp as apiSendOtp, verifyEmailOtp as apiVerifyOtp } from "../api";

export default function Register({ compact }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Reset OTP verification if email changes
    if (name === "email") {
      setOtpSent(false);
      setOtpVerified(false);
      setResendTimer(30);
    }
  };

  // OTP resend countdown
  useEffect(() => {
    let timer;
    if (otpSent && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpSent, resendTimer]);

  // Send Email OTP
  const sendOtp = async () => {
    if (!form.email) {
      setError("Enter a valid email address");
      return;
    }
    try {
      setError("");
      setSuccess("");
      setOtpSending(true);
      await apiSendOtp(form.email);
      setOtpSent(true);
      setResendTimer(30);
      setSuccess("OTP sent successfully to your email");
    } catch (err) {
      console.error("Send OTP error:", err);
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setOtpSending(false);
    }
  };

  // Verify Email OTP
  const handleVerifyOtp = async () => {
    if (!form.otp) return;
    try {
      setError("");
      setOtpVerifying(true);
      await apiVerifyOtp({ email: form.email, code: form.otp });
      setOtpVerified(true);
      setSuccess("✅ OTP verified successfully!");
    } catch (err) {
      console.error("OTP verify error:", err);
      setError(err.response?.data?.message || "OTP verification failed");
      setOtpVerified(false);
    } finally {
      setOtpVerifying(false);
    }
  };

  // Register User
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!otpVerified) {
      setError("Please verify your email OTP before registering");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/register", {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      setSuccess(res.data.message || "Registration successful!");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        otp: "",
        role: "student",
      });
      setOtpSent(false);
      setOtpVerified(false);
    } catch (err) {
      console.error("Register error:", err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-3 py-4 sm:px-4">
      <div
        className={`flex flex-col ${compact ? "p-3" : "p-6 sm:p-8"} bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg`}
      >
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">Create Account</h2>
          <p className="text-sm sm:text-base text-gray-500">
            Join as <span className="font-medium capitalize">{form.role}</span>
          </p>
        </div>

        {/* Role Selection */}
        <div className="flex flex-wrap justify-center gap-4 mb-5 text-sm sm:text-base">
          {["student", "recruiter", "admin"].map((roleOption) => (
            <label key={roleOption} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value={roleOption}
                checked={form.role === roleOption}
                onChange={handleChange}
                className="accent-indigo-500"
              />
              {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
            </label>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
              className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm sm:text-base"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
              className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm sm:text-base"
            />
          </div>

          {/* Email field */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="flex-1 border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm sm:text-base"
            />
            <button
              type="button"
              onClick={sendOtp}
              disabled={!form.email || otpSent || otpSending}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-50 text-sm sm:text-base"
            >
              {otpSending ? "Sending..." : otpSent ? `Resend (${resendTimer}s)` : "Send OTP"}
            </button>
          </div>

          {/* OTP input */}
          {otpSent && (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={form.otp}
                onChange={handleChange}
                required
                className="flex-1 border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={!form.otp || otpVerified || otpVerifying}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 text-sm sm:text-base"
              >
                {otpVerifying ? "Verifying..." : otpVerified ? "Verified ✅" : "Verify OTP"}
              </button>
            </div>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm sm:text-base"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm sm:text-base"
          />

          <button
            type="submit"
            disabled={loading || !otpVerified}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 rounded-md font-semibold text-sm sm:text-base transition"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        {error && <p className="text-red-500 text-center text-sm mt-2">{error}</p>}
        {success && <p className="text-green-600 text-center text-sm mt-2">{success}</p>}

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
