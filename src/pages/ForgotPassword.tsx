import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { addPasswordRequest } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      addPasswordRequest(email);
      setSubmitted(true);
    }
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
          Request a password reset from the Super Administrator
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-slide-up">
        <div className="bg-[#F9FAFB] py-8 px-4 sm:px-10 border border-[#FECACA] rounded-lg shadow-xl">
          
          {submitted ? (
            <div className="text-center space-y-4 animate-fade-in">
              <div className="flex justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-black">Request Sent</h3>
              <p className="text-sm text-[#4B5563]">
                Your password reset request has been forwarded to the Super Administrator. You will be notified once it is approved.
              </p>
              <Link to="/login" className="mt-4 inline-block font-medium text-black hover:underline transition-colors">
                Return to Login
              </Link>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black">
                  Admin Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#4B5563]" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 bg-[#FFFFFF] border border-[#FECACA] rounded-md py-2.5 text-black placeholder-[#4B5563] focus:outline-none focus:ring-1 focus:border-transparent transition-all sm:text-sm"
                    placeholder="admin@company.com"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!email}
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EF4444] focus:ring-offset-[#FFFFFF] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Reset Request
                </button>
              </div>
            </form>
          )}
          
        </div>
      </div>
    </div>
  );
}
