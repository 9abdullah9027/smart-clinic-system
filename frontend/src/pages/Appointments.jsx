import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  FaPlus, FaSearch, FaCalendarAlt, FaClock, FaUserMd, FaEllipsisV, 
  FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaTimes, FaSpinner, 
  FaTrashAlt, FaCheck, FaExclamationTriangle
} from 'react-icons/fa';

const Appointments = () => {
  const { api, user } = useAuth();
  
  // Data State
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // DELETE CONFIRMATION STATE
  const [apptToDelete, setApptToDelete] = useState(null);

  // SUCCESS STATES
  const [bookingSuccess, setBookingSuccess] = useState(false); 
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [newAppt, setNewAppt] = useState({
    doctor: '', date: '', time: '', reason: 'General Checkup'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apptRes = await api.get('/appointments/my');
        setAppointments(apptRes.data.appointments);
        const docRes = await api.get('/users/doctors');
        setDoctors(docRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [api]);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await api.post('/appointments', newAppt);
      setAppointments([res.data.appointment, ...appointments]);
      setBookingSuccess(true);
      setNewAppt({ doctor: '', date: '', time: '', reason: 'General Checkup' });
      setTimeout(() => { setBookingSuccess(false); setShowModal(false); }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setAppointments(prev => prev.map(app => 
        app._id === id ? { ...app, status: newStatus } : app
      ));
      await api.put(`/appointments/${id}`, { status: newStatus });
      setActiveMenuId(null);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const promptDelete = (id) => {
    setApptToDelete(id);
    setActiveMenuId(null);
  };

  const confirmDelete = async () => {
    if (!apptToDelete) return;
    try {
      setAppointments(prev => prev.filter(app => app._id !== apptToDelete));
      await api.delete(`/appointments/${apptToDelete}`);
      setApptToDelete(null);
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 2000);
    } catch (err) {
      console.error("Failed to delete", err);
      alert("Failed to delete appointment");
    }
  };

  const filteredAppointments = appointments.filter(app => {
    const doctorName = app.doctor?.name || 'Unknown';
    const patientName = app.patient?.name || 'Unknown';
    const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-600 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <FaCheckCircle />;
      case 'pending': return <FaHourglassHalf />;
      case 'cancelled': return <FaTimesCircle />;
      default: return null;
    }
  };

  if (loading) return <div className="p-10 text-center">Loading appointments...</div>;

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          <p className="text-gray-500 text-sm">Manage and schedule patient appointments</p>
        </div>
        {(user?.role === 'patient' || user?.role === 'admin') && (
          <button 
            onClick={() => { setShowModal(true); setBookingSuccess(false); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-blue-600/30 transition-all font-medium"
          >
            <FaPlus /> New Appointment
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input type="text" placeholder="Search patient or doctor..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['All', 'Confirmed', 'Pending', 'Cancelled'].map((status) => (
            <button key={status} onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === status ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* List Container */}
      <motion.div layout className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
        {/* pb-32 ensures space at bottom so dropdown never clips */}
        <div className="overflow-x-auto rounded-xl pb-32">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-5 font-semibold">Patient</th>
                <th className="p-5 font-semibold">Doctor</th>
                <th className="p-5 font-semibold">Date & Time</th>
                <th className="p-5 font-semibold">Reason</th>
                <th className="p-5 font-semibold">Status</th>
                <th className="p-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((app, index) => {
                  return (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors relative">
                      <td className="p-5">
                        <div className="font-medium text-gray-800">{app.patient?.name || 'N/A'}</div>
                        <div className="text-xs text-gray-400">{app.patient?.email}</div>
                      </td>
                      <td className="p-5 text-gray-600"><div className="flex items-center gap-2"><FaUserMd className="text-blue-400"/>{app.doctor?.name || 'N/A'}</div></td>
                      <td className="p-5">
                        <div className="text-sm text-gray-700"><FaCalendarAlt className="inline mr-1 text-gray-400"/>{new Date(app.date).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500 mt-1"><FaClock className="inline mr-1 text-gray-400"/>{app.time}</div>
                      </td>
                      <td className="p-5 text-gray-600 text-sm">{app.reason}</td>
                      <td className="p-5"><span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>{getStatusIcon(app.status)} {app.status}</span></td>
                      
                      {/* --- ACTION MENU --- */}
                      <td className="p-5 text-right relative">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === app._id ? null : app._id); }}
                          className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <FaEllipsisV />
                        </button>
                        <AnimatePresence>
                          {activeMenuId === app._id && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                              // ALWAYS OPEN DOWNWARDS (top-12) to avoid clipping
                              className="absolute right-10 top-12 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden"
                              onClick={(e) => e.stopPropagation()} 
                            >
                              <div className="py-1">
                                {user.role !== 'patient' && (
                                  <>
                                    <button onClick={() => handleStatusChange(app._id, 'confirmed')} className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"><FaCheck /> Mark Confirmed</button>
                                    <button onClick={() => handleStatusChange(app._id, 'cancelled')} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><FaTimes /> Mark Cancelled</button>
                                    <div className="border-t border-gray-100 my-1"></div>
                                  </>
                                )}
                                <button onClick={() => promptDelete(app._id)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"><FaTrashAlt /> Delete</button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No appointments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {apptToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><FaExclamationTriangle className="text-3xl text-red-500" /></div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Are you sure?</h3>
              <p className="text-gray-500 text-sm mb-6">Do you really want to delete this appointment?</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setApptToDelete(null)} className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors">Cancel</button>
                <button onClick={confirmDelete} className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {deleteSuccess && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-10 right-10 z-50 bg-white border-l-4 border-red-500 shadow-2xl rounded-lg p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0"><FaTrashAlt className="text-xl text-red-500" /></div>
            <div><h4 className="font-bold text-gray-800">Deleted</h4><p className="text-sm text-gray-500">Appointment has been removed.</p></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOOKING FORM MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
              {bookingSuccess ? (
                 <div className="p-10 flex flex-col items-center text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"><FaCheckCircle className="text-5xl text-green-500" /></motion.div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Successful!</h3>
                    <p className="text-gray-500">Your appointment has been forwarded.</p>
                    <button onClick={() => setShowModal(false)} className="mt-8 bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200">Close</button>
                 </div>
              ) : (
                <>
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Book Appointment</h3>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
                  </div>
                  <form onSubmit={handleAddAppointment} className="p-6 space-y-4">
                    {error && <div className="p-3 bg-red-100 text-red-600 text-sm rounded">{error}</div>}
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor</label><select required className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" value={newAppt.doctor} onChange={e => setNewAppt({...newAppt, doctor: e.target.value})}><option value="">-- Choose a Doctor --</option>{doctors.map(doc => <option key={doc._id} value={doc._id}>{doc.name}</option>)}</select></div>
                    <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label><input type="date" required className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" value={newAppt.date} onChange={e => setNewAppt({...newAppt, date: e.target.value})} /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Time</label><input type="time" required className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" value={newAppt.time} onChange={e => setNewAppt({...newAppt, time: e.target.value})} /></div></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Reason / Notes</label><textarea rows="2" required className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" value={newAppt.reason} onChange={e => setNewAppt({...newAppt, reason: e.target.value})}></textarea></div>
                    <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors mt-2 flex justify-center items-center gap-2">{submitting ? <FaSpinner className="animate-spin" /> : 'Confirm Booking'}</button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Appointments;