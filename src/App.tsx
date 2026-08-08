import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { TelegramProvider } from './context/TelegramContext';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardOverview from './pages/Dashboard/DashboardOverview';

import DatabaseMonitoring from './pages/Dashboard/DatabaseMonitoring';
import ServerMonitoring from './pages/Dashboard/ServerMonitoring';
import Alerts from './pages/Dashboard/Alerts';
import Profile from './pages/Dashboard/Profile';
import AIAssistant from './pages/Dashboard/AIAssistant';
import AuditLog from './pages/Dashboard/AuditLog';

import Landing from './pages/Landing';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("React Error Boundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: '#ff6b6b', backgroundColor: '#1e1e2e', minHeight: '100vh', fontFamily: 'monospace', whiteSpace: 'pre-wrap', overflow: 'auto' }}>
          <h2>React Render Error Boundary:</h2>
          <pre>{this.state.error?.message}</pre>
          <pre>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
    <TelegramProvider>
      <ThemeProvider>
        <AuthProvider>
        <BrowserRouter basename="/Redcloud">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="database" element={<DatabaseMonitoring />} />
              <Route path="server" element={<ServerMonitoring />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="profile" element={<Profile />} />
              <Route path="ai" element={<AIAssistant />} />
              <Route path="audit" element={<AuditLog />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
    </TelegramProvider>
    </ErrorBoundary>
  );
}

export default App;
