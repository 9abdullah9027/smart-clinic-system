import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaBell, FaSave, FaCamera, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user, api } = useAuth(); // Get API helper
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Load initial data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
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
      // Validation for Password
      if (activeTab === 'security') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (formData.password.length > 0 && formData.password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
      }

      // API Call
      const res = await api.put('/users/profile', {
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined // Only send if typed
      });

      // Update Local Storage to reflect changes immediately
      const updatedUser = { ...user, name: res.data.name, email: res.data.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Optional: Trigger a page reload or context update to show new name in Topbar
      // For now, a reload ensures everything syncs up
      if (formData.name !== user.name) {
         window.location.reload(); 
      }

      setMessage("Settings saved successfully!");
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' })); // Clear passwords
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
        {/* Sidebar Tabs */}
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

        {/* Main Content */}
        <div className="flex-1">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            
            {/* Feedback */}
            {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-800 border-b pb-4">Public Profile</h2>
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-md">
                      <img src={`https://ui-avatars.com/api/?name=${formData.name}&background=0D8ABC&color=fff`} alt="Profile" className="w-full h-full object-cover"/>
                    </div>
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
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
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

            {/* SAVE BUTTON */}
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