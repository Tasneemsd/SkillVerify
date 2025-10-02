import React, { useState } from "react";
import {
  GraduationCap,
  Menu,
  X,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white text-gray-800">

      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl hover:opacity-80 transition-opacity">

            <img src="/logos.png" alt="Logo" className="h-22 w-auto" />
          </Link>


          <div className="hidden md:flex gap-6 lg:gap-8 font-medium text-gray-700 text-sm lg:text-base">
            <a href="#verification" className="hover:text-blue-600">
              Verification Process
            </a>
            <a href="#courses" className="hover:text-blue-600">
              Course
            </a>
            <a href="#about" className="hover:text-blue-600">
              About Us
            </a>
            <a href="#recruiters" className="hover:text-blue-600">
              For Recruiters
            </a>
          </div>


          <div className="hidden sm:flex gap-2 sm:gap-4 text-sm sm:text-base">
            <button
              className="px-3 sm:px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>

          <button
            className="md:hidden flex items-center text-blue-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>


        <div
          className={`md:hidden bg-white shadow-lg border-t overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="flex flex-col gap-4 px-6 py-4 font-medium text-gray-700">
            <a
              href="#verification"
              className="hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Verification Process
            </a>
            <a
              href="#courses"
              className="hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Courses
            </a>
            <a
              href="#about"
              className="hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              About Us
            </a>
            <a
              href="#recruiters"
              className="hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              For Recruiters
            </a>
            <div className="flex flex-col gap-2 pt-4 border-t">
              <button
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/login");
                }}
              >
                Login
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/register");
                }}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="text-center px-4 sm:px-6 py-16 sm:py-20 max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-snug">
          <span className="text-blue-600">Get Skills Verified</span> <br />
          That Recruiters{" "}
          <span className="text-green-600">Actually Trust</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8 px-2">
          Go beyond self-proclaimed skills. Complete our rigorous 5-step
          verification process and earn green-badge credentials that top
          recruiters recognize and value.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-5 sm:px-6 py-3 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base">
            <GraduationCap size={20} className="text-black-600" />
            <a className="start" onClick={() => {

              navigate("/register");
            }}>Start Your Journey</a>
          </button>
          <button className="flex items-center justify-center gap-2 border border-blue-600 text-blue-600 font-semibold px-5 sm:px-6 py-3 rounded-lg hover:bg-blue-50 transition text-sm sm:text-base">
            <img
              src="https://img.icons8.com/color/48/organization.png"
              alt="recruiter"
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
            <a className='rec' onClick={() => {

              navigate("/register");
            }}>I'm a Recruiter</a>
          </button>
        </div>
      </section>


      <section
        id="verification"
        className="py-12 sm:py-16 bg-white max-w-6xl mx-auto px-4 sm:px-6"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-12">
          5-Step Skill Verification Process
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            {
              step: "Step 1",
              title: "Course Registration",
              img: "https://img.icons8.com/color/48/books.png",
              active: true,
            },
            {
              step: "Step 2",
              title: "Regular Classes & Projects",
              img: "https://img.icons8.com/fluency/48/laptop.png",
            },
            {
              step: "Step 3",
              title: "Major Project",
              img: "https://img.icons8.com/color/48/rocket--v1.png",
            },
            {
              step: "Step 4",
              title: "Technical Interview",
              img: "https://img.icons8.com/color/48/goal.png",
            },
            {
              step: "Step 5",
              title: "Skill Verification",
              img: "https://img.icons8.com/color/48/ok--v1.png",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-xl shadow border ${item.active ? "bg-blue-50 border-blue-400" : "bg-gray-50"
                }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-10 h-10 sm:w-12 sm:h-12"
                />
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {item.step}
                  </p>
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-50 to-green-50">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-10 sm:mb-12">
          Your Journey to Verified Skills
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 max-w-5xl mx-auto">
          {[
            {
              title: "Course Registration",
              img: "https://img.icons8.com/color/48/books.png",
            },
            {
              title: "Regular Classes & Projects",
              img: "https://img.icons8.com/fluency/48/laptop.png",
            },
            {
              title: "Major Project",
              img: "https://img.icons8.com/color/48/rocket--v1.png",
            },
            {
              title: "Technical Interview",
              img: "https://img.icons8.com/color/48/goal.png",
            },
            {
              title: "Skill Verification",
              img: "https://img.icons8.com/color/48/ok--v1.png",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center relative"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-10 h-10 sm:w-12 sm:h-12 mb-2"
              />
              <p className="text-xs sm:text-sm md:text-base font-medium">
                {item.title}
              </p>
              {idx < 4 && (
                <div className="hidden md:block w-12 sm:w-16 h-0.5 bg-blue-300 absolute top-6 left-full"></div>
              )}
            </div>
          ))}
        </div>
      </section>


      <section
        id="courses"
        className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-12">
          Why Choose Us
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              title: "Rigorous Assessment",
              desc: "Every skill undergoes a 5-step verification including technical interviews by industry professionals, ensuring genuine competency.",
              img: "https://img.icons8.com/color/48/goal.png",
            },
            {
              title: "Industry Alignment",
              desc: "Our courses and assessments are designed with input from hiring managers and experts to match real job requirements.",
              img: "https://img.icons8.com/emoji/48/high-voltage.png",
            },
            {
              title: "Verified Results",
              desc: "Green-badge verified skills appear prominently on profiles, giving recruiters confidence from the first glance.",
              img: "https://img.icons8.com/color/48/trophy--v1.png",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 sm:p-6 rounded-xl shadow hover:shadow-lg transition text-center"
            >
              <div className="flex flex-col items-center">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-10 h-10 sm:w-12 sm:h-12 mb-3"
                />
                <h3 className="font-semibold text-base sm:text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>


      <section
        id="about"
        className="py-16 sm:py-20 bg-gray-50 px-4 sm:px-6 text-center"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">About Us</h2>
        <p className="max-w-3xl mx-auto text-gray-600 text-sm sm:text-base">
          At SkillVerify, we are passionate about bridging the gap between
          learning and employability. Our platform ensures that learners don’t
          just acquire knowledge, but also prove their competency through
          rigorous multi-step skill verification trusted by top recruiters.
        </p>
      </section>


      <section
        id="recruiters"
        className="py-16 sm:py-20 bg-white px-4 sm:px-6 text-center"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">For Recruiters</h2>
        <p className="max-w-3xl mx-auto text-gray-600 mb-8 text-sm sm:text-base">
          Tired of inflated resumes? We provide green-badge verified candidates
          who have undergone our strict process, saving you time and ensuring
          you hire only the most competent talent.
        </p>
        <button className="bg-green-600 text-white px-5 sm:px-6 py-3 rounded-lg hover:bg-green-700 text-sm sm:text-base">
          Partner With Us
        </button>
      </section>


      <footer className="bg-indigo-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm md:text-base text-center md:text-left">
            &copy; {new Date().getFullYear()} SkillVerify. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6">
            <a
              href="#verification"
              className="hover:text-gray-300 text-xs sm:text-sm"
            >
              Verification
            </a>
            <a
              href="#courses"
              className="hover:text-gray-300 text-xs sm:text-sm"
            >
              Courses
            </a>
            <a href="#about" className="hover:text-gray-300 text-xs sm:text-sm">
              About
            </a>
            <a
              href="#recruiters"
              className="hover:text-gray-300 text-xs sm:text-sm"
            >
              Recruiters
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
