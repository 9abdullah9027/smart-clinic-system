import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  FaUserMd, FaEnvelope, FaLock, FaUser, FaCalendarAlt, 
  FaSmile, FaFrown, FaShieldAlt, FaArrowLeft, FaCheck, 
  FaPhone, FaIdCard, FaMapMarkerAlt, FaUserFriends, FaExclamationCircle
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', dob: '',
    fatherName: '', gender: 'Male', nationalId: '', phone: '', address: '',
    emergencyName: '', emergencyPhone: ''
  });

  // Validation & UI State
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [passStrength, setPassStrength] = useState({ score: 0, message: '', color: 'text-gray-400' });
  
  // Hooks
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const controls = useAnimation(); 

  // --- FIX: TRIGGER ENTRY ANIMATION ON LOAD ---
  useEffect(() => {
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.5 } });
  }, [controls]);

  // Auto-switch to Register if directed from Landing Page
  useEffect(() => {
    if (location.state?.mode === 'register') setIsLogin(false);
  }, [location]);

  // Password Strength Logic
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
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: false });
    }
  };

  const triggerShake = async () => {
    await controls.start({ x: -10, transition: { duration: 0.1 } });
    await controls.start({ x: 10, transition: { duration: 0.1 } });
    await controls.start({ x: -10, transition: { duration: 0.1 } });
    await controls.start({ x: 10, transition: { duration: 0.1 } });
    await controls.start({ x: 0, transition: { duration: 0.1 } });
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    const requiredFields = ['name', 'fatherName', 'dob', 'nationalId', 'phone', 'email', 'address', 'emergencyName', 'emergencyPhone', 'password'];

    requiredFields.forEach(field => {
      if (!formData[field] || !formData[field].trim()) {
        errors[field] = true;
        isValid = false;
      }
    });
    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError("Please enter email and password.");
        triggerShake();
        return;
      }
      const result = await login(formData.email, formData.password);
      if (result.success) navigate('/dashboard');
      else {
        setError(result.message);
        triggerShake();
      }
    } else {
      if (!validateForm()) {
        setError("Please fill in all required fields.");
        triggerShake();
        return;
      }

      if (passStrength.score < 4) {
        setError("Password is too weak. Use 8+ chars, uppercase, number & symbol.");
        triggerShake();
        return;
      }
      
      const result = await register(
        formData.name, formData.email, formData.password, undefined, formData.dob,
        { 
          fatherName: formData.fatherName,
          gender: formData.gender,
          nationalId: formData.nationalId,
          phone: formData.phone,
          address: formData.address,
          emergencyContact: { name: formData.emergencyName, phone: formData.emergencyPhone }
        }
      );
      
      if (result.success) {
        setShowSuccess(true);
        setFormData({ 
          name: '', email: '', password: '', dob: '',
          fatherName: '', gender: 'Male', nationalId: '', phone: '', address: '',
          emergencyName: '', emergencyPhone: '' 
        });
        setTimeout(() => { setShowSuccess(false); setIsLogin(true); }, 3000);
      } else {
        setError(result.message);
        triggerShake();
      }
    }
  };

  const getInputClass = (fieldName) => {
    const base = "w-full bg-gray-900/50 border rounded-lg py-3 pl-10 focus:outline-none transition-colors";
    if (fieldErrors[fieldName]) return `${base} border-red-500 text-white focus:border-red-500 placeholder-red-300`;
    return `${base} border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500`;
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-10 relative overflow-y-auto">
      <Link to="/" className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium text-sm">
        <FaArrowLeft /> Back to Home
      </Link>

      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={controls} // FIX: This was blocking visibility without the useEffect above
        className={`w-full bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-10 relative ${isLogin ? 'max-w-md' : 'max-w-2xl'}`}
      >
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 mb-4">
              <FaUserMd className="text-3xl text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isLogin ? 'Welcome Back' : 'Patient Registration'}
            </h2>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded flex items-center justify-center gap-2">
              <FaExclamationCircle /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {!isLogin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="text-gray-400 text-sm font-bold border-b border-gray-700 pb-1">Personal Details</h3>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3.5 text-gray-500" />
                    <input type="text" name="name" placeholder="Full Name *" value={formData.name} onChange={handleChange} className={getInputClass('name')} />
                  </div>
                  <div className="relative">
                    <FaUserFriends className="absolute left-3 top-3.5 text-gray-500" />
                    <input type="text" name="fatherName" placeholder="Father/Guardian Name *" value={formData.fatherName} onChange={handleChange} className={getInputClass('fatherName')} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-3.5 text-gray-500" />
                      <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={`${getInputClass('dob')} text-gray-300`} />
                    </div>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="bg-gray-900/50 border border-gray-600 rounded-lg py-3 px-2 text-gray-300 focus:ring-2 focus:ring-blue-500 outline-none">
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div className="relative">
                    <FaIdCard className="absolute left-3 top-3.5 text-gray-500" />
                    <input type="text" name="nationalId" placeholder="National ID / CNIC *" value={formData.nationalId} onChange={handleChange} className={getInputClass('nationalId')} />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="text-gray-400 text-sm font-bold border-b border-gray-700 pb-1">Contact Info</h3>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-3.5 text-gray-500" />
                    <input type="tel" name="phone" placeholder="Phone Number *" value={formData.phone} onChange={handleChange} className={getInputClass('phone')} />
                  </div>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-3.5 text-gray-500" />
                    <input type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={handleChange} className={getInputClass('email')} />
                  </div>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-500" />
                    <input type="text" name="address" placeholder="Home Address *" value={formData.address} onChange={handleChange} className={getInputClass('address')} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" name="emergencyName" placeholder="Emerg. Name *" value={formData.emergencyName} onChange={handleChange} className={getInputClass('emergencyName').replace('pl-10', 'px-3 text-sm')} />
                    <input type="tel" name="emergencyPhone" placeholder="Emerg. Phone *" value={formData.emergencyPhone} onChange={handleChange} className={getInputClass('emergencyPhone').replace('pl-10', 'px-3 text-sm')} />
                  </div>
                </div>
              </div>
            )}

            {/* LOGIN FIELDS */}
            {isLogin && (
              <div className="space-y-4">
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3.5 text-gray-500" />
                  <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className={getInputClass('email')} />
                </div>
                <div className="relative">
                  <FaLock className="absolute left-3 top-3.5 text-gray-500" />
                  <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className={getInputClass('password')} />
                </div>
              </div>
            )}

            {/* Password Strength (Register Only) */}
            {!isLogin && (
              <div className="space-y-4 mt-4">
                <div className="relative">
                  <FaLock className="absolute left-3 top-3.5 text-gray-500" />
                  <input type="password" name="password" placeholder="Create Password *" value={formData.password} onChange={handleChange} className={getInputClass('password')} />
                </div>
                <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Password Strength</span>
                    <span className={`text-sm font-bold ${passStrength.color}`}>{passStrength.message || 'Enter Password'}</span>
                  </div>
                  <motion.div key={passStrength.message} initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl">
                    {passStrength.score >= 4 ? <FaSmile className="text-green-500" /> : <FaFrown className="text-gray-500" />}
                  </motion.div>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all mt-6 transform active:scale-95">
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
          <div className="flex items-center justify-center gap-1 text-xs text-green-500/80 mt-2">
            <FaShieldAlt />
            <span>256-bit SSL Secured Connection</span>
          </div>
        </div>
      </motion.div>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.5, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.5, opacity: 0, y: 50 }} transition={{ type: "spring", damping: 15 }} className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl m-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }} className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><FaCheck className="text-5xl text-green-500" /></motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Account Created!</h3>
              <p className="text-gray-500 mb-6">Redirecting...</p>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 3, ease: "linear" }} className="h-full bg-green-500" /></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;