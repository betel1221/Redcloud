import React from 'react';
import AIChatInterface from '../../components/ui/AIChatInterface';

export default function InfrastructureAIAssistant() {
  return (
    <AIChatInterface 
      domain="infrastructure"
      title="Server & Security AI"
      description="Infrastructure Monitoring & Security Analysis"
      systemGreeting="Hello, Administrator. I am your Infrastructure AI Assistant. I continuously monitor server health, cluster orchestration, and perimeter security. Please detail the security logs or server metrics you'd like me to analyze."
    />
  );
}
