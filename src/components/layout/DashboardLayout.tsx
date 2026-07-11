import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';
import { Menu, ChevronLeft } from 'lucide-react';

export default function DashboardLayout() {
  const { isAuthenticated } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-textPrimary flex">
      <Sidebar isCollapsed={isCollapsed} />
      
      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed z-30 top-4 left-4 bg-surface border border-border rounded-md p-1.5 text-textSecondary hover:text-textPrimary hover:bg-surfaceHover transition-colors shadow-sm"
        style={{ left: isCollapsed ? '16px' : '264px', top: '16px', transition: 'left 0.3s ease' }}
      >
        {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
      </button>

      <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header />
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
