import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  userEmail: string | null;
  role: 'admin' | 'superadmin' | null;
  passwordRequests: string[];
  addPasswordRequest: (email: string) => void;
  approvePasswordRequest: (email: string) => void;
  profileComplete: boolean;
  completeProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [role, setRole] = useState<'admin' | 'superadmin' | null>(null);
  const [passwordRequests, setPasswordRequests] = useState<string[]>([]);
  const [profileComplete, setProfileComplete] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage on mount
    const savedAuth = localStorage.getItem('eraop_auth');
    if (savedAuth) {
      const data = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUserEmail(data.email);
      setRole(data.role);
      setProfileComplete(data.profileComplete || false);
    }
    
    const savedRequests = localStorage.getItem('eraop_password_requests');
    if (savedRequests) {
      setPasswordRequests(JSON.parse(savedRequests));
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const userRole = (email === 'superadmin@company.com') ? 'superadmin' : 'admin';
    
    setIsAuthenticated(true);
    setUserEmail(email);
    setRole(userRole);
    // Fetch profile status from storage or mock it as false initially
    const savedData = localStorage.getItem('eraop_auth');
    let isProfileComplete = false;
    if (savedData) {
       const pd = JSON.parse(savedData);
       if (pd.email === email && pd.profileComplete) {
         isProfileComplete = true;
       }
    }
    setProfileComplete(isProfileComplete);
    
    localStorage.setItem('eraop_auth', JSON.stringify({ email, role: userRole, profileComplete: isProfileComplete }));
  };

  const completeProfile = () => {
    setProfileComplete(true);
    if (userEmail && role) {
      localStorage.setItem('eraop_auth', JSON.stringify({ email: userEmail, role, profileComplete: true }));
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    setRole(null);
    setProfileComplete(false);
    localStorage.removeItem('eraop_auth');
  };

  const addPasswordRequest = (email: string) => {
    const newRequests = [...passwordRequests, email];
    setPasswordRequests(newRequests);
    localStorage.setItem('eraop_password_requests', JSON.stringify(newRequests));
  };

  const approvePasswordRequest = (email: string) => {
    const newRequests = passwordRequests.filter(e => e !== email);
    setPasswordRequests(newRequests);
    localStorage.setItem('eraop_password_requests', JSON.stringify(newRequests));
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-textPrimary">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, login, logout, userEmail, role, 
      passwordRequests, addPasswordRequest, approvePasswordRequest,
      profileComplete, completeProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
