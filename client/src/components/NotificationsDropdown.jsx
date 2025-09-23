import React, { useState, useEffect } from 'react';
import { Bell, Check, X, User, Mail, AlertCircle, FileText } from 'lucide-react';
import API from '../api/axios';

const NotificationsDropdown = ({ onClose, onUnreadCountChange, isMobile = false }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await API.get('/recruiter/notifications?limit=20');
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
      onUnreadCountChange(response.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationIds) => {
    try {
      await API.post('/recruiter/notifications/mark-read', {
        notificationIds: Array.isArray(notificationIds) ? notificationIds : [notificationIds]
      });

      // Update local state
      setNotifications(prev => prev.map(notif => 
        notificationIds.includes(notif._id) 
          ? { ...notif, read: true }
          : notif
      ));

      const newUnreadCount = notifications.filter(n => 
        !notificationIds.includes(n._id) && !n.read
      ).length;
      
      setUnreadCount(newUnreadCount);
      onUnreadCountChange(newUnreadCount);
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const markAllAsRead = () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n._id);
    if (unreadIds.length > 0) {
      markAsRead(unreadIds);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'student_verified':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'student_applied':
        return <User className="h-4 w-4 text-blue-600" />;
      case 'student_message':
        return <Mail className="h-4 w-4 text-purple-600" />;
      case 'system_alert':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'export_ready':
        return <FileText className="h-4 w-4 text-indigo-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffInMinutes = Math.floor((now - notifDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return notifDate.toLocaleDateString();
  };

  const dropdownClasses = isMobile
    ? "fixed inset-x-4 top-20 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 max-h-96 overflow-hidden"
    : "absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 max-h-96 overflow-hidden";

  return (
    <div className={dropdownClasses}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-gray-600" />
          <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs rounded-full px-2 py-1">
              {unreadCount} new
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchNotifications}
              className="text-xs text-blue-600 hover:text-blue-800 mt-2"
            >
              Try again
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => !notification.read && markAsRead(notification._id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {notification.body}
                    </p>

                    {/* Additional data */}
                    {notification.data?.studentId && (
                      <div className="mt-2 text-xs text-gray-500">
                        Student ID: {notification.data.studentId}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-100 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;