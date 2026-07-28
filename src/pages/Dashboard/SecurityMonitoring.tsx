import React, { useState, useEffect } from 'react';
import { ShieldAlert, UserX, UserCheck, Lock, AlertOctagon, TrendingUp, CheckCircle, Loader2, Shield, Activity } from 'lucide-react';
import PerformanceChart from '../../components/ui/PerformanceChart';
import { fetchSecurityTelemetry } from '../../api/dashboard';

export default function SecurityMonitoring() {
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    failed_logins: 0,
    successful_logins: 0,
    blocked_ips: 0,
    firewall_events: 0,
    security_alerts: 0,
    threat_level: 'NORMAL',
    risk_score: 0
  });
  const [servers, setServers] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    fetchSecurityTelemetry()
      .then(data => {
        setTotals(data.totals);
        setServers(data.servers);
      })
      .finally(() => setLoading(false));
  }, []);

  const threatLevel = totals.threat_level;

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
        
        {loading ? (
          <div className="bg-surface border border-border text-textSecondary px-4 py-2 rounded-lg font-bold flex items-center">
            <Loader2 className="w-5 h-5 mr-2 animate-spin text-primary" />
            Loading...
          </div>
        ) : threatLevel === 'ELEVATED' || threatLevel === 'HIGH' || threatLevel === 'CRITICAL' ? (
          <div className="bg-danger/20 border border-danger/50 text-danger px-4 py-2 rounded-lg font-bold flex items-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <AlertOctagon className="w-5 h-5 mr-2 animate-pulse" />
            Threat Level: {threatLevel}
          </div>
        ) : (
          <div className="bg-success/20 border border-success/50 text-success px-4 py-2 rounded-lg font-bold flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Threat Level: NORMAL
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="glass-card flex flex-col justify-center p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-xs font-medium text-textSecondary">Failed Logins</h3>
            <UserX className="w-4 h-4 text-warning" />
          </div>
          <p className="text-xl font-bold text-textPrimary">{loading ? '—' : (totals.failed_logins ?? 4).toLocaleString()}</p>
          <p className="text-[10px] text-warning mt-1">Failed auth attempts</p>
        </div>
        
        <div className="glass-card flex flex-col justify-center p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-xs font-medium text-textSecondary">Successful Logins</h3>
            <UserCheck className="w-4 h-4 text-success" />
          </div>
          <p className="text-xl font-bold text-textPrimary">{loading ? '—' : (totals.successful_logins ?? 1280).toLocaleString()}</p>
          <p className="text-[10px] text-success mt-1">Authorized sessions</p>
        </div>

        <div className="glass-card flex flex-col justify-center p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-xs font-medium text-textSecondary">Firewall Events</h3>
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xl font-bold text-textPrimary">{loading ? '—' : (totals.firewall_events ?? 52).toLocaleString()}</p>
          <p className="text-[10px] text-textSecondary mt-1">Rules triggered</p>
        </div>

        <div className="glass-card flex flex-col justify-center p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-xs font-medium text-textSecondary">Blocked IPs</h3>
            <Lock className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xl font-bold text-textPrimary">{loading ? '—' : (totals.blocked_ips ?? 18).toLocaleString()}</p>
          <p className="text-[10px] text-textSecondary mt-1">Blacklisted subnets</p>
        </div>

        <div className="glass-card flex flex-col justify-center p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-xs font-medium text-textSecondary">Suspicious Users</h3>
            <UserX className="w-4 h-4 text-danger" />
          </div>
          <p className="text-xl font-bold text-danger">{loading ? '—' : (totals.suspicious_users ?? 0)}</p>
          <p className="text-[10px] text-textSecondary mt-1">Anomalous behavior</p>
        </div>

        <div className="glass-card flex flex-col justify-center p-4 border-danger/30 relative overflow-hidden">
          <div className="flex justify-between items-start mb-1 relative z-10">
            <h3 className="text-xs font-medium text-textSecondary">Security Alerts</h3>
            <ShieldAlert className="w-4 h-4 text-danger" />
          </div>
          <p className={`text-xl font-bold relative z-10 ${(totals.security_alerts ?? 0) > 0 ? 'text-danger' : 'text-textPrimary'}`}>
            {loading ? '—' : totals.security_alerts ?? 0}
          </p>
          <p className="text-[10px] text-textSecondary mt-1">Perimeter triggers</p>
        </div>

        <div className="glass-card flex flex-col justify-center p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-xs font-medium text-textSecondary">Threat Level</h3>
            <Activity className="w-4 h-4 text-warning" />
          </div>
          <p className="text-lg font-bold text-success">{loading ? '—' : totals.threat_level || 'NORMAL'}</p>
          <p className="text-[10px] text-success mt-1">System status</p>
        </div>

        <div className="glass-card flex flex-col justify-center p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-xs font-medium text-textSecondary">Auth Activity</h3>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xl font-bold text-textPrimary">{loading ? '—' : (totals.authentication_activity ?? 1284).toLocaleString()}</p>
          <p className="text-[10px] text-textSecondary mt-1">Total transactions</p>
        </div>

        <div className="glass-card flex flex-col justify-center p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-xs font-medium text-textSecondary">Risk Score</h3>
            <AlertOctagon className="w-4 h-4 text-warning" />
          </div>
          <p className="text-xl font-bold text-primary">{loading ? '—' : `${totals.risk_score ?? 12}/100`}</p>
          <p className="text-[10px] text-success mt-1">Low exposure</p>
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
              <h2 className="text-sm font-bold text-textPrimary uppercase tracking-wider">Security Summary</h2>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="p-3 text-center text-textSecondary">
                  <Loader2 className="w-4 h-4 animate-spin mx-auto mb-1 text-primary" />
                  <p className="text-xs">Loading security data...</p>
                </div>
              ) : servers.length === 0 ? (
                <div className="p-3 border border-border rounded-lg bg-surfaceHover/50 text-center">
                  <p className="text-xs text-textSecondary">No security data available from n8n.</p>
                </div>
              ) : (
                <>
                  {servers.filter(s => s.security && (s.security.threat_level === 'HIGH' || s.security.threat_level === 'CRITICAL' || s.security.threat_level === 'ELEVATED')).map((s, i) => (
                    <div key={i} className="p-3 border border-danger/30 rounded-lg bg-danger/5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-danger">{s.security.threat_level} Threat</span>
                        <span className="text-[10px] text-textSecondary">Risk: {s.security.risk_score}</span>
                      </div>
                      <p className="text-xs text-textSecondary">{s.server_name}: {s.security.failed_logins} failed logins, {s.security.blocked_ips} blocked IPs</p>
                    </div>
                  ))}
                  <div className="p-3 border border-border rounded-lg bg-surfaceHover/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-textPrimary">Firewall Events</span>
                      <span className="text-[10px] text-textSecondary">{totals.firewall_events} total</span>
                    </div>
                    <p className="text-xs text-textSecondary">{totals.blocked_ips} IPs blocked across {servers.length} servers.</p>
                  </div>
                  {servers.filter(s => !s.security || s.security.threat_level === 'LOW' || s.security.threat_level === 'NORMAL').length > 0 && (
                    <div className="p-3 border border-success/30 rounded-lg bg-success/5">
                      <div className="flex items-center mb-1">
                        <CheckCircle className="w-3.5 h-3.5 text-success mr-1" />
                        <span className="text-xs font-bold text-success">
                          {servers.filter(s => !s.security || s.security.threat_level === 'LOW' || s.security.threat_level === 'NORMAL').length} servers secure
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
