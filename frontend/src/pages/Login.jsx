import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Added Link
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserMd, FaEnvelope, FaLock, FaUser, FaCalendarAlt, FaSmile, FaFrown, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', dob: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // Password Strength State
  const [passStrength, setPassStrength] = useState({ score: 0, message: '', color: 'text-gray-400' });
  
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // --- 1. AUTO-SWITCH TO REGISTER MODE ---
  useEffect(() => {
    if (location.state?.mode === 'register') {
      setIsLogin(false);
    }
  }, [location]);

  // Check Password Strength Logic
  useEffect(() => {
    if (isLogin || !formData.password) {
      setPassStrength({ score: 0, message: '', color: 'text-gray-400' });
      return;
    }

    const pass = formData.password;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) setPassStrength({ score, message: 'Weak', color: 'text-red-500' });
    else if (score === 2 || score === 3) setPassStrength({ score, message: 'Medium', color: 'text-yellow-500' });
    else setPassStrength({ score, message: 'Strong', color: 'text-green-500' });

  }, [formData.password, isLogin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (isLogin) {
      const result = await login(formData.email, formData.password);
      if (result.success) navigate('/dashboard');
      else setError(result.message);
    } else {
      if (passStrength.score < 4) {
        setError("Password is too weak. Use 8+ chars, numbers & symbols.");
        return;
      }
      const result = await register(formData.name, formData.email, formData.password, undefined, formData.dob);
      if (result.success) {
        setMessage('Account created! Please sign in.');
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '', dob: '' });
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* --- NEW HOME BUTTON --- */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium text-sm"
      >
        <FaArrowLeft /> Back to Home
      </Link>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-10 relative"
      >
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 mb-4">
              <FaUserMd className="text-3xl text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isLogin ? 'Welcome Back' : 'Join Smart Clinic'}
            </h2>
          </div>

          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded text-center">{error}</div>}
          {message && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 text-green-500 text-sm rounded text-center">{message}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3.5 text-gray-500" />
                  <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required
                    className="w-full bg-gray-900/50 border border-gray-600 text-white rounded-lg py-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3.5 text-gray-500" />
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} required
                    className="w-full bg-gray-900/50 border border-gray-600 text-white rounded-lg py-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500" />
                </div>
              </>
            )}

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3.5 text-gray-500" />
              <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required
                className="w-full bg-gray-900/50 border border-gray-600 text-white rounded-lg py-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-3.5 text-gray-500" />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required
                className="w-full bg-gray-900/50 border border-gray-600 text-white rounded-lg py-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            {/* Password Strength Animation */}
            {!isLogin && (
              <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Password Strength</span>
                  <span className={`text-sm font-bold ${passStrength.color}`}>{passStrength.message || 'Enter Password'}</span>
                </div>
                <motion.div
                  key={passStrength.message}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="text-2xl"
                >
                  {passStrength.score >= 4 ? <FaSmile className="text-green-500" /> : <FaFrown className="text-gray-500" />}
                </motion.div>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02]">
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>
        </div>

        <div className="bg-gray-900/50 p-4 text-center border-t border-gray-700 flex flex-col gap-2">
          <p className="text-gray-500 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-blue-400 font-bold hover:underline">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
          
          {/* SSL Badge */}
          <div className="flex items-center justify-center gap-1 text-xs text-green-500/80 mt-2">
            <FaShieldAlt />
            <span>256-bit SSL Secured Connection</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;