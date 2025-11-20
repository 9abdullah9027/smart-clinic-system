import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // 1. Setup Axios Instance
  const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Points to your Node.js server
  });

  // 2. Attach Token to Every Request
  api.interceptors.request.use((config) => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken}`;
    }
    return config;
  });

  // 3. Check Login Status on Refresh
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // --- REAL LOGIN ACTION ---
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      
      // Backend returns: { message, token, user: { id, name, role... } }
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // --- REAL REGISTER ACTION ---
  const register = async (name, email, password, role = 'doctor') => {
    try {
      await api.post('/auth/register', { name, email, password, role });
      // After register, we usually ask them to login, or login automatically
      // For now, we return success so the UI can switch to login view
      return { success: true };
    } catch (error) {
      console.error("Register Error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // --- LOGOUT ACTION ---
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, api }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);