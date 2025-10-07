import React, { useState, useEffect } from "react";
import { FaGoogle, FaEnvelope, FaArrowUp } from "react-icons/fa";

export default function Home() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  // Show Back to Top button on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) setShowTopBtn(true);
      else setShowTopBtn(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="font-sans bg-white text-gray-800">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 shadow-sm sticky top-0 bg-white z-50">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="VHireToday Logo" className="h-8" />
          <span className="text-2xl font-bold text-blue-600">VHireToday</span>
        </div>
        <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <a href="#" className="hover:text-blue-600">Hire</a>
          <a href="#" className="hover:text-blue-600">Internships</a>
          <a href="#" className="hover:text-blue-600">Verify Skills</a>
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
            Hire Smarter with <span className="text-yellow-300">VHireToday</span>
          </h1>
          <p className="text-lg">India’s trusted platform for hiring interns, freshers, and skilled talent.</p>
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
            By continuing, you agree to our <a href="#" className="underline">Terms & Conditions</a>.
          </p>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
          <img src="https://cdn.pixabay.com/photo/2017/01/31/13/14/business-2029319_1280.png" alt="Hero People" className="rounded-lg shadow-lg" />
        </div>
      </section>

      {/* Trusted Companies */}
      <section className="py-10 bg-white text-center">
        <p className="text-gray-500 font-medium">Trusted by 1000+ companies</p>
        <div className="flex justify-center items-center flex-wrap mt-4 gap-6">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Paytm_logo.png" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/02/Nestle_textlogo_blue.svg" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/1a/HCL_Technologies_Logo.svg" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/BookMyShow_logo.svg" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Nykaa_logo.svg" className="h-6" />
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-12 bg-gray-50 px-6 md:px-20">
        <h2 className="text-2xl font-bold mb-6">Trending Now 🔥</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-teal-50 p-6 rounded-2xl hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-teal-700 mb-3">AI-Powered Resume Builder</h3>
            <p className="text-gray-700 text-sm mb-4">Boost your profile visibility and get hired faster.</p>
            <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">Try Now</button>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">Get Discovered by Recruiters</h3>
            <p className="text-gray-700 text-sm mb-4">Showcase your verified skills and get matched instantly.</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Know More</button>
          </div>
          <div className="bg-purple-50 p-6 rounded-2xl hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-purple-700 mb-3">Free Placement Courses</h3>
            <p className="text-gray-700 text-sm mb-4">Upskill yourself with certified career programs.</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Explore</button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 text-center bg-blue-600 text-white">
        <h2 className="text-2xl font-bold mb-6">VHireToday in Numbers</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div><h3 className="text-4xl font-bold">50K+</h3><p>Active Internships</p></div>
          <div><h3 className="text-4xl font-bold">200K+</h3><p>Registered Students</p></div>
          <div><h3 className="text-4xl font-bold">10K+</h3><p>Companies Hiring</p></div>
          <div><h3 className="text-4xl font-bold">100%</h3><p>Verified Profiles</p></div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 px-8 md:px-20 text-center">
        <h2 className="text-2xl font-bold mb-10">What Our Users Say 💬</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Aarav Mehta",
              text: "VHireToday helped me find my first internship in just 3 days!",
            },
            {
              name: "Priya Sharma",
              text: "Their skill verification helped me stand out and land a great job.",
            },
            {
              name: "Rohit Verma",
              text: "A seamless platform with trusted employers and real opportunities.",
            },
          ].map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <p className="text-gray-700 italic mb-4">“{t.text}”</p>
              <h4 className="font-semibold text-blue-700">{t.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-blue-100 text-center">
        <h2 className="text-2xl font-bold mb-4">Stay Updated 📩</h2>
        <p className="text-gray-600 mb-6">Get weekly job & internship updates right to your inbox!</p>
        <div className="flex justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-l-md w-64 border border-gray-300 focus:outline-none"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">Subscribe</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 px-6 md:px-20">
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <h3 className="font-semibold text-white mb-3">About VHireToday</h3>
            <p className="text-sm">Empowering students and companies with smarter hiring tools and verified skills.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">FAQs</a></li>
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3">Follow Us</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white">Instagram</a></li>
              <li><a href="#" className="hover:text-white">Twitter</a></li>
            </ul>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-8">© 2025 VHireToday. All rights reserved.</p>
      </footer>

      {/* Floating Back to Top Button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all animate-bounce"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
}
