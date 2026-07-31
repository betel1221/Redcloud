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
  avatar: string | null;
  updateAvatar: (base64Image: string) => Promise<void>;
  needsPasswordChange: boolean;
  setNeedsPasswordChange: (val: boolean) => void;
  passwordRequests: PasswordRequest[];
  addPasswordRequest: (email: string, newPassword?: string) => void;
  approvePasswordRequest: (email: string) => void;
  profileComplete: boolean;
  completeProfile: () => void;
  users: UserAccount[];
  addUser: (email: string, role: 'admin'|'superadmin', pass: string) => Promise<void>;
  updateUserPassword: (email: string, newPass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const safeFetchJson = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);
  
  // Read as text first to avoid 'Unexpected end of JSON input' crash
  const text = await response.text();
  
  if (!text) {
    throw new Error('n8n returned an empty response. Check if your N8N workflow is Active and database is reachable.');
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error('Invalid JSON response from n8n:', text);
    throw new Error(`Server returned invalid JSON: ${text.substring(0, 100)}`);
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [role, setRole] = useState<'admin' | 'superadmin' | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const [passwordRequests, setPasswordRequests] = useState<PasswordRequest[]>([]);
  const [profileComplete, setProfileComplete] = useState<boolean>(false);
  const [users, setUsers] = useState<UserAccount[]>([
    { email: 'superadmin@company.com', role: 'superadmin', password: 'admin', needsPasswordChange: false }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch users from n8n on mount (strictly in-memory, no localStorage checks)
    const fetchUsers = async () => {
      try {
        const authUrl = import.meta.env.VITE_N8N_AUTH_URL || 'http://localhost:5678/webhook/erp-auth';
        const data = await safeFetchJson(authUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operation: 'list_users' })
        });
        if (Array.isArray(data)) {
          const fetchedUsers = data.map(u => ({
            email: u.email || u.user_email,
            role: u.role || 'admin',
            needsPasswordChange: u.needs_password_change || false
          }));
          if (fetchedUsers.length > 0) {
            setUsers(prev => {
              const combined = [...prev, ...fetchedUsers];
              return combined.reduce((acc: UserAccount[], user) => {
                const existingIdx = acc.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
                if (existingIdx >= 0) {
                  acc[existingIdx] = user;
                } else {
                  acc.push(user);
                }
                return acc;
              }, []);
            });
          }
        }
      } catch (e) {
        console.warn('Failed to fetch users from n8n', e);
      }
    };
    fetchUsers();
    setLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    let userRole: 'admin' | 'superadmin' = (email === 'superadmin@company.com') ? 'superadmin' : 'admin';
    let needsChange = false;
    let authSuccess = false;

    // Try n8n backend PostgreSQL Auth Webhook
    try {
      const authUrl = import.meta.env.VITE_N8N_AUTH_URL || 'http://localhost:5678/webhook/erp-auth';
      const data = await safeFetchJson(authUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'login', email, password })
      });
      if (data.success && data.user) {
        userRole = data.user.role || userRole;
        needsChange = !!data.user.needs_password_change;
        if (data.user.avatar) {
           setAvatar(data.user.avatar);
        }
        authSuccess = true;
      } else if (data.message) {
        if (data.message === 'Workflow was started' || data.message === 'Webhook received') {
           throw new Error('Database connection failed. Ensure N8N workflow is Active.');
        }
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error("Authentication failed:", err);
      throw new Error(err.message || 'Authentication service unreachable.');
    }

    if (!authSuccess) {
       throw new Error('Authentication failed.');
    }
    
    setIsAuthenticated(true);
    setUserEmail(email);
    setRole(userRole);
    setNeedsPasswordChange(needsChange);
    setProfileComplete(false); // default profileComplete to false in-memory
  };

  const updateAvatar = async (base64Image: string) => {
    setAvatar(base64Image);
    if (userEmail) {
      try {
        const authUrl = import.meta.env.VITE_N8N_AUTH_URL || 'http://localhost:5678/webhook/erp-auth';
        await fetch(authUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operation: 'update_avatar', email: userEmail, avatar: base64Image })
        });
      } catch (err) {
        console.warn("Failed to sync avatar to backend", err);
      }
    }
  };

  const completeProfile = () => {
    setProfileComplete(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    setRole(null);
    setAvatar(null);
    setProfileComplete(false);
    setNeedsPasswordChange(false);
  };

  const addUser = async (email: string, role: 'admin'|'superadmin', pass: string) => {
    try {
      const authUrl = import.meta.env.VITE_N8N_AUTH_URL || 'http://localhost:5678/webhook/erp-auth';
      await fetch(authUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'create_user', email, role, password: pass })
      });
    } catch (err) {
      console.warn("n8n user creation webhook unreachable", err);
    }

    let newUsers: UserAccount[];
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingIndex >= 0) {
      newUsers = [...users];
      newUsers[existingIndex] = { ...newUsers[existingIndex], role, password: pass, needsPasswordChange: true };
    } else {
      newUsers = [...users, { email, role, password: pass, needsPasswordChange: true }];
    }
    
    setUsers(newUsers);
  };

  const updateUserPassword = async (email: string, newPass: string) => {
    try {
      const authUrl = import.meta.env.VITE_N8N_AUTH_URL || 'http://localhost:5678/webhook/erp-auth';
      await fetch(authUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'update_password', email, password: newPass })
      });
    } catch (err) {
      console.warn("n8n update_password webhook unreachable", err);
    }

    const newUsers = users.map(u => 
      u.email === email ? { ...u, password: newPass, needsPasswordChange: false } : u
    );
    setUsers(newUsers);
    if (userEmail === email) {
      setNeedsPasswordChange(false);
    }
  };

  const addPasswordRequest = (email: string, newPassword?: string) => {
    const newRequests = [...passwordRequests.filter(r => r.email !== email), { email, newPassword, status: 'pending' as const }];
    setPasswordRequests(newRequests);
  };

  const approvePasswordRequest = (email: string) => {
    const request = passwordRequests.find(r => r.email === email);
    if (request && request.newPassword) {
      updateUserPassword(email, request.newPassword);
    }
    const newRequests = passwordRequests.map(r => r.email === email ? { ...r, status: 'approved' as const } : r);
    setPasswordRequests(newRequests);
    
    // Auto cleanup after a minute in memory
    setTimeout(() => {
      setPasswordRequests(prev => prev.filter(r => r.email !== email));
    }, 60000);
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-textPrimary">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, login, logout, userEmail, role, avatar, updateAvatar,
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
