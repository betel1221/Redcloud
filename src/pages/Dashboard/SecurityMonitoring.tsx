import React, { useMemo } from 'react';
import { ShieldAlert, UserX, UserCheck, Shield, Lock, AlertOctagon, TrendingUp, Search, CheckCircle } from 'lucide-react';
import PerformanceChart from '../../components/ui/PerformanceChart';

const securityEvents = [
  { time: '10:00', failed: 12, blocked: 4 },
  { time: '11:00', failed: 45, blocked: 15 },
  { time: '12:00', failed: 89, blocked: 34 },
  { time: '13:00', failed: 24, blocked: 8 },
  { time: '14:00', failed: 15, blocked: 2 },
  { time: '15:00', failed: 18, blocked: 5 },
];

export default function SecurityMonitoring() {
  const threatLevel = useMemo(() => {
    const totalBlocked = securityEvents.reduce((acc, curr) => acc + curr.blocked, 0);
    return totalBlocked > 50 ? 'ELEVATED' : 'NORMAL';
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center">
            <ShieldAlert className="w-6 h-6 mr-3 text-primary" />
            Security Monitoring
          </h1>
          <p className="text-textSecondary mt-1">Real-time threat detection and access logs.</p>
        </div>
        
        {threatLevel === 'ELEVATED' ? (
          <div className="bg-danger/20 border border-danger/50 text-danger px-4 py-2 rounded-lg font-bold flex items-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <AlertOctagon className="w-5 h-5 mr-2 animate-pulse" />
            Threat Level: ELEVATED
          </div>
        ) : (
          <div className="bg-success/20 border border-success/50 text-success px-4 py-2 rounded-lg font-bold flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Threat Level: NORMAL
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card flex flex-col justify-center p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-textSecondary">Failed Logins</h3>
            <UserX className="w-5 h-5 text-warning" />
          </div>
          <p className="text-2xl font-bold text-textPrimary">203</p>
          <p className="text-xs text-warning mt-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +14% vs yesterday</p>
        </div>
        
        <div className="glass-card flex flex-col justify-center p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-textSecondary">Successful Logins</h3>
            <UserCheck className="w-5 h-5 text-success" />
          </div>
          <p className="text-2xl font-bold text-textPrimary">1,492</p>
          <p className="text-xs text-success mt-1">Normal activity</p>
        </div>

        <div className="glass-card flex flex-col justify-center p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-textSecondary">Blocked IPs</h3>
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-textPrimary">68</p>
          <p className="text-xs text-textSecondary mt-1">Last 24 hours</p>
        </div>

        <div className="glass-card flex flex-col justify-center p-5 border-danger/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-danger/10 rounded-full blur-xl -mr-4 -mt-4"></div>
          <div className="flex justify-between items-start mb-2 relative z-10">
            <h3 className="text-sm font-medium text-textSecondary">Security Alerts</h3>
            <ShieldAlert className="w-5 h-5 text-danger" />
          </div>
          <p className="text-2xl font-bold text-danger relative z-10">11</p>
          <p className="text-xs text-danger mt-1 relative z-10">Requires immediate attention</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80">
          <PerformanceChart title="Authentication Activity & Performance" />
        </div>

        <div className="space-y-6 h-full flex flex-col">
          <div className="glass-panel p-6">
            <div className="flex items-center mb-4">
              <ShieldAlert className="w-5 h-5 text-danger mr-2" />
              <h2 className="text-sm font-bold text-textPrimary uppercase tracking-wider">Updates & Alerts</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 border border-border rounded-lg bg-surfaceHover/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-danger">Brute Force Attack</span>
                  <span className="text-[10px] text-textSecondary">5m ago</span>
                </div>
                <p className="text-xs text-textSecondary">Multiple failed logins from 192.168.10.25 blocked.</p>
              </div>
              <div className="p-3 border border-border rounded-lg bg-surfaceHover/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-warning">New CVE</span>
                  <span className="text-[10px] text-textSecondary">1h ago</span>
                </div>
                <p className="text-xs text-textSecondary">Vulnerability detected in openssl package.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
