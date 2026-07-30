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
    // Check local storage on mount
    const savedAuth = localStorage.getItem('eraop_auth');
    if (savedAuth) {
      const data = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUserEmail(data.email);
      setRole(data.role);
      setAvatar(data.avatar || null);
      setProfileComplete(data.profileComplete || false);
      setNeedsPasswordChange(data.needsPasswordChange || false);
    }
    
    const savedRequests = localStorage.getItem('eraop_password_requests');
    if (savedRequests) {
      setPasswordRequests(JSON.parse(savedRequests));
    }

    const savedUsers = localStorage.getItem('eraop_users');
    if (savedUsers) {
      const parsedUsers: UserAccount[] = JSON.parse(savedUsers);
      // Deduplicate by keeping the latest occurrence
      const uniqueUsers = parsedUsers.reduce((acc: UserAccount[], user) => {
        const existingIdx = acc.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
        if (existingIdx >= 0) {
          acc[existingIdx] = user;
        } else {
          acc.push(user);
        }
        return acc;
      }, []);
      setUsers(uniqueUsers);
    } else {
      setUsers([{ email: 'superadmin@company.com', role: 'superadmin', password: 'admin', needsPasswordChange: false }]);
    }
    
    // Fetch users from n8n
    const fetchUsers = async () => {
      try {
        const authUrl = import.meta.env.VITE_N8N_AUTH_URL || 'http://localhost:5678/webhook/erp-auth';
        const res = await fetch(authUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operation: 'list_users' })
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const fetchedUsers = data.map(u => ({
              email: u.email || u.user_email,
              role: u.role || 'admin',
              needsPasswordChange: u.needs_password_change || false
            }));
            if (fetchedUsers.length > 0) {
              setUsers(prev => {
                const combined = [...prev, ...fetchedUsers];
                const unique = combined.reduce((acc: UserAccount[], user) => {
                  const existingIdx = acc.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
                  if (existingIdx >= 0) {
                    acc[existingIdx] = user;
                  } else {
                    acc.push(user);
                  }
                  return acc;
                }, []);
                localStorage.setItem('eraop_users', JSON.stringify(unique));
                return unique;
              });
            }
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
      const res = await fetch(authUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'login', email, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          userRole = data.user.role || userRole;
          needsChange = !!data.user.needs_password_change;
          if (data.user.avatar) {
             setAvatar(data.user.avatar);
          }
          authSuccess = true;
        } else if (data.message) {
          // If the message is a default N8N message, it means it didn't hit the DB response node
          if (data.message === 'Workflow was started' || data.message === 'Webhook received') {
             throw new Error('Database connection failed. Ensure N8N workflow is Active.');
          }
          throw new Error(data.message);
        }
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

    const savedData = localStorage.getItem('eraop_auth');
    let isProfileComplete = false;
    let localAvatar = null;
    if (savedData) {
       const pd = JSON.parse(savedData);
       if (pd.email === email && pd.profileComplete) {
         isProfileComplete = true;
       }
       if (pd.email === email && pd.avatar) {
         localAvatar = pd.avatar;
       }
    }
    setProfileComplete(isProfileComplete);
    
    // If backend didn't provide avatar but localstorage has it, load it
    setAvatar(prev => {
       const newAvatar = prev || localAvatar;
       localStorage.setItem('eraop_auth', JSON.stringify({ email, role: userRole, avatar: newAvatar, profileComplete: isProfileComplete, needsPasswordChange: needsChange }));
       return newAvatar;
    });
  };

  const updateAvatar = async (base64Image: string) => {
    setAvatar(base64Image);
    const savedData = localStorage.getItem('eraop_auth');
    if (savedData) {
      const pd = JSON.parse(savedData);
      localStorage.setItem('eraop_auth', JSON.stringify({ ...pd, avatar: base64Image }));
    }
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
    if (userEmail && role) {
      localStorage.setItem('eraop_auth', JSON.stringify({ email: userEmail, role, profileComplete: true }));
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    setRole(null);
    setAvatar(null);
    setProfileComplete(false);
    setNeedsPasswordChange(false);
    localStorage.removeItem('eraop_auth');
  };

  const addUser = async (email: string, role: 'admin'|'superadmin', pass: string) => {
    // Sync with n8n backend PostgreSQL DB
    try {
      const authUrl = import.meta.env.VITE_N8N_AUTH_URL || 'http://localhost:5678/webhook/erp-auth';
      await fetch(authUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'create_user', email, role, password: pass })
      });
    } catch (err) {
      console.warn("n8n user creation webhook unreachable, writing to local storage state:", err);
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
    localStorage.setItem('eraop_users', JSON.stringify(newUsers));
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
      console.warn("n8n update_password webhook unreachable, writing to local storage state:", err);
    }

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
