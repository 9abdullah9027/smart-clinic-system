import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  FaSearch, FaPlus, FaUser, FaEnvelope, FaTimes, FaSpinner, FaCalendarAlt
} from 'react-icons/fa';

const Patients = () => {
  const { api } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', email: '', password: 'password123', dob: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/users/patients');
        setPatients(res.data);
      } catch (err) {
        console.error("Error fetching patients", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [api]);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/auth/register', { ...newPatient, role: 'patient' });
      const res = await api.get('/users/patients'); 
      setPatients(res.data);
      setShowModal(false);
      setNewPatient({ name: '', email: '', password: 'password123', dob: '' });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to register patient");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center">Loading Patients...</div>;

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Registry</h1>
          <p className="text-gray-500 text-sm">Total registered patients: {patients.length}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg shadow-blue-600/30">
          <FaPlus /> Add Patient
        </button>
      </div>

      <div className="relative">
        <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
        <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={patient._id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow"
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold mb-4 uppercase">
              {patient.name.charAt(0)}
            </div>
            <h3 className="font-bold text-gray-800 text-lg">{patient.name}</h3>
            
            {/* EMAIL DISPLAY */}
            <div className="bg-gray-50 px-3 py-1 rounded-full text-gray-600 text-sm mb-4 flex items-center gap-2">
              <FaEnvelope className="text-gray-400" /> {patient.email}
            </div>
            
            <div className="w-full pt-4 border-t border-gray-50 flex justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1"><FaUser /> ID: ...{patient._id.slice(-4)}</span>
              <span className="flex items-center gap-1"><FaCalendarAlt /> {patient.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A'}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Register New Patient</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
              </div>
              <form onSubmit={handleAddPatient} className="p-6 space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" required className="w-full p-2 border border-gray-300 rounded-lg outline-none" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" required className="w-full p-2 border border-gray-300 rounded-lg outline-none" value={newPatient.email} onChange={e => setNewPatient({...newPatient, email: e.target.value})} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label><input type="date" required className="w-full p-2 border border-gray-300 rounded-lg outline-none" value={newPatient.dob} onChange={e => setNewPatient({...newPatient, dob: e.target.value})} /></div>
                <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">{submitting ? <FaSpinner className="animate-spin mx-auto"/> : 'Register Patient'}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Patients;