import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Server, Database, AlertTriangle, AlertCircle, ChevronRight, Bot, Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PerformanceChart, { mockPerformanceData } from '../../components/ui/PerformanceChart';

// --- MOCK DATA ---
// Backend developers: Replace these with real API calls

const mockHealthData = {
  dbHealth: 98,
  dbStatus: 'Optimal performance',
  serverHealth: 96,
  serverStatus: 'All systems operational',
  securityScore: 82,
  securityStatus: 'Moderate risk detected',
  aiSystemRunning: true,
};

const mockAlertsSummary = {
  critical: 2,
  high: 5,
  medium: 10,
  low: 18,
};

const mockRecommendation = {
  title: 'Database Server Memory Usage Increasing.',
  description: 'Increase RAM or optimize cache settings to prevent upcoming bottlenecks.',
};

const mockNotifications = [
  { id: 1, severity: 'Critical', event: 'Server 02 CPU High', source: 'Application Server', time: '2 mins ago' },
  { id: 2, severity: 'Critical', event: 'Database Connection Timeout', source: 'CompanyERP DB', time: '15 mins ago' },
  { id: 3, severity: 'High', event: 'Firewall Login Attempts', source: 'Gateway 01', time: '1 hour ago' },
];
// -----------------

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
  const { profileComplete, role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const generatePDF = () => {
    // Mock PDF download
    const element = document.createElement("a");
    const file = new Blob(["MOCK PDF CONTENT - RedCloud System Report\n\nPerformance metrics, alerts, and system health."], { type: 'application/pdf' });
    element.href = URL.createObjectURL(file);
    element.download = "RedCloud_System_Report.pdf";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    
    setReportGenerated(true);
    setTimeout(() => setReportGenerated(false), 3000);
  };

  useEffect(() => {
    // Backend developers: Replace this setTimeout with your actual fetch calls
    // e.g., const res = await fetch('/api/dashboard'); const json = await res.json(); setData(json);
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Simulating network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setData({
          performance: mockPerformanceData,
          health: mockHealthData,
          alerts: mockAlertsSummary,
          recommendation: mockRecommendation,
          notifications: mockNotifications
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="ml-3 text-textSecondary font-medium">Loading Dashboard Data...</span>
      </div>
    );
  }

  const { health, alerts, recommendation, notifications, performance } = data;

  return (
    <div className="space-y-6 animate-fade-in relative">
      
      {!profileComplete && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between mb-6">
          <div>
            <h3 className="text-primary font-bold text-lg">Welcome to Redhelp!</h3>
            <p className="text-textSecondary text-sm mt-1">
              Please complete your profile setup (Name, Phone, Profile Picture) to get the most out of the platform.
            </p>
          </div>
          <Link 
            to="/dashboard/profile"
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm shadow-sm shadow-primary/20"
          >
            Setup Profile <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      )}

      {reportGenerated && (
        <div className="fixed bottom-6 right-6 bg-success text-white px-4 py-3 rounded-lg shadow-lg flex items-center animate-slide-up z-50">
          <CheckCircle className="w-5 h-5 mr-3" />
          <span className="font-medium">Full system report generated and downloaded!</span>
        </div>
      )}

      {showAnalysis && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-surface border border-border p-6 rounded-xl w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setShowAnalysis(false)}
              className="absolute top-4 right-4 text-textSecondary hover:text-textPrimary"
            >
              &times;
            </button>
            <div className="flex items-center mb-4">
              <Bot className="w-6 h-6 text-primary mr-3" />
              <h3 className="text-lg font-bold text-textPrimary">AI Insight Analysis</h3>
            </div>
            <p className="text-textSecondary text-sm mb-4 leading-relaxed">
              Based on historical data patterns over the last 30 days, the database server memory usage peaks heavily during business hours (9AM-5PM). We project a critical threshold breach within 4 days if cache TTL is not optimized.
            </p>
            <p className="text-textPrimary text-sm font-medium">Recommended action:</p>
            <ul className="list-disc list-inside text-sm text-textSecondary mt-2 space-y-1">
              <li>Increase RAM allocation by 16GB</li>
              <li>Tune Redis caching parameters</li>
            </ul>
            <button 
              onClick={() => setShowAnalysis(false)}
              className="mt-6 w-full py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Close Analysis
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Company Infrastructure Dashboard</h1>
          <p className="text-textSecondary mt-1">Real-time overview of your enterprise systems.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          {health.aiSystemRunning ? (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
              </span>
              <span className="text-success font-medium">AI System Running</span>
            </>
          ) : (
            <>
              <span className="relative flex h-3 w-3">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-danger"></span>
              </span>
              <span className="text-danger font-medium">AI System Offline</span>
            </>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Database Health" 
          value={`${health.dbHealth}%`} 
          icon={Database} 
          colorClass={{ bg: 'bg-success', text: 'text-success', border: 'border-success/30' }}
          statusText={health.dbStatus}
        />
        <StatCard 
          title="Server Health" 
          value={`${health.serverHealth}%`} 
          icon={Server} 
          colorClass={{ bg: 'bg-success', text: 'text-success', border: 'border-success/30' }}
          statusText={health.serverStatus}
        />
        <StatCard 
          title="Security Score" 
          value={`${health.securityScore}%`} 
          icon={ShieldCheck} 
          colorClass={{ bg: 'bg-warning', text: 'text-warning', border: 'border-warning/30' }}
          statusText={health.securityStatus}
        />
        <div 
          className="glass-card flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-surfaceHover/80 transition-colors"
          onClick={generatePDF}
        >
          <Activity className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-bold text-textPrimary">Generate Full Report</h3>
          <p className="text-xs text-textSecondary mt-1">Download PDF overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2">
          <PerformanceChart data={performance} />
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
                <span className="bg-danger/20 text-danger text-xs font-bold px-2 py-1 rounded-full">{alerts.critical}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surfaceHover border border-border">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-warning mr-3"></div>
                  <span className="text-sm font-medium">High</span>
                </div>
                <span className="bg-warning/20 text-warning text-xs font-bold px-2 py-1 rounded-full">{alerts.high}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surfaceHover border border-border">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                  <span className="text-sm font-medium">Medium</span>
                </div>
                <span className="bg-blue-500/20 text-blue-500 text-xs font-bold px-2 py-1 rounded-full">{alerts.medium}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surfaceHover border border-border">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-textSecondary mr-3"></div>
                  <span className="text-sm font-medium">Low</span>
                </div>
                <span className="bg-surface border border-border text-textSecondary text-xs font-bold px-2 py-1 rounded-full">{alerts.low}</span>
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
              {recommendation.title}
            </p>
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-xs text-textSecondary">
                <strong className="text-primary block mb-1">Recommendation:</strong>
                {recommendation.description}
              </p>
            </div>
            <button 
              onClick={() => setShowAnalysis(true)}
              className="mt-4 w-full flex items-center justify-center text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View Analysis <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
