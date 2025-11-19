import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaPlus, 
  FaUser, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaTimes, 
  FaVenusMars,
  FaTint
} from 'react-icons/fa';

// --- MOCK DATA ---
const initialPatients = [
  { id: 1, name: 'Sarah Jenkins', age: 32, gender: 'Female', blood: 'O+', phone: '+1 (555) 123-4567', address: 'New York, USA', lastVisit: '2023-10-15', condition: 'Healthy' },
  { id: 2, name: 'Michael Chen', age: 45, gender: 'Male', blood: 'AB-', phone: '+1 (555) 987-6543', address: 'San Francisco, USA', lastVisit: '2023-11-02', condition: 'Hypertension' },
  { id: 3, name: 'Emma Wilson', age: 28, gender: 'Female', blood: 'A+', phone: '+1 (555) 456-7890', address: 'London, UK', lastVisit: '2023-10-28', condition: 'Pregnancy' },
  { id: 4, name: 'James Rodriguez', age: 55, gender: 'Male', blood: 'B+', phone: '+1 (555) 222-3333', address: 'Madrid, Spain', lastVisit: '2023-11-10', condition: 'Diabetes' },
  { id: 5, name: 'Linda Brown', age: 62, gender: 'Female', blood: 'O-', phone: '+1 (555) 888-9999', address: 'Berlin, Germany', lastVisit: '2023-09-15', condition: 'Arthritis' },
  { id: 6, name: 'Robert Fox', age: 38, gender: 'Male', blood: 'A-', phone: '+1 (555) 777-1111', address: 'Toronto, Canada', lastVisit: '2023-11-18', condition: 'Flu' },
];

const Patients = () => {
  const [patients, setPatients] = useState(initialPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: 'Male', phone: '' });

  // Filter Logic
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Form Submit
  const handleAddPatient = (e) => {
    e.preventDefault();
    const patient = {
      id: patients.length + 1,
      ...newPatient,
      blood: 'Unknown', // Default for now
      address: 'N/A',
      lastVisit: 'Just Registered',
      condition: 'New Patient'
    };
    setPatients([patient, ...patients]);
    setShowModal(false);
    setNewPatient({ name: '', age: '', gender: 'Male', phone: '' });
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Registry</h1>
          <p className="text-gray-500 text-sm">Total registered patients: {patients.length}</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-blue-600/30 transition-all font-medium"
        >
          <FaPlus /> Add Patient
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search by name or medical condition..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Patients Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredPatients.map((patient) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={patient.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{patient.name}</h3>
                      <span className="text-xs text-gray-500">ID: #PAT-{1000 + patient.id}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                    {patient.condition}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaVenusMars className="text-gray-400" /> {patient.gender}, {patient.age} yrs
                  </div>
                  <div className="flex items-center gap-2">
                    <FaTint className="text-red-400" /> Blood Type: <span className="font-medium text-gray-800">{patient.blood}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-gray-400" /> {patient.phone}
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <FaMapMarkerAlt className="text-gray-400" /> {patient.address}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                <span>Last Visit: {patient.lastVisit}</span>
                <button className="text-blue-600 hover:text-blue-800 font-medium">View Profile</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Add New Patient</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500">
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleAddPatient} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newPatient.name}
                    onChange={e => setNewPatient({...newPatient, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input 
                      type="number" 
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={newPatient.age}
                      onChange={e => setNewPatient({...newPatient, age: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={newPatient.gender}
                      onChange={e => setNewPatient({...newPatient, gender: e.target.value})}
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newPatient.phone}
                    onChange={e => setNewPatient({...newPatient, phone: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                  Register Patient
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Patients;