import React, { useState } from 'react';
import { Bot, User, Send, Paperclip, MoreVertical, RefreshCw, FileText } from 'lucide-react';

interface Message {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  references?: string[];
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    sender: 'ai',
    text: 'Hello, Administrator. I am your Redhelp Infrastructure Assistant. I have access to real-time monitoring data, logs, and the company knowledge base. How can I help you today?',
    timestamp: '10:00 AM'
  },
  {
    id: 2,
    sender: 'user',
    text: 'Why is Server 2 running slowly?',
    timestamp: '10:02 AM'
  },
  {
    id: 3,
    sender: 'ai',
    text: 'CPU usage has averaged 94% over the last 15 minutes. The FastAPI process is consuming most of the CPU. Memory usage is normal. Disk usage is acceptable. I recommend checking application logs and scaling workers if high load continues.',
    references: ['Server 02 Metrics', 'FastAPI Process Logs'],
    timestamp: '10:02 AM'
  },
  {
    id: 4,
    sender: 'user',
    text: 'Which database has the largest storage?',
    timestamp: '10:05 AM'
  },
  {
    id: 5,
    sender: 'ai',
    text: 'CompanyERP uses 152 GB. HRDB uses 46 GB. FinanceDB uses 21 GB.',
    references: ['Database Storage Index'],
    timestamp: '10:05 AM'
  }
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // Mock AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        sender: 'ai',
        text: 'Analyzing system logs and documentation to answer your query. Currently, no anomalies are detected related to that request. Can you provide more context?',
        references: ['Knowledge Base v2.4'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col glass-panel animate-fade-in">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface/50 rounded-t-2xl">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 mr-3">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-textPrimary">Redhelp Assistant</h2>
            <p className="text-xs text-success flex items-center">
              <span className="w-2 h-2 rounded-full bg-success mr-1"></span> Online & Monitoring
            </p>
          </div>
        </div>
        <div className="flex space-x-2 text-textSecondary">
          <button className="p-2 hover:bg-surfaceHover rounded-lg transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-surfaceHover rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'user' ? 'bg-surface border border-border ml-3' : 'bg-primary/20 border border-primary/30 mr-3'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4 text-textSecondary" /> : <Bot className="w-4 h-4 text-primary" />}
              </div>
              
              <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-2xl ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-white rounded-tr-sm' 
                    : 'bg-surface border border-border text-textPrimary rounded-tl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
                
                {msg.references && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {msg.references.map((ref, idx) => (
                      <div key={idx} className="flex items-center text-xs bg-surfaceHover border border-border px-2 py-1 rounded-md text-textSecondary cursor-pointer hover:text-primary hover:border-primary/50 transition-colors">
                        <FileText className="w-3 h-3 mr-1" />
                        {ref}
                      </div>
                    ))}
                  </div>
                )}
                
                <span className="text-[10px] text-textSecondary mt-1 opacity-70">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-surface/50 border-t border-border rounded-b-2xl">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <button type="button" className="p-2 text-textSecondary hover:text-primary transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about infrastructure, alerts, or system health..."
            className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-sm text-textPrimary placeholder-textSecondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="p-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
