import React from 'react';
import { Database, Activity, HardDrive, Zap, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const mockDbData = [
  { name: 'CompanyERP', status: 'Healthy', tables: 128, connections: 35, storage: '152 GB', slowQueries: 3, risk: 'Low' },
  { name: 'HRDB', status: 'Healthy', tables: 45, connections: 12, storage: '46 GB', slowQueries: 0, risk: 'Low' },
  { name: 'FinanceDB', status: 'Warning', tables: 89, connections: 84, storage: '21 GB', slowQueries: 15, risk: 'High' },
  { name: 'SecurityLogs', status: 'Healthy', tables: 12, connections: 5, storage: '340 GB', slowQueries: 1, risk: 'Medium' },
];

const mockQueryPerformance = [
  { time: '10:00', queries: 400 },
  { time: '10:15', queries: 450 },
  { time: '10:30', queries: 800 },
  { time: '10:45', queries: 550 },
  { time: '11:00', queries: 420 },
];

export default function DatabaseMonitoring() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center">
            <Database className="w-6 h-6 mr-3 text-primary" />
            Database Monitoring
          </h1>
          <p className="text-textSecondary mt-1">Manage and monitor enterprise database instances.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card flex flex-col items-center justify-center py-6 text-center">
          <Database className="w-8 h-8 text-primary mb-2" />
          <h3 className="text-2xl font-bold text-textPrimary">4</h3>
          <p className="text-sm text-textSecondary uppercase tracking-wide">Total Databases</p>
        </div>
        <div className="glass-card flex flex-col items-center justify-center py-6 text-center">
          <HardDrive className="w-8 h-8 text-success mb-2" />
          <h3 className="text-2xl font-bold text-textPrimary">559 GB</h3>
          <p className="text-sm text-textSecondary uppercase tracking-wide">Total Storage Used</p>
        </div>
        <div className="glass-card flex flex-col items-center justify-center py-6 text-center">
          <Activity className="w-8 h-8 text-warning mb-2" />
          <h3 className="text-2xl font-bold text-textPrimary">136</h3>
          <p className="text-sm text-textSecondary uppercase tracking-wide">Active Connections</p>
        </div>
        <div className="glass-card flex flex-col items-center justify-center py-6 text-center border-danger/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-danger/5"></div>
          <Clock className="w-8 h-8 text-danger mb-2 relative z-10" />
          <h3 className="text-2xl font-bold text-textPrimary relative z-10">19</h3>
          <p className="text-sm text-textSecondary uppercase tracking-wide relative z-10">Slow Queries / Hr</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6">
          <h2 className="text-lg font-bold text-textPrimary mb-6">Database Instances</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-textSecondary uppercase bg-surfaceHover border-b border-border">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Database Name</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Storage</th>
                  <th className="px-4 py-3">Connections</th>
                  <th className="px-4 py-3">Slow Queries</th>
                  <th className="px-4 py-3 rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockDbData.map((db, idx) => (
                  <tr key={idx} className="hover:bg-surfaceHover/50 transition-colors">
                    <td className="px-4 py-4 font-medium text-textPrimary flex items-center">
                      <Database className="w-4 h-4 mr-2 text-primary" />
                      {db.name}
                    </td>
                    <td className="px-4 py-4">
                      {db.status === 'Healthy' ? (
                        <span className="flex items-center text-success"><ShieldCheck className="w-4 h-4 mr-1" /> Healthy</span>
                      ) : (
                        <span className="flex items-center text-warning"><AlertTriangle className="w-4 h-4 mr-1" /> Warning</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-textSecondary">{db.storage}</td>
                    <td className="px-4 py-4 text-textSecondary">{db.connections}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        db.slowQueries > 10 ? 'bg-danger/20 text-danger' : 'bg-surface text-textSecondary border border-border'
                      }`}>
                        {db.slowQueries}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button className="text-primary hover:underline text-xs font-medium">Analyze</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6 h-full flex flex-col">
          <div className="glass-panel p-6">
            <div className="flex items-center mb-4">
              <Zap className="w-5 h-5 text-warning mr-2" />
              <h2 className="text-sm font-bold text-textPrimary uppercase tracking-wider">Updates & Alerts</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 border border-border rounded-lg bg-surfaceHover/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-danger">Missing Index</span>
                  <span className="text-[10px] text-textSecondary">2m ago</span>
                </div>
                <p className="text-xs text-textSecondary">CompanyERP <code className="bg-background px-1 py-0.5 rounded text-primary">customer_id</code> missing index.</p>
              </div>
              <div className="p-3 border border-border rounded-lg bg-surfaceHover/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-warning">High Connections</span>
                  <span className="text-[10px] text-textSecondary">15m ago</span>
                </div>
                <p className="text-xs text-textSecondary">FinanceDB connection pool nearing capacity limit.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
