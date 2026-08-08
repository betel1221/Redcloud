import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, AlertTriangle, AlertCircle, Moon, Sun, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

import { fetchRealNotifications, type NotificationItem } from '../../api/dashboard';

interface HeaderProps {
  onMenuToggle?: () => void;
  isCollapsed?: boolean;
  onDesktopToggle?: () => void;
}

export default function Header({ onMenuToggle, isCollapsed, onDesktopToggle }: HeaderProps) {
  const { userEmail, logout, role } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRealNotifications().then(data => setNotifications(data));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);





  return (
    <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 w-full">
      <div className="flex flex-1 items-center space-x-2 md:space-x-4">
        {onMenuToggle && (
          <button 
            onClick={onMenuToggle}
            className="md:hidden p-2 text-textSecondary hover:text-textPrimary transition-colors rounded-lg hover:bg-surfaceHover"
            title="Open Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {onDesktopToggle && (
          <button 
            onClick={onDesktopToggle}
            className="hidden md:block p-2 text-textSecondary hover:text-textPrimary transition-colors rounded-lg hover:bg-surfaceHover"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        

      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 text-textSecondary hover:text-textPrimary transition-colors rounded-full hover:bg-surfaceHover"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-textSecondary hover:text-textPrimary transition-colors rounded-full hover:bg-surfaceHover"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-danger ring-2 ring-surface"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-fade-in">
              <div className="p-4 border-b border-border bg-background flex justify-between items-center">
                <h3 className="font-bold text-textPrimary text-sm">Notifications</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{notifications.length} Live</span>
              </div>
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {notifications.map(notif => (
                  <div key={notif.id} className="p-4 border-b border-border hover:bg-surfaceHover/50 transition-colors cursor-pointer flex items-start">
                    <div className={`mt-0.5 mr-3 flex-shrink-0 p-1.5 rounded-full ${
                      notif.type === 'critical' ? 'bg-danger/10 text-danger' :
                      notif.type === 'warning' ? 'bg-warning/10 text-warning' :
                      'bg-success/10 text-success'
                    }`}>
                      {notif.type === 'critical' ? <AlertCircle className="w-4 h-4" /> : notif.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-textPrimary">{notif.title}</p>
                      <p className="text-xs text-textSecondary mt-1">{notif.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div 
                onClick={() => {
                  setShowNotifications(false);
                  navigate('/dashboard/alerts');
                }}
                className="p-3 text-center bg-background hover:bg-surfaceHover/50 transition-colors cursor-pointer border-t border-border"
              >
                <p className="text-xs font-medium text-primary">View All Notifications</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-3 border-l border-border pl-3 md:pl-4">
          <div className="flex flex-col justify-center text-right hidden sm:block">
            <span className="text-sm font-medium text-textPrimary">
              {userEmail ? userEmail.split('@')[0].split('.')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].split('.')[0].slice(1) : 'Admin'}
            </span>
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
