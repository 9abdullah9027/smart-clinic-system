// src/pages/Dashboard.jsx
import React from "react";
import { motion } from "framer-motion";
import { FiUsers, FiUser, FiCalendar } from "react-icons/fi";

const stats = [
  { id: 1, title: "Total Patients", value: 128, icon: FiUsers, bg: "bg-blue-500" },
  { id: 2, title: "Total Doctors", value: 24, icon: FiUser, bg: "bg-green-500" },
  { id: 3, title: "Appointments Today", value: 32, icon: FiCalendar, bg: "bg-purple-500" },
];

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map(({ id, title, value, icon: Icon, bg }) => (
          <motion.div
            key={id}
            whileHover={{ scale: 1.05 }}
            className={`flex items-center p-6 bg-white rounded-lg shadow-md cursor-pointer`}
          >
            <div className={`p-4 rounded-full text-white ${bg} mr-4`}>
              <Icon size={28} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">{title}</p>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doctor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-gray-800">Patient One</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-800">Doctor Ahmed</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-800">2025-11-20</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-800">17:00</td>
            </tr>
            {/* Repeat for other rows */}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default Dashboard;
