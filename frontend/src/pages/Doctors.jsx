import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  FaSearch, FaPlus, FaUserMd, FaTimes, FaSpinner
} from 'react-icons/fa';

const Doctors = () => {
  const { api, user } = useAuth(); 
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: '', email: '', password: 'password123' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/users/doctors');
        setDoctors(res.data);
      } catch (err) {
        console.error("Error fetching doctors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [api]);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Use the Admin-Only endpoint to create staff
      await api.post('/users/staff', { ...newDoctor, role: 'doctor' });
      
      const res = await api.get('/users/doctors'); 
      setDoctors(res.data);
      setShowModal(false);
      setNewDoctor({ name: '', email: '', password: 'password123' });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add doctor");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDoctors = doctors.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="p-10 text-center">Loading Staff...</div>;

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Medical Staff</h1>
          <p className="text-gray-500 text-sm">Manage doctors and specialists</p>
        </div>
        
        {/* ONLY ADMIN CAN SEE THIS BUTTON */}
        {user?.role === 'admin' && (
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg shadow-blue-600/30">
            <FaPlus /> Add Doctor
          </button>
        )}
      </div>

      <div className="relative">
        <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
        <input type="text" placeholder="Search doctors..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={doc._id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow"
          >
            <div className="w-20 h-20 rounded-full border-4 border-blue-50 bg-gray-100 mb-4 overflow-hidden">
              <FaUserMd className="w-full h-full text-gray-300 p-3" />
            </div>
            <h3 className="font-bold text-gray-800 text-lg">{doc.name}</h3>
            
            {/* UPDATED LINE: Show dynamic specialization */}
            <p className="text-blue-500 text-sm font-medium mb-4">
              {doc.specialization || "General Practitioner"}
            </p>
            
            <p className="text-gray-400 text-sm">{doc.email}</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Add Medical Staff</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
              </div>
              <form onSubmit={handleAddDoctor} className="p-6 space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input type="text" required className="w-full p-2 border border-gray-300 rounded-lg outline-none" value={newDoctor.name} onChange={e => setNewDoctor({...newDoctor, name: e.target.value})} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" required className="w-full p-2 border border-gray-300 rounded-lg outline-none" value={newDoctor.email} onChange={e => setNewDoctor({...newDoctor, email: e.target.value})} /></div>
                <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">{submitting ? <FaSpinner className="animate-spin mx-auto"/> : 'Add Doctor'}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Doctors;