import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // 1. Setup Axios
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
  });

  // 2. Attach Token
  api.interceptors.request.use((config) => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken}`;
    }
    return config;
  });

  // 3. Check Login Status
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // --- LOGIN ---
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error.response?.data);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // --- REGISTER ---
  const register = async (name, email, password, role, dob, extraData = {}) => {
    try {
      // We use spread operator (...) to combine main fields with extraData (fatherName, phone, etc.)
      const payload = { 
        name, 
        email, 
        password, 
        role, 
        dob,
        ...extraData 
      };

      console.log("Sending Payload:", payload); // Debugging

      await api.post('/auth/register', payload);
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Registration failed";
      console.error("Register Error:", msg);
      return { success: false, message: msg };
    }
  };

  // --- LOGOUT ---
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Expose everything to the app
  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    api
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);