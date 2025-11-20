import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext'; // 1. Import Context

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth(); // 2. Get User Data

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      <div 
        className={`flex-1 flex flex-col h-screen transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <header className="bg-white h-16 shadow-sm flex items-center px-6 border-b border-gray-200 shrink-0 justify-between">
          {/* 3. Display Real Name */}
          <h2 className="text-gray-800 font-bold text-lg">
            Welcome back, <span className="text-blue-600">{user?.name || 'Doctor'}</span>
          </h2>
          
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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