import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { ShieldCheck, Brain, BookOpen } from "lucide-react";
import {WhyChoose,StatsSection} from "./Whychoose";

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
    document.body.style.overflow =
      showLoginModal || showRegisterModal ? "hidden" : "auto";
  }, [showLoginModal, showRegisterModal]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 64, // adjust if header height is 64px
        behavior: "smooth",
      });
    }
  };


  return (
    <div className="font-sans bg-white text-gray-800 relative">
      {/* Navbar */}

      <header className="flex items-center justify-between px-3 sm:px-6 md:px-10 h-14 sm:h-16 shadow-sm sticky top-0 bg-white z-50">
        <div className="flex-shrink-0">
          <img
            src="/logos.png"
            alt="VHireToday Logo"
            className="h-48 sm:h-40 md:h-42 lg:h-44 xl:h-46 w-auto object-contain"
          />
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex flex-1 justify-center space-x-8 text-gray-700 font-medium">
          <a onClick={() => scrollToSection("trending")} className="hover:text-blue-600 transition">
            Trending
          </a>
          <a onClick={() => scrollToSection("categories")} className="hover:text-blue-600 transition">
            Categories
          </a>
          <a onClick={() => scrollToSection("why-choose")} className="hover:text-blue-600 transition">
            Why Choose Us
          </a>
          <a onClick={() => scrollToSection("employers")} className="hover:text-blue-600 transition">
            Employers
          </a>
        </nav>

        {/* Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => setShowLoginModal(true)}
            className="border border-blue-500 text-blue-500 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-blue-50 transition"
          >
            Login
          </button>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="bg-blue-600 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-blue-700 transition"
          >
            Register
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-12 sm:py-16 px-4 sm:px-6 md:px-10 lg:px-20 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 space-y-4 sm:space-y-5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Hire Smarter with{" "}
            <span className="text-yellow-300">VHireToday</span>
          </h1>
          <p className="text-base sm:text-lg">
            India’s trusted platform for hiring interns, freshers, and skilled
            talent.
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button className="flex items-center justify-center space-x-2 bg-white text-gray-800 font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-gray-100 text-sm sm:text-base">
              <FaGoogle className="text-red-500" />
              <span>Continue with Google</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-blue-800 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-blue-900 text-sm sm:text-base">
              <FaEnvelope />
              <span>Continue with Email</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm text-gray-200">
            By continuing, you agree to our{" "}
            <a href="#" className="underline">
              Terms & Conditions
            </a>
            .
          </p>
        </div>
        <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center">
          <img
            src="https://training-comp-uploads.internshala.com/data-structures-algorithms/signup_page_media/illustration-images/why-learn.png"
            alt="Hero Illustration"
            className="w-4/5 sm:w-3/4 md:w-full max-w-sm md:max-w-md lg:max-w-lg rounded-lg shadow-lg"
          />
        </div>
      </section>



      {/* Trusted Companies */}
      <section id="trusted" className="py-10 bg-white text-center overflow-hidden">
        <p className="text-gray-500 font-medium mb-6 sm:mb-8 text-base sm:text-lg">
          Trusted by 1000+ companies
        </p>

        {/* ✅ Marquee container */}
        <div className="relative w-full overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[
              "https://res.cloudinary.com/dm94ctges/image/upload/v1753619889/logo_bzvwmg.jpg",
              "https://play-lh.googleusercontent.com/FPtxFPnbUNmOPvggNFaTUGPUr4DAb-djW6uWgG8lST76KTmZYko679Oh5g15gr4KAUZH",
              "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
              "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
              "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
              "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
              "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png",
              "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
            ].map((logo, i) => (
              <div
                key={i}
                className="flex justify-center items-center bg-gray-50 rounded-lg shadow-sm mx-4 p-3 sm:p-4 w-[100px] sm:w-[140px] md:w-[160px] flex-shrink-0"
              >
                <img
                  src={logo}
                  alt={`Company ${i}`}
                  className="h-6 sm:h-8 md:h-10 w-auto object-contain"
                />
              </div>
            ))}
            {/* Duplicate logos for infinite loop */}
            {[
              "https://res.cloudinary.com/dm94ctges/image/upload/v1753619889/logo_bzvwmg.jpg",
              "https://play-lh.googleusercontent.com/FPtxFPnbUNmOPvggNFaTUGPUr4DAb-djW6uWgG8lST76KTmZYko679Oh5g15gr4KAUZH",
              "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
              "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
              "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
              "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
              "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png",
              "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
            ].map((logo, i) => (
              <div
                key={`dup-${i}`}
                className="flex justify-center items-center bg-gray-50 rounded-lg shadow-sm mx-4 p-3 sm:p-4 w-[100px] sm:w-[140px] md:w-[160px] flex-shrink-0"
              >
                <img
                  src={logo}
                  alt={`Company ${i}`}
                  className="h-6 sm:h-8 md:h-10 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section id="trending" className="py-16 bg-white px-4 md:px-16">
        {/* Heading */}
        <div className="flex items-center gap-2 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Trending now</h2>
          <span className="text-blue-500 text-xl">📈</span>
        </div>

        {/* Cards Container */}
        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4">
          {/* Card 1 */}
          <div className="min-w-[280px] md:min-w-0 bg-gradient-to-br from-teal-400 to-teal-600 text-white rounded-2xl p-8 shadow-md hover:shadow-xl transition relative overflow-hidden snap-start flex-shrink-0">
            <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-md">
              Placement courses
            </span>
            <h3 className="text-xl font-bold mt-4 mb-3">
              Placement Courses with AI
            </h3>
            <p className="text-sm mb-6">
              Our learners get placed at Amazon, Flipkart, Samsung & more!
            </p>
            <button className="bg-white text-teal-700 font-semibold px-5 py-2 rounded-md hover:bg-gray-100">
              Know more
            </button>
            <div className="absolute bottom-4 right-4 opacity-20 text-7xl font-bold">AI</div>
          </div>

          {/* Card 2 */}
          <div className="min-w-[280px] md:min-w-0 bg-gradient-to-br from-sky-300 to-blue-500 text-white rounded-2xl p-8 shadow-md hover:shadow-xl transition relative overflow-hidden snap-start flex-shrink-0">
            <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-md">
              Certification courses
            </span>
            <h3 className="text-xl font-bold mt-4 mb-3">
              Special offer for students pursuing your degree!
            </h3>
            <p className="text-sm mb-6">
              Get 55% + 10% OFF on online trainings. Hurry up — Final hours!
            </p>
            <button className="bg-white text-blue-700 font-semibold px-5 py-2 rounded-md hover:bg-gray-100">
              Know more
            </button>
            <div className="absolute bottom-4 right-4 opacity-20 text-7xl font-bold">🎓</div>
          </div>

          {/* Card 3 */}
          <div className="min-w-[280px] md:min-w-0 bg-gradient-to-br from-purple-400 to-fuchsia-600 text-white rounded-2xl p-8 shadow-md hover:shadow-xl transition relative overflow-hidden snap-start flex-shrink-0">
            <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-md">
              Campus competition
            </span>
            <h3 className="text-xl font-bold mt-4 mb-3">
              TATA Crucible – The Campus Quiz
            </h3>
            <p className="text-sm mb-6">
              Dream internships at the Tata Group + ₹2.5L Grand Prize!
            </p>
            <button className="bg-lime-400 text-black font-semibold px-5 py-2 rounded-md hover:bg-lime-500">
              Register now
            </button>
            <div className="absolute bottom-4 right-4 opacity-20 text-7xl font-bold">🏆</div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section id="categories" className="py-12 px-6 md:px-20 text-center">
        <h2 className="text-2xl font-bold mb-6">Popular Categories </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Web Development", icon: <FaLaptopCode className="text-blue-600 text-2xl mb-2" /> },
            { name: "Data Science", icon: <FaChartLine className="text-green-600 text-2xl mb-2" /> },
            { name: "Design", icon: <FaPaintBrush className="text-purple-600 text-2xl mb-2" /> },
            { name: "Marketing", icon: <FaBullhorn className="text-yellow-600 text-2xl mb-2" /> },
          ].map((cat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="flex flex-col items-center justify-center">
                {cat.icon}
                <p className="text-lg font-semibold">{cat.name}</p>
                <p className="text-gray-500 text-sm">Top internships & jobs</p>
              </div>
            </div>
          ))}
        </div>
      </section>

     <WhyChoose />
      <StatsSection />

      {/* 🌟 Testimonials Section (Internshala-style, responsive and polished) */}
      <section className="py-20 bg-gray-50 px-6 sm:px-10 lg:px-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-14 text-gray-800">
          What Our Users Say
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Aarav Mehta",
              role: "Computer Science Student, IIT Delhi",
              text: "VHireToday helped me secure my first internship in under 3 days. The process was smooth and quick!",
              img: "https://randomuser.me/api/portraits/men/32.jpg",
            },
            {
              name: "Priya Sharma",
              role: "Marketing Intern, Nestlé India",
              text: "The skill verification feature made my profile stand out. I landed an amazing role at Nestlé!",
              img: "https://randomuser.me/api/portraits/women/45.jpg",
            },
            {
              name: "Rohit Verma",
              role: "Software Developer, Paytm",
              text: "A user-friendly platform with trusted employers. It truly bridges the gap between students and companies.",
              img: "https://randomuser.me/api/portraits/men/44.jpg",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center border border-gray-100"
            >
              <img
                src={t.img}
                alt={t.name}
                className="w-20 h-20 rounded-full mb-4 object-cover"
              />
              <p className="text-gray-600 italic mb-4 leading-relaxed text-base sm:text-lg">
                “{t.text}”
              </p>
              <h4 className="font-semibold text-blue-700 text-lg">{t.name}</h4>
              <p className="text-sm text-gray-500 mt-1">{t.role}</p>
            </div>
          ))}
        </div>

        
      </section>


      {/* Employers Section */}
      <section
        id="employers"
        className="py-16 px-4 sm:px-8 md:px-16 lg:px-24 text-center bg-white"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800">
          Top Employers
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
          {[
            {
              name: "Google",
              src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
            },
            {
              name: "Microsoft",
              src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
            },
            {
              name: "Amazon",
              src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
            },
            {
              name: "HCL Technologies",
              src: "https://www.google.com/imgres?q=hcl&imgurl=https%3A%2F%2Fwww.hashicorp.com%2F_next%2Fimage%3Furl%3Dhttps%253A%252F%252Fwww.datocms-assets.com%252F2885%252F1683590388-hcl-logo-1976.png%26w%3D3840%26q%3D75&imgrefurl=https%3A%2F%2Fwww.hashicorp.com%2Fid%2Fpartners%2Fsystems-integrators%2Fhcl&docid=uNLzauK0AIaoiM&tbnid=HkkqnaQ7yYNYbM&vet=12ahUKEwjq2KXKsKaQAxWS-zgGHQ5rAAkQM3oECBAQAA..i&w=3840&h=2160&hcb=2&ved=2ahUKEwjq2KXKsKaQAxWS-zgGHQ5rAAkQM3oECBAQAA",
            },
            {
              name: "Infosys",
              src: "https://www.google.com/imgres?q=infosys%20logo&imgurl=https%3A%2F%2Fbrandeps.com%2Flogo-download%2FI%2FInfosys-logo-01.png&imgrefurl=https%3A%2F%2Fbrandeps.com%2Flogo%2FI%2FInfosys-01&docid=Tx-d0sL1-Njp4M&tbnid=Rez962yUkpJHAM&vet=12ahUKEwju27zAsaaQAxWT9DgGHTfSCbcQM3oECBgQAA..i&w=512&h=512&hcb=2&ved=2ahUKEwju27zAsaaQAxWT9DgGHTfSCbcQM3oECBgQAA",
            },
            {
              name: "Paytm",
              src: "https://www.google.com/imgres?q=infosys%2C%20paytm%2Cnestle%2CTCS&imgurl=https%3A%2F%2Fcms-resources.pocketful.in%2Fblog%2Fwp-content%2Fuploads%2F2023%2F12%2FPaytm_Logo_standalone.svg_.webp&imgrefurl=https%3A%2F%2Fwww.pocketful.in%2Fblog%2Fpaytm-case-study-business-model-and-marketing-strategy%2F&docid=zrRiul-yKEva9M&tbnid=CBi7z10fyTkm8M&vet=12ahUKEwiRrKyCsaaQAxVy7DgGHZwQKXoQM3oECB4QAA..i&w=2560&h=811&hcb=2&ved=2ahUKEwiRrKyCsaaQAxVy7DgGHZwQKXoQM3oECB4QAA",
            },
            {
              name: "TCS",
              src: "https://www.google.com/imgres?q=tcs&imgurl=https%3A%2F%2Fcdn.i.haymarketmedia.asia%2F%3Fn%3Dcampaign-india%252Fcontent%252F20230531101105_Tata_Consultancy_Services_Logo.svg.png%26h%3D570%26w%3D855%26q%3D100%26v%3D20250320%26c%3D1&imgrefurl=https%3A%2F%2Fwww.campaignindia.in%2Farticle%2Ftata-consultancy-services-most-valuable-indian-brand-interbrand-study%2F490532&docid=eU34mUL36JMqsM&tbnid=nre8gntkXroG6M&vet=12ahUKEwjLrejfsaaQAxVv4DgGHfNlAFgQM3oECCIQAA..i&w=855&h=570&hcb=2&ved=2ahUKEwjLrejfsaaQAxVv4DgGHfNlAFgQM3oECCIQAA",
            },
            {
              name: "BookMyShow",
              src: "https://www.google.com/imgres?q=infosys%2C%20paytm%2Cnestle%2Cbookmyshow&imgurl=https%3A%2F%2Fimages.livemint.com%2Fimg%2F2021%2F02%2F05%2F600x338%2FBookMyShow_1593571635994_1593571656157_1612516175604.png&imgrefurl=https%3A%2F%2Fwww.livemint.com%2Findustry%2Fmedia%2Fbookmyshow-launches-movie-streaming-service-11612515924416.html&docid=qSwXr8oDaIEdAM&tbnid=xLzN8-c6JUrKPM&vet=12ahUKEwjvuqTxsKaQAxWT4jgGHYI6MpwQM3oECBQQAA..i&w=600&h=337&hcb=2&ved=2ahUKEwjvuqTxsKaQAxWT4jgGHYI6MpwQM3oECBQQAA",
            },
            {
              name: "Nestlé",
              src: "https://www.google.com/imgres?q=nestle&imgurl=https%3A%2F%2Fwww.sourcewatch.org%2Fimages%2Fthumb%2F6%2F65%2FNestle-logo.jpg%2F300px-Nestle-logo.jpg&imgrefurl=https%3A%2F%2Fwww.sourcewatch.org%2Findex.php%2FNestl%25C3%25A9&docid=DLddcHnH8DLZMM&tbnid=4J1Nv1U1Va-suM&vet=12ahUKEwiKq5PysaaQAxV4zDgGHTG5KdwQM3oECBUQAA..i&w=300&h=197&hcb=2&ved=2ahUKEwiKq5PysaaQAxV4zDgGHTG5KdwQM3oECBUQAA",
            },
          ].map((employer) => (
            <img
              key={employer.name}
              src={employer.src}
              alt={employer.name}
              className="h-6 sm:h-8 md:h-10 lg:h-12 xl:h-14 w-auto object-contain transition-transform hover:scale-105"
              loading="lazy"
            />
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

      {/* Scroll Up Button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 bg-blue-600 text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all animate-bounce"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="text-sm sm:text-base" />
        </button>
      )}

      {/* ✅ Login Modal */}
      {showLoginModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/40 px-2 sm:px-4"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ✕ Close Button — inside card */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              aria-label="Close login modal"
            >
              ✕
            </button>
            <div className="mt-8">
              <Login />
            </div>
          </div>
        </div>
      )}

      {/* ✅ Register Modal */}
      {showRegisterModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/40 px-2 sm:px-4"
          onClick={() => setShowRegisterModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ✕ Close Button — inside card */}
            <button
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              aria-label="Close register modal"
            >
              ✕
            </button>
            <div className="mt-8">
              <Register />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 