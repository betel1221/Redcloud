import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardOverview from './pages/Dashboard/DashboardOverview';

import AIAssistant from './pages/Dashboard/AIAssistant';
import DatabaseMonitoring from './pages/Dashboard/DatabaseMonitoring';
import ServerMonitoring from './pages/Dashboard/ServerMonitoring';
import SecurityMonitoring from './pages/Dashboard/SecurityMonitoring';

import Landing from './pages/Landing';

// Placeholders for secondary pages
const Alerts = () => <div className="p-6 animate-fade-in"><h1 className="text-2xl font-bold text-textPrimary">Alerts</h1><p className="text-textSecondary mt-2">Page under construction.</p></div>;
const Recommendations = () => <div className="p-6 animate-fade-in"><h1 className="text-2xl font-bold text-textPrimary">Recommendations</h1><p className="text-textSecondary mt-2">Page under construction.</p></div>;
const Reports = () => <div className="p-6 animate-fade-in"><h1 className="text-2xl font-bold text-textPrimary">Reports</h1><p className="text-textSecondary mt-2">Page under construction.</p></div>;
const Logs = () => <div className="p-6 animate-fade-in"><h1 className="text-2xl font-bold text-textPrimary">Logs</h1><p className="text-textSecondary mt-2">Page under construction.</p></div>;
const KnowledgeBase = () => <div className="p-6 animate-fade-in"><h1 className="text-2xl font-bold text-textPrimary">Knowledge Base</h1><p className="text-textSecondary mt-2">Page under construction.</p></div>;
const Notifications = () => <div className="p-6 animate-fade-in"><h1 className="text-2xl font-bold text-textPrimary">Notifications</h1><p className="text-textSecondary mt-2">Page under construction.</p></div>;
const Settings = () => <div className="p-6 animate-fade-in"><h1 className="text-2xl font-bold text-textPrimary">Settings</h1><p className="text-textSecondary mt-2">Page under construction.</p></div>;
const Profile = () => <div className="p-6 animate-fade-in"><h1 className="text-2xl font-bold text-textPrimary">Profile</h1><p className="text-textSecondary mt-2">Page under construction.</p></div>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="ai" element={<AIAssistant />} />
            <Route path="database" element={<DatabaseMonitoring />} />
            <Route path="server" element={<ServerMonitoring />} />
            <Route path="security" element={<SecurityMonitoring />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="reports" element={<Reports />} />
            <Route path="logs" element={<Logs />} />
            <Route path="knowledge" element={<KnowledgeBase />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
