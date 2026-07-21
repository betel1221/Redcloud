import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardOverview from './pages/Dashboard/DashboardOverview';

import DatabaseMonitoring from './pages/Dashboard/DatabaseMonitoring';
import ServerMonitoring from './pages/Dashboard/ServerMonitoring';
import SecurityMonitoring from './pages/Dashboard/SecurityMonitoring';
import Alerts from './pages/Dashboard/Alerts';
import Settings from './pages/Dashboard/Settings';
import Profile from './pages/Dashboard/Profile';
import AIAssistant from './pages/Dashboard/AIAssistant';
import AuditLog from './pages/Dashboard/AuditLog';

import Landing from './pages/Landing';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="database" element={<DatabaseMonitoring />} />
            <Route path="server" element={<ServerMonitoring />} />
            <Route path="security" element={<SecurityMonitoring />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="ai" element={<AIAssistant />} />
            <Route path="audit" element={<AuditLog />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
