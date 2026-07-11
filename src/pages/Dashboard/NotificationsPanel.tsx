import React from 'react';
import './NotificationsPanel.css';

interface Notification {
  id: string;
  title: string;
  timestamp: string;
}

const notifications: Notification[] = [
  { id: '1', title: 'AI model v2.4 deployed successfully', timestamp: '10m ago' },
  { id: '2', title: 'New security patch applied to edge nodes', timestamp: '2h ago' },
  { id: '3', title: 'Automated database backup completed', timestamp: '4h ago' },
  { id: '4', title: 'Weekly system diagnostic generated', timestamp: '1d ago' },
  { id: '5', title: 'Admin credentials rotated securely', timestamp: '2d ago' },
];

const NotificationsPanel: React.FC = () => {
  return (
    <div className="card notifications-panel">
      <div className="card-header">
        <h2 className="card-title">Recent Activity</h2>
        <button className="view-all">View All</button>
      </div>
      <div className="activity-timeline">
        {notifications.map((n, index) => (
          <div key={n.id} className="timeline-item">
            <div className="timeline-dot-wrapper">
              <div className="timeline-dot"></div>
              {index !== notifications.length - 1 && <div className="timeline-line"></div>}
            </div>
            <div className="timeline-content">
              <div className="timeline-message">{n.title}</div>
              <div className="timeline-time">{n.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPanel;
