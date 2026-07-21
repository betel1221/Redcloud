import React, { useState } from 'react';
import { Shield, Key, Search, FileText, CheckCircle, Loader2, UserCog, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const mockAuditLogs = [
  { id: 1, action: 'Password Changed', user: 'admin@company.com', time: '10 mins ago', status: 'Success' },
  { id: 2, action: 'Login Attempt', user: 'unknown', time: '25 mins ago', status: 'Failed' },
  { id: 3, action: 'Server Restarted', user: 'admin@company.com', time: '1 hour ago', status: 'Success' },
  { id: 4, action: 'Database Backup', user: 'system', time: '5 hours ago', status: 'Success' },
  { id: 5, action: 'Role Updated', user: 'superadmin@company.com', time: '1 day ago', status: 'Success' },
];

const mockUsers = [
  { id: 1, email: 'admin@company.com', role: 'admin', status: 'Active' },
  { id: 2, email: 'tech@company.com', role: 'admin', status: 'Active' },
  { id: 3, email: 'guest@company.com', role: 'viewer', status: 'Inactive' },
];

export default function AuditLog() {
  const { role } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
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
      setIsUpdating(false);
      setUpdateSuccess(true);
      setNewPassword('');
      setTimeout(() => setUpdateSuccess(false), 3000);
    }, 1500);
  };

  const filteredLogs = mockAuditLogs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  {mockUsers.filter(u => u.role !== 'superadmin').map(user => (
                    <option key={user.id} value={user.email}>{user.email}</option>
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
        </div>

        {/* System Audit Logs */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-6 h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
              <h2 className="text-lg font-bold text-textPrimary flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" /> Activity Audit Logs
              </h2>
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-textSecondary" />
                </div>
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-surface text-sm text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-textSecondary uppercase bg-surfaceHover border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-surfaceHover/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-textPrimary">{log.action}</td>
                        <td className="px-6 py-4 text-textSecondary">{log.user}</td>
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
