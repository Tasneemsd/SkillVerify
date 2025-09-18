import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "", role: "student" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Mock login validation (replace with backend API later)
        if (form.email && form.password) {
            // Save user with role in localStorage
            localStorage.setItem("user", JSON.stringify(form));

            alert(`Logged in as ${form.email} (${form.role})`);

            // Redirect based on role
            if (form.role === "student") navigate("/student");
            else if (form.role === "admin") navigate("/admin");
            else if (form.role === "recruiter") navigate("/recruiter");
        } else {
            alert("Invalid email or password!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-white to-indigo-50">
            {/* Wrapper */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                
                {/* Left Image */}
                <div
                    className="hidden md:flex flex-1 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/034/956/340/non_2x/people-seeking-job-opportunities-job-search-recruitment-hr-hiring-employees-flat-illustrations-for-landing-page-web-banner-social-media-infographic-mobile-apps-vector.jpg')"
                    }}
                ></div>

                {/* Right Form */}
                <div className="flex flex-col justify-center p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                        <div className="w-16 h-1 bg-indigo-500 mx-auto mt-2 rounded-full"></div>
                        <p className="mt-3 text-gray-500 text-sm">
                            Access your account and explore new opportunities
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••••"
                                required
                                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            />
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Login as
                            </label>
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            >
                                <option value="student">Student</option>
                                <option value="admin">Admin</option>
                                <option value="recruiter">Recruiter</option>
                            </select>
                        </div>

                        {/* Remember + Forgot */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded text-indigo-500" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="hover:text-indigo-600">Forgot password?</a>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-semibold transition duration-200"
                        >
                            Login
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="px-2 text-gray-400 text-sm">OR</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    {/* Social Login */}
                    <div className="flex gap-3">
                        <button className="flex-1 flex items-center justify-center border rounded-xl py-2 hover:bg-gray-50 transition">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
                            Google
                        </button>
                        <button className="flex-1 flex items-center justify-center border rounded-xl py-2 hover:bg-gray-50 transition">
                            <img src="https://img.favpng.com/13/12/10/github-pages-logo-computer-icons-png-favpng-ew8sjnZfG8RsyhJNBTL2Dw3SR.jpg" alt="GitHub" className="w-6 h-6 mr-2" />
                            GitHub
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don’t have an account?{" "}
                        <a href="/register" className="text-indigo-600 font-medium hover:underline">
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
