import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserAccount {
  email: string;
  role: 'admin' | 'superadmin';
  password?: string;
  needsPasswordChange?: boolean;
}

export interface PasswordRequest {
  email: string;
  newPassword?: string;
  status: 'pending' | 'approved';
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  userEmail: string | null;
  role: 'admin' | 'superadmin' | null;
  needsPasswordChange: boolean;
  setNeedsPasswordChange: (val: boolean) => void;
  passwordRequests: PasswordRequest[];
  addPasswordRequest: (email: string, newPassword?: string) => void;
  approvePasswordRequest: (email: string) => void;
  profileComplete: boolean;
  completeProfile: () => void;
  users: UserAccount[];
  addUser: (email: string, role: 'admin'|'superadmin', pass: string) => void;
  updateUserPassword: (email: string, newPass: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [role, setRole] = useState<'admin' | 'superadmin' | null>(null);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const [passwordRequests, setPasswordRequests] = useState<PasswordRequest[]>([]);
  const [profileComplete, setProfileComplete] = useState<boolean>(false);
  const [users, setUsers] = useState<UserAccount[]>([
    { email: 'superadmin@company.com', role: 'superadmin', password: 'admin', needsPasswordChange: false }
  ]);
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
      setNeedsPasswordChange(data.needsPasswordChange || false);
    }
    
    const savedRequests = localStorage.getItem('eraop_password_requests');
    if (savedRequests) {
      setPasswordRequests(JSON.parse(savedRequests));
    }

    const savedUsers = localStorage.getItem('eraop_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      localStorage.setItem('eraop_users', JSON.stringify([{ email: 'superadmin@company.com', role: 'superadmin', password: 'admin', needsPasswordChange: false }]));
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Quick bypass for dev
    let userRole: 'admin'|'superadmin' = (email === 'superadmin@company.com') ? 'superadmin' : 'admin';
    let needsChange = false;

    // Check mock users DB if not superadmin
    if (email !== 'superadmin@company.com') {
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        if (password && existingUser.password && existingUser.password !== password) {
          throw new Error('Invalid credentials');
        }
        userRole = existingUser.role;
        needsChange = existingUser.needsPasswordChange || false;
      } else {
        throw new Error('User not found. Ask Superadmin to create your account.');
      }
    }
    
    setIsAuthenticated(true);
    setUserEmail(email);
    setRole(userRole);
    setNeedsPasswordChange(needsChange);

    const savedData = localStorage.getItem('eraop_auth');
    let isProfileComplete = false;
    if (savedData) {
       const pd = JSON.parse(savedData);
       if (pd.email === email && pd.profileComplete) {
         isProfileComplete = true;
       }
    }
    setProfileComplete(isProfileComplete);
    
    localStorage.setItem('eraop_auth', JSON.stringify({ email, role: userRole, profileComplete: isProfileComplete, needsPasswordChange: needsChange }));
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
    setNeedsPasswordChange(false);
    localStorage.removeItem('eraop_auth');
  };

  const addUser = (email: string, role: 'admin'|'superadmin', pass: string) => {
    const newUsers = [...users, { email, role, password: pass, needsPasswordChange: true }];
    setUsers(newUsers);
    localStorage.setItem('eraop_users', JSON.stringify(newUsers));
  };

  const updateUserPassword = (email: string, newPass: string) => {
    const newUsers = users.map(u => 
      u.email === email ? { ...u, password: newPass, needsPasswordChange: false } : u
    );
    setUsers(newUsers);
    localStorage.setItem('eraop_users', JSON.stringify(newUsers));
    if (userEmail === email) {
      setNeedsPasswordChange(false);
      const saved = JSON.parse(localStorage.getItem('eraop_auth') || '{}');
      localStorage.setItem('eraop_auth', JSON.stringify({ ...saved, needsPasswordChange: false }));
    }
  };

  const addPasswordRequest = (email: string, newPassword?: string) => {
    const newRequests = [...passwordRequests.filter(r => r.email !== email), { email, newPassword, status: 'pending' as const }];
    setPasswordRequests(newRequests);
    localStorage.setItem('eraop_password_requests', JSON.stringify(newRequests));
  };

  const approvePasswordRequest = (email: string) => {
    // Approve it, then apply the password change
    const request = passwordRequests.find(r => r.email === email);
    if (request && request.newPassword) {
      updateUserPassword(email, request.newPassword);
    }
    const newRequests = passwordRequests.map(r => r.email === email ? { ...r, status: 'approved' as const } : r);
    setPasswordRequests(newRequests);
    localStorage.setItem('eraop_password_requests', JSON.stringify(newRequests));
    
    // Auto cleanup after a minute
    setTimeout(() => {
      const cleanReqs = JSON.parse(localStorage.getItem('eraop_password_requests') || '[]');
      const filtered = cleanReqs.filter((r: PasswordRequest) => r.email !== email);
      setPasswordRequests(filtered);
      localStorage.setItem('eraop_password_requests', JSON.stringify(filtered));
    }, 60000);
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-textPrimary">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, login, logout, userEmail, role, 
      needsPasswordChange, setNeedsPasswordChange,
      passwordRequests, addPasswordRequest, approvePasswordRequest,
      profileComplete, completeProfile,
      users, addUser, updateUserPassword
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
