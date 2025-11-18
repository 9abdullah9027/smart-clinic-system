import React from "react";
import { motion } from "framer-motion";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white p-8 shadow-lg rounded-xl border border-gray-100"
      >
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-blue-600"
          >
            Smart Clinic System
          </motion.h1>
          <p className="text-gray-500 mt-2">Welcome back! Please log in.</p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          <div>
            <label className="text-gray-700 font-medium">Email</label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium">Password</label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          {/* Login Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Login
          </motion.button>
        </form>

        {/* Extra */}
        <div className="text-center mt-6">
          <a
            href="#"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Forgot Password?
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
