import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, Shield, Mail, Camera, Save, CheckCircle, Settings as SettingsIcon, X, Crop as CropIcon } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { useAuth } from '../../context/AuthContext';
import { getCroppedImg } from '../../utils/cropImage';

export default function Profile() {
  const { userEmail, role, avatar, updateAvatar, profileComplete, completeProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');

  // Cropper State
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings State
  const [enforce2fa, setEnforce2fa] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  
  useEffect(() => {
    setEnforce2fa(false);
    setMaintenance(false);
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
        setImageSrc(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveCroppedImage = async () => {
    try {
      if (imageSrc && croppedAreaPixels) {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        await updateAvatar(croppedImage);
        completeProfile();
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
        setShowCropper(false);
        setImageSrc(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggle2FA = () => {
    setEnforce2fa(prev => !prev);
  };

  const toggleMaintenance = () => {
    setMaintenance(prev => !prev);
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
              </>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          
          {activeTab === 'profile' && (
            <div className="flex justify-center animate-fade-in">
              <div className={`glass-panel p-8 w-full max-w-md flex flex-col items-center text-center relative group ${!profileComplete ? 'border-2 border-primary ring-4 ring-primary/10' : ''}`}>
                
                {!profileComplete && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded animate-pulse">
                      Setup Required
                    </span>
                  </div>
                )}
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div className="w-32 h-32 rounded-full bg-primary/20 border-[3px] border-primary flex items-center justify-center text-primary font-bold text-4xl mb-6 relative overflow-hidden cursor-pointer shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:scale-105 transition-transform"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatar ? (
                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    userEmail ? userEmail.charAt(0).toUpperCase() : 'A'
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 h-8 bg-black/60 flex items-center justify-center">
                    <span className="text-[10px] text-white font-medium uppercase tracking-wider">Set Photo</span>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-textPrimary mb-1">
                  {role === 'superadmin' ? 'Super Administrator' : 'Administrator'}
                </h2>
                
                <div className="flex items-center justify-center text-success mb-6">
                  <Shield className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Security Policy Verified</span>
                </div>
                
                {isSaved && (
                  <span className="text-success flex items-center text-sm font-medium animate-fade-in mb-6 bg-success/10 px-4 py-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 mr-2" /> Profile updated successfully
                  </span>
                )}
                
                <div className="w-full pt-6 border-t border-border space-y-5 text-left">
                  <div className="bg-surface/50 p-4 rounded-xl border border-border">
                    <p className="text-xs text-textSecondary uppercase tracking-wider mb-2">Account Email</p>
                    <p className="text-md font-medium text-textPrimary flex items-center">
                      <Mail className="w-5 h-5 mr-3 text-primary" />
                      {userEmail || 'admin@company.com'}
                    </p>
                  </div>
                  
                  <div className="bg-surface/50 p-4 rounded-xl border border-border">
                    <p className="text-xs text-textSecondary uppercase tracking-wider mb-2">Account Status</p>
                    <p className="text-md font-medium text-textPrimary flex items-center">
                      <Shield className="w-5 h-5 mr-3 text-success" />
                      Active & Secured
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cropper Modal */}
          {showCropper && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-surface border border-border w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-border bg-surfaceHover">
                  <h3 className="font-bold flex items-center"><CropIcon className="w-5 h-5 mr-2 text-primary" /> Crop Photo</h3>
                  <button onClick={() => setShowCropper(false)} className="text-textSecondary hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="relative w-full h-80 bg-black/50">
                  <Cropper
                    image={imageSrc || ''}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>
                
                <div className="p-6 bg-surfaceHover space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-textSecondary">Zoom</span>
                    <input
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      aria-labelledby="Zoom"
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      onClick={() => setShowCropper(false)}
                      className="px-4 py-2 rounded-lg font-medium text-textSecondary hover:bg-surface transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveCroppedImage}
                      className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                    >
                      Set Photo
                    </button>
                  </div>
                </div>
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


        </div>
      </div>
    </div>
  );
}
