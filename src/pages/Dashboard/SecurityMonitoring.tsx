import React from 'react';
import { ShieldAlert, UserX, UserCheck, Shield, Lock, AlertOctagon, TrendingUp, Search } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const securityEvents = [
  { time: '10:00', failed: 12, blocked: 4 },
  { time: '11:00', failed: 45, blocked: 15 },
  { time: '12:00', failed: 89, blocked: 34 },
  { time: '13:00', failed: 24, blocked: 8 },
  { time: '14:00', failed: 15, blocked: 2 },
  { time: '15:00', failed: 18, blocked: 5 },
];

export default function SecurityMonitoring() {
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
        <div className="bg-danger/20 border border-danger/50 text-danger px-4 py-2 rounded-lg font-bold flex items-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <AlertOctagon className="w-5 h-5 mr-2 animate-pulse" />
          Threat Level: ELEVATED
        </div>
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
        <div className="lg:col-span-2 glass-panel p-6">
          <h2 className="text-lg font-bold text-textPrimary mb-6">Authentication Activity</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={securityEvents} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FBBF24" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F87171" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F87171" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2E3B52" vertical={false} />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A2235', borderColor: '#2E3B52', borderRadius: '8px' }}
                  itemStyle={{ color: '#F8FAFC' }}
                />
                <Area type="monotone" dataKey="failed" stroke="#FBBF24" strokeWidth={2} fillOpacity={1} fill="url(#colorFailed)" name="Failed Logins" />
                <Area type="monotone" dataKey="blocked" stroke="#F87171" strokeWidth={2} fillOpacity={1} fill="url(#colorBlocked)" name="Blocked Requests" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold text-textPrimary mb-4">Today's Threats</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-danger font-medium">Critical</span>
                  <span className="text-textPrimary font-bold">1</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div className="h-2 rounded-full bg-danger w-[5%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-warning font-medium">High</span>
                  <span className="text-textPrimary font-bold">3</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div className="h-2 rounded-full bg-warning w-[15%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-primary font-medium">Medium</span>
                  <span className="text-textPrimary font-bold">7</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div className="h-2 rounded-full bg-primary w-[35%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-textSecondary font-medium">Low</span>
                  <span className="text-textPrimary font-bold">22</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div className="h-2 rounded-full bg-border w-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 border-danger/30 bg-danger/5 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-danger/10 rounded-full blur-xl -mr-10 -mt-10"></div>
            <div className="flex items-center mb-3 relative z-10">
              <ShieldAlert className="w-5 h-5 text-danger mr-2" />
              <h2 className="text-sm font-bold text-danger uppercase tracking-wider">AI Security Summary</h2>
            </div>
            <p className="text-sm text-textPrimary mb-3 leading-relaxed relative z-10">
              Multiple failed logins detected from <span className="text-danger font-mono font-bold bg-danger/10 px-1 rounded">192.168.10.25</span>.
            </p>
            <div className="bg-background/80 border border-border p-3 rounded-lg text-sm text-textSecondary relative z-10">
              <strong className="text-textPrimary block mb-1">Diagnosis:</strong>
              Possible brute-force attack targeting Admin accounts. IP has been temporarily blocked by firewall rules.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
