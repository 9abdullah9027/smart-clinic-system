import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { FaBell, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaTrashAlt } from 'react-icons/fa';
import io from 'socket.io-client';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, api } = useAuth();
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newNotificationToast, setNewNotificationToast] = useState(null);

  // 1. Initial Fetch
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.isRead).length);
      } catch (err) { console.error(err); }
    };
    fetchNotifications();
  }, [api]);

  // 2. Real-Time Listener
  useEffect(() => {
    if (!user) return;
    const socket = io("http://localhost:5000");
    socket.emit("join_room", user.id || user._id);

    socket.on("receive_notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
      setNewNotificationToast(data);
      setTimeout(() => setNewNotificationToast(null), 5000);
    });

    return () => socket.disconnect();
  }, [user]);

  // 3. Mark Read & Clear
  const handleBellClick = async () => {
    setShowNotifMenu(!showNotifMenu);
    if (unreadCount > 0) {
      try {
        await api.put('/notifications/read'); // Mark backend as read
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      } catch (err) { console.error(err); }
    }
  };

  const handleClearAll = async () => {
    // Assuming you might add a DELETE route later, for now we just clear local view
    // or strictly we mark all as read. If you want to DELETE all:
    // await api.delete('/notifications'); 
    setNotifications([]); // Clear UI
    setShowNotifMenu(false);
  };

  const getIcon = (type) => {
    if (type === 'success') return <FaCheckCircle className="text-green-500" />;
    if (type === 'error') return <FaTimesCircle className="text-red-500" />;
    return <FaInfoCircle className="text-blue-500" />;
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className={`flex-1 flex flex-col h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        
        <header className="bg-white h-16 shadow-sm flex items-center px-6 border-b border-gray-200 shrink-0 justify-between z-40 relative">
          <h2 className="text-gray-800 font-bold text-lg">
            Welcome back, <span className="text-blue-600">{user?.name || 'User'}</span>
          </h2>
          
          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <div className="relative">
              <button onClick={handleBellClick} className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors">
                <FaBell className="text-xl" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Click Outside Overlay */}
              {showNotifMenu && (
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifMenu(false)}></div>
              )}

              <AnimatePresence>
                {showNotifMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                      <h3 className="font-bold text-gray-700 text-sm">Notifications</h3>
                      {notifications.length > 0 && (
                        <button onClick={handleClearAll} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif, idx) => (
                          <div key={idx} className={`p-4 border-b border-gray-50 flex gap-3 hover:bg-gray-50 ${!notif.isRead ? 'bg-blue-50/50' : ''}`}>
                            <div className="mt-1 shrink-0">{getIcon(notif.type)}</div>
                            <div>
                              <p className="text-sm text-gray-700 leading-snug">{notif.message}</p>
                              <span className="text-xs text-gray-400 mt-1 block">{new Date(notif.createdAt).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-gray-400 text-sm">No notifications</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative">
          <Outlet />
          {/* Toast Notification */}
          <AnimatePresence>
            {newNotificationToast && (
              <motion.div initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }} className="fixed top-20 right-5 bg-white border-l-4 border-blue-500 shadow-2xl rounded-lg p-4 z-50 w-80 flex gap-3">
                <div className="mt-1">{getIcon(newNotificationToast.type)}</div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">New Notification</h4>
                  <p className="text-sm text-gray-600 mt-1">{newNotificationToast.message}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;