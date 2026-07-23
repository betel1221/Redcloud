import React from 'react';
import AIChatInterface from '../../components/ui/AIChatInterface';

export default function DatabaseAIAssistant() {
  return (
    <AIChatInterface 
      domain="database"
      title="Database AI Assistant"
      description="Database Queries & Performance Analysis"
      systemGreeting="Hello, Administrator. I am your Database AI Assistant. I have deep insights into query performance, schema optimization, and storage metrics. How can I assist you with your databases today?"
    />
  );
}
