import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaChartLine, 
  FaCalendarCheck, 
  FaUserInjured, 
  FaUserMd, 
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaLock,
  FaFileMedical // <--- Added back
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // --- LOGOUT HANDLER WITH ANIMATION ---
  const handleLogout = () => {
    setIsLoggingOut(true); 
    setTimeout(() => {
      logout();
    }, 2000);
  };

  const menuItems = [
    { 
      path: '/dashboard', 
      name: 'Dashboard', 
      icon: <FaChartLine />, 
      roles: ['admin', 'doctor', 'patient'] 
    },
    { 
      path: '/appointments', 
      name: 'Appointments', 
      icon: <FaCalendarCheck />, 
      roles: ['admin', 'doctor', 'patient'] 
    },
    { 
      path: '/patients', 
      name: 'Patients', 
      icon: <FaUserInjured />, 
      roles: ['admin', 'doctor'] 
    },
    { 
      path: '/doctors', 
      name: 'Doctors', 
      icon: <FaUserMd />, 
      roles: ['admin', 'patient' , 'doctor'] 
    },
    { 
      path: '/reports', 
      name: 'Reports', 
      icon: <FaFileMedical />, // <--- Reports Link Restored
      roles: ['admin', 'doctor', 'patient'] 
    },
    { 
      path: '/settings', 
      name: 'Settings', 
      icon: <FaCog />, 
      roles: ['admin', 'doctor', 'patient'] 
    },
  ];

  const visibleMenuItems = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <>
      {/* --- SIDEBAR UI --- */}
      <div 
        className={`bg-gray-900 border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800 bg-gray-900">
          <div className={`flex items-center ${!isOpen && 'justify-center w-full'}`}>
            <FaUserMd className="text-2xl text-blue-500 shrink-0" />
            <span className={`ml-3 text-xl font-bold text-white tracking-wide whitespace-nowrap transition-all duration-200 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden hidden'}`}>
              Smart Clinic
            </span>
          </div>
          {isOpen && (
            <button onClick={toggleSidebar} className="text-gray-400 hover:text-white p-1 rounded-md transition-colors">
              <FaChevronLeft />
            </button>
          )}
        </div>

        {!isOpen && (
          <button onClick={toggleSidebar} className="w-full flex justify-center py-2 text-gray-400 hover:text-white hover:bg-gray-800">
            <FaChevronRight />
          </button>
        )}

        <nav className="flex-1 py-6 space-y-1 px-3 overflow-y-auto overflow-x-hidden">
          {visibleMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={!isOpen ? item.name : ''}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                } ${!isOpen ? 'justify-center' : ''}`
              }
            >
              <span className="text-xl shrink-0">{item.icon}</span>
              <span className={`ml-3 transition-all duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden hidden'}`}>
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            title="Sign Out"
            className={`w-full flex items-center px-3 py-3 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/10 transition-colors ${!isOpen ? 'justify-center' : ''}`}
          >
            <FaSignOutAlt className={`shrink-0 ${!isOpen ? 'text-lg' : 'mr-3'}`} />
            <span className={`${isOpen ? 'block' : 'hidden'}`}>Sign Out</span>
          </button>
        </div>
      </div>

      {/* --- LOGOUT OVERLAY ANIMATION --- */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-gray-900/95 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-center"
            >
              {/* Animated Icon Container */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaLock className="text-3xl text-white" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">Securely Logging Out</h2>
              <p className="text-gray-400">See you again soon, {user?.name?.split(' ')[0] || 'Doctor'}.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;