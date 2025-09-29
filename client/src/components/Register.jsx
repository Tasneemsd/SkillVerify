import React, { useState } from "react";
import API from "../api";

function Register() {
  const [step, setStep] = useState("form"); // form | otp | success
  const [formData, setFormData] = useState({ email: "", phone: "", password: "" });
  const [otp, setOtp] = useState("");

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async e => {
    e.preventDefault();
    try {
      await API.post("/send-otp", formData);
      setStep("otp");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async e => {
    e.preventDefault();
    try {
      await API.post("/verify-otp", { phone: formData.phone, otp });
      setStep("success");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to verify OTP");
    }
  };

  return (
    <div className="register">
      {step === "form" && (
        <form onSubmit={sendOtp}>
          <h2>Register</h2>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="tel" name="phone" placeholder="+91XXXXXXXXXX" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Send OTP</button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={verifyOtp}>
          <h2>Verify OTP</h2>
          <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" required />
          <button type="submit">Verify OTP</button>
        </form>
      )}

      {step === "success" && <h2>✅ Registration Successful! Please log in.</h2>}
    </div>
  );
}

export default Register;
