import React from 'react';
import { Activity, ShieldCheck, Server, Database, AlertTriangle, AlertCircle, ChevronRight, Bot } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockPerformanceData = [
  { time: '09:00', cpu: 45, memory: 60 },
  { time: '09:10', cpu: 55, memory: 65 },
  { time: '09:20', cpu: 40, memory: 62 },
  { time: '09:30', cpu: 75, memory: 70 },
  { time: '09:40', cpu: 85, memory: 78 },
  { time: '09:50', cpu: 92, memory: 82 },
  { time: '10:00', cpu: 65, memory: 75 },
];

const StatCard = ({ title, value, icon: Icon, colorClass, statusText }: any) => (
  <div className="glass-card flex flex-col relative overflow-hidden">
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-20 ${colorClass.bg}`}></div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div>
        <h3 className="text-sm font-medium text-textSecondary">{title}</h3>
        <p className="text-3xl font-bold mt-1 text-textPrimary">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${colorClass.bg} ${colorClass.text} bg-opacity-10 border ${colorClass.border}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <div className="mt-auto flex items-center text-sm relative z-10">
      <span className={colorClass.text}>{statusText}</span>
    </div>
  </div>
);

export default function DashboardOverview() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Company Infrastructure Dashboard</h1>
          <p className="text-textSecondary mt-1">Real-time overview of your enterprise systems.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
          </span>
          <span className="text-success font-medium">AI System Running</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Database Health" 
          value="98%" 
          icon={Database} 
          colorClass={{ bg: 'bg-success', text: 'text-success', border: 'border-success/30' }}
          statusText="Optimal performance"
        />
        <StatCard 
          title="Server Health" 
          value="96%" 
          icon={Server} 
          colorClass={{ bg: 'bg-success', text: 'text-success', border: 'border-success/30' }}
          statusText="All systems operational"
        />
        <StatCard 
          title="Security Score" 
          value="82%" 
          icon={ShieldCheck} 
          colorClass={{ bg: 'bg-warning', text: 'text-warning', border: 'border-warning/30' }}
          statusText="Moderate risk detected"
        />
        <div className="glass-card flex flex-col justify-center items-center text-center group cursor-pointer">
          <Activity className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-bold text-textPrimary">Generate Full Report</h3>
          <p className="text-xs text-textSecondary mt-1">Download PDF overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 glass-panel p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-textPrimary">System Performance</h2>
            <select className="bg-background border border-border text-sm rounded-md px-3 py-1 focus:ring-primary focus:border-primary">
              <option>Last 1 Hour</option>
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A3A3A3" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#A3A3A3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '8px' }}
                  itemStyle={{ color: '#111111' }}
                />
                <Area type="monotone" dataKey="cpu" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" name="CPU Usage %" />
                <Area type="monotone" dataKey="memory" stroke="#A3A3A3" strokeWidth={2} fillOpacity={1} fill="url(#colorMemory)" name="Memory Usage %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts & AI Recommendations Sidebar */}
        <div className="space-y-6">
          {/* Today's Alerts */}
          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold text-textPrimary mb-4">Today's Alerts</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-surfaceHover border border-border">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-danger mr-3"></div>
                  <span className="text-sm font-medium">Critical</span>
                </div>
                <span className="bg-danger/20 text-danger text-xs font-bold px-2 py-1 rounded-full">2</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surfaceHover border border-border">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-warning mr-3"></div>
                  <span className="text-sm font-medium">High</span>
                </div>
                <span className="bg-warning/20 text-warning text-xs font-bold px-2 py-1 rounded-full">5</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surfaceHover border border-border">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                  <span className="text-sm font-medium">Medium</span>
                </div>
                <span className="bg-blue-500/20 text-blue-500 text-xs font-bold px-2 py-1 rounded-full">10</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surfaceHover border border-border">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-textSecondary mr-3"></div>
                  <span className="text-sm font-medium">Low</span>
                </div>
                <span className="bg-surface border border-border text-textSecondary text-xs font-bold px-2 py-1 rounded-full">18</span>
              </div>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="glass-panel p-6 border-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex items-center mb-3">
              <Bot className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-sm font-bold text-primary uppercase tracking-wider">AI Insight</h2>
            </div>
            <p className="text-textPrimary font-medium text-sm leading-relaxed mb-3">
              Database Server Memory Usage Increasing.
            </p>
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-xs text-textSecondary">
                <strong className="text-primary block mb-1">Recommendation:</strong>
                Increase RAM or optimize cache settings to prevent upcoming bottlenecks.
              </p>
            </div>
            <button className="mt-4 w-full flex items-center justify-center text-xs font-medium text-primary hover:text-primary/80 transition-colors">
              View Analysis <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Notifications Table */}
      <div className="glass-panel p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-textPrimary">Recent Notifications</h2>
          <button className="text-sm text-primary hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-textSecondary uppercase bg-surfaceHover border-b border-border">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Severity</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3 rounded-tr-lg">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-surfaceHover/50 transition-colors">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-danger/10 text-danger border border-danger/20">
                    <AlertCircle className="w-3 h-3 mr-1" /> Critical
                  </span>
                </td>
                <td className="px-4 py-3 text-textPrimary font-medium">Server 02 CPU High</td>
                <td className="px-4 py-3 text-textSecondary">Application Server</td>
                <td className="px-4 py-3 text-textSecondary">2 mins ago</td>
              </tr>
              <tr className="hover:bg-surfaceHover/50 transition-colors">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-danger/10 text-danger border border-danger/20">
                    <AlertCircle className="w-3 h-3 mr-1" /> Critical
                  </span>
                </td>
                <td className="px-4 py-3 text-textPrimary font-medium">Database Connection Timeout</td>
                <td className="px-4 py-3 text-textSecondary">CompanyERP DB</td>
                <td className="px-4 py-3 text-textSecondary">15 mins ago</td>
              </tr>
              <tr className="hover:bg-surfaceHover/50 transition-colors">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-warning/10 text-warning border border-warning/20">
                    <AlertTriangle className="w-3 h-3 mr-1" /> High
                  </span>
                </td>
                <td className="px-4 py-3 text-textPrimary font-medium">Firewall Login Attempts</td>
                <td className="px-4 py-3 text-textSecondary">Gateway 01</td>
                <td className="px-4 py-3 text-textSecondary">1 hour ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
