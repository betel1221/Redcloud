import React, { useState, useEffect, useRef } from 'react';
import { User, Shield, Mail, Key, Clock, Phone, Camera, Save, CheckCircle, Settings as SettingsIcon, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { userEmail, role, profileComplete, completeProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Info State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings State
  const [enforce2fa, setEnforce2fa] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  
  useEffect(() => {
    const savedAvatar = localStorage.getItem(`eraop_avatar_${userEmail}`);
    if (savedAvatar) setAvatar(savedAvatar);
    
    setEnforce2fa(localStorage.getItem('eraop_enforce_2fa') === 'true');
    setMaintenance(localStorage.getItem('eraop_maintenance') === 'true');
  }, [userEmail]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    completeProfile();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
        localStorage.setItem(`eraop_avatar_${userEmail}`, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggle2FA = () => {
    const newVal = !enforce2fa;
    setEnforce2fa(newVal);
    localStorage.setItem('eraop_enforce_2fa', String(newVal));
  };

  const toggleMaintenance = () => {
    const newVal = !maintenance;
    setMaintenance(newVal);
    localStorage.setItem('eraop_maintenance', String(newVal));
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center">
            <SettingsIcon className="w-6 h-6 mr-3 text-primary" />
            Account & System Settings
          </h1>
          <p className="text-textSecondary mt-1">Manage your profile, preferences, and security.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="glass-panel p-2 flex flex-col space-y-1">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:bg-surfaceHover hover:text-textPrimary'
              }`}
            >
              <User className="w-4 h-4 mr-3" /> Profile Information
            </button>
            
            {role === 'superadmin' && (
              <>
                <button 
                  onClick={() => setActiveTab('system')}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'system' ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:bg-surfaceHover hover:text-textPrimary'
                  }`}
                >
                  <SettingsIcon className="w-4 h-4 mr-3" /> System Configuration
                </button>
                <button 
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'security' ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:bg-surfaceHover hover:text-textPrimary'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 mr-3" /> Security & 2FA
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <div className="glass-panel p-6 flex flex-col items-center text-center relative group">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div 
                  className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary font-bold text-3xl mb-4 relative overflow-hidden cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatar ? (
                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    userEmail ? userEmail.charAt(0).toUpperCase() : 'A'
                  )}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
                </div>
              </div>

              <div className={`glass-panel p-6 ${!profileComplete ? 'border-2 border-primary ring-4 ring-primary/10' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-textPrimary flex items-center">
                    <User className="w-5 h-5 mr-2 text-primary" /> Professional Information
                  </h2>
                  <div className="flex gap-2">
                    {!profileComplete && (
                      <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded animate-pulse">
                        Setup Required
                      </span>
                    )}
                    {role !== 'superadmin' && (
                      <span className="bg-warning/20 text-warning text-xs font-bold px-2 py-1 rounded">
                        Read Only
                      </span>
                    )}
                  </div>
                </div>
                
                {role !== 'superadmin' && (
                  <div className="mb-4 p-3 bg-surfaceHover border border-border rounded-lg text-sm text-textSecondary flex items-start">
                    <Shield className="w-4 h-4 mr-2 text-warning flex-shrink-0 mt-0.5" />
                    <p>Your profile is locked by policy. To update your information or request a password reset, please contact a Super Administrator.</p>
                  </div>
                )}
                
                <form className="space-y-4" onSubmit={handleSaveProfile}>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-textPrimary">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={role !== 'superadmin'}
                        placeholder="e.g. John Doe"
                        className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed" 
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
                        disabled={role !== 'superadmin'}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed" 
                      />
                    </div>
                  </div>
                  <div className="pt-2 flex items-center">
                    {role === 'superadmin' && (
                      <>
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
                      </>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'system' && role === 'superadmin' && (
            <div className="glass-panel p-8 animate-fade-in">
              <h2 className="text-lg font-bold text-textPrimary mb-4">System Configuration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-textPrimary">Support Email</label>
                  <input type="email" defaultValue="it-support@company.com" className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-textPrimary">Maintenance Mode</label>
                  <div className="flex items-center mt-2">
                    <div className="relative inline-block w-12 h-6 mr-3 align-middle select-none transition duration-200 ease-in">
                      <input type="checkbox" checked={maintenance} onChange={toggleMaintenance} id="maintenance" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-surface appearance-none cursor-pointer" />
                      <label htmlFor="maintenance" className="toggle-label block overflow-hidden h-6 rounded-full bg-border cursor-pointer"></label>
                    </div>
                    <span className="text-sm text-textSecondary">Disable platform access for standard users during upgrades.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && role === 'superadmin' && (
            <div className="glass-panel p-8 animate-fade-in">
              <h2 className="text-lg font-bold text-textPrimary mb-4">Security & 2FA</h2>
              <div className="space-y-6">
                <div className="p-4 border border-border rounded-xl bg-surfaceHover/30">
                  <h3 className="font-bold text-textPrimary mb-1">Enforce Two-Factor Authentication (2FA)</h3>
                  <p className="text-sm text-textSecondary mb-4">Require all Administrators to set up 2FA.</p>
                  <div className="flex items-center">
                    <div className="relative inline-block w-12 h-6 mr-3 align-middle select-none transition duration-200 ease-in">
                      <input type="checkbox" checked={enforce2fa} onChange={toggle2FA} id="toggle2fa" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-primary appearance-none cursor-pointer transform" style={{ transform: enforce2fa ? 'translateX(1.5rem)' : 'translateX(0)' }} />
                      <label htmlFor="toggle2fa" className="toggle-label block overflow-hidden h-6 rounded-full bg-primary cursor-pointer" style={{ backgroundColor: enforce2fa ? 'var(--primary)' : 'var(--border)' }}></label>
                    </div>
                    <span className="text-sm text-textPrimary font-medium">{enforce2fa ? 'Enabled Globally' : 'Disabled'}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-textPrimary">Session Timeout (Minutes)</label>
                  <input type="number" defaultValue="30" className="w-full max-w-xs bg-surface border border-border rounded-lg px-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
