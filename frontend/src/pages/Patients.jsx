import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  FaSearch, FaPlus, FaUser, FaEnvelope, FaTimes, FaSpinner, 
  FaCalendarAlt, FaIdCard, FaTrashAlt, FaExclamationTriangle, FaCheckCircle
} from 'react-icons/fa';

// Sound URL (Simple "Pop/Trash" sound)
const DELETE_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3";

const Patients = () => {
  const { api, user } = useAuth();
  const navigate = useNavigate();
  
  // Data State
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null); // For Delete Confirmation
  
  // Success State
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  
  // Form State
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

  // --- SOUND HELPER ---
  const playDeleteSound = () => {
    const audio = new Audio(DELETE_SOUND_URL);
    audio.volume = 0.5; // Not too loud
    audio.play().catch(e => console.log("Audio play failed (user interaction required first)"));
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/auth/register', { ...newPatient, role: 'patient' });
      const res = await api.get('/users/patients'); 
      setPatients(res.data);
      setShowAddModal(false);
      setNewPatient({ name: '', email: '', password: 'password123', dob: '' });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to register patient");
    } finally {
      setSubmitting(false);
    }
  };

  // --- 1. OPEN DELETE MODAL ---
  const promptDelete = (e, id) => {
    e.stopPropagation(); // Prevent opening profile
    setPatientToDelete(id);
  };

  // --- 2. CONFIRM DELETE ---
  const confirmDelete = async () => {
    if (!patientToDelete) return;

    try {
      // Play Sound
      playDeleteSound();

      // Optimistic UI Update
      setPatients(prev => prev.filter(p => p._id !== patientToDelete));
      
      // API Call
      await api.delete(`/users/${patientToDelete}`);

      // Close Modal & Show Success
      setPatientToDelete(null);
      setDeleteSuccess(true);
      
      // Hide Success Toast after 2s
      setTimeout(() => setDeleteSuccess(false), 2000);

    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete patient");
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center">Loading Patients...</div>;

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Registry</h1>
          <p className="text-gray-500 text-sm">Total registered patients: {patients.length}</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg shadow-blue-600/30">
          <FaPlus /> Add Patient
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
        <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <motion.div 
            key={patient._id}
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            whileHover={{ y: -5 }}
            onClick={() => navigate(`/patients/${patient._id}`)}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-all cursor-pointer group relative"
          >
            {/* --- DELETE BUTTON (ADMIN ONLY) --- */}
            {user?.role === 'admin' && (
              <button 
                onClick={(e) => promptDelete(e, patient._id)}
                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
                title="Delete Patient"
              >
                <FaTrashAlt />
              </button>
            )}

            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold mb-4 uppercase group-hover:bg-blue-600 group-hover:text-white transition-colors">
              {patient.name.charAt(0)}
            </div>
            <h3 className="font-bold text-gray-800 text-lg">{patient.name}</h3>
            
            <div className="text-xs font-mono text-blue-500 bg-blue-50 px-2 py-1 rounded mb-2 mt-1">
              {patient.mrn || 'MRN Pending'}
            </div>

            <div className="bg-gray-50 px-3 py-1 rounded-full text-gray-600 text-sm mb-4 flex items-center gap-2">
              <FaEnvelope className="text-gray-400" /> {patient.email}
            </div>
            
            <div className="w-full pt-4 border-t border-gray-50 flex justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1"><FaIdCard /> View Profile</span>
              <span className="flex items-center gap-1"><FaCalendarAlt /> {patient.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A'}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- ADD PATIENT MODAL --- */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Register New Patient</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
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

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {patientToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.9 }} 
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-3xl text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Patient?</h3>
              <p className="text-gray-500 text-sm mb-6">
                This will permanently remove this patient and all their records. This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setPatientToDelete(null)} 
                  className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete} 
                  className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SUCCESS TOAST --- */}
      <AnimatePresence>
        {deleteSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 right-10 z-[70] bg-white border-l-4 border-red-500 shadow-2xl rounded-lg p-6 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
              <FaTrashAlt className="text-xl text-red-500" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Deleted</h4>
              <p className="text-sm text-gray-500">Patient record removed.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Patients;