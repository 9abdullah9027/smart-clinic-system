import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaPlus, FaStethoscope, FaStar, FaPhone, FaEnvelope, FaTimes, FaUserMd 
} from 'react-icons/fa';

// --- MOCK DATA ---
const initialDoctors = [
  { id: 1, name: 'Dr. Sarah Wilson', role: 'Cardiologist', patients: 120, rating: 4.9, status: 'Available', image: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=random' },
  { id: 2, name: 'Dr. James House', role: 'Neurologist', patients: 98, rating: 4.8, status: 'In Surgery', image: 'https://ui-avatars.com/api/?name=James+House&background=random' },
  { id: 3, name: 'Dr. Emily Stone', role: 'Pediatrician', patients: 150, rating: 5.0, status: 'Available', image: 'https://ui-avatars.com/api/?name=Emily+Stone&background=random' },
  { id: 4, name: 'Dr. Michael Strange', role: 'Surgeon', patients: 80, rating: 4.7, status: 'Busy', image: 'https://ui-avatars.com/api/?name=Michael+Strange&background=random' },
];

const Doctors = () => {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: '', role: 'General', status: 'Available' });

  // Filter
  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add Doctor Handler
  const handleAddDoctor = (e) => {
    e.preventDefault();
    const doctor = {
      id: doctors.length + 1,
      ...newDoctor,
      patients: 0,
      rating: 5.0,
      image: `https://ui-avatars.com/api/?name=${newDoctor.name}&background=random`
    };
    setDoctors([...doctors, doctor]);
    setShowModal(false);
    setNewDoctor({ name: '', role: 'General', status: 'Available' });
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Medical Staff</h1>
          <p className="text-gray-500 text-sm">Manage doctors and specialists</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-blue-600/30 transition-all font-medium"
        >
          <FaPlus /> Add Doctor
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search doctor by name or specialization..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredDoctors.map((doc) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={doc.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group"
            >
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full p-1 border-2 border-blue-100 mb-3">
                  <img src={doc.image} alt={doc.name} className="w-full h-full rounded-full object-cover" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{doc.name}</h3>
                <span className="text-blue-500 text-sm font-medium mb-4 flex items-center gap-1">
                  <FaStethoscope /> {doc.role}
                </span>
                
                <div className="w-full grid grid-cols-2 gap-2 text-sm border-t border-gray-100 pt-4">
                  <div className="text-gray-500">Patients<br/><span className="font-bold text-gray-800">{doc.patients}</span></div>
                  <div className="text-gray-500">Rating<br/><span className="font-bold text-gray-800 flex items-center justify-center gap-1"><FaStar className="text-yellow-400"/> {doc.rating}</span></div>
                </div>
              </div>
              
              <div className={`px-4 py-2 text-center text-xs font-bold uppercase tracking-wider text-white
                ${doc.status === 'Available' ? 'bg-green-500' : doc.status === 'Busy' ? 'bg-red-500' : 'bg-yellow-500'}
              `}>
                {doc.status}
              </div>
              
              <div className="flex border-t border-gray-100">
                <button className="flex-1 py-3 hover:bg-gray-50 text-gray-500 hover:text-blue-600 transition-colors flex justify-center"><FaPhone /></button>
                <div className="w-px bg-gray-100"></div>
                <button className="flex-1 py-3 hover:bg-gray-50 text-gray-500 hover:text-blue-600 transition-colors flex justify-center"><FaEnvelope /></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Add Doctor Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:20}} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Add Medical Staff</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
              </div>
              <form onSubmit={handleAddDoctor} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                  <input type="text" required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newDoctor.name} onChange={e => setNewDoctor({...newDoctor, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <input type="text" required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Cardiologist" value={newDoctor.role} onChange={e => setNewDoctor({...newDoctor, role: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newDoctor.status} onChange={e => setNewDoctor({...newDoctor, status: e.target.value})}>
                    <option>Available</option>
                    <option>Busy</option>
                    <option>In Surgery</option>
                    <option>On Leave</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">Add Doctor</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Doctors;