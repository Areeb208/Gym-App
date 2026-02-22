import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CheckInPage from './pages/CheckInPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import MembersPage from './pages/MembersPage'; 
import RevenuePage from './pages/RevenuePage';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CheckInPage />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/members" element={<MembersPage />} />
        <Route path="/admin/revenue" element={<RevenuePage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;