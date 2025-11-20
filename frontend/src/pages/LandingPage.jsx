import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Shield, Activity, Zap, Globe, 
  CheckCircle, PlayCircle, ChevronRight, Lock 
} from 'lucide-react';

// --- 1. BACKGROUND & NAVBAR ---

const BackgroundGradient = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
    <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[100px] animate-bounce delay-1000" />
    <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px]" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
  </div>
);

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Activity className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">SmartClinic</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Log In
          </button>
          <button 
             // FIXED: Send state to open Register view
             onClick={() => navigate('/login', { state: { mode: 'register' } })}
             className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg shadow-white/10"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

// --- 2. HERO SECTION ---

const Hero = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const yMockup = useTransform(scrollY, [0, 500], [0, -50]);
  const opacityMockup = useTransform(scrollY, [0, 300], [1, 0.5]);

  return (
    <section className="relative z-10 pt-40 pb-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-300 text-xs font-medium mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Accepting Beta Clinics
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8 tracking-tight">
            Manage your clinic <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">
              like it's 2030.
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The all-in-one platform for modern healthcare. AI-powered scheduling, 
            secure MRN records, and real-time analytics in one beautiful interface.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
            <button 
              // FIXED: Send state to open Register view
              onClick={() => navigate('/login', { state: { mode: 'register' } })}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20"
            >
              Start Free Trial <ArrowRight size={18} />
            </button>
            <button className="px-8 py-4 rounded-full font-bold text-white border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-2 backdrop-blur-md">
              <PlayCircle size={18} /> Watch Demo
            </button>
          </div>
        </motion.div>

        {/* 3D Dashboard Preview (CSS Mockup) */}
        <motion.div 
          style={{ y: yMockup, opacity: opacityMockup }}
          initial={{ opacity: 0, rotateX: 20 }}
          animate={{ opacity: 1, rotateX: 10 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative perspective-1000 mx-auto max-w-5xl"
        >
          <div className="relative bg-[#0f1115] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Browser Controls */}
            <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
              <div className="ml-4 px-3 py-1 bg-black/40 rounded-md text-xs text-gray-500 font-mono w-64">app.smartclinic.com/dashboard</div>
            </div>

            {/* Dashboard Content Mockup */}
            <div className="p-6 grid grid-cols-4 gap-6 opacity-90">
              {/* Sidebar Mock */}
              <div className="col-span-1 h-96 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-3 p-4">
                {[1,2,3,4,5].map(i => <div key={i} className="h-8 w-full bg-white/5 rounded-lg" />)}
              </div>
              
              {/* Main Content Mock */}
              <div className="col-span-3 flex flex-col gap-6">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-white/5 p-4">
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 mb-2" />
                      <div className="h-4 w-20 bg-white/10 rounded" />
                    </div>
                  ))}
                </div>
                {/* Chart Area */}
                <div className="flex-1 bg-white/5 rounded-xl border border-white/5 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-500/20 to-transparent" />
                  <div className="absolute bottom-0 w-full h-px bg-blue-500/50" />
                  <svg className="w-full h-full absolute bottom-0" preserveAspectRatio="none">
                     <path d="M0,100 Q150,50 300,80 T600,20 T900,60" fill="none" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="3" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Glossy Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

// --- 3. FEATURES SECTION ---

const Features = () => {
  const features = [
    { title: "Smart Scheduling", desc: "Drag-and-drop calendar with automatic conflict detection.", icon: <Activity />, col: "md:col-span-2" },
    { title: "MRN Tracking", desc: "Unique Medical Record Numbers for precise patient history.", icon: <Zap />, col: "md:col-span-1" },
    { title: "Role-Based Access", desc: "Strict portals for Doctors, Patients, and Admins.", icon: <Shield />, col: "md:col-span-1" },
    { title: "Real-Time Analytics", desc: "Live dashboards powered by WebSockets.", icon: <Globe />, col: "md:col-span-2" },
  ];

  return (
    <section id="features" className="relative z-10 py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="text-blue-400 font-bold tracking-wider uppercase text-sm">Features</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-6">Engineered for speed.</h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            We stripped away the complexity of traditional hospital software and built a tool 
            that actually helps you treat patients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className={`bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl hover:bg-white/10 transition-all duration-300 ${f.col} group`}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:text-white transition-colors">
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- 4. SECURITY SECTION ---

const Security = () => {
  return (
    <section id="security" className="relative z-10 py-20 px-6 bg-black/40">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium mb-6">
            <CheckCircle size={14} /> HIPAA Compliant
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">
            Bank-grade security for <br/> your patient data.
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            We take security seriously. Your data is encrypted at rest and in transit, 
            ensuring complete privacy for your clinic and patients.
          </p>
          
          <div className="space-y-4">
            {[
              "256-bit SSL Encryption on all requests",
              "Daily automated backups to secure cloud",
              "Role-based access control (RBAC)",
              "Two-factor authentication support"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-300">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                   <CheckCircle size={14} className="text-green-400" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Security Visual */}
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/10 blur-[100px] rounded-full" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Lock className="text-green-400" />
                <span className="text-white font-mono">Secure Connection</span>
              </div>
              <span className="text-green-400 text-sm font-mono">Connected</span>
            </div>
            <div className="space-y-4 font-mono text-sm text-gray-400">
               <div className="flex justify-between">
                 <span>Status</span>
                 <span className="text-green-400">Encrypted</span>
               </div>
               <div className="flex justify-between">
                 <span>Protocol</span>
                 <span className="text-white">TLS 1.3</span>
               </div>
               <div className="flex justify-between">
                 <span>Database</span>
                 <span className="text-white">MongoDB Atlas (Locked)</span>
               </div>
               <div className="h-2 bg-white/10 rounded-full mt-4 overflow-hidden">
                 <motion.div 
                   initial={{ width: "0%" }}
                   whileInView={{ width: "100%" }}
                   transition={{ duration: 1.5 }}
                   className="h-full bg-green-500"
                 />
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- 5. PRICING SECTION ---

const Pricing = () => {
  const plans = [
    {
      name: "Starter Clinic",
      price: "$500",
      desc: "Perfect for single-doctor practices.",
      features: ["1 Doctor Account", "Unlimited Patients", "Basic Appointments", "500MB Storage"],
      color: "border-white/10 bg-white/5",
      btn: "border-white/20 hover:bg-white/10"
    },
    {
      name: "Professional",
      price: "$1,000",
      desc: "For growing clinics with multiple staff.",
      features: ["5 Doctor Accounts", "Advanced Analytics", "SMS Notifications", "Priority Support"],
      color: "border-blue-500/50 bg-blue-900/10 shadow-2xl shadow-blue-900/20",
      popular: true,
      btn: "bg-blue-600 hover:bg-blue-500 border-transparent"
    },
    {
      name: "Enterprise",
      price: "$2,500",
      desc: "Full hospital management suite.",
      features: ["Unlimited Staff", "Custom API Access", "Dedicated Manager", "On-premise Option"],
      color: "border-white/10 bg-white/5",
      btn: "border-white/20 hover:bg-white/10"
    }
  ];

  return (
    <section id="pricing" className="relative z-10 py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Simple, transparent pricing.</h2>
          <p className="text-gray-400 text-lg">Invest in technology that pays for itself.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className={`relative rounded-3xl p-8 border backdrop-blur-xl flex flex-col ${plan.color}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="text-sm text-gray-400 mt-4">{plan.desc}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle size={16} className="text-blue-400" /> {f}
                  </li>
                ))}
              </ul>

              <button 
                // FIXED: Send state to open Register view
                onClick={() => navigate('/login', { state: { mode: 'register' } })}
                className={`w-full py-4 rounded-xl font-bold text-white border transition-all ${plan.btn}`}
              >
                Choose {plan.name}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- 6. FOOTER ---

const Footer = () => (
  <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-lg pt-20 pb-10 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <span className="text-xl font-bold text-white">SmartClinic</span>
          </div>
          <p className="text-gray-400 max-w-sm">
            The leading platform for clinic management. Trusted by over 500 doctors worldwide.
            Join the revolution today.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">Product</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="hover:text-blue-400 cursor-pointer">Features</li>
            <li className="hover:text-blue-400 cursor-pointer">Security</li>
            <li className="hover:text-blue-400 cursor-pointer">Pricing</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Legal</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="hover:text-blue-400 cursor-pointer">Privacy Policy</li>
            <li className="hover:text-blue-400 cursor-pointer">Terms of Service</li>
            <li className="hover:text-blue-400 cursor-pointer">HIPAA Compliance</li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-gray-500 text-sm">
          &copy; 2025 SmartClinic Systems. All rights reserved.
        </div>
        <div className="flex gap-6 text-gray-400">
          <Globe size={20} className="hover:text-white cursor-pointer" />
          <Shield size={20} className="hover:text-white cursor-pointer" />
        </div>
      </div>
    </div>
  </footer>
);

// --- MAIN COMPONENT ---
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black font-sans selection:bg-blue-500/30">
      <BackgroundGradient />
      <Navbar />
      <Hero />
      <Features />
      <Security />
      <Pricing />
      <Footer />
    </div>
  );
};

export default LandingPage;