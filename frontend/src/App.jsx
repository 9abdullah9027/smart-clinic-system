import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import Login from './pages/Login';
import MainLayout from './components/layout/MainLayout';

// --- IMPORT THE REAL DASHBOARD HERE ---
import Dashboard from './pages/Dashboard'; // <--- Make sure this line exists
import Appointments from './pages/Appointments'; // <--- Import Appointments too

// --- DELETE THESE OLD LINES IF THEY EXIST ---
// const Dashboard = () => <h1...>Dashboard Overview</h1>;  <--- DELETE THIS
// const Appointments = () => <h1...>Appointments...</h1>;  <--- DELETE THIS

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;