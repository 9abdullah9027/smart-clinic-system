import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiHome, FiCalendar, FiUsers, FiUser, FiSettings } from "react-icons/fi";

const menuItems = [
  { name: "Dashboard", icon: <FiHome />, path: "/" },
  { name: "Appointments", icon: <FiCalendar />, path: "/appointments" },
  { name: "Patients", icon: <FiUsers />, path: "/patients" },
  { name: "Doctors", icon: <FiUser />, path: "/doctors" },
  { name: "Settings", icon: <FiSettings />, path: "/settings" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  return (
    <motion.div
      animate={{ width: isOpen ? 220 : 80 }}
      transition={{ duration: 0.3 }}
      className="bg-[#1F2937] h-screen py-6 flex flex-col shadow-xl"
    >
      {/* Toggle Button */}
      <div className="flex justify-end px-4 mb-6">
        <FiMenu
          size={24}
          className="text-gray-300 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link key={item.name} to={item.path}>
              <div
                className={`flex items-center gap-4 p-3 mx-3 rounded-xl cursor-pointer transition-all
                ${active ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"}`}
              >
                <span className="text-xl">{item.icon}</span>

                {isOpen && <span className="text-md">{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
}
