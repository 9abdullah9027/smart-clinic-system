import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt, 
  FaClock,
  FaUserMd,
  FaUserInjured,
  FaEllipsisV,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf
} from 'react-icons/fa';

// --- MOCK DATA ---
const initialAppointments = [
  { id: 1, patient: 'Alice Smith', doctor: 'Dr. Sarah Wilson', type: 'General Checkup', date: '2023-11-15', time: '09:00 AM', status: 'Confirmed', avatar: 'https://ui-avatars.com/api/?name=Alice+Smith&background=random' },
  { id: 2, patient: 'Michael Johnson', doctor: 'Dr. James House', type: 'Dental Surgery', date: '2023-11-15', time: '10:30 AM', status: 'Pending', avatar: 'https://ui-avatars.com/api/?name=Michael+Johnson&background=random' },
  { id: 3, patient: 'Emily Davis', doctor: 'Dr. Sarah Wilson', type: 'Consultation', date: '2023-11-16', time: '02:00 PM', status: 'Cancelled', avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=random' },
  { id: 4, patient: 'Robert Brown', doctor: 'Dr. Emily Stone', type: 'Cardiology', date: '2023-11-16', time: '04:15 PM', status: 'Confirmed', avatar: 'https://ui-avatars.com/api/?name=Robert+Brown&background=random' },
  { id: 5, patient: 'Jessica White', doctor: 'Dr. James House', type: 'Root Canal', date: '2023-11-17', time: '11:00 AM', status: 'Pending', avatar: 'https://ui-avatars.com/api/?name=Jessica+White&background=random' },
  { id: 6, patient: 'David Wilson', doctor: 'Dr. Sarah Wilson', type: 'Follow-up', date: '2023-11-18', time: '09:30 AM', status: 'Confirmed', avatar: 'https://ui-avatars.com/api/?name=David+Wilson&background=random' },
];

const Appointments = () => {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter Logic
  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = app.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Helper for Status Colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-600 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'Cancelled': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed': return <FaCheckCircle />;
      case 'Pending': return <FaHourglassHalf />;
      case 'Cancelled': return <FaTimesCircle />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          <p className="text-gray-500 text-sm">Manage and schedule patient appointments</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-blue-600/30 transition-all font-medium">
          <FaPlus /> New Appointment
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search patient or doctor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['All', 'Confirmed', 'Pending', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === status 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List (Cards for Mobile, Table for Desktop) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-5 font-semibold">Patient Name</th>
                <th className="p-5 font-semibold">Doctor</th>
                <th className="p-5 font-semibold">Date & Time</th>
                <th className="p-5 font-semibold">Type</th>
                <th className="p-5 font-semibold">Status</th>
                <th className="p-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors group">
                    
                    {/* Patient */}
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <img src={app.avatar} alt={app.patient} className="w-10 h-10 rounded-full border border-gray-200" />
                        <div>
                          <p className="font-medium text-gray-800">{app.patient}</p>
                          <p className="text-xs text-gray-400">ID: #P-00{app.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaUserMd className="text-blue-400" />
                        <span>{app.doctor}</span>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="p-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                          <FaCalendarAlt className="text-gray-400" /> {app.date}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                          <FaClock className="text-gray-400" /> {app.time}
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="p-5 text-gray-600 text-sm">
                      {app.type}
                    </td>

                    {/* Status */}
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)} {app.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-5 text-right relative">
                      <button className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-all">
                        <FaEllipsisV />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colspan="6" className="p-10 text-center text-gray-500">
                    No appointments found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <span>Showing {filteredAppointments.length} entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Appointments;