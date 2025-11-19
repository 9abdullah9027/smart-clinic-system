import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaChartLine, 
  FaCalendarCheck, 
  FaUserInjured, 
  FaUserMd, 
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <FaChartLine /> },
    { path: '/appointments', name: 'Appointments', icon: <FaCalendarCheck /> },
    { path: '/patients', name: 'Patients', icon: <FaUserInjured /> },
    { path: '/doctors', name: 'Doctors', icon: <FaUserMd /> },
    { path: '/settings', name: 'Settings', icon: <FaCog /> },
  ];

  return (
    <div 
      className={`bg-gray-900 border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800 bg-gray-900">
        <div className={`flex items-center ${!isOpen && 'justify-center w-full'}`}>
          <FaUserMd className="text-2xl text-blue-500 shrink-0" />
          
          {/* Text fades out when closed */}
          <span 
            className={`ml-3 text-xl font-bold text-white tracking-wide whitespace-nowrap transition-all duration-200 ${
              isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden hidden'
            }`}
          >
           Waheed Intl Hospit
          </span>
        </div>
        
        {/* Toggle Button (Only visible when open, otherwise we put it elsewhere or use logic) */}
        {isOpen && (
          <button 
            onClick={toggleSidebar}
            className="text-gray-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <FaChevronLeft />
          </button>
        )}
      </div>

      {/* If closed, show a toggle button at the top to re-open */}
      {!isOpen && (
        <button 
          onClick={toggleSidebar}
          className="w-full flex justify-center py-2 text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <FaChevronRight />
        </button>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 py-6 space-y-1 px-3 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={!isOpen ? item.name : ''} // Tooltip when closed
            className={({ isActive }) =>
              `flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              } ${!isOpen ? 'justify-center' : ''}`
            }
          >
            <span className="text-xl shrink-0">{item.icon}</span>
            
            <span 
              className={`ml-3 transition-all duration-200 ${
                isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden hidden'
              }`}
            >
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* User / Logout Area */}
      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={logout}
          title="Sign Out"
          className={`w-full flex items-center px-3 py-3 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/10 transition-colors ${!isOpen ? 'justify-center' : ''}`}
        >
          <FaSignOutAlt className={`shrink-0 ${!isOpen ? 'text-lg' : 'mr-3'}`} />
          <span className={`${isOpen ? 'block' : 'hidden'}`}>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;