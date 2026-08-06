import React, { useState, useEffect } from 'react';
import { Shield, Key, Search, FileText, CheckCircle, Loader2, UserCog, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AuditLog() {
  const { role, users, addUser, updateUserPassword } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [approvedCredentials, setApprovedCredentials] = useState(null);

  if (role !== 'superadmin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const authUrl = import.meta.env.VITE_N8N_AUTH_URL || 'http://localhost:5678/webhook/erp-auth';
        const res = await fetch(authUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operation: 'list_audit_logs' })
        });
        if (res.ok) {
          const data = await res.json();
          // Assuming n8n returns an array or an object with logs
          if (Array.isArray(data)) {
            setAuditLogs(data.map(d => ({
              id: d.id,
              action: d.action,
              user: d.user_email || d.user,
              time: d.timestamp ? new Date(d.timestamp).toLocaleString() : 'Just now',
              status: 'Success', // Mocking status since Postgres doesn't save it by default
              ip: d.ip_address || '127.0.0.1',
              browser: 'N/A'
            })));
          } else if (data.logs && Array.isArray(data.logs)) {
             setAuditLogs(data.logs.map((d:any) => ({
              id: d.id,
              action: d.action,
              user: d.user_email || d.user,
              time: d.timestamp ? new Date(d.timestamp).toLocaleString() : 'Just now',
              status: 'Success',
              ip: d.ip_address || '127.0.0.1',
              browser: 'N/A'
            })));
          }
        }
      } catch (e) {
        console.warn('Failed to fetch audit logs from n8n', e);
      }
    };
    fetchLogs();
  }, []);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [grandfatherName, setGrandfatherName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{email: string, password: string} | null>(null);
  
  // Password management state
  const [selectedUser, setSelectedUser] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  if (role !== 'superadmin') {
    return <Navigate to="/dashboard" replace />;
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newPassword) return;
    
    // Ensure the selected user actually exists
    const userExists = users.some(u => u.email.toLowerCase() === selectedUser.toLowerCase());
    if (!userExists) return;

    setIsUpdating(true);
    try {
      await updateUserPassword(selectedUser, newPassword);
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
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !grandfatherName || !employeeId) return;
    setIsCreating(true);
    try {
      const generatedEmail = `${firstName.toLowerCase().replace(/\s+/g, '')}.${lastName.toLowerCase().replace(/\s+/g, '')}@redcloud.com`;
      const randomPass = Math.random().toString(36).slice(-10);
      
      await addUser(generatedEmail, 'admin', randomPass);
      
      const log = {
        id: Date.now(),
        action: 'Admin Account Created',
        user: generatedEmail,
        time: 'Just now',
        status: 'Success',
        ip: '127.0.0.1',
        browser: 'Current Session'
      };
      setAuditLogs(prev => [log, ...prev]);
      
      // Close the creation modal, show the credentials popup
      setShowCreateModal(false);
      setCreatedCredentials({ email: generatedEmail, password: randomPass });
      
      // Reset form fields
      setFirstName('');
      setLastName('');
      setGrandfatherName('');
      setEmployeeId('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const isSelectedUserValid = users.some(u => u.email.toLowerCase() === selectedUser.toLowerCase());

  // Approve pending admin request
  const handleApprove = (reqId: number) => {
    const req = pendingRequests.find(r => r.id === reqId);
    if (!req) return;
    addUser(req.email, 'admin', req.password);
    // Log approval
    const log = {
      id: Date.now(),
      action: 'Admin Account Approved',
      user: req.email,
      time: 'Just now',
      status: 'Success',
      ip: '127.0.0.1',
      browser: 'Current Session'
    };
    setAuditLogs(prev => [log, ...prev]);
    // Remove from pending
    setPendingRequests(prev => prev.filter(r => r.id !== reqId));
  };

  // Reject pending admin request
  const handleReject = (reqId: number) => {
    const req = pendingRequests.find(r => r.id === reqId);
    if (!req) return;
    const log = {
      id: Date.now(),
      action: 'Admin Account Rejected',
      user: req.email,
      time: 'Just now',
      status: 'Failed',
      ip: '127.0.0.1',
      browser: 'Current Session'
    };
    setAuditLogs(prev => [log, ...prev]);
    setPendingRequests(prev => prev.filter(r => r.id !== reqId));
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

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-surface border border-border p-6 rounded-xl w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-textSecondary hover:text-textPrimary"
            >
              <Loader2 className="w-5 h-5 hidden" /> &times;
            </button>
            <h2 className="text-xl font-bold text-textPrimary mb-2 flex items-center">
              <UserCog className="w-5 h-5 mr-2 text-primary" /> Create Admin Account
            </h2>
            <p className="text-sm text-textSecondary mb-6">
              A secure temporary password will be auto-generated.
            </p>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-textPrimary">First Name</label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); setCreatedCredentials(null); }}
                  placeholder="e.g. Jane"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors" 
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-textPrimary">Last Name</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); setCreatedCredentials(null); }}
                  placeholder="e.g. Doe"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors" 
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-textPrimary">Grandfather Name</label>
                <input 
                  type="text" 
                  value={grandfatherName}
                  onChange={(e) => { setGrandfatherName(e.target.value); setCreatedCredentials(null); }}
                  placeholder="e.g. Smith"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors" 
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-textPrimary">Employee ID</label>
                <input 
                  type="text" 
                  value={employeeId}
                  onChange={(e) => { setEmployeeId(e.target.value); setCreatedCredentials(null); }}
                  placeholder="e.g. EMP-1042"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors" 
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={!firstName || !lastName || !grandfatherName || !employeeId || isCreating}
                className="w-full flex justify-center items-center py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 mt-4"
              >
                {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Force Password Reset Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 border-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <h2 className="text-lg font-bold text-textPrimary mb-4 flex items-center relative z-10">
              <UserCog className="w-5 h-5 mr-2 text-primary" /> Admin Password Reset
            </h2>
            <p className="text-sm text-textSecondary mb-6 relative z-10 bg-surface/50 p-3 rounded-lg border border-border/50">
              <strong className="text-textPrimary block mb-1">Policy:</strong>
              Standard users cannot change their passwords. Use this utility to assign a new temporary password and provide it to the user securely.
            </p>
            
            <form onSubmit={handlePasswordReset} className="space-y-4 relative z-10">
              <div className="space-y-1 relative">
                <label className="text-sm font-medium text-textPrimary">Search User Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-textSecondary" />
                  </div>
                  <input 
                    type="search"
                    list="users-list"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    placeholder="Type exact email..."
                    className="w-full bg-surface border border-border rounded-lg pl-9 pr-4 py-2.5 text-textPrimary focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                  <datalist id="users-list">
                    {users.map(u => (
                      <option key={u.email} value={u.email} />
                    ))}
                  </datalist>
                </div>
                {selectedUser && !isSelectedUserValid && (
                  <p className="text-xs text-danger mt-1">User not found</p>
                )}
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-textPrimary flex justify-between items-center">
                  <span>New Password</span>
                  <button 
                    type="button" 
                    disabled={!selectedUser || !isSelectedUserValid}
                    className="text-xs bg-primary/20 text-primary px-2 py-1 rounded hover:bg-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
                      let password = "";
                      for (let i = 0; i < 12; i++) {
                        password += chars.charAt(Math.floor(Math.random() * chars.length));
                      }
                      setNewPassword(password);
                    }}
                  >
                    Auto-generate
                  </button>
                </label>
                <div className="relative h-10 w-full bg-surface/50 border border-border rounded-lg flex items-center px-4 font-mono text-sm text-textSecondary">
                  {newPassword ? (
                    <span className="text-textPrimary">{newPassword}</span>
                  ) : (
                    <span>Click auto-generate...</span>
                  )}
                </div>
              </div>

              <button 
                type="submit"
                disabled={!selectedUser || !newPassword || isUpdating || !isSelectedUserValid}
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

          {/* Create Admin Panel Placeholder */}
          <div className="glass-panel p-6 border-primary/30 relative overflow-hidden flex flex-col justify-center items-center text-center h-[280px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            
            <div className="w-16 h-16 bg-primary/20 border border-primary/30 rounded-full flex items-center justify-center mb-4 relative z-10">
              <UserCog className="w-8 h-8 text-primary" />
            </div>
            
            <h2 className="text-lg font-bold text-textPrimary mb-2 relative z-10">
              Admin Provisioning
            </h2>
            <p className="text-sm text-textSecondary mb-6 relative z-10 max-w-[200px]">
              Provision new administrator accounts safely.
            </p>

            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm relative z-10"
            >
              Create New Admin
            </button>
          </div>

          {createdCredentials && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
              <div className="bg-surface border border-primary/30 p-8 rounded-xl w-full max-w-md shadow-2xl relative text-center">
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-success/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                
                <h2 className="text-xl font-bold text-textPrimary mb-2">Account Provisioned</h2>
                <p className="text-sm text-textSecondary mb-6">
                  The administrator account has been successfully created and recorded in the database.
                </p>
                
                <div className="bg-background border border-border p-4 rounded-lg space-y-4 text-left mb-6">
                  <div>
                    <p className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-1">Generated Email</p>
                    <code className="block bg-surfaceHover px-3 py-2 rounded border border-border text-primary font-mono select-all">
                      {createdCredentials.email}
                    </code>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-1">Temporary Password</p>
                    <code className="block bg-surfaceHover px-3 py-2 rounded border border-border text-primary font-mono select-all">
                      {createdCredentials.password}
                    </code>
                  </div>
                </div>
                
                <p className="text-xs text-warning mb-6">
                  ⚠️ Please copy these credentials and provide them to the user securely. The password will not be shown again.
                </p>

                <button 
                  onClick={() => setCreatedCredentials(null)}
                  className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  I've saved these credentials
                </button>
              </div>
            </div>
          )}
        </div>

        {/* System Audit Logs */}
        <div className="lg:col-span-2">
            {/* Pending Admin Approvals (Superadmin only) */}
            {role === 'superadmin' && pendingRequests.length > 0 && (
              <div className="glass-panel p-6 mb-6">
                <h2 className="text-lg font-bold text-textPrimary mb-4 flex items-center">
                  <UserCog className="w-4 h-4 mr-2" /> Pending Admin Approvals
                </h2>
                <ul className="space-y-3">
                  {pendingRequests.map(req => (
                      <li key={req.id} className="flex items-center justify-between bg-surfaceHover p-3 rounded">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {req.firstName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-textPrimary">{req.firstName} {req.lastName} ({req.email})</p>
                            <p className="text-xs text-textSecondary">Employee ID: {req.employeeId}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(req.id)}
                            className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 transition"
                          >Approve</button>
                          <button
                            onClick={() => handleReject(req.id)}
                            className="px-3 py-1 bg-danger text-white rounded hover:bg-danger/90 transition"
                          >Reject</button>
                        </div>
                      </li>
                  ))}
                </ul>
              </div>
            )}
          {/* User Accounts Table */}
          <div className="glass-panel p-6 mb-6">
            <h2 className="text-lg font-bold text-textPrimary mb-2 flex items-center">
              <UserCog className="w-5 h-5 mr-2 text-primary" /> Active User Accounts
            </h2>
            <p className="text-xs text-textSecondary mb-4">
              Registered administrators with database access.
            </p>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-textSecondary uppercase bg-surfaceHeader border-b border-border font-semibold">
                  <tr>
                    <th scope="col" className="px-4 py-3">Email Address</th>
                    <th scope="col" className="px-4 py-3">Role</th>
                    <th scope="col" className="px-4 py-3">Security Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => (
                    <tr key={user.email} className="hover:bg-surfaceHover/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-textPrimary font-mono text-xs">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'superadmin' 
                            ? 'bg-danger/10 text-danger border border-danger/20' 
                            : 'bg-primary/10 text-primary border border-primary/20'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.needsPasswordChange
                            ? 'bg-warning/10 text-warning border border-warning/20'
                            : 'bg-success/10 text-success border border-success/20'
                        }`}>
                          {user.needsPasswordChange ? 'Reset Required' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-panel p-6">
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
                            log.status === 'Success' ? 'bg-success/10 text-success' : log.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-danger/10 text-danger'
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
