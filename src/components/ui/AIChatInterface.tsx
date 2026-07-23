import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, Paperclip, FileText, Trash2 } from 'lucide-react';

interface Message {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  references?: string[];
  timestamp: string;
}

interface AIChatInterfaceProps {
  domain: 'database' | 'infrastructure';
  title: string;
  description: string;
  systemGreeting: string;
}

export default function AIChatInterface({ domain, title, description, systemGreeting }: AIChatInterfaceProps) {
  const storageKey = `redcloud_ai_history_${domain}`;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        setMessages([{ id: 1, sender: 'ai', text: systemGreeting, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      }
    } else {
      setMessages([{ id: 1, sender: 'ai', text: systemGreeting, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }
  }, [domain, systemGreeting, storageKey]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, storageKey]);

  const handleClearHistory = () => {
    const initialMsg: Message = { id: 1, sender: 'ai', text: systemGreeting, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages([initialMsg]);
    localStorage.setItem(storageKey, JSON.stringify([initialMsg]));
  };

  const generateProfessionalResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    if (domain === 'database') {
      if (lowerQuery.includes('slow') || lowerQuery.includes('performance')) {
        return "I have analyzed the database performance metrics. There is a slight query latency spike on the 'users' table index. I recommend reviewing the latest EXPLAIN plans and considering index optimization.";
      }
      if (lowerQuery.includes('storage') || lowerQuery.includes('size')) {
        return "Current database storage utilization is at 64% (320GB/500GB). Growth rate suggests we will not reach capacity for approximately 8 months. No immediate action is required.";
      }
      return "I have received your database query. I am analyzing the schema, current active connections, and query logs to provide a comprehensive response.";
    } else {
      if (lowerQuery.includes('security') || lowerQuery.includes('attack') || lowerQuery.includes('breach')) {
        return "Security protocols are actively monitoring all ingress traffic. We recently blocked 43 suspicious IPs attempting port scans. The perimeter firewall remains fully secure.";
      }
      if (lowerQuery.includes('server') || lowerQuery.includes('cpu') || lowerQuery.includes('memory')) {
        return "Server node alpha-01 is currently experiencing 85% CPU utilization due to a background worker process. Memory usage is stable at 45%. Auto-scaling rules are configured if it exceeds 90%.";
      }
      return "I am processing your infrastructure request. Analyzing server health metrics, security event logs, and network topology to formulate a precise assessment.";
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newMessage: Message = {
        id: Date.now(),
        sender: 'user',
        text: `📎 Uploaded file: ${file.name}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newMessage]);
      
      setTimeout(() => {
        const aiResponse: Message = {
          id: Date.now() + 1,
          sender: 'ai',
          text: `I have received the file "${file.name}". I am parsing the contents against our ${domain} parameters now. Please specify what analysis you require.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1500);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    const currentInput = input;
    setInput('');

    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: generateProfessionalResponse(currentInput),
        references: [`${title} Telemetry`, 'System Logs'],
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
            <h2 className="text-lg font-bold text-textPrimary">{title}</h2>
            <p className="text-xs text-textSecondary flex items-center">
              <span className="w-2 h-2 rounded-full bg-success mr-1"></span> {description}
            </p>
          </div>
        </div>
        <button 
          onClick={handleClearHistory}
          className="p-2 text-textSecondary hover:text-danger transition-colors rounded-lg hover:bg-surfaceHover"
          title="Clear Conversation History"
        >
          <Trash2 className="w-4 h-4" />
        </button>
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
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-surface/50 border-t border-border rounded-b-2xl">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />
          <button 
            type="button" 
            title="Attach file"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-textSecondary hover:text-primary transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${title}...`}
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
