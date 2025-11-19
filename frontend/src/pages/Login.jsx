import React from "react";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      {/* Login Card */}
      <div className="bg-white w-full max-w-md p-10 rounded-xl shadow-lg border border-gray-200">
        
        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          Smart Clinic Admin
        </h1>
        <p className="text-center text-gray-500 mt-2 mb-8">
          Sign in to access your dashboard
        </p>

        <form className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 
                         text-gray-800 placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300
                         text-gray-800 placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gray-800 text-white font-medium
                       hover:bg-gray-900 transition-all"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Forgot password?{" "}
          <span className="text-gray-900 font-medium cursor-pointer hover:underline">
            Reset here
          </span>
        </p>
      </div>

    </div>
  );
};

export default Login;
