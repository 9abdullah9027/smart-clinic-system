import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { FaBell, FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, api } = useAuth();
  
  // Notification State
  const [notifications, setNotifications] = useState([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch Notifications Function
  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  // Poll every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Mark read on click
  const handleBellClick = async () => {
    setShowNotifMenu(!showNotifMenu);
    if (unreadCount > 0) {
      try {
        await api.put('/notifications/read');
        setUnreadCount(0);
        // Locally update list to read
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      } catch (err) {
        console.error("Failed to mark read");
      }
    }
  };

  // Helpers for icons
  const getIcon = (type) => {
    if (type === 'success') return <FaCheckCircle className="text-green-500" />;
    if (type === 'error') return <FaTimesCircle className="text-red-500" />;
    return <FaInfoCircle className="text-blue-500" />;
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className={`flex-1 flex flex-col h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        
        {/* TOPBAR */}
        <header className="bg-white h-16 shadow-sm flex items-center px-6 border-b border-gray-200 shrink-0 justify-between z-40 relative">
          <h2 className="text-gray-800 font-bold text-lg">
            Welcome back, <span className="text-blue-600">{user?.name || 'Doctor'}</span>
          </h2>
          
          <div className="flex items-center gap-6">
            {/* NOTIFICATION BELL */}
            <div className="relative">
              <button onClick={handleBellClick} className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors">
                <FaBell className="text-xl" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* DROPDOWN MENU */}
              <AnimatePresence>
                {showNotifMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-gray-100 bg-gray-50">
                      <h3 className="font-bold text-gray-700 text-sm">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div key={notif._id} className={`p-4 border-b border-gray-50 flex gap-3 hover:bg-gray-50 transition-colors ${!notif.isRead ? 'bg-blue-50/50' : ''}`}>
                            <div className="mt-1 shrink-0">{getIcon(notif.type)}</div>
                            <div>
                              <p className="text-sm text-gray-700 leading-snug">{notif.message}</p>
                              <span className="text-xs text-gray-400 mt-1 block">{new Date(notif.createdAt).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-gray-400 text-sm">No notifications yet</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Date */}
            <div className="text-sm text-gray-500 hidden md:block">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;