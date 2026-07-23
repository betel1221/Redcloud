import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';
import ForcePasswordChangeModal from '../ui/ForcePasswordChangeModal';
import { ShieldAlert } from 'lucide-react';

export default function DashboardLayout() {
  const { isAuthenticated, role } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const enforce2fa = localStorage.getItem('eraop_enforce_2fa') === 'true';
  const show2faWarning = enforce2fa && role !== 'superadmin';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-textPrimary flex relative">
      <ForcePasswordChangeModal />
      
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar 
        isCollapsed={false} 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 md:ml-64 w-full`}>
        {show2faWarning && (
          <div className="bg-warning text-warning-foreground px-4 py-2 flex items-center justify-center text-sm font-medium animate-slide-up z-50">
            <ShieldAlert className="w-4 h-4 mr-2" />
            Superadmin requires you to set up Two-Factor Authentication (2FA). Please go to your Profile to configure it.
          </div>
        )}
        <Header onMenuToggle={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-background w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
