
import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api"; // axios instance

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("form"); // form | otp | success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    try {
      await API.post("/send-otp", form);
      setStep("otp");
      setInfo("OTP sent to your phone");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    try {
      await API.post("/verify-otp", { phone: form.phone, otp });
      setStep("success");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");
    setInfo("");
    try {
      await API.post("/resend-otp", { phone: form.phone });
      setInfo("A new OTP has been sent");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
        
        {/* Tabs */}
        <div className="flex justify-around border-b mb-6">
          <button className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-2 w-1/2">
            Student
          </button>
          <button className="text-gray-500 w-1/2 pb-2">
            Employer / T&P
          </button>
        </div>

        {/* Step: Form */}
        {step === "form" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              required
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password (min 6 chars)"
              required
              minLength={6}
              className="w-full px-4 py-2 border rounded-md"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md font-medium"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Register"}
            </button>
          </form>
        )}

        {/* Step: OTP */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              className="w-full px-4 py-2 border rounded-md"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md font-medium"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-md font-medium hover:bg-gray-300"
              disabled={loading}
            >
              Resend OTP
            </button>
          </form>
        )}

        {/* Step: Success */}
        {step === "success" && (
          <div className="text-center text-green-600 font-medium">
            ✅ Registration successful!
          </div>
        )}

        {/* Messages */}
        {info && (
          <div className="mt-4 text-center text-blue-600 font-medium">{info}</div>
        )}
        {error && (
          <div className="mt-4 text-center text-red-600 font-medium">{error}</div>
        )}

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

