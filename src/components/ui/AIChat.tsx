import React, { useState } from 'react';
import { Bot, User, Send, Paperclip, MoreVertical, RefreshCw, FileText } from 'lucide-react';

export interface AIChatMessage {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  references?: string[];
  timestamp: string;
}

interface AIChatProps {
  title?: string;
  contextPlaceholder?: string;
  initialMessages?: AIChatMessage[];
}

export default function AIChat({ 
  title = "Redhelp Assistant", 
  contextPlaceholder = "Ask about infrastructure, alerts, or system health...",
  initialMessages = []
}: AIChatProps) {
  const defaultMessages: AIChatMessage[] = initialMessages.length > 0 ? initialMessages : [
    {
      id: 1,
      sender: 'ai',
      text: `Hello, Administrator. I am your ${title}. How can I assist you with this context?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];

  const [messages, setMessages] = useState<AIChatMessage[]>(defaultMessages);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: AIChatMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // Mock AI response
    setTimeout(() => {
      const aiResponse: AIChatMessage = {
        id: messages.length + 2,
        sender: 'ai',
        text: 'Analyzing system logs and documentation to answer your query. Currently, no anomalies are detected related to that request. Can you provide more context?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-surface border border-border rounded-xl shadow-sm overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-border flex items-center justify-between bg-background">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 mr-3">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-textPrimary">{title}</h2>
            <p className="text-xs text-success flex items-center mt-0.5">
              <span className="w-2 h-2 rounded-full bg-success mr-1"></span> Online
            </p>
          </div>
        </div>
        <div className="flex space-x-1 text-textSecondary">
          <button className="p-2 hover:bg-surfaceHover rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-surfaceHover rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-background/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'user' ? 'bg-surface border border-border ml-2 mt-1' : 'bg-primary/10 border border-primary/20 mr-2 mt-1'
              }`}>
                {msg.sender === 'user' ? <User className="w-3 h-3 text-textSecondary" /> : <Bot className="w-3 h-3 text-primary" />}
              </div>
              
              <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-3 py-2 text-sm rounded-2xl ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-white rounded-tr-sm' 
                    : 'bg-surface border border-border text-textPrimary rounded-tl-sm'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
                
                {msg.references && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {msg.references.map((ref, idx) => (
                      <div key={idx} className="flex items-center text-[10px] bg-surfaceHover border border-border px-1.5 py-0.5 rounded text-textSecondary cursor-pointer hover:text-primary transition-colors">
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

      <div className="p-3 bg-background border-t border-border">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={contextPlaceholder}
            className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm text-textPrimary placeholder-textSecondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
