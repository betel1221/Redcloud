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
  login: (email: string, password?: string, telegramChatId?: string) => Promise<void>;
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
    throw err;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Load initial values from localStorage if available and not expired
  const getInitialState = () => {
    const isAuth = localStorage.getItem('auth_isAuthenticated') === 'true';
    const timestampStr = localStorage.getItem('auth_timestamp');
    if (!isAuth || !timestampStr) {
      return { isAuth: false, email: null, role: null, avatar: null, complete: false, change: false };
    }
    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;
    
    if (now - timestamp > tenMinutes) {
      // Session expired
      localStorage.clear();
      return { isAuth: false, email: null, role: null, avatar: null, complete: false, change: false };
    }
    
    // Refresh timestamp
    localStorage.setItem('auth_timestamp', now.toString());
    return {
      isAuth: true,
      email: localStorage.getItem('auth_userEmail'),
      role: localStorage.getItem('auth_role') as 'admin' | 'superadmin',
      avatar: localStorage.getItem('auth_avatar'),
      complete: localStorage.getItem('auth_profileComplete') === 'true',
      change: localStorage.getItem('auth_needsPasswordChange') === 'true'
    };
  };

  const initialState = getInitialState();

  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuth);
  const [userEmail, setUserEmail] = useState<string | null>(initialState.email);
  const [role, setRole] = useState<'admin' | 'superadmin' | null>(initialState.role);
  const [avatar, setAvatar] = useState<string | null>(initialState.avatar);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(initialState.change);
  const [passwordRequests, setPasswordRequests] = useState<PasswordRequest[]>([]);
  const [profileComplete, setProfileComplete] = useState<boolean>(initialState.complete);
  const [users, setUsers] = useState<UserAccount[]>([
    { email: 'superadmin@company.com', role: 'superadmin', password: 'admin', needsPasswordChange: false }
  ]);
  const [loading, setLoading] = useState(true);

  // Monitor user activity and handle 10-minute session expiry
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Check every 10 seconds if session has expired
    const interval = setInterval(() => {
      const timestampStr = localStorage.getItem('auth_timestamp');
      if (timestampStr) {
        const timestamp = parseInt(timestampStr, 10);
        const now = Date.now();
        const tenMinutes = 10 * 60 * 1000;
        if (now - timestamp > tenMinutes) {
          logout();
        }
      } else {
        logout();
      }
    }, 10000);
    
    // Refresh the 10-minute session timer whenever the user interacts with the app
    const handleActivity = () => {
      localStorage.setItem('auth_timestamp', Date.now().toString());
    };
    
    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('mousemove', handleActivity);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('mousemove', handleActivity);
    };
  }, [isAuthenticated]);

  // Check URL or sessionStorage for telegram_chat_id and register it if authenticated
  useEffect(() => {
    // If not authenticated yet but parameter is in URL, cache it immediately so it survives redirects!
    const urlParams = new URLSearchParams(window.location.search);
    const urlChatId = urlParams.get('telegram_chat_id');
    if (urlChatId) {
      sessionStorage.setItem('telegram_chat_id', urlChatId);
    }

    if (isAuthenticated && userEmail) {
      const telegramChatId = urlChatId || sessionStorage.getItem('telegram_chat_id');
      if (telegramChatId) {
        const chatHistoryUrl = import.meta.env.VITE_N8N_CHAT_HISTORY_URL || 'http://localhost:5678/webhook/chat-history';
        fetch(chatHistoryUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            operation: 'register_telegram',
            email: userEmail,
            telegram_chat_id: telegramChatId
          })
        })
          .then(res => {
            if (res.ok) {
              console.log("Registered Telegram Chat ID successfully!");
              sessionStorage.removeItem('telegram_chat_id');
              const newUrl = window.location.pathname;
              window.history.replaceState({}, document.title, newUrl);
            }
          })
          .catch(e => console.warn("Failed to register Telegram Chat ID:", e));
      }
    }
  }, [isAuthenticated, userEmail]);

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

  const login = async (email: string, password?: string, telegramChatId?: string) => {
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
        body: JSON.stringify({
          operation: 'login',
          body: { email, password }
        })
      });
      if (data.success && data.user) {
        userRole = data.user.role || userRole;
        needsChange = !!data.user.needs_password_change;
        if (data.user.avatar) {
           setAvatar(data.user.avatar);
           localStorage.setItem('auth_avatar', data.user.avatar);
        } else {
           setAvatar(null);
           localStorage.removeItem('auth_avatar');
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

    // Store in localStorage
    localStorage.setItem('auth_isAuthenticated', 'true');
    localStorage.setItem('auth_userEmail', email);
    localStorage.setItem('auth_role', userRole);
    localStorage.setItem('auth_profileComplete', 'false');
    localStorage.setItem('auth_needsPasswordChange', needsChange ? 'true' : 'false');
    localStorage.setItem('auth_timestamp', Date.now().toString());

    if (telegramChatId) {
      const chatHistoryUrl = import.meta.env.VITE_N8N_CHAT_HISTORY_URL || 'http://localhost:5678/webhook/chat-history';
      fetch(chatHistoryUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'register_telegram',
          email: email,
          telegram_chat_id: telegramChatId
        })
      })
        .then(res => {
          if (res.ok) {
            console.log("Registered Telegram Chat ID successfully on login!");
          }
        })
        .catch(e => console.warn("Failed to register Telegram Chat ID on login:", e));
    }
  };

  const updateAvatar = async (base64Image: string) => {
    setAvatar(base64Image);
    localStorage.setItem('auth_avatar', base64Image);
    if (userEmail) {
      try {
        const authUrl = import.meta.env.VITE_N8N_AUTH_URL || 'http://localhost:5678/webhook/erp-auth';
        await fetch(authUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            operation: 'update_avatar',
            body: { email: userEmail, avatar: base64Image }
          })
        });
      } catch (err) {
        console.warn("Failed to sync avatar to backend", err);
      }
    }
  };

  const completeProfile = () => {
    setProfileComplete(true);
    localStorage.setItem('auth_profileComplete', 'true');
  };

  const logout = () => {
    localStorage.removeItem('auth_isAuthenticated');
    localStorage.removeItem('auth_userEmail');
    localStorage.removeItem('auth_role');
    localStorage.removeItem('auth_avatar');
    localStorage.removeItem('auth_profileComplete');
    localStorage.removeItem('auth_needsPasswordChange');
    localStorage.removeItem('auth_timestamp');
    
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
        body: JSON.stringify({
          operation: 'update_password',
          body: { email, password: newPass }
        })
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
