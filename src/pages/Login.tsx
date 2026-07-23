import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Lock, Mail, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      // Backend integration happens here
      await login(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      setErrors({ submit: error.message || 'Invalid email or password' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <Link to="/" className="absolute top-8 left-8 flex items-center text-textSecondary hover:text-textPrimary transition-colors group z-20 text-sm font-medium">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-fade-in">
        <div className="flex justify-center items-center mb-6">
          <Link to="/" className="bg-surface p-3 rounded-2xl border border-border hover:bg-surfaceHover transition-colors cursor-pointer">
            <Activity className="w-10 h-10 text-primary" />
          </Link>
        </div>
        <div className="mb-8 text-center relative z-10">
          <h1 className="text-3xl font-extrabold text-textPrimary tracking-tight mb-2">
            Log in to Redhelp
          </h1>
          <p className="mt-2 text-center text-sm text-textSecondary">
            Welcome back to the Operations Platform
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-slide-up">
        <div className="bg-surface py-8 px-4 sm:px-10 border border-border rounded-lg shadow-xl">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            
            {errors.submit && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-md">
                <p className="text-sm text-red-500 font-medium text-center">{errors.submit}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-textPrimary">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-textSecondary" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({...errors, email: ''}); }}
                  className={`block w-full pl-10 bg-background border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-primary'} rounded-md py-2.5 text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-1 focus:border-transparent transition-all sm:text-sm`}
                  placeholder="admin@company.com"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-textPrimary">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-textSecondary" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({...errors, password: ''}); }}
                  className={`block w-full pl-10 pr-10 bg-background border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-primary'} rounded-md py-2.5 text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-1 focus:border-transparent transition-all sm:text-sm`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-textSecondary hover:text-textPrimary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 bg-background border-border rounded text-primary focus:ring-primary focus:ring-offset-background accent-primary"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-textSecondary">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-textPrimary hover:underline transition-colors">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Authenticating...</>
                ) : (
                  'Log In'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
