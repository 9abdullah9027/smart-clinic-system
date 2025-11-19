import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // API Instance
  const api = axios.create({
    baseURL: 'http://localhost:5000/api', 
  });

  // Attach token to requests
  api.interceptors.request.use((config) => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken}`;
    }
    return config;
  });

  // Check if user is logged in on boot
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [token]);

  // Login Action
  const login = async (email, password) => {
    // --- TEMPORARY TESTING MODE START ---
    // We are bypassing the backend to test the UI flow
    
    try {
      // Simulate network delay for realism (optional)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // REAL API CALL (COMMENTED OUT)
      // const res = await api.post('/auth/login', { email, password });
      // const { token, user } = res.data;

      // MOCK DATA
      const token = "mock-token-123456789";
      const user = { 
        name: "Dr. Admin", 
        email: email, 
        role: "admin",
        id: "user_001" 
      };

      // Save to local storage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update State
      setToken(token);
      setUser(user);
      
      return { success: true };

    } catch (error) {
      console.error("Login Error:", error);
      return { 
        success: false, 
        message: 'Login failed' 
      };
    }
    // --- TEMPORARY TESTING MODE END ---
  };

  // Logout Action
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);