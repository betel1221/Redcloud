import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

export default function ForcePasswordChangeModal() {
  const { userEmail, updateUserPassword, needsPasswordChange } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!needsPasswordChange) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    if (userEmail) {
      updateUserPassword(userEmail, newPassword);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-surface border border-border p-8 rounded-2xl max-w-md w-full shadow-2xl animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20">
            <ShieldAlert className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-textPrimary">Action Required</h2>
          <p className="text-sm text-textSecondary mt-2">
            For security reasons, you must change the temporary password provided by the Superadmin before continuing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm font-medium text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-1">New Password</label>
            <input 
              type="password"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-textPrimary focus:outline-none focus:border-primary transition-colors"
              placeholder="Enter at least 8 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-1">Confirm New Password</label>
            <input 
              type="password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-textPrimary focus:outline-none focus:border-primary transition-colors"
              placeholder="Re-enter new password"
            />
          </div>
          
          <button 
            type="submit"
            disabled={!newPassword || !confirmPassword || isSubmitting}
            className="w-full py-3 mt-4 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password and Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
