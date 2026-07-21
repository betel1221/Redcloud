import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Save, CheckCircle, KeyRound, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
  const { role, passwordRequests, approvePasswordRequest } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center">
            <SettingsIcon className="w-6 h-6 mr-3 text-primary" />
            System Settings
          </h1>
          <p className="text-textSecondary mt-1">Configure global Redhelp preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center shadow-sm"
        >
          {isSaved ? <CheckCircle className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {isSaved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="glass-panel p-2 flex flex-col space-y-1">
            <button 
              onClick={() => setActiveTab('general')}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'general' ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:bg-surfaceHover hover:text-textPrimary'
              }`}
            >
              <SettingsIcon className="w-4 h-4 mr-3" /> General Configuration
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'security' ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:bg-surfaceHover hover:text-textPrimary'
              }`}
            >
              <Shield className="w-4 h-4 mr-3" /> Security & Access
            </button>
            {role === 'superadmin' && (
              <button 
                onClick={() => setActiveTab('requests')}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'requests' ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:bg-surfaceHover hover:text-textPrimary'
                }`}
              >
                <KeyRound className="w-4 h-4 mr-3" /> Access Requests
                {passwordRequests.length > 0 && (
                  <span className="ml-auto bg-danger text-white text-xs px-2 py-0.5 rounded-full">
                    {passwordRequests.length}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1">
          <div className="glass-panel p-8">
            
            {activeTab === 'general' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-lg font-bold text-textPrimary mb-4">General Configuration</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-textPrimary">Platform Name</label>
                    <input type="text" defaultValue="Redhelp Production" className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-textPrimary">Support Email</label>
                    <input type="email" defaultValue="it-support@company.com" className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-textPrimary">Maintenance Mode</label>
                    <div className="flex items-center mt-2">
                      <div className="relative inline-block w-12 h-6 mr-3 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="toggle" id="maintenance" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-surface appearance-none cursor-pointer" />
                        <label htmlFor="maintenance" className="toggle-label block overflow-hidden h-6 rounded-full bg-border cursor-pointer"></label>
                      </div>
                      <span className="text-sm text-textSecondary">Disable platform access for standard users during upgrades.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-lg font-bold text-textPrimary mb-4">Security & Access</h2>
                <div className="space-y-6">
                  <div className="p-4 border border-border rounded-xl bg-surfaceHover/30">
                    <h3 className="font-bold text-textPrimary mb-1">Enforce Two-Factor Authentication (2FA)</h3>
                    <p className="text-sm text-textSecondary mb-4">Require all Administrators and Super Admins to set up 2FA.</p>
                    <div className="flex items-center">
                      <div className="relative inline-block w-12 h-6 mr-3 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" defaultChecked name="toggle2fa" id="toggle2fa" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-primary appearance-none cursor-pointer transform translate-x-6" />
                        <label htmlFor="toggle2fa" className="toggle-label block overflow-hidden h-6 rounded-full bg-primary cursor-pointer"></label>
                      </div>
                      <span className="text-sm text-textPrimary font-medium">Enabled Globally</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-textPrimary">Session Timeout (Minutes)</label>
                    <input type="number" defaultValue="30" className="w-full max-w-xs bg-surface border border-border rounded-lg px-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'requests' && role === 'superadmin' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-lg font-bold text-textPrimary mb-4">Password Reset Requests</h2>
                <p className="text-sm text-textSecondary mb-6">Review and approve access requests from Administrators.</p>
                
                {passwordRequests.length === 0 ? (
                  <div className="p-8 border border-dashed border-border rounded-xl text-center">
                    <UserCheck className="w-8 h-8 text-textSecondary mx-auto mb-3" />
                    <p className="text-textSecondary font-medium">No pending requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {passwordRequests.map((email, idx) => (
                      <div key={idx} className="p-4 border border-border rounded-xl bg-surfaceHover flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-textPrimary mb-1">{email}</h3>
                          <p className="text-xs text-textSecondary">Requested a password reset link.</p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => approvePasswordRequest(email)}
                            className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
