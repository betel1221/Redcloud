import React from 'react';
import { Server, Cpu, HardDrive, Network, Activity, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const mockServerData = [
  { name: 'Application Server 01', status: 'Running', cpu: 92, memory: 74, disk: 62, network: '450 Mbps', uptime: '45 Days' },
  { name: 'Application Server 02', status: 'Running', cpu: 45, memory: 50, disk: 40, network: '120 Mbps', uptime: '45 Days' },
  { name: 'Worker Node A', status: 'Running', cpu: 88, memory: 90, disk: 70, network: '800 Mbps', uptime: '12 Days' },
  { name: 'Worker Node B', status: 'Restarting', cpu: 0, memory: 0, disk: 20, network: '0 Mbps', uptime: '0 Days' },
];

const cpuTrend = [
  { time: '0', val: 50 }, { time: '1', val: 55 }, { time: '2', val: 80 }, { time: '3', val: 92 }, { time: '4', val: 90 }, { time: '5', val: 95 }
];

export default function ServerMonitoring() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center">
            <Server className="w-6 h-6 mr-3 text-primary" />
            Server Infrastructure
          </h1>
          <p className="text-textSecondary mt-1">Monitor compute resources and server health.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-textPrimary">Server Instances</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockServerData.map((server, idx) => (
                <div key={idx} className="bg-surface/50 border border-border rounded-xl p-4 hover:border-primary/50 transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${server.status === 'Running' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                        <Server className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-textPrimary">{server.name}</h3>
                        <p className="text-xs text-textSecondary flex items-center mt-1">
                          <span className={`w-2 h-2 rounded-full mr-1 ${server.status === 'Running' ? 'bg-success' : 'bg-warning animate-pulse'}`}></span>
                          {server.status}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-textSecondary flex items-center"><Cpu className="w-3 h-3 mr-1"/> CPU</span>
                        <span className={server.cpu > 80 ? 'text-danger font-bold' : 'text-textPrimary'}>{server.cpu}%</span>
                      </div>
                      <div className="w-full bg-background rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${server.cpu > 80 ? 'bg-danger' : 'bg-primary'}`} style={{ width: `${server.cpu}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-textSecondary flex items-center"><HardDrive className="w-3 h-3 mr-1"/> RAM</span>
                        <span className={server.memory > 85 ? 'text-danger font-bold' : 'text-textPrimary'}>{server.memory}%</span>
                      </div>
                      <div className="w-full bg-background rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${server.memory > 85 ? 'bg-danger' : 'bg-primary'}`} style={{ width: `${server.memory}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-3 border-t border-border/50 text-xs text-textSecondary">
                    <span className="flex items-center"><Network className="w-3 h-3 mr-1" /> {server.network}</span>
                    <span className="flex items-center"><Activity className="w-3 h-3 mr-1" /> Uptime: {server.uptime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h2 className="text-sm font-bold text-textPrimary mb-2 flex items-center">
              <Cpu className="w-4 h-4 mr-2 text-danger" /> Critical Load Alert
            </h2>
            <div className="h-24 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cpuTrend}>
                  <defs>
                    <linearGradient id="colorDanger" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="val" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorDanger)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-3xl font-bold text-danger mb-1">92%</p>
            <p className="text-xs text-textSecondary">App Server 01 CPU Spike</p>
          </div>

          <div className="glass-panel p-6 border border-warning/30 bg-warning/5">
            <div className="flex items-center mb-3">
              <Info className="w-5 h-5 text-warning mr-2" />
              <h2 className="text-sm font-bold text-warning uppercase tracking-wider">AI Insight</h2>
            </div>
            <p className="text-sm text-textPrimary mb-3 leading-relaxed">
              CPU utilization on <span className="font-mono text-xs bg-background px-1 py-0.5 rounded border border-border">App Server 01</span> is consistently high.
            </p>
            <div className="bg-background/50 border border-border p-3 rounded-lg text-sm text-textSecondary">
              Investigate the FastAPI worker processes causing high load. Consider horizontal scaling.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
