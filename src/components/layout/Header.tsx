import React from 'react';
import { Search, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { userEmail, logout } = useAuth();

  return (
    <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 flex items-center">
        <div className="relative w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-textSecondary" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg leading-5 bg-background text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all"
            placeholder="Search resources, logs, or ask AI..."
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-textSecondary hover:text-textPrimary transition-colors rounded-full hover:bg-surfaceHover">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-danger ring-2 ring-surface"></span>
        </button>
        
        <div className="flex items-center space-x-3 border-l border-border pl-4">
          <div className="flex flex-col text-right hidden sm:block">
            <span className="text-sm font-medium text-textPrimary">{userEmail || 'Admin'}</span>
            <span className="text-xs text-textSecondary">System Administrator</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
            {userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}
          </div>
          <button 
            onClick={logout}
            className="p-2 text-textSecondary hover:text-danger transition-colors rounded-full hover:bg-surfaceHover ml-2"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
