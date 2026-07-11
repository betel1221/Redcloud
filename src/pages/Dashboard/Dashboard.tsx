import React from 'react';
import HealthSummary from './HealthSummary';
import AlertsPanel from './AlertsPanel';
import NotificationsPanel from './NotificationsPanel';
import AiRecommendation from './AiRecommendation';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-layout animate-fade-in">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="dot"></div>
          ERAOP System
        </div>
        <nav className="nav-menu">
          <div className="nav-item active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Overview
          </div>
          <div className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            Analytics
          </div>
          <div className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Security
          </div>
          <div className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            Settings
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title">Dashboard / Overview</div>
          <div className="topbar-actions">
            <input type="text" className="search-bar" placeholder="Search resources..." />
            <div className="user-profile"></div>
          </div>
        </header>

        <div className="dashboard-container">
          <div className="dashboard-header animate-fade-in delay-1">
            <h1>Operations Overview</h1>
            <p>Monitor your AI infrastructure and security systems in real-time.</p>
          </div>
          
          <div className="dashboard-grid">
            <div style={{ gridColumn: 'span 8' }} className="animate-fade-in delay-2">
              <HealthSummary />
            </div>
            <div style={{ gridColumn: 'span 4' }} className="animate-fade-in delay-2">
              <AiRecommendation />
            </div>
            <div style={{ gridColumn: 'span 6' }} className="animate-fade-in delay-3">
              <AlertsPanel />
            </div>
            <div style={{ gridColumn: 'span 6' }} className="animate-fade-in delay-4">
              <NotificationsPanel />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
