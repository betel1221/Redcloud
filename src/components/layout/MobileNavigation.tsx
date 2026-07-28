import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bot, FileText, Settings } from 'lucide-react';

export default function MobileNavigation() {
  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Home", end: true },
    { to: "/dashboard/ai", icon: Bot, label: "AI" },
    { to: "/dashboard/audit", icon: FileText, label: "Audit" },
    { to: "/dashboard/profile", icon: Settings, label: "Settings" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-primary' : 'text-textSecondary hover:text-textPrimary'
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
