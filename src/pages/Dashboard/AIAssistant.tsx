import React, { useState } from 'react';
import { Database, ShieldAlert, Bot } from 'lucide-react';
import AIChatInterface from '../../components/ui/AIChatInterface';

export default function AIAssistant() {
  const [domain, setDomain] = useState<'database' | 'infrastructure'>('database');

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center">
            <Bot className="w-6 h-6 mr-3 text-primary" />
            AI Assistant
          </h1>
          <p className="text-textSecondary mt-1">Chat with specialized AI models for your operations.</p>
        </div>

        <div className="mt-4 md:mt-0 bg-surface border border-border rounded-lg p-1 flex items-center">
          <button
            onClick={() => setDomain('database')}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
              domain === 'database'
                ? 'bg-primary text-white shadow-sm'
                : 'text-textSecondary hover:text-textPrimary hover:bg-surfaceHover'
            }`}
          >
            <Database className="w-4 h-4 mr-2" />
            Database AI
          </button>
          <button
            onClick={() => setDomain('infrastructure')}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
              domain === 'infrastructure'
                ? 'bg-primary text-white shadow-sm'
                : 'text-textSecondary hover:text-textPrimary hover:bg-surfaceHover'
            }`}
          >
            <ShieldAlert className="w-4 h-4 mr-2" />
            Server & Cyber AI
          </button>
        </div>
      </div>

      <div className="flex-1 glass-panel border border-border rounded-xl overflow-hidden relative">
        <AIChatInterface 
          key={domain}
          domain={domain} 
          title={domain === 'database' ? 'Database AI Assistant' : 'Server & Cyber AI Assistant'}
          description={domain === 'database' ? 'Database Queries & Performance Analysis' : 'Infrastructure Monitoring & Security Analysis'}
          systemGreeting={domain === 'database' 
            ? 'Hello, Administrator. I am your Database AI Assistant. I have deep insights into query performance, schema optimization, and storage metrics. How can I assist you with your databases today?' 
            : 'Hello, Administrator. I am your Infrastructure AI Assistant. I continuously monitor server health, cluster orchestration, and perimeter security. Please detail the security logs or server metrics you\'d like me to analyze.'}
        />
      </div>
    </div>
  );
}
