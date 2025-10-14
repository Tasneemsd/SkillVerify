import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API, { setAuthToken, setUserData } from "../api";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await API.post("/login", {
        email: form.email,
        password: form.password,
        role: form.role,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userRole", user.role);

      setAuthToken(token);
      setUserData(user);
      setSuccess(`✅ Logged in as ${user.email}`);

      if (user.role === "student") navigate("/student");
      else if (user.role === "recruiter") navigate("/recruiter");
      else if (user.role === "admin") navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] px-2 sm:px-4">
      <div className="bg-white w-full max-w-sm sm:max-w-md md:max-w-lg shadow-2xl rounded-2xl p-6 sm:p-8">
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Login as{" "}
            <span className="font-semibold capitalize">{form.role}</span>
          </p>
        </div>

      

        <div className="text-center text-gray-400 mb-4 text-sm">OR</div>

        {/* Role Selection */}
        <div className="flex justify-center gap-4 mb-6 text-sm sm:text-base flex-wrap">
          {["student", "recruiter", "admin"].map((roleOption) => (
            <label
              key={roleOption}
              className="flex items-center gap-2 cursor-pointer"
            >
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm sm:text-base"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm sm:text-base"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 gap-2 sm:gap-0">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-indigo-500" /> Remember me
            </label>
            <a href="#" className="hover:text-indigo-600">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 sm:py-2.5 rounded-md font-semibold transition text-sm sm:text-base"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-center mt-3 text-sm">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-center mt-3 text-sm">{success}</p>
        )}

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
