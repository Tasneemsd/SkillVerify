import React, { useState, useEffect } from "react";
import { FaGoogle, FaEnvelope, FaArrowUp } from "react-icons/fa";

export default function Home() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="font-sans bg-white text-gray-800">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 shadow-sm">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="VHireToday Logo" className="h-8" />
          <span className="text-2xl font-bold text-blue-600">VHireToday</span>
        </div>
        <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <a href="#" className="hover:text-blue-600">Jobs</a>
          <a href="#" className="hover:text-blue-600">Internships</a>
          <a href="#" className="hover:text-blue-600">Courses</a>
          <span className="bg-yellow-400 text-sm px-2 py-0.5 rounded-md text-white font-semibold">OFFER</span>
        </nav>
        <div className="flex items-center space-x-3">
          <button className="border border-blue-500 text-blue-500 px-4 py-1.5 rounded hover:bg-blue-50">Login</button>
          <button className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700">Register</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-16 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 space-y-5">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            India’s <span className="text-yellow-300">#1 platform</span>
          </h1>
          <p className="text-lg">For fresher jobs, internships and courses</p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button className="flex items-center justify-center space-x-2 bg-white text-gray-800 font-semibold px-6 py-3 rounded-md hover:bg-gray-100">
              <FaGoogle className="text-red-500" />
              <span>Continue with Google</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-blue-800 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-900">
              <FaEnvelope />
              <span>Continue with Email</span>
            </button>
          </div>
          <p className="text-sm text-gray-200">
            By continuing, you agree to our <a href="#" className="underline">T&C</a>.
          </p>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
          <img src="https://cdn.pixabay.com/photo/2017/01/31/13/14/business-2029319_1280.png" alt="Hero People" className="rounded-lg shadow-lg" />
        </div>
      </section>

      {/* Trusted Companies */}
      <section className="py-10 bg-white text-center">
        <p className="text-gray-500 font-medium">10K+ openings daily</p>
        <div className="flex justify-center items-center flex-wrap mt-4 space-x-6">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Paytm_logo.png" alt="Paytm" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/02/Nestle_textlogo_blue.svg" alt="Nestle" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/1a/HCL_Technologies_Logo.svg" alt="HCL" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/BookMyShow_logo.svg" alt="BookMyShow" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Nykaa_logo.svg" alt="Nykaa" className="h-6" />
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-12 bg-gray-50 px-6 md:px-20">
        <h2 className="text-2xl font-bold mb-6">Trending now 🔥</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-teal-50 p-6 rounded-2xl hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-teal-700 mb-3">Placement Courses with AI</h3>
            <p className="text-gray-700 text-sm mb-4">Our learners get placed at Amazon, Flipkart, Samsung & more.</p>
            <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">Know more</button>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">Get discovered by 3L+ Companies</h3>
            <p className="text-gray-700 text-sm mb-4">Master a skill & get recommended to recruiters.</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Know more</button>
          </div>
          <div className="bg-purple-50 p-6 rounded-2xl hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-purple-700 mb-3">TATA Crucible - The Campus Quiz</h3>
            <p className="text-gray-700 text-sm mb-4">Win internships, ₹2.5L prizes & epic rewards.</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Register now</button>
          </div>
        </div>
      </section>

      {/* 💼 Popular Categories */}
      <section className="py-12 px-6 md:px-20 bg-white">
        <h2 className="text-2xl font-bold mb-6">Popular Categories 💼</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Web Development", "Data Science", "UI/UX Design", "Marketing", "Finance", "Human Resources", "AI & ML", "Content Writing"].map((cat) => (
            <div key={cat} className="bg-gray-100 text-center p-6 rounded-xl hover:shadow-md transition">
              <p className="font-semibold text-gray-700">{cat}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ⭐ Why Choose VHireToday */}
      <section className="bg-blue-50 py-16 px-6 md:px-20 text-center">
        <h2 className="text-2xl font-bold mb-8">Why Choose VHireToday ⭐</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-blue-700 mb-2">AI-Powered Job Match</h3>
            <p className="text-gray-600 text-sm">We connect you to the most relevant jobs using smart algorithms.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-blue-700 mb-2">Trusted by Recruiters</h3>
            <p className="text-gray-600 text-sm">Top brands rely on us to hire the best freshers and interns.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-blue-700 mb-2">Career Boosting Courses</h3>
            <p className="text-gray-600 text-sm">Upskill with industry-recognized certifications and live projects.</p>
          </div>
        </div>
      </section>

      {/* 📊 Stats Section */}
      <section className="py-16 bg-white text-center px-6 md:px-20">
        <h2 className="text-2xl font-bold mb-8">Our Impact in Numbers 📊</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { num: "5L+", label: "Active Students" },
            { num: "50K+", label: "Companies" },
            { num: "1L+", label: "Successful Placements" },
            { num: "200+", label: "Online Courses" },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-50 py-8 rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="text-3xl font-bold text-blue-600">{stat.num}</h3>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🎓 Testimonials */}
      <section className="bg-gray-50 py-16 px-6 md:px-20 text-center">
        <h2 className="text-2xl font-bold mb-8">What Our Users Say 🎓</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Aarav Mehta",
              text: "VHireToday helped me land my first internship in web development! The process was super smooth.",
            },
            {
              name: "Priya Sharma",
              text: "I loved the AI-based recommendations. It made finding relevant roles so easy!",
            },
            {
              name: "Rohit Verma",
              text: "Thanks to VHireToday, I got a full-time job offer from a top startup. Highly recommend!",
            },
          ].map((t) => (
            <div key={t.name} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
              <p className="text-gray-700 text-sm italic mb-3">“{t.text}”</p>
              <h4 className="font-semibold text-blue-700">{t.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* ✉️ Newsletter Signup */}
      <section className="bg-blue-600 text-white text-center py-16 px-6 md:px-20">
        <h2 className="text-2xl font-bold mb-4">Stay Updated with VHireToday ✉️</h2>
        <p className="mb-6 text-blue-100">Get the latest internships, job alerts, and career tips directly in your inbox.</p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-md w-64 text-gray-800 outline-none"
          />
          <button className="bg-yellow-400 px-6 py-3 rounded-md font-semibold hover:bg-yellow-500">
            Subscribe
          </button>
        </div>
      </section>

      {/* Employer Section */}
      <section className="py-16 bg-blue-100 px-6 md:px-20 text-center md:text-left flex flex-col md:flex-row items-center justify-between rounded-xl mx-4 md:mx-12 my-10">
        <div className="md:w-2/3 space-y-3">
          <h3 className="text-lg font-semibold text-blue-700">VHireToday for Employers</h3>
          <h2 className="text-2xl font-bold text-gray-800">
            Looking to hire freshers and interns?
          </h2>
          <p className="text-gray-700">
            Access India’s largest talent pool with AI-powered tools and smart filters to hire faster.
          </p>
          <button className="bg-yellow-400 text-white px-5 py-2 rounded font-semibold hover:bg-yellow-500">Post now for free</button>
        </div>
        <div className="md:w-1/3 mt-8 md:mt-0">
          <img
            src="https://cdn.pixabay.com/photo/2016/03/31/19/56/avatar-1295396_1280.png"
            alt="Employer"
            className="rounded-lg shadow-md"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center py-6">
        <p className="text-sm">© 2025 VHireToday. All rights reserved.</p>
      </footer>

      {/* 🔝 Floating Back-to-Top Button */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 animate-bounce"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
