import React, { useState } from 'react';
import { Shield, Key, Search, FileText, CheckCircle, Loader2, UserCog, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const mockAuditLogs = [
  { id: 1, action: 'Password Changed', user: 'admin@company.com', time: '10 mins ago', status: 'Success', ip: '192.168.1.5', browser: 'Chrome / Windows' },
  { id: 2, action: 'Login Attempt', user: 'unknown', time: '25 mins ago', status: 'Failed', ip: '203.0.113.45', browser: 'Firefox / Linux' },
  { id: 3, action: 'Server Restarted', user: 'admin@company.com', time: '1 hour ago', status: 'Success', ip: '192.168.1.5', browser: 'Chrome / Windows' },
  { id: 4, action: 'Database Backup', user: 'system', time: '5 hours ago', status: 'Success', ip: 'Internal', browser: 'Cron' },
  { id: 5, action: 'Role Updated', user: 'superadmin@company.com', time: '1 day ago', status: 'Success', ip: '10.0.0.2', browser: 'Safari / macOS' },
];

export default function AuditLog() {
  const { role, users, addUser, updateUserPassword } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [auditLogs, setAuditLogs] = useState(mockAuditLogs);
  
  // Create Admin state
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createdPassword, setCreatedPassword] = useState('');
  
  // Password management state
  const [selectedUser, setSelectedUser] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  if (role !== 'superadmin') {
    return <Navigate to="/dashboard" replace />;
  }

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newPassword) return;
    
    setIsUpdating(true);
    setTimeout(() => {
      updateUserPassword(selectedUser, newPassword);
      setIsUpdating(false);
      setUpdateSuccess(true);
      
      const newLog = {
        id: Date.now(),
        action: 'Password Forced Reset',
        user: selectedUser,
        time: 'Just now',
        status: 'Success',
        ip: '127.0.0.1',
        browser: 'Current Session'
      };
      setAuditLogs(prev => [newLog, ...prev]);

      setNewPassword('');
      setTimeout(() => setUpdateSuccess(false), 3000);
    }, 1500);
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;

    setIsCreating(true);
    // Generate random 10 character password
    const randomPass = Math.random().toString(36).slice(-10);
    
    setTimeout(() => {
      addUser(newAdminEmail, 'admin', randomPass);
      setCreatedPassword(randomPass);
      setIsCreating(false);
      
      const newLog = {
        id: Date.now(),
        action: 'Admin Account Created',
        user: newAdminEmail,
        time: 'Just now',
        status: 'Success',
        ip: '127.0.0.1',
        browser: 'Current Session'
      };
      setAuditLogs(prev => [newLog, ...prev]);

      setNewAdminEmail('');
    }, 1000);
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.ip.includes(searchTerm);
    const matchesAction = actionFilter === 'All' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const uniqueActions = ['All', ...Array.from(new Set(auditLogs.map(l => l.action)))];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center">
            <Shield className="w-6 h-6 mr-3 text-primary" />
            Audit & User Management
          </h1>
          <p className="text-textSecondary mt-1">Superadmin console for privacy logs and user credential management.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Force Password Reset Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 border-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <h2 className="text-lg font-bold text-textPrimary mb-4 flex items-center relative z-10">
              <UserCog className="w-5 h-5 mr-2 text-primary" /> Admin Password Reset
            </h2>
            <p className="text-sm text-textSecondary mb-6 relative z-10">
              Directly reset an admin's password if they are locked out. You do not need their current password.
            </p>
            
            <form onSubmit={handlePasswordReset} className="space-y-4 relative z-10">
              <div className="space-y-1">
                <label className="text-sm font-medium text-textPrimary">Select User</label>
                <select 
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">-- Choose User --</option>
                  {users.filter(u => u.role !== 'superadmin').map(user => (
                    <option key={user.email} value={user.email}>{user.email}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-textPrimary">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors" 
                />
              </div>

              <button 
                type="submit"
                disabled={!selectedUser || !newPassword || isUpdating}
                className="w-full flex justify-center items-center py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Force Reset Password'}
              </button>
              
              {updateSuccess && (
                <div className="mt-3 p-3 bg-success/10 border border-success/30 rounded-lg flex items-center text-success text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Password successfully updated.
                </div>
              )}
            </form>
          </div>

          {/* Create Admin Panel */}
          <div className="glass-panel p-6 border-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <h2 className="text-lg font-bold text-textPrimary mb-4 flex items-center relative z-10">
              <UserCog className="w-5 h-5 mr-2 text-primary" /> Create Admin Account
            </h2>
            <p className="text-sm text-textSecondary mb-6 relative z-10">
              Create a new administrator account. A secure temporary password will be generated for them.
            </p>

            <form onSubmit={handleCreateAdmin} className="space-y-4 relative z-10">
              <div className="space-y-1">
                <label className="text-sm font-medium text-textPrimary">Email Address</label>
                <input 
                  type="email" 
                  value={newAdminEmail}
                  onChange={(e) => { setNewAdminEmail(e.target.value); setCreatedPassword(''); }}
                  placeholder="newadmin@company.com"
                  className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors" 
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={!newAdminEmail || isCreating}
                className="w-full flex justify-center items-center py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account & Generate Password'}
              </button>

              {createdPassword && (
                <div className="mt-4 p-4 bg-surfaceHover border border-primary/30 rounded-lg">
                  <p className="text-sm font-medium text-textSecondary mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 text-success mr-2" /> Account Created
                  </p>
                  <p className="text-xs text-textSecondary mb-1">Temporary Password:</p>
                  <div className="flex items-center justify-between bg-background border border-border rounded p-2">
                    <code className="text-primary font-mono text-lg">{createdPassword}</code>
                  </div>
                  <p className="text-xs text-warning mt-2 italic">
                    Please provide this password to the new admin securely. They will be forced to change it upon first login.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* System Audit Logs */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-6 h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
              <h2 className="text-lg font-bold text-textPrimary flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" /> Activity Audit Logs
              </h2>
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <div className="relative w-full md:w-48">
                  <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    className="block w-full bg-surface border border-border text-sm text-textPrimary py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-all"
                  >
                    {uniqueActions.map(action => (
                      <option key={action} value={action}>{action === 'All' ? 'All Actions' : action}</option>
                    ))}
                  </select>
                </div>
                <div className="relative w-full md:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-textSecondary" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search user, action, or IP..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-surface text-sm text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-textSecondary uppercase bg-surfaceHover border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">User Info</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-surfaceHover/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-textPrimary">{log.action}</td>
                        <td className="px-6 py-4">
                          <p className="text-textPrimary font-medium">{log.user}</p>
                          <p className="text-xs text-textSecondary mt-0.5">IP: {log.ip} &bull; {log.browser}</p>
                        </td>
                        <td className="px-6 py-4 text-textSecondary flex items-center">
                          <Clock className="w-3 h-3 mr-1" /> {log.time}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${
                            log.status === 'Success' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-textSecondary">
                        No logs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
