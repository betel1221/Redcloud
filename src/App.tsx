import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardOverview from './pages/Dashboard/DashboardOverview';

import DatabaseMonitoring from './pages/Dashboard/DatabaseMonitoring';
import ServerMonitoring from './pages/Dashboard/ServerMonitoring';
import SecurityMonitoring from './pages/Dashboard/SecurityMonitoring';
import Alerts from './pages/Dashboard/Alerts';
import Profile from './pages/Dashboard/Profile';
import DatabaseAIAssistant from './pages/Dashboard/DatabaseAIAssistant';
import InfrastructureAIAssistant from './pages/Dashboard/InfrastructureAIAssistant';
import AuditLog from './pages/Dashboard/AuditLog';

import Landing from './pages/Landing';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="database" element={<DatabaseMonitoring />} />
              <Route path="server" element={<ServerMonitoring />} />
              <Route path="security" element={<SecurityMonitoring />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="profile" element={<Profile />} />
              <Route path="ai/database" element={<DatabaseAIAssistant />} />
              <Route path="ai/infrastructure" element={<InfrastructureAIAssistant />} />
              <Route path="audit" element={<AuditLog />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
