import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api"; // your Axios instance

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
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Send OTP
  const sendOtp = async () => {
    if (!form.phone) {
      setError("Phone number is required for OTP");
      return;
    }
    try {
      setError("");
      setLoading(true);
      await API.post("/send-otp", { phone: form.phone });
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!otp) {
      setError("Enter the OTP");
      return;
    }
    try {
      setError("");
      setLoading(true);
      const res = await API.post("/verify-otp", { phone: form.phone, code: otp });
      if (res.data.success) {
        setOtpVerified(true);
      } else {
        setError("Invalid OTP");
      }
    } catch (err) {
      setError(err.response?.data?.error || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Only allow registration after OTP verified for student/recruiter
    if ((form.role === "student" || form.role === "recruiter") && !otpVerified) {
      setError("Please verify your phone number first");
      return;
    }

    try {
      setLoading(true);
      setError("");

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
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-white to-indigo-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden">

        {/* Left Side */}
        <div
          className="hidden md:flex flex-1 bg-cover bg-center min-h-[400px]"
          style={{
            backgroundImage:
              "url('https://storage.googleapis.com/joblist-content/hero-images/Work-Abroad-for-a-Year.png')",
          }}
        ></div>

        {/* Right Side */}
        <div className="flex flex-col justify-start p-6 md:p-10 flex-1 overflow-y-auto">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Create Your Account
            </h2>
            <div className="w-16 h-1 bg-indigo-500 mx-auto mt-2 rounded-full"></div>
            <p className="mt-2 text-gray-500 text-sm md:text-base">
              Register to find jobs or hire professionals
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name Fields */}
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

            {/* Role-specific */}
            {(form.role === "student" || form.role === "recruiter") && (
              <>
                {form.role === "student" && (
                  <input
                    type="text"
                    name="college"
                    value={form.college}
                    onChange={handleChange}
                    placeholder="College Name"
                    required
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  />
                )}
                {form.role === "recruiter" && (
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Company Name"
                    required
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  />
                )}

                <div className="flex gap-2">
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    required
                    className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  />
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={sendOtp}
                      className="bg-indigo-600 text-white px-4 rounded-xl"
                    >
                      Send OTP
                    </button>
                  ) : !otpVerified ? (
                    <>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={verifyOtp}
                        className="bg-green-600 text-white px-4 rounded-xl"
                      >
                        Verify OTP
                      </button>
                    </>
                  ) : (
                    <span className="text-green-600 font-medium">✅ Verified</span>
                  )}
                </div>
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
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            )}

            {/* Email & Password */}
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-semibold transition"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {submitted && <div className="mt-4 text-green-600 text-center">✅ Registration successful!</div>}
          {error && <div className="mt-4 text-red-600 text-center">❌ {error}</div>}

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
