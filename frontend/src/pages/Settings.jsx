import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaSave, FaSpinner, FaStethoscope } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user, api } = useAuth(); 
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '', // New Field
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        specialization: user.specialization || 'General Practitioner'
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      if (activeTab === 'security') {
        if (formData.password !== formData.confirmPassword) throw new Error("Passwords do not match");
        if (formData.password.length > 0 && formData.password.length < 6) throw new Error("Password must be at least 6 characters");
      }

      const res = await api.put('/users/profile', {
        name: formData.name,
        email: formData.email,
        specialization: formData.specialization, // Send to backend
        password: formData.password || undefined
      });

      const updatedUser = { ...user, ...res.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      if (formData.name !== user.name) window.location.reload(); 

      setMessage("Settings saved successfully!");
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' })); 
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <nav className="flex flex-col">
              <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <FaUser /> Profile Information
              </button>
              <button onClick={() => setActiveTab('security')} className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <FaLock /> Security & Password
              </button>
            </nav>
          </div>
        </div>

        <div className="flex-1">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-800 border-b pb-4">Public Profile</h2>
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-md">
                    <img src={`https://ui-avatars.com/api/?name=${formData.name}&background=0D8ABC&color=fff`} alt="Profile" className="w-full h-full object-cover"/>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{formData.name || 'User'}</h3>
                    <p className="text-sm text-gray-500">{user?.role?.toUpperCase()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  
                  {/* SPECIALIZATION - ONLY FOR DOCTORS */}
                  {user?.role === 'doctor' && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <FaStethoscope className="text-blue-500"/> Specialization / Title
                      </label>
                      <input 
                        type="text" 
                        name="specialization" 
                        placeholder="e.g. Cardiologist, Senior Surgeon"
                        value={formData.specialization} 
                        onChange={handleChange} 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50/30" 
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-800 border-b pb-4">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t flex justify-end">
              <button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-blue-600/30 transition-all disabled:opacity-70">
                {isLoading ? <><FaSpinner className="animate-spin"/> Saving...</> : <><FaSave /> Save Changes</>}
              </button>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;