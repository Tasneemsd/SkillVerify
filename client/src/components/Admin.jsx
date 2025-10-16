import { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Briefcase,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    verifiedStudents: 0,
    pendingVerifications: 0,
    totalRecruiters: 0,
    applications: 0,
    completedInterviews: 0
  });

  const [students, setStudents] = useState([]);
  const [mockInterviews, setMockInterviews] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDashboardData({
        totalStudents: 156,
        verifiedStudents: 98,
        pendingVerifications: 12,
        totalRecruiters: 45,
        applications: 234,
        completedInterviews: 142
      });

      setStudents([
        { id: 1, name: 'Sarah Johnson', email: 'sarah.j@university.edu', mockResult: 'Pass', verified: false },
        { id: 2, name: 'Michael Chen', email: 'michael.c@university.edu', mockResult: 'Pass', verified: true },
        { id: 3, name: 'Emily Davis', email: 'emily.d@university.edu', mockResult: 'Fail', verified: false },
        { id: 4, name: 'James Wilson', email: 'james.w@university.edu', mockResult: 'Pass', verified: false },
        { id: 5, name: 'Olivia Brown', email: 'olivia.b@university.edu', mockResult: 'Pass', verified: true },
      ]);

      setMockInterviews([
        { id: 1, studentName: 'Sarah Johnson', date: '2024-03-15', status: 'Pass' },
        { id: 2, studentName: 'Michael Chen', date: '2024-03-14', status: 'Pass' },
        { id: 3, studentName: 'Emily Davis', date: '2024-03-13', status: 'Fail' },
        { id: 4, studentName: 'James Wilson', date: '2024-03-12', status: 'Pass' },
        { id: 5, studentName: 'Olivia Brown', date: '2024-03-11', status: 'Pass' },
      ]);

      setRecruiters([
        { id: 1, name: 'John Smith', company: 'Tech Corp', status: 'Approved' },
        { id: 2, name: 'Lisa Anderson', company: 'Innovation Labs', status: 'Pending' },
        { id: 3, name: 'Robert Garcia', company: 'Digital Solutions', status: 'Approved' },
        { id: 4, name: 'Jennifer Lee', company: 'Future Systems', status: 'Pending' },
      ]);

      setApplications([
        { id: 1, studentName: 'Michael Chen', recruiterName: 'John Smith', jobTitle: 'Software Engineer', status: 'Under Review' },
        { id: 2, studentName: 'Olivia Brown', recruiterName: 'Robert Garcia', jobTitle: 'Frontend Developer', status: 'Accepted' },
        { id: 3, studentName: 'Sarah Johnson', recruiterName: 'John Smith', jobTitle: 'Full Stack Developer', status: 'Pending' },
      ]);

      setIsLoading(false);
    }, 1000);
  };

  const handleVerifyStudent = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const confirmVerification = () => {
    if (!selectedStudent) return;
    setStudents(students.map(s =>
      s.id === selectedStudent.id ? { ...s, verified: true } : s
    ));
    setShowModal(false);
    setSelectedStudent(null);
  };

  const updateInterviewStatus = (id, newStatus) => {
    setMockInterviews(mockInterviews.map(interview =>
      interview.id === id ? { ...interview, status: newStatus } : interview
    ));
  };

  const toggleRecruiterApproval = (id) => {
    setRecruiters(recruiters.map(recruiter =>
      recruiter.id === id
        ? { ...recruiter, status: recruiter.status === 'Approved' ? 'Pending' : 'Approved' }
        : recruiter
    ));
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'interviews', label: 'Mock Interviews', icon: MessageSquare },
    { id: 'recruiters', label: 'Recruiters', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const StatCard = ({ title, value, icon: Icon, gradient }) => (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-4xl font-bold mt-2">{value}</p>
        </div>
        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
          <Icon size={32} />
        </div>
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-gray-200 h-32 rounded-2xl"></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50 backdrop-blur-lg bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Briefcase className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                PlacementHub
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <span className="font-medium text-gray-700">Admin</span>
                  <ChevronDown size={20} className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-gray-700">
                      <Settings size={18} />
                      <span>Settings</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-red-600">
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-3 space-y-2">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-gray-700 rounded-lg">
                <Settings size={18} />
                <span>Settings</span>
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-red-600 rounded-lg">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Welcome back, Admin 👋</h1>
              <p className="text-xl text-blue-100">Manage placements, students, and mock interviews efficiently.</p>
            </div>
            <div className="hidden md:block">
              <div className="w-64 h-64 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center">
                <TrendingUp size={120} className="text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-600 border-transparent hover:text-blue-600 hover:border-gray-300'
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <StatCard
                    title="Total Students"
                    value={dashboardData.totalStudents}
                    icon={Users}
                    gradient="from-blue-500 to-blue-600"
                  />
                  <StatCard
                    title="Verified Students"
                    value={dashboardData.verifiedStudents}
                    icon={UserCheck}
                    gradient="from-green-500 to-green-600"
                  />
                  <StatCard
                    title="Pending Verifications"
                    value={dashboardData.pendingVerifications}
                    icon={UserX}
                    gradient="from-orange-500 to-orange-600"
                  />
                  <StatCard
                    title="Total Recruiters"
                    value={dashboardData.totalRecruiters}
                    icon={Briefcase}
                    gradient="from-purple-500 to-purple-600"
                  />
                  <StatCard
                    title="Applications"
                    value={dashboardData.applications}
                    icon={FileText}
                    gradient="from-pink-500 to-pink-600"
                  />
                  <StatCard
                    title="Completed Interviews"
                    value={dashboardData.completedInterviews}
                    icon={MessageSquare}
                    gradient="from-teal-500 to-teal-600"
                  />
                </div>

                {/* Chart Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Student Verifications Over Time</h3>
                  <div className="h-64 flex items-end justify-around space-x-2">
                    {[65, 78, 85, 92, 88, 98].map((height, idx) => (
                      <div key={idx} className="flex flex-col items-center flex-1">
                        <div
                          className="w-full bg-gradient-to-t from-blue-600 to-indigo-600 rounded-t-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700"
                          style={{ height: `${height}%` }}
                        ></div>
                        <span className="text-xs text-gray-600 mt-2">Week {idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Manage Students</h2>
                  <p className="text-gray-600 mt-1">Verify students who passed mock interviews</p>
                </div>
                {students.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Users size={64} className="text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No students found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Mock Result</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {students.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{student.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                student.mockResult === 'Pass'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {student.mockResult === 'Pass' ? <CheckCircle size={14} className="mr-1" /> : <XCircle size={14} className="mr-1" />}
                                {student.mockResult}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                student.verified
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {student.verified ? 'Verified' : 'Pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {student.mockResult === 'Pass' && !student.verified && (
                                <button
                                  onClick={() => handleVerifyStudent(student)}
                                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                  <CheckCircle size={16} className="mr-2" />
                                  Verify
                                </button>
                              )}
                              {student.verified && (
                                <span className="text-green-600 font-medium flex items-center">
                                  <CheckCircle size={16} className="mr-2" />
                                  Verified
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Mock Interviews Tab */}
            {activeTab === 'interviews' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Manage Mock Interviews</h2>
                  <p className="text-gray-600 mt-1">Update interview results and track student performance</p>
                </div>
                {mockInterviews.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <MessageSquare size={64} className="text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No mock interviews found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Student Name</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {mockInterviews.map((interview) => (
                          <tr key={interview.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{interview.studentName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{interview.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                interview.status === 'Pass'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {interview.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={interview.status}
                                onChange={(e) => updateInterviewStatus(interview.id, e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              >
                                <option value="Pass">Pass</option>
                                <option value="Fail">Fail</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Recruiters Tab */}
            {activeTab === 'recruiters' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Manage Recruiters</h2>
                  <p className="text-gray-600 mt-1">Approve recruiter accounts and manage access</p>
                </div>
                {recruiters.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Briefcase size={64} className="text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No recruiters found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Company</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {recruiters.map((recruiter) => (
                          <tr key={recruiter.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{recruiter.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{recruiter.company}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                recruiter.status === 'Approved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {recruiter.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => toggleRecruiterApproval(recruiter.id)}
                                className={`inline-flex items-center px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                                  recruiter.status === 'Approved'
                                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                                }`}
                              >
                                {recruiter.status === 'Approved' ? 'Revoke' : 'Approve'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Job Applications</h2>
                  <p className="text-gray-600 mt-1">View all student applications and their status</p>
                </div>
                {applications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <FileText size={64} className="text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No applications found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Student Name</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Recruiter</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Job Title</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {applications.map((application) => (
                          <tr key={application.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{application.studentName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{application.recruiterName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{application.jobTitle}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                application.status === 'Accepted'
                                  ? 'bg-green-100 text-green-800'
                                  : application.status === 'Under Review'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {application.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Settings</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue="Admin User"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        defaultValue="admin@placementhub.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium">
                        Save Changes
                      </button>
                      <button className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium flex items-center justify-center">
                        <LogOut size={20} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Verification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Verify Student</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to verify <span className="font-semibold">{selectedStudent?.name}</span>?
                This will make their profile visible to all recruiters.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmVerification}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
