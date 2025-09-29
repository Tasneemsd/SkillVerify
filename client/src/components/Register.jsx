
import React, { useState } from "react";
import { sendOtp, verifyOtp } from "../api";

function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    otp: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSendOtp = async () => {
    try {
      await sendOtp(form.phone);
      alert("OTP sent!");
      setStep(2);
    } catch (err) {
      alert("Failed to send OTP");
    }
  };

  const handleVerify = async () => {
    try {
      const res = await verifyOtp({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        code: form.otp,
      });

      if (res.data.success) {
        alert("Registered successfully!");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Verification failed");
    }
  };

  return (
    <div>
      {step === 1 && (
        <div>
          <input name="name" placeholder="Name" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="phone" placeholder="Phone" onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} />
          <button onClick={handleSendOtp}>Send OTP</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <input name="otp" placeholder="Enter OTP" onChange={handleChange} />
          <button onClick={handleVerify}>Verify & Register</button>
        </div>
      )}
    </div>
  );
}

export default Register;

