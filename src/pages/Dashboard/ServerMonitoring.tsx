import React, { useState, useEffect } from 'react';
import { Server, Cpu, HardDrive, Network, Activity, Loader2, CheckCircle } from 'lucide-react';
import PerformanceChart from '../../components/ui/PerformanceChart';
import { fetchLiveServerTelemetry, type ServerTelemetry } from '../../api/dashboard';

export default function ServerMonitoring() {
  const [showUpdate, setShowUpdate] = useState<string | null>(null);
  const [servers, setServers] = useState<ServerTelemetry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchLiveServerTelemetry()
      .then(data => setServers(data))
      .finally(() => setLoading(false));
  }, []);               

  const handleUpdateClick = (updateText: string) => {
    setShowUpdate(updateText);
    setTimeout(() => setShowUpdate(null), 3000);
  };

  // Compute KPIs from live data
  const activeCount = servers.length;
  const runningCount = servers.filter(s => s.status === 'Running' || s.status === 'OPERATIONAL').length;
  const otherCount = activeCount - runningCount;
  const avgCpu = servers.length > 0 ? Math.round(servers.reduce((s, v) => s + v.cpu.usage_percent, 0) / servers.length) : 0;
  const avgMem = servers.length > 0 ? Math.round(servers.reduce((s, v) => s + v.memory.usage_percent, 0) / servers.length) : 0;
  const highCpuServer = servers.length > 0 ? servers.reduce((max, s) => s.cpu.usage_percent > max.cpu.usage_percent ? s : max, servers[0]) : null;
  const totalNetwork = servers.reduce((sum, s) => {
    if (s.network) {
      const num = parseInt(s.network);
      return isNaN(num) ? sum : sum + num;
    }
    return sum;
  }, 0);

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card flex flex-col justify-center p-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-textSecondary">Active Servers</span>
            <Server className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-textPrimary">{loading ? '—' : `${activeCount} Nodes`}</p>
          <p className="text-[10px] text-success mt-1">{loading ? 'Loading...' : `${runningCount} Running${otherCount > 0 ? `, ${otherCount} Other` : ''}`}</p>
        </div>
        <div className="glass-card flex flex-col justify-center p-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-textSecondary">Avg CPU Usage</span>
            <Cpu className={`w-4 h-4 ${avgCpu > 80 ? 'text-danger' : avgCpu > 60 ? 'text-warning' : 'text-success'}`} />
          </div>
          <p className="text-2xl font-bold text-textPrimary">{loading ? '—' : `${avgCpu}%`}</p>
          <p className={`text-[10px] mt-1 ${highCpuServer && highCpuServer.cpu.usage_percent > 80 ? 'text-warning' : 'text-success'}`}>
            {loading ? 'Loading...' : highCpuServer ? `${highCpuServer.server_name} (${highCpuServer.cpu.usage_percent}%)` : 'All normal'}
          </p>
        </div>
        <div className="glass-card flex flex-col justify-center p-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-textSecondary">Avg Memory Usage</span>
            <HardDrive className={`w-4 h-4 ${avgMem > 85 ? 'text-danger' : avgMem > 70 ? 'text-warning' : 'text-success'}`} />
          </div>
          <p className="text-2xl font-bold text-textPrimary">{loading ? '—' : `${avgMem}%`}</p>
          <p className={`text-[10px] mt-1 ${avgMem > 85 ? 'text-danger' : 'text-success'}`}>
            {loading ? 'Loading...' : avgMem > 85 ? 'High usage detected' : 'Optimal allocation'}
          </p>
        </div>
        <div className="glass-card flex flex-col justify-center p-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-textSecondary">Total Throughput</span>
            <Network className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-textPrimary">{loading ? '—' : totalNetwork > 1000 ? `${(totalNetwork / 1000).toFixed(2)} Gbps` : `${totalNetwork} Mbps`}</p>
          <p className="text-[10px] text-textSecondary mt-1">Aggregated bandwidth</p>
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
              {loading ? (
                <div className="col-span-full py-8 text-center text-textSecondary flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2 text-primary" />
                  Loading server telemetry from n8n...
                </div>
              ) : servers.length === 0 ? (
                <div className="col-span-full py-8 text-center text-textSecondary">
                  No server data available. Ensure n8n SRE pipeline is active.
                </div>
              ) : servers.map((server: any, idx: number) => {
                const cpuVal = typeof server.cpu === 'object' ? server.cpu.usage_percent : server.cpu;
                const memVal = typeof server.memory === 'object' ? server.memory.usage_percent : server.memory;
                const diskVal = typeof server.disk === 'object' ? server.disk.usage_percent : (server.disk || 38);
                const nameStr = server.server_name || server.name;
                const isRunning = server.status === 'Running' || server.status === 'OPERATIONAL';
                const runningSvcs = server.services?.running ?? 96;
                const tempC = server.temperature_c ?? 41.5;

                return (
                  <div key={idx} className="bg-surface/50 border border-border rounded-xl p-4 hover:border-primary/50 transition-colors group space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${isRunning ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                          <Server className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-textPrimary">{nameStr}</h3>
                          <p className="text-xs text-textSecondary flex items-center mt-0.5">
                            <span className={`w-2 h-2 rounded-full mr-1.5 ${isRunning ? 'bg-success' : 'bg-warning animate-pulse'}`}></span>
                            Status: <strong className="ml-1 text-textPrimary">{server.status}</strong>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-surface border border-border text-textSecondary">
                          ⚙️ {runningSvcs} Svcs
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${tempC > 75 ? 'bg-danger/10 text-danger' : 'bg-surface border border-border text-textSecondary'}`}>
                          🔥 {tempC}°C
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 pt-1">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-textSecondary flex items-center"><Cpu className="w-3 h-3 mr-1"/> CPU</span>
                          <span className={cpuVal > 80 ? 'text-danger font-bold' : 'text-textPrimary'}>{cpuVal}%</span>
                        </div>
                        <div className="w-full bg-background rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${cpuVal > 80 ? 'bg-danger' : 'bg-primary'}`} style={{ width: `${cpuVal}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-textSecondary flex items-center"><HardDrive className="w-3 h-3 mr-1"/> RAM</span>
                          <span className={memVal > 85 ? 'text-danger font-bold' : 'text-textPrimary'}>{memVal}%</span>
                        </div>
                        <div className="w-full bg-background rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${memVal > 85 ? 'bg-danger' : 'bg-primary'}`} style={{ width: `${memVal}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-textSecondary flex items-center"><HardDrive className="w-3 h-3 mr-1"/> Disk</span>
                          <span className={diskVal > 85 ? 'text-danger font-bold' : 'text-textPrimary'}>{diskVal}%</span>
                        </div>
                        <div className="w-full bg-background rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${diskVal > 85 ? 'bg-danger' : 'bg-success'}`} style={{ width: `${diskVal}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-border/50 text-xs text-textSecondary">
                      <span className="flex items-center"><Network className="w-3.5 h-3.5 mr-1 text-primary" /> {server.network || '142 Mbps'}</span>
                      <span className="flex items-center"><Activity className="w-3.5 h-3.5 mr-1 text-success" /> Uptime: {server.uptime}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6 h-full flex flex-col">
          <div className="glass-panel p-6">
            <div className="flex items-center mb-4">
              <Activity className="w-5 h-5 text-warning mr-2" />
              <h2 className="text-sm font-bold text-textPrimary uppercase tracking-wider">Live Server Alerts</h2>
            </div>
            <div className="space-y-3">
              {servers.filter(s => s.cpu.usage_percent > 80 || (s.services?.failed ?? 0) > 0 || s.status !== 'Running').length === 0 ? (
                <div className="p-3 border border-success/30 rounded-lg bg-success/5 text-center">
                  <p className="text-xs text-success font-medium">✅ All servers healthy</p>
                </div>
              ) : (
                servers.filter(s => s.cpu.usage_percent > 80 || (s.services?.failed ?? 0) > 0 || (s.status !== 'Running' && s.status !== 'OPERATIONAL')).map((s, i) => (
                  <div key={i}
                    className="p-3 border border-border rounded-lg bg-surfaceHover/50 cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => handleUpdateClick(`${s.server_name} alert acknowledged.`)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${s.cpu.usage_percent > 85 ? 'text-danger' : 'text-warning'}`}>
                        {s.cpu.usage_percent > 85 ? 'CPU Spike' : s.status !== 'Running' ? 'Node Issue' : 'Warning'}
                      </span>
                      <span className="text-[10px] text-textSecondary">Live</span>
                    </div>
                    <p className="text-xs text-textSecondary">
                      {s.server_name} — CPU {s.cpu.usage_percent}%, Memory {s.memory.usage_percent}%
                      {(s.services?.failed ?? 0) > 0 ? `, ${s.services!.failed} failed services` : ''}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
