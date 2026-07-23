import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, LogOut, CheckCircle, AlertTriangle, AlertCircle, Moon, Sun, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const { userEmail, logout, role } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchIndex = [
    { title: 'Dashboard Overview', path: '/dashboard' },
    { title: 'Server Monitoring', path: '/dashboard/servers' },
    { title: 'Database Health', path: '/dashboard/databases' },
    { title: 'Security Audit', path: '/dashboard/security' },
    { title: 'Alerts & Notifications', path: '/dashboard/alerts' },
    { title: 'AI Assistant', path: '/dashboard/ai' },
    { title: 'System Settings', path: '/dashboard/settings' },
    { title: 'Administrator Profile', path: '/dashboard/profile' },
  ];

  const filteredSearch = searchIndex.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mockNotifications = [
    { id: 1, type: 'critical', title: 'Server 02 CPU Spike', time: '2 mins ago', icon: AlertCircle },
    { id: 2, type: 'warning', title: 'Firewall Login Attempts', time: '1 hour ago', icon: AlertTriangle },
    { id: 3, type: 'success', title: 'Daily Backup Completed', time: '3 hours ago', icon: CheckCircle },
  ];

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
        
        <div className="relative w-full max-w-[200px] sm:max-w-xs md:max-w-sm lg:w-96" ref={searchRef}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-textSecondary" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(e.target.value.length > 0);
            }}
            onFocus={() => {
              if (searchQuery.length > 0) setShowSearchDropdown(true);
            }}
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg leading-5 bg-background text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all"
            placeholder="Search resources, logs, or ask AI..."
          />
          
          {/* Search Dropdown */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-surface border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              {filteredSearch.length > 0 ? (
                filteredSearch.map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearchDropdown(false);
                      navigate(item.path);
                    }}
                    className="px-4 py-2 hover:bg-surfaceHover cursor-pointer text-sm text-textPrimary transition-colors"
                  >
                    {item.title}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-textSecondary text-center">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
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
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">3 New</span>
              </div>
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {mockNotifications.map(notif => (
                  <div key={notif.id} className="p-4 border-b border-border hover:bg-surfaceHover/50 transition-colors cursor-pointer flex items-start">
                    <div className={`mt-0.5 mr-3 flex-shrink-0 p-1.5 rounded-full ${
                      notif.type === 'critical' ? 'bg-danger/10 text-danger' :
                      notif.type === 'warning' ? 'bg-warning/10 text-warning' :
                      'bg-success/10 text-success'
                    }`}>
                      <notif.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-textPrimary">{notif.title}</p>
                      <p className="text-xs text-textSecondary mt-1">{notif.time}</p>
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
          <div className="flex flex-col text-right hidden sm:block">
            <span className="text-sm font-medium text-textPrimary">{userEmail || 'Admin'}</span>
            <span className="text-xs text-textSecondary">
              {role === 'superadmin' ? 'Super Administrator' : 'System Administrator'}
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
