import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { getAuthToken } from '../api';


export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobile, setMobile] = useState('');
  const [coupon, setCoupon] = useState('');
  const [batch, setBatch] = useState('');
  const [objective, setObjective] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const token = getAuthToken();
      const response = await API.get(`/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourse(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course:', error);
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!mobile || !batch || !objective) {
      alert('Please fill all required fields');
      return;
    }

    setEnrolling(true);
    try {
      const token = getAuthToken();
      await API.post('/student/enroll', {
        courseId: id,
        mobile,
        coupon,
        batch,
        objective
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Enrollment successful!');
      navigate('/my-courses');
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Enrollment failed. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const getUserInitials = () => {
    const name = localStorage.getItem('userName') || 'User';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Course not found</div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl hover:opacity-80 transition-opacity">
              
              <img src="/logos.png" alt="Logo" className="h-48 w-auto" />
            </Link>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm hover:bg-blue-700 transition"
              >
                {getUserInitials()}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border">
                  <button
                    onClick={() => navigate('/profile')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => navigate('/my-courses')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Courses
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section - Course Details */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-green-50 via-green-100 to-green-200 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
            {/* Top Banner */}
            <div className="absolute top-0 left-0 w-full h-16 bg-green-200 rounded-t-3xl flex items-center justify-center z-10">
              <span className="text-lg font-bold text-green-900">🔥 Limited Seats Available!</span>
            </div>

            {/* Badges & Title */}
            <div className="mb-4 mt-16">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="bg-white text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-300 hover:scale-105 transition-transform">
                  ⭐ {course.rating || '4.5'} Rating
                </span>
                {course.isPlacementGuaranteed && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full border border-yellow-300 hover:scale-105 transition-transform">
                   Stipend Related Internship Gurantee
                  </span>
                )}
                {course.hasLiveClasses && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full border border-blue-300 hover:scale-105 transition-transform">
                    🎥 Live Classes will be updated soon
                  </span>
                )}
                <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full border border-purple-300 hover:scale-105 transition-transform">
                  📜 Certificate
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{course.courseName}</h1>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">{course.courseDescription}</p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-4">
              <div className="flex items-center gap-2 bg-white/60 p-3 rounded-lg shadow-sm hover:scale-105 transition-transform">
                <span className="text-green-600 text-xl">💼</span>
                <p className="text-sm md:text-base font-medium text-gray-700">Internships Oriented</p>
              </div>
              <div className="flex items-center gap-2 bg-white/60 p-3 rounded-lg shadow-sm hover:scale-105 transition-transform">
                <span className="text-blue-600 text-xl">🎓</span>
                <p className="text-sm md:text-base font-medium text-gray-700">Certified Training</p>
              </div>
              <div className="flex items-center gap-2 bg-white/60 p-3 rounded-lg shadow-sm hover:scale-105 transition-transform">
                <span className="text-yellow-600 text-xl">⏱️</span>
                <p className="text-sm md:text-base font-medium text-gray-700">Flexible Schedule</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${star <= (course.rating || 4.5) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-700 font-semibold">{course.rating || '4.5'}</span>
              <span className="text-sm text-gray-500">({course.reviewsCount || 120} reviews)</span>
            </div>

            {/* Duration & Salary */}
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center gap-2 bg-white/50 px-3 py-2 rounded-lg shadow-sm">
                <span className="text-gray-600 text-lg">⏱️</span>
                <span className="text-sm font-medium text-gray-700">Duration: {course.courseDuration}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/50 px-3 py-2 rounded-lg shadow-sm">
                <span className="text-green-600 text-lg">📈</span>
                <span className="text-sm font-medium text-gray-700">Avg. Salary: {course.stipend || '₹ N/A'}</span>
              </div>
            </div>

            {/* Placement Partners */}
            {course.placementPartners?.length > 0 && (
              <div className="bg-white/80 rounded-xl p-5 shadow-inner">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Our Placement Partners</h3>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {course.placementPartners.map((partner, idx) => (
                    <li key={idx}>{partner}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Enrollment Box */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 ">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Enroll Now</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile number <span className="text-red-500">*</span></label>
              <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter your mobile number"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Have a coupon code?</label>
              <input type="text" value={coupon} onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter coupon code"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select batch <span className="text-red-500">*</span></label>
              <select value={batch} onChange={(e) => setBatch(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white"
              >
                <option value="">Choose batch</option>
                <option value="weekday-morning">Weekday Morning (9 AM - 12 PM)</option>
                <option value="weekday-evening">Weekday Evening (6 PM - 9 PM)</option>
                <option value="weekend">Weekend (10 AM - 4 PM)</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your objective <span className="text-red-500">*</span></label>
              <select value={objective} onChange={(e) => setObjective(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white"
              >
                <option value="">Select your goal</option>
                <option value="career-switch">Career Switch</option>
                <option value="skill-upgrade">Skill Upgrade</option>
                <option value="freelancing">Freelancing</option>
                <option value="entrepreneurship">Entrepreneurship</option>
              </select>
            </div>

           

            <div className="mb-4">
              <p className="text-xs text-gray-500 text-center">
                Valid till {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>

            <button onClick={handleEnroll} disabled={enrolling}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enrolling ? 'Enrolling...' : 'Enroll Now'}
            </button>
          </div>

          {/* Banner */}
          <div className="bg-blue-600 text-white p-6 rounded-xl flex flex-col md:flex-row items-center justify-between shadow-lg">
            <p className="text-lg md:text-xl font-bold">💯 100% Internships Guranteed</p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mt-3 md:mt-0 bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Enroll Now
            </button>
          </div>

          {/* What you will learn */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">What you will learn</h3>
            {course.topics?.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {course.topics.map((topic, idx) => <li key={idx}>{topic}</li>)}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">Topics will be updated soon.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
