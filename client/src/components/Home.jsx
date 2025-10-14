import React, { useState, useEffect } from "react";
import {
  FaGoogle,
  FaEnvelope,
  FaArrowUp,
  FaLaptopCode,
  FaChartLine,
  FaPaintBrush,
  FaBullhorn,
} from "react-icons/fa";
import Login from "./Login";
import Register from "./Register";

export default function Home() {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (showLoginModal || showRegisterModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showLoginModal, showRegisterModal]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="font-sans bg-white text-gray-800 relative overflow-x-hidden">
      {/* Navbar */}
      <header className="flex items-center justify-between px-4 sm:px-6 md:px-10 h-16 shadow-sm sticky top-0 bg-white z-50">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <img
            src="/logos.png"
            alt="VHireToday Logo"
            className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto object-contain"
          />
        </div>

        {/* Center: Nav Links */}
        <nav className="hidden md:flex flex-1 justify-center flex-wrap gap-6 text-gray-700 font-medium items-center">
          <a href="#trending" className="hover:text-blue-600 transition text-sm lg:text-base">Trending</a>
          <a href="#categories" className="hover:text-blue-600 transition text-sm lg:text-base">Categories</a>
          <a href="#why-choose" className="hover:text-blue-600 transition text-sm lg:text-base">Why Choose Us</a>
          <a href="#employers" className="hover:text-blue-600 transition text-sm lg:text-base">Employers</a>
        </nav>

        {/* Right: Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => setShowLoginModal(true)}
            className="border border-blue-500 text-blue-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-blue-50 transition text-sm sm:text-base"
          >
            Login
          </button>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-blue-700 transition text-sm sm:text-base"
          >
            Register
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-12 sm:py-16 px-4 sm:px-8 lg:px-20 flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-16">
        <div className="w-full md:w-1/2 space-y-5 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Hire Smarter with <span className="text-yellow-300">VHireToday</span>
          </h1>
          <p className="text-base sm:text-lg">
            India’s trusted platform for hiring interns, freshers, and skilled talent.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button className="flex items-center justify-center space-x-2 bg-white text-gray-800 font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-md hover:bg-gray-100 w-full sm:w-auto">
              <FaGoogle className="text-red-500" />
              <span>Continue with Google</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-blue-800 text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-md hover:bg-blue-900 w-full sm:w-auto">
              <FaEnvelope />
              <span>Continue with Email</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm text-gray-200">
            By continuing, you agree to our{" "}
            <a href="#" className="underline">Terms & Conditions</a>.
          </p>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="https://training-comp-uploads.internshala.com/data-structures-algorithms/signup_page_media/illustration-images/why-learn.png"
            alt="Hero"
            className="rounded-lg shadow-lg w-4/5 sm:w-3/4 md:w-full object-contain"
          />
        </div>
      </section>

      {/* Trusted Companies */}
      <section className="py-12 bg-white text-center px-4 sm:px-8 lg:px-20">
        <p className="text-gray-500 font-medium mb-8 text-base sm:text-lg">Trusted by 1000+ companies</p>
        <div className="overflow-hidden relative">
          <div className="flex animate-scroll whitespace-nowrap gap-10 sm:gap-12">
            {[
              "https://res.cloudinary.com/dm94ctges/image/upload/v1753619889/logo_bzvwmg.jpg",
              "https://play-lh.googleusercontent.com/FPtxFPnbUNmOPvggNFaTUGPUr4DAb-djW6uWgG8lST76KTmZYko679Oh5g15gr4KAUZH",
              "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
              "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
              "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
              "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
              "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png",
              "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
            ].map((logo, index) => (
              <div key={index} className="inline-block p-3 sm:p-4 bg-gray-50 rounded-xl shadow-md">
                <img src={logo} className="h-12 sm:h-16 md:h-20 object-contain" alt={`Company ${index}`} />
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            display: flex;
            animation: scroll 25s linear infinite;
          }
        `}</style>
      </section>

      {/* Trending */}
      <section id="trending" className="py-16 bg-white px-4 sm:px-8 lg:px-20">
        <div className="flex items-center gap-2 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Trending now</h2>
          <span className="text-blue-500 text-lg sm:text-xl">📈</span>
        </div>

        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4">
          {[
            {
              bg: "from-teal-400 to-teal-600",
              title: "Placement Courses with AI",
              desc: "Our learners get placed at Amazon, Flipkart, Samsung & more!",
              btn: "Know more",
              icon: "AI"
            },
            {
              bg: "from-sky-300 to-blue-500",
              title: "Special offer for students pursuing your degree!",
              desc: "Get 55% + 10% OFF on online trainings. Hurry up — Final hours!",
              btn: "Know more",
              icon: "🎓"
            },
            {
              bg: "from-purple-400 to-fuchsia-600",
              title: "TATA Crucible – The Campus Quiz",
              desc: "Dream internships at the Tata Group + ₹2.5L Grand Prize!",
              btn: "Register now",
              icon: "🏆"
            },
          ].map((item, i) => (
            <div key={i} className={`min-w-[260px] sm:min-w-[280px] md:min-w-0 bg-gradient-to-br ${item.bg} text-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition relative overflow-hidden snap-start flex-shrink-0`}>
              <span className="bg-white/20 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-md">Featured</span>
              <h3 className="text-lg sm:text-xl font-bold mt-3 mb-2">{item.title}</h3>
              <p className="text-sm mb-6">{item.desc}</p>
              <button className="bg-white text-teal-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-100 text-sm">
                {item.btn}
              </button>
              <div className="absolute bottom-4 right-4 opacity-20 text-6xl sm:text-7xl font-bold">{item.icon}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-12 px-4 sm:px-8 lg:px-20 text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">Popular Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { name: "Web Development", icon: <FaLaptopCode className="text-blue-600 text-2xl mb-2" /> },
            { name: "Data Science", icon: <FaChartLine className="text-green-600 text-2xl mb-2" /> },
            { name: "Design", icon: <FaPaintBrush className="text-purple-600 text-2xl mb-2" /> },
            { name: "Marketing", icon: <FaBullhorn className="text-yellow-600 text-2xl mb-2" /> },
          ].map((cat, i) => (
            <div key={i} className="bg-white p-5 sm:p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="flex flex-col items-center justify-center">
                {cat.icon}
                <p className="text-base sm:text-lg font-semibold">{cat.name}</p>
                <p className="text-gray-500 text-xs sm:text-sm">Top internships & jobs</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose */}
      <section id="why-choose" className="py-12 bg-blue-50 px-4 sm:px-8 lg:px-20 text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">Why Choose VHireToday?</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { title: "Verified Talent", desc: "Profiles verified to save time for employers." },
            { title: "AI Matching", desc: "Get matched with the right job opportunities." },
            { title: "Paid Courses", desc: "Upskill yourself to boost employability." },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="font-semibold text-blue-700 mb-2">{item.title}</h3>
              <p className="text-gray-700 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 text-center bg-blue-600 text-white px-4 sm:px-8 lg:px-20">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">VHireToday in Numbers</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div><h3 className="text-3xl sm:text-4xl font-bold">50K+</h3><p>Active Internships</p></div>
          <div><h3 className="text-3xl sm:text-4xl font-bold">200K+</h3><p>Registered Students</p></div>
          <div><h3 className="text-3xl sm:text-4xl font-bold">10K+</h3><p>Companies Hiring</p></div>
          <div><h3 className="text-3xl sm:text-4xl font-bold">100%</h3><p>Verified Profiles</p></div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 px-4 sm:px-8 lg:px-20 text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-10">What Our Users Say</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[{ name: "Aarav Mehta", text: "VHireToday helped me find my first internship in just 3 days!" },
            { name: "Priya Sharma", text: "Their skill verification helped me stand out and land a great job." },
            { name: "Rohit Verma", text: "A seamless platform with trusted employers and real opportunities." }]
            .map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                <p className="text-gray-700 italic mb-4 text-sm sm:text-base">“{t.text}”</p>
                <h4 className="font-semibold text-blue-700 text-sm sm:text-base">{t.name}</h4>
              </div>
            ))}
        </div>
      </section>

      {/* Employers */}
      <section id="employers" className="py-12 px-4 sm:px-8 lg:px-20 text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">Top Employers</h2>
        <div className="flex justify-center flex-wrap gap-6">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Paytm_logo.png" className="h-5 sm:h-6 object-contain" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/02/Nestle_textlogo_blue.svg" className="h-5 sm:h-6 object-contain" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/1a/HCL_Technologies_Logo.svg" className="h-5 sm:h-6 object-contain" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/BookMyShow_logo.svg" className="h-5 sm:h-6 object-contain" />
        </div>
        <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-sm sm:text-base">Hire Talent</button>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-blue-100 text-center px-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Stay Updated 📩</h2>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">Get weekly job & internship updates right to your inbox!</p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-md sm:rounded-l-md w-64 sm:w-72 border border-gray-300 focus:outline-none"
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md sm:rounded-r-md hover:bg-blue-700 text-sm sm:text-base">Subscribe</button>
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

      {/* Scroll Up Button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all animate-bounce"
        >
          <FaArrowUp />
        </button>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/40"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md max-h-[90vh] overflow-y-auto p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              ✕
            </button>

            {/* Login Form */}
            <div className="mt-6">
              <Login />
            </div>
          </div>
        </div>
      )}
      {/* Register Modal */}
      {showRegisterModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/40"
          onClick={() => setShowRegisterModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md max-h-[90vh] overflow-y-auto p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              ✕
            </button>

            {/* Register Form */}
            <div className="mt-6">
              <Register />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}