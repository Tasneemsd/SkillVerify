import React, { useState } from "react";
import { X } from "lucide-react";

// Mock API for testing
const API = {
  post: (url, payload) =>
    new Promise((resolve, reject) => {
      console.log("API called:", url, payload);
      setTimeout(() => {
        if (url === "/otp/send-otp") resolve({ success: true });
        else if (url === "/otp/verify-otp") resolve({ success: true });
        else reject(new Error("Unknown endpoint"));
      }, 1000);
    }),
};

export default function Register({ isOpen, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async () => {
    if (!form.phone) {
      setError("Please enter phone before sending OTP");
      return;
    }
    setSendingOtp(true);
    setError("");
    try {
      await API.post("/otp/send-otp", { phone: form.phone });
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSubmitted(false);

    try {
      const payload = {
        ...form,
        code: form.otp,
      };
      await API.post("/otp/verify-otp", payload);
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", password: "", otp: "" });
      setOtpSent(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Create Your Account
        </h2>
        <div className="w-16 h-1 bg-indigo-500 mx-auto mt-2 rounded-full"></div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full px-4 py-2 border rounded-xl"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded-xl"
          />

          <div className="flex gap-2">
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              required
              className="flex-1 px-4 py-2 border rounded-xl"
            />
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={sendingOtp}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition"
            >
              {sendingOtp ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
            </button>
          </div>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded-xl"
          />

          <input
            type="text"
            name="otp"
            value={form.otp}
            onChange={handleChange}
            placeholder="Enter OTP"
            disabled={!otpSent}
            required
            className="w-full px-4 py-2 border rounded-xl"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-semibold"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

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
      </div>
    </div>
  );
}
