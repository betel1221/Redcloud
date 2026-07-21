import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Mail, ArrowLeft, CheckCircle, Lock, ShieldQuestion, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const { addPasswordRequest, passwordRequests } = useAuth();
  const navigate = useNavigate();

  // Polling for approval status
  useEffect(() => {
    if (step === 4) {
      const interval = setInterval(() => {
        const storedReqs = JSON.parse(localStorage.getItem('eraop_password_requests') || '[]');
        const req = storedReqs.find((r: any) => r.email === email);
        if (req && req.status === 'approved') {
          setStep(5); // Success step
          clearInterval(interval);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [step, email]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStep(2);
      setError('');
    }
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityAnswer.toLowerCase().trim() === 'redhelp') {
      setStep(3);
      setError('');
    } else {
      setError('Incorrect answer.');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    addPasswordRequest(email, newPassword);
    setStep(4);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <Link to="/login" className="absolute top-8 left-8 flex items-center text-[#4B5563] hover:text-black transition-colors group z-20 text-sm font-medium">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Login
      </Link>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-fade-in">
        <div className="flex justify-center items-center mb-6">
          <div className="bg-[#F9FAFB] p-3 rounded-2xl border border-[#FECACA]">
            <ShieldAlert className="w-10 h-10 text-[#EF4444]" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold text-black tracking-tight">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-[#4B5563]">
          {step === 1 && "Enter your email to begin the reset process"}
          {step === 2 && "Security verification required"}
          {step === 3 && "Create a new secure password"}
          {step === 4 && "Waiting for Super Admin approval"}
          {step === 5 && "Password successfully reset!"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#F9FAFB] py-8 px-4 sm:px-10 border border-[#FECACA] rounded-lg shadow-xl relative overflow-hidden">
          
          {/* Step 1: Email */}
          {step === 1 && (
            <form className="space-y-5 animate-slide-up" onSubmit={handleEmailSubmit}>
              <div>
                <label className="block text-sm font-medium text-black">Admin Email address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#4B5563]" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 bg-[#FFFFFF] border border-[#FECACA] rounded-md py-2.5 text-black placeholder-[#4B5563] focus:outline-none focus:ring-1 focus:border-transparent transition-all sm:text-sm"
                    placeholder="admin@company.com"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={!email}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] disabled:opacity-50 transition-all"
              >
                Continue
              </button>
            </form>
          )}

          {/* Step 2: Security Verification */}
          {step === 2 && (
            <form className="space-y-5 animate-slide-up" onSubmit={handleSecuritySubmit}>
              {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-black flex items-center mb-2">
                  <ShieldQuestion className="w-4 h-4 mr-1 text-[#EF4444]" /> Security Question
                </label>
                <p className="text-sm font-medium text-[#4B5563] mb-3">What is the name of this monitoring platform?</p>
                <input
                  type="text"
                  required
                  value={securityAnswer}
                  onChange={(e) => { setSecurityAnswer(e.target.value); setError(''); }}
                  className="block w-full bg-[#FFFFFF] border border-[#FECACA] rounded-md py-2.5 px-3 text-black placeholder-[#4B5563] focus:outline-none focus:ring-1 focus:border-transparent transition-all sm:text-sm"
                  placeholder="Enter your answer (hint: redhelp)"
                />
              </div>
              <button
                type="submit"
                disabled={!securityAnswer}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] disabled:opacity-50 transition-all"
              >
                Verify Identity
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form className="space-y-5 animate-slide-up" onSubmit={handlePasswordSubmit}>
              {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-black">New Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#4B5563]" />
                  </div>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                    className="block w-full pl-10 bg-[#FFFFFF] border border-[#FECACA] rounded-md py-2.5 text-black placeholder-[#4B5563] focus:outline-none focus:ring-1 focus:border-transparent transition-all sm:text-sm"
                    placeholder="Enter at least 8 characters"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Confirm Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#4B5563]" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                    className="block w-full pl-10 bg-[#FFFFFF] border border-[#FECACA] rounded-md py-2.5 text-black placeholder-[#4B5563] focus:outline-none focus:ring-1 focus:border-transparent transition-all sm:text-sm"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={!newPassword || !confirmPassword}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] disabled:opacity-50 transition-all"
              >
                Submit Request
              </button>
            </form>
          )}

          {/* Step 4: Pending Approval */}
          {step === 4 && (
            <div className="text-center space-y-4 animate-fade-in py-4">
              <div className="flex justify-center mb-4">
                <Loader2 className="w-12 h-12 text-[#EF4444] animate-spin" />
              </div>
              <h3 className="text-lg font-bold text-black">Request Pending</h3>
              <p className="text-sm text-[#4B5563]">
                Your password reset request has been forwarded to the Super Admin. This page will automatically update once approved.
              </p>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="text-center space-y-4 animate-fade-in py-4">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-black">Password Updated</h3>
              <p className="text-sm text-[#4B5563]">
                Your password has been successfully reset. You can now login with your new credentials.
              </p>
              <Link to="/login" className="mt-4 w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-green-500 hover:bg-green-600 transition-all">
                Go to Login
              </Link>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
