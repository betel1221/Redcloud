import React from 'react';
import './AlertsPanel.css';

interface Alert {
  id: string;
  severity: string;
  message: string;
  timestamp: string;
}

const alerts: Alert[] = [
  { id: '1', severity: 'Critical', message: 'Database connection lost in eu-west-1', timestamp: '2m ago' },
  { id: '2', severity: 'Warning', message: 'High memory usage on cluster A', timestamp: '15m ago' },
  { id: '3', severity: 'Critical', message: 'Unauthorized access attempt blocked', timestamp: '1h ago' },
  { id: '4', severity: 'Info', message: 'Scheduled backup completed successfully', timestamp: '3h ago' },
];

const severityConfig: Record<string, { color: string, icon: React.ReactNode }> = {
  Critical: { 
    color: 'var(--error-color)', 
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
  },
  Warning: { 
    color: 'var(--warning-color)', 
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
  },
  Info: { 
    color: 'var(--info-color)', 
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
  },
};

const AlertsPanel: React.FC = () => {
  return (
    <div className="card alerts-panel">
      <div className="card-header">
        <h2 className="card-title">System Alerts</h2>
        <button className="view-all">View All</button>
      </div>
      <div className="alerts-list">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity] || severityConfig.Info;
          return (
            <div key={alert.id} className="alert-item group">
              <div 
                className="alert-icon" 
                style={{ 
                  backgroundColor: `${config.color}15`, 
                  color: config.color,
                  border: `1px solid ${config.color}30`
                }}
              >
                {config.icon}
              </div>
              <div className="alert-content">
                <div className="alert-message">{alert.message}</div>
                <div className="alert-meta">
                  <span style={{ color: config.color, fontWeight: 600 }}>{alert.severity}</span>
                  <span className="separator">•</span>
                  <span>{alert.timestamp}</span>
                </div>
              </div>
              <button className="resolve-btn">Resolve</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsPanel;
