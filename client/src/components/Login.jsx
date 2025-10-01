import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API, { setAuthToken, setUserData } from "../api"; // updated import

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

      // ✅ store token and user in unified way
      setAuthToken(res.data.token);
      setUserData(res.data.user);

      setSuccess(`✅ Logged in as ${res.data.user.email}`);

      // redirect based on role
      if (res.data.user.role === "student") navigate("/student");
      else if (res.data.user.role === "recruiter") navigate("/recruiter");
      else if (res.data.user.role === "admin") navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-100 to-white px-4">
      <div className="bg-white w-full max-w-md shadow-2xl rounded-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500">
            Login as{" "}
            <span className="font-semibold capitalize">{form.role}</span>
          </p>
        </div>

        {/* Google Login */}
        <button className="w-full border flex items-center justify-center py-2 rounded-md mb-4 hover:bg-gray-50 transition font-medium">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Continue with Google
        </button>

        <div className="text-center text-gray-400 mb-4">OR</div>

        {/* Role Selection */}
        <div className="flex justify-around mb-6">
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />

          <div className="flex items-center justify-between text-sm text-gray-500">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-indigo-500" /> Remember me
            </label>
            <a href="#" className="hover:text-indigo-600">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-md font-semibold transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-3">{error}</p>}
        {success && <p className="text-green-600 text-center mt-3">{success}</p>}

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
