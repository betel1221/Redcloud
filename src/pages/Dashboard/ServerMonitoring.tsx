import React, { useState } from 'react';
import { Server, Cpu, HardDrive, Network, Activity, ArrowUpRight, ArrowDownRight, Info, CheckCircle } from 'lucide-react';
import PerformanceChart from '../../components/ui/PerformanceChart';


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
  const [showUpdate, setShowUpdate] = useState<string | null>(null);

  const handleUpdateClick = (updateText: string) => {
    setShowUpdate(updateText);
    setTimeout(() => setShowUpdate(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {showUpdate && (
        <div className="fixed bottom-6 right-6 bg-success text-white px-4 py-3 rounded-lg shadow-lg flex items-center animate-slide-up z-50">
          <CheckCircle className="w-5 h-5 mr-3" />
          <span className="font-medium">{showUpdate}</span>
        </div>
      )}

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
          <div className="h-80">
            <PerformanceChart title="Server Resource Usage" />
          </div>
          
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

        <div className="space-y-6 h-full flex flex-col">
          <div className="glass-panel p-6">
            <div className="flex items-center mb-4">
              <Activity className="w-5 h-5 text-warning mr-2" />
              <h2 className="text-sm font-bold text-textPrimary uppercase tracking-wider">Updates & Alerts</h2>
            </div>
            <div className="space-y-3">
              <div 
                className="p-3 border border-border rounded-lg bg-surfaceHover/50 cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => handleUpdateClick('CPU Spike acknowledged and recorded.')}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-danger">CPU Spike</span>
                  <span className="text-[10px] text-textSecondary">Now</span>
                </div>
                <p className="text-xs text-textSecondary">App Server 01 CPU at 92%.</p>
              </div>
              <div 
                className="p-3 border border-border rounded-lg bg-surfaceHover/50 cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => handleUpdateClick('Node Restart status tracked.')}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-warning">Node Restarting</span>
                  <span className="text-[10px] text-textSecondary">10m ago</span>
                </div>
                <p className="text-xs text-textSecondary">Worker Node B restarting after crash.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
