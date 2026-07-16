import React, { useState } from 'react';
import { Bell, Search, Filter, AlertTriangle, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';

const initialAlerts = [
  { id: 1, type: 'critical', message: 'CPU utilization on App Server 01 exceeded 90%', source: 'Server Monitoring', time: '10 mins ago', status: 'Open' },
  { id: 2, type: 'critical', message: 'Multiple failed login attempts from IP 192.168.1.50', source: 'Security', time: '25 mins ago', status: 'Investigating' },
  { id: 3, type: 'warning', message: 'Database connection pool near capacity (85%)', source: 'Database Monitoring', time: '1 hour ago', status: 'Open' },
  { id: 4, type: 'warning', message: 'High memory usage on Worker Node B', source: 'Server Monitoring', time: '2 hours ago', status: 'Resolved' },
  { id: 5, type: 'info', message: 'Automated backup completed successfully', source: 'System', time: '5 hours ago', status: 'Resolved' },
  { id: 6, type: 'info', message: 'New Redhelp agent version available (v2.4)', source: 'System', time: '1 day ago', status: 'Open' },
];

export default function Alerts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredAlerts = initialAlerts.filter(alert => {
    const matchesSearch = alert.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          alert.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || alert.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center">
            <Bell className="w-6 h-6 mr-3 text-primary" />
            System Alerts
          </h1>
          <p className="text-textSecondary mt-1">Review and manage system notifications and incidents.</p>
        </div>
      </div>

      <div className="glass-panel p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-textSecondary" />
            </div>
            <input
              type="text"
              placeholder="Search alerts by message or source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-lg bg-surface text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative inline-block text-left w-full md:w-auto">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none block w-full bg-surface border border-border text-textPrimary py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-all"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical Only</option>
                <option value="warning">Warning Only</option>
                <option value="info">Info Only</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-textSecondary">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
            <button className="flex items-center justify-center bg-surface border border-border text-textPrimary px-4 py-2.5 rounded-lg hover:bg-surfaceHover transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-textSecondary uppercase bg-surfaceHover border-b border-border">
              <tr>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-surfaceHover/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className={`flex items-center space-x-2 px-2.5 py-1 rounded-full w-fit ${
                        alert.type === 'critical' ? 'bg-danger/10 text-danger border border-danger/20' :
                        alert.type === 'warning' ? 'bg-warning/10 text-warning border border-warning/20' :
                        'bg-success/10 text-success border border-success/20'
                      }`}>
                        {alert.type === 'critical' ? <AlertCircle className="w-3.5 h-3.5" /> : 
                         alert.type === 'warning' ? <AlertTriangle className="w-3.5 h-3.5" /> : 
                         <CheckCircle className="w-3.5 h-3.5" />}
                        <span className="text-xs font-bold capitalize">{alert.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-textPrimary">{alert.message}</td>
                    <td className="px-6 py-4 text-textSecondary">{alert.source}</td>
                    <td className="px-6 py-4 text-textSecondary">{alert.time}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        alert.status === 'Open' ? 'bg-surface border border-border text-textPrimary' :
                        alert.status === 'Investigating' ? 'bg-warning/10 text-warning' :
                        'bg-success/10 text-success'
                      }`}>
                        {alert.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:underline font-medium text-xs">View Details</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-textSecondary">
                    No alerts found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
