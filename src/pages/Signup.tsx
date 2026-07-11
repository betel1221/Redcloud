import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Lock, Mail, Loader2, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      // Simulate backend registration call for the developer to replace
      await new Promise(resolve => setTimeout(resolve, 800));
      // For now, auto-login the user after signup simulation
      await login(email);
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
      setErrors({ submit: 'An error occurred during registration. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#DC2626] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <Link to="/" className="absolute top-8 left-8 flex items-center text-[#A1A1AA] hover:text-white transition-colors group z-20 text-sm font-medium">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-fade-in">
        <div className="flex justify-center items-center mb-6">
          <Link to="/" className="bg-[#B91C1C] p-3 rounded-2xl border border-[#F87171] hover:bg-[#991B1B] transition-colors cursor-pointer">
            <Activity className="w-10 h-10 text-white" />
          </Link>
        </div>
        <h2 className="text-center text-3xl font-bold text-white tracking-tight">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-[#A1A1AA]">
          Join Redhelp Operations Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-slide-up">
        <div className="bg-[#B91C1C] py-8 px-4 sm:px-10 border border-[#F87171] rounded-lg shadow-xl">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            
            {errors.submit && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-md">
                <p className="text-sm text-red-500 font-medium text-center">{errors.submit}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white">Full Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#A1A1AA]" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({...errors, name: ''}); }}
                  className={`block w-full pl-10 bg-[#DC2626] border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-[#F87171] focus:ring-white'} rounded-md py-2.5 text-white placeholder-[#A1A1AA] focus:outline-none focus:ring-1 focus:border-transparent transition-all sm:text-sm`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">Email address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#A1A1AA]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({...errors, email: ''}); }}
                  className={`block w-full pl-10 bg-[#DC2626] border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-[#F87171] focus:ring-white'} rounded-md py-2.5 text-white placeholder-[#A1A1AA] focus:outline-none focus:ring-1 focus:border-transparent transition-all sm:text-sm`}
                  placeholder="admin@company.com"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#A1A1AA]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({...errors, password: ''}); }}
                  className={`block w-full pl-10 bg-[#DC2626] border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-[#F87171] focus:ring-white'} rounded-md py-2.5 text-white placeholder-[#A1A1AA] focus:outline-none focus:ring-1 focus:border-transparent transition-all sm:text-sm`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">Confirm Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#A1A1AA]" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors({...errors, confirmPassword: ''}); }}
                  className={`block w-full pl-10 bg-[#DC2626] border ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-[#F87171] focus:ring-white'} rounded-md py-2.5 text-white placeholder-[#A1A1AA] focus:outline-none focus:ring-1 focus:border-transparent transition-all sm:text-sm`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.confirmPassword}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-[#DC2626] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-black" />
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-[#A1A1AA]">Already have an account? </span>
            <Link to="/login" className="font-medium text-white hover:underline transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
