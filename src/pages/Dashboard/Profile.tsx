import React, { useState } from 'react';
import { User, Shield, Mail, Key, Clock, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { userEmail } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center">
            <User className="w-6 h-6 mr-3 text-primary" />
            Administrator Profile
          </h1>
          <p className="text-textSecondary mt-1">Manage your account and security credentials.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="glass-panel p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary font-bold text-3xl mb-4">
            {userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}
          </div>
          <h2 className="text-lg font-bold text-textPrimary">{userEmail || 'Admin User'}</h2>
          <div className="flex items-center justify-center text-success mt-1 mb-6">
            <Shield className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Super Administrator</span>
          </div>
          
          <div className="w-full pt-6 border-t border-border space-y-4 text-left">
            <div>
              <p className="text-xs text-textSecondary uppercase tracking-wider mb-1">Email Address</p>
              <p className="text-sm font-medium text-textPrimary flex items-center">
                <Mail className="w-4 h-4 mr-2 text-textSecondary" />
                {userEmail || 'admin@company.com'}
              </p>
            </div>
            <div>
              <p className="text-xs text-textSecondary uppercase tracking-wider mb-1">Account Created</p>
              <p className="text-sm font-medium text-textPrimary flex items-center">
                <Clock className="w-4 h-4 mr-2 text-textSecondary" />
                Oct 10, 2024
              </p>
            </div>
          </div>
        </div>

        {/* Security & Activity */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Change Password */}
          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold text-textPrimary mb-4 flex items-center">
              <Key className="w-5 h-5 mr-2 text-primary" /> Change Password
            </h2>
            <form className="space-y-4 max-w-md" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1">
                <label className="text-sm font-medium text-textPrimary">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-textPrimary">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-textPrimary">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors" 
                />
              </div>
              <button 
                type="submit"
                disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                className="mt-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Recent Activity */}
          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold text-textPrimary mb-4">Recent Login Activity</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-textSecondary uppercase border-b border-border">
                  <tr>
                    <th className="pb-3">Date & Time</th>
                    <th className="pb-3">IP Address</th>
                    <th className="pb-3">Location</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-3 text-textPrimary">Today, 10:45 AM</td>
                    <td className="py-3 text-textSecondary font-mono">192.168.1.100</td>
                    <td className="py-3 text-textSecondary">New York, USA</td>
                    <td className="py-3"><span className="text-success text-xs font-bold bg-success/10 px-2 py-1 rounded">Success</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 text-textPrimary">Yesterday, 14:20 PM</td>
                    <td className="py-3 text-textSecondary font-mono">192.168.1.100</td>
                    <td className="py-3 text-textSecondary">New York, USA</td>
                    <td className="py-3"><span className="text-success text-xs font-bold bg-success/10 px-2 py-1 rounded">Success</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 text-textPrimary">Oct 12, 09:15 AM</td>
                    <td className="py-3 text-textSecondary font-mono">10.0.0.55</td>
                    <td className="py-3 text-textSecondary">VPN IP</td>
                    <td className="py-3"><span className="text-danger text-xs font-bold bg-danger/10 px-2 py-1 rounded">Failed</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border">
              <button className="flex items-center text-danger hover:text-danger/80 transition-colors font-medium text-sm">
                <LogOut className="w-4 h-4 mr-2" />
                Terminate All Other Sessions
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
