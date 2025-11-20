import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserMd, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle state
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [message,ZS] = useState(''); // Success message
  
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    ZS('');

    if (isLogin) {
      // --- LOGIN LOGIC ---
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } else {
      // --- REGISTER LOGIC ---
      const result = await register(formData.name, formData.email, formData.password, 'admin');
      if (result.success) {
        ZS('Account created! Please sign in.');
        setIsLogin(true); // Switch back to login
        setFormData({ name: '', email: '', password: '' });
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 mb-4">
              <FaUserMd className="text-3xl text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-400 text-sm">Smart Clinic Management System</p>
          </div>

          {/* Feedback Messages */}
          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded">{error}</div>}
          {message && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 text-green-500 text-sm rounded">{message}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input (Register Only) */}
            {!isLogin && (
              <div className="relative">
                <FaUser className="absolute left-3 top-3.5 text-gray-500" />
                <input 
                  type="text" name="name" placeholder="Full Name"
                  value={formData.name} onChange={handleChange}
                  className="w-full bg-gray-900/50 border border-gray-600 text-white rounded-lg py-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            )}

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3.5 text-gray-500" />
              <input 
                type="email" name="email" placeholder="Email Address"
                value={formData.email} onChange={handleChange}
                className="w-full bg-gray-900/50 border border-gray-600 text-white rounded-lg py-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-3.5 text-gray-500" />
              <input 
                type="password" name="password" placeholder="Password"
                value={formData.password} onChange={handleChange}
                className="w-full bg-gray-900/50 border border-gray-600 text-white rounded-lg py-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
            </button>
          </form>
        </div>
        
        <div className="bg-gray-900/50 p-4 text-center border-t border-gray-700">
          <p className="text-gray-500 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }} 
              className="text-blue-400 font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;