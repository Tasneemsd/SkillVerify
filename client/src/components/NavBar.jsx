import React, { useState, useEffect } from 'react';
import { Bell, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import NotificationsDropdown from './NotificationsDropdown';
import API from '../api/axios';

const NavBar = () => {
  const { user, logout, refreshProfile } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileData, setProfileData] = useState(null);

  // Fetch profile data and notifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile (this will work with Recruiter.jsx unchanged)
        const profileResponse = await API.get('/recruiter/profile');
        setProfileData(profileResponse.data);

        // Fetch unread notifications count
        const notificationsResponse = await API.get('/recruiter/notifications?unreadOnly=true&limit=1');
        setUnreadCount(notificationsResponse.data.unreadCount || 0);
      } catch (error) {
        console.error('Failed to fetch navbar data:', error);
      }
    };

    if (user) {
      fetchData();
      
      // Poll for notifications every 30 seconds
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const handleNotificationUpdate = (newUnreadCount) => {
    setUnreadCount(newUnreadCount);
  };

  if (!user || !profileData) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">SkillVerify</h1>
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  Recruiter
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <NotificationsDropdown
                    onClose={() => setShowNotifications(false)}
                    onUnreadCountChange={handleNotificationUpdate}
                  />
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {profileData.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt={profileData.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {profileData.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {profileData.companyName || profileData.company}
                    </div>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-900">
                          {profileData.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {profileData.email}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {profileData.companyName || profileData.company}
                        </div>
                      </div>
                      
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </button>
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-3">
              {/* User Info */}
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt={profileData.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
                <div>
                  <div className="text-base font-medium text-gray-900">
                    {profileData.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {profileData.companyName || profileData.company}
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-auto">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Settings */}
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Notifications Dropdown for Mobile */}
      {showNotifications && (
        <div className="md:hidden">
          <NotificationsDropdown
            onClose={() => setShowNotifications(false)}
            onUnreadCountChange={handleNotificationUpdate}
            isMobile={true}
          />
        </div>
      )}

      {/* Click outside handlers */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </>
  );
};

export default NavBar;