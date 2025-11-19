import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      {/* Main Content Area */}
      {/* We adjust the margin based on sidebar state */}
      <div 
        className={`flex-1 flex flex-col h-screen transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Top Header Area (Optional, good for search/profile later) */}
        <header className="bg-white h-16 shadow-sm flex items-center px-6 border-b border-gray-200 shrink-0">
          <h2 className="text-gray-500 text-sm font-medium">Welcome back, Dr. Admin</h2>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;