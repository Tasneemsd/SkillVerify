import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", role: "student" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Determine endpoint based on role
      let endpoint = "";
      if (form.role === "student") endpoint = "/student/login";
      else if (form.role === "recruiter") endpoint = "/recruiter/login";
      else if (form.role === "admin") endpoint = "/admin/login";

      const res = await API.post(endpoint, {
        email: form.email,
        password: form.password,
      });

      // Save JWT + user info
      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert(`Logged in as ${res.data.user.email} (${res.data.user.role})`);

      // Redirect based on role
      if (res.data.user.role === "student") navigate("/student");
      else if (res.data.user.role === "admin") navigate("/admin");
      else if (res.data.user.role === "recruiter") navigate("/recruiter");

    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-white to-indigo-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* Left Illustration */}
        <div
          className="hidden md:flex flex-1 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/034/956/340/non_2x/people-seeking-job-opportunities-job-search-recruitment-hr-hiring-employees-flat-illustrations-for-landing-page-web-banner-social-media-infographic-mobile-apps-vector.jpg')"
          }}
        ></div>

        {/* Right Side - Form */}
        <div className="flex flex-col justify-center p-8 sm:p-10">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <div className="w-16 h-1 bg-indigo-500 mx-auto mt-2 rounded-full"></div>
            <p className="mt-2 text-gray-500 text-sm">Access your account and explore new opportunities</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />

            {/* Role Selection */}
            <div className="flex gap-3 flex-wrap">
              {["student", "recruiter", "admin"].map((role) => (
                <label
                  key={role}
                  className={`px-4 py-2 border rounded-xl cursor-pointer flex-1 text-center capitalize min-w-[80px] ${
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-semibold transition duration-200"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Error message */}
          {error && (
            <p className="mt-4 text-red-600 font-medium text-center">
              ❌ {error}
            </p>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
