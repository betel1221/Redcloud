import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  userEmail: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage on mount
    const savedAuth = localStorage.getItem('eraop_auth');
    if (savedAuth) {
      const data = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUserEmail(data.email);
    }
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsAuthenticated(true);
    setUserEmail(email);
    localStorage.setItem('eraop_auth', JSON.stringify({ email }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    localStorage.removeItem('eraop_auth');
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-textPrimary">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userEmail }}>
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
