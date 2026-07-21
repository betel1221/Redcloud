import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';
import ForcePasswordChangeModal from '../ui/ForcePasswordChangeModal';
import { ShieldAlert } from 'lucide-react';

export default function DashboardLayout() {
  const { isAuthenticated, role } = useAuth();
  
  const enforce2fa = localStorage.getItem('eraop_enforce_2fa') === 'true';
  const show2faWarning = enforce2fa && role !== 'superadmin';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-textPrimary flex relative">
      <ForcePasswordChangeModal />
      <Sidebar isCollapsed={false} />
      
      <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ml-64`}>
        {show2faWarning && (
          <div className="bg-warning text-warning-foreground px-4 py-2 flex items-center justify-center text-sm font-medium animate-slide-up z-50">
            <ShieldAlert className="w-4 h-4 mr-2" />
            Superadmin requires you to set up Two-Factor Authentication (2FA). Please go to your Profile to configure it.
          </div>
        )}
        <Header />
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
