import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  Server, 
  ShieldAlert, 
  Bell, 
  Settings,
  User,
  Activity,
  Bot,
  Shield,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Database Monitoring', path: '/dashboard/database', icon: Database },
  { name: 'Server Monitoring', path: '/dashboard/server', icon: Server },
  { name: 'Security Monitoring', path: '/dashboard/security', icon: ShieldAlert },
  { name: 'Database AI', path: '/dashboard/ai/database', icon: Bot },
  { name: 'Server & Security AI', path: '/dashboard/ai/infrastructure', icon: Bot },
  { name: 'Alerts', path: '/dashboard/alerts', icon: Bell },
];

const bottomItems = [
  { name: 'Settings & Profile', path: '/dashboard/profile', icon: Settings },
];

interface SidebarProps {
  isCollapsed: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isCollapsed, isOpen = false, onClose }: SidebarProps) {
  const { role } = useAuth();
  
  const currentBottomItems = [...bottomItems];
  if (role === 'superadmin') {
    currentBottomItems.unshift({ name: 'Audit & Users', path: '/dashboard/audit', icon: Shield });
  }

  return (
    <div className={cn(
      "bg-surface border-r border-border h-screen flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300",
      isCollapsed ? "w-16" : "w-64",
      "md:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <div className="flex items-center">
          <Activity className="w-6 h-6 text-primary flex-shrink-0" />
          {!isCollapsed && <span className="text-lg font-bold text-textPrimary tracking-wider ml-2">Redhelp</span>}
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden p-1 text-textSecondary hover:text-textPrimary rounded-lg hover:bg-surfaceHover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <nav className="space-y-1 px-3">
          <div className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2 px-3 text-center">
            {!isCollapsed && "Overview"}
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'}
              title={isCollapsed ? item.name : undefined}
              className={({ isActive }) =>
                cn(
                  "group flex items-center py-2 text-sm font-medium rounded-lg transition-colors",
                  isCollapsed ? "justify-center px-0" : "px-3",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-textSecondary hover:bg-surfaceHover hover:text-textPrimary"
                )
              }
            >
              <item.icon className={cn(
                "flex-shrink-0 h-5 w-5 transition-colors",
                !isCollapsed && "mr-3"
              )} />
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-border space-y-1">
        {currentBottomItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            title={isCollapsed ? item.name : undefined}
            className={({ isActive }) =>
              cn(
                "group flex items-center py-2 text-sm font-medium rounded-lg transition-colors",
                isCollapsed ? "justify-center px-0" : "px-3",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-textSecondary hover:bg-surfaceHover hover:text-textPrimary"
              )
            }
          >
            <item.icon className={cn("flex-shrink-0 h-5 w-5", !isCollapsed && "mr-3")} />
            {!isCollapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
