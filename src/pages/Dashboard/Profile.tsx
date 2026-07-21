import React, { useState } from 'react';
import { User, Shield, Mail, Key, Clock, Phone, Camera, Save, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { userEmail, role, profileComplete, completeProfile } = useAuth();
  
  // Profile Info State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    completeProfile();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

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
        <div className="glass-panel p-6 flex flex-col items-center text-center relative group">
          <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary font-bold text-3xl mb-4 relative overflow-hidden">
            {userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-textPrimary">{fullName || 'Admin User'}</h2>
          <div className="flex items-center justify-center text-success mt-1 mb-6">
            <Shield className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">
              {role === 'superadmin' ? 'Super Administrator' : 'System Administrator'}
            </span>
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
          
          {/* Professional Information */}
          <div className={`glass-panel p-6 ${!profileComplete ? 'border-2 border-primary ring-4 ring-primary/10' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-textPrimary flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" /> Professional Information
              </h2>
              {!profileComplete && (
                <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded animate-pulse">
                  Setup Required
                </span>
              )}
            </div>
            
            <form className="space-y-4 max-w-md" onSubmit={handleSaveProfile}>
              <div className="space-y-1">
                <label className="text-sm font-medium text-textPrimary">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors" 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-textPrimary">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors" 
                  />
                </div>
              </div>
              <div className="pt-2 flex items-center">
                <button 
                  type="submit"
                  disabled={!fullName}
                  className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </button>
                {isSaved && (
                  <span className="ml-4 text-success flex items-center text-sm font-medium animate-fade-in">
                    <CheckCircle className="w-4 h-4 mr-1" /> Saved Successfully
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Change Password */}
          {role === 'superadmin' ? (
            <div className="glass-panel p-6 opacity-70">
              <h2 className="text-lg font-bold text-textPrimary mb-4 flex items-center text-textSecondary">
                <Key className="w-5 h-5 mr-2" /> Change Password
              </h2>
              <div className="p-4 bg-surfaceHover border border-border rounded-lg flex items-start">
                <AlertTriangle className="w-5 h-5 text-warning mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-textSecondary leading-relaxed">
                  Superadmin passwords are fundamentally managed and generated by the developers. You cannot change your own password from this interface.
                </p>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
