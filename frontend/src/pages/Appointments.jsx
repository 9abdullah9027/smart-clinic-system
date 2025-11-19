import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaSearch, FaCalendarAlt, FaClock, FaUserMd, FaEllipsisV, 
  FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaTimes
} from 'react-icons/fa';

// --- MOCK DATA ---
const initialAppointments = [
  { id: 1, patient: 'Alice Smith', doctor: 'Dr. Sarah Wilson', type: 'General Checkup', date: '2023-11-15', time: '09:00 AM', status: 'Confirmed', avatar: 'https://ui-avatars.com/api/?name=Alice+Smith&background=random' },
  { id: 2, patient: 'Michael Johnson', doctor: 'Dr. James House', type: 'Dental Surgery', date: '2023-11-15', time: '10:30 AM', status: 'Pending', avatar: 'https://ui-avatars.com/api/?name=Michael+Johnson&background=random' },
];

const Appointments = () => {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [newAppt, setNewAppt] = useState({
    patient: '', doctor: 'Dr. Sarah Wilson', date: '', time: '', type: 'Consultation'
  });

  // Filter Logic
  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = app.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Helpers
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

  // Handle New Appointment Submit
  const handleAddAppointment = (e) => {
    e.preventDefault();
    const appointment = {
      id: appointments.length + 1,
      ...newAppt,
      status: 'Pending', // Default status
      avatar: `https://ui-avatars.com/api/?name=${newAppt.patient}&background=random`
    };
    setAppointments([appointment, ...appointments]); // Add to top of list
    setShowModal(false); // Close modal
    setNewAppt({ patient: '', doctor: 'Dr. Sarah Wilson', date: '', time: '', type: 'Consultation' }); // Reset form
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          <p className="text-gray-500 text-sm">Manage and schedule patient appointments</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-blue-600/30 transition-all font-medium"
        >
          <FaPlus /> New Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search patient or doctor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['All', 'Confirmed', 'Pending', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === status ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <motion.div layout className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
              {filteredAppointments.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-5 flex items-center gap-3">
                    <img src={app.avatar} alt="" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-medium text-gray-800">{app.patient}</p>
                      <p className="text-xs text-gray-400">ID: #{app.id}</p>
                    </div>
                  </td>
                  <td className="p-5 text-gray-600"><div className="flex items-center gap-2"><FaUserMd className="text-blue-400"/>{app.doctor}</div></td>
                  <td className="p-5"><div className="text-sm text-gray-700"><FaCalendarAlt className="inline mr-1 text-gray-400"/>{app.date}</div><div className="text-xs text-gray-500 mt-1"><FaClock className="inline mr-1 text-gray-400"/>{app.time}</div></td>
                  <td className="p-5 text-gray-600 text-sm">{app.type}</td>
                  <td className="p-5"><span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>{getStatusIcon(app.status)} {app.status}</span></td>
                  <td className="p-5 text-right"><button className="text-gray-400 hover:text-blue-600"><FaEllipsisV /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* NEW APPOINTMENT MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Book Appointment</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
              </div>
              
              <form onSubmit={handleAddAppointment} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ex: John Doe"
                    value={newAppt.patient}
                    onChange={e => setNewAppt({...newAppt, patient: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input 
                      type="date" 
                      required
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={newAppt.date}
                      onChange={e => setNewAppt({...newAppt, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input 
                      type="time" 
                      required
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={newAppt.time}
                      onChange={e => setNewAppt({...newAppt, time: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                    <select 
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={newAppt.doctor}
                      onChange={e => setNewAppt({...newAppt, doctor: e.target.value})}
                    >
                      <option>Dr. Sarah Wilson</option>
                      <option>Dr. James House</option>
                      <option>Dr. Emily Stone</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select 
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={newAppt.type}
                      onChange={e => setNewAppt({...newAppt, type: e.target.value})}
                    >
                      <option>Consultation</option>
                      <option>Checkup</option>
                      <option>Surgery</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors mt-2">
                  Confirm Booking
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Appointments;