import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bot, 
  Database, 
  Server, 
  ShieldAlert, 
  Bell, 
  Lightbulb, 
  FileText, 
  BookOpen, 
  MessageSquare,
  Settings,
  User,
  Activity
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Assistant', path: '/dashboard/ai', icon: Bot },
  { name: 'Database Monitoring', path: '/dashboard/database', icon: Database },
  { name: 'Server Monitoring', path: '/dashboard/server', icon: Server },
  { name: 'Security Monitoring', path: '/dashboard/security', icon: ShieldAlert },
  { name: 'Alerts', path: '/dashboard/alerts', icon: Bell },
  { name: 'Recommendations', path: '/dashboard/recommendations', icon: Lightbulb },
  { name: 'Reports', path: '/dashboard/reports', icon: FileText },
  { name: 'Logs', path: '/dashboard/logs', icon: MessageSquare },
  { name: 'Knowledge Base', path: '/dashboard/knowledge', icon: BookOpen },
  { name: 'Notifications', path: '/dashboard/notifications', icon: Bell },
];

const bottomItems = [
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  { name: 'Profile', path: '/dashboard/profile', icon: User },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-surface border-r border-border h-screen flex flex-col fixed left-0 top-0 z-20">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Activity className="w-6 h-6 text-primary mr-2" />
        <span className="text-lg font-bold text-textPrimary tracking-wider">ERAOP</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <nav className="space-y-1 px-3">
          <div className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2 px-3">
            Overview
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-textSecondary hover:bg-surfaceHover hover:text-textPrimary"
                )
              }
            >
              <item.icon className={cn(
                "mr-3 flex-shrink-0 h-5 w-5 transition-colors",
                // Active state handled by parent class in NavLink via custom cn logic if needed,
                // but tailwind group-hover works well here.
              )} />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-border space-y-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-textSecondary hover:bg-surfaceHover hover:text-textPrimary"
              )
            }
          >
            <item.icon className="mr-3 flex-shrink-0 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
