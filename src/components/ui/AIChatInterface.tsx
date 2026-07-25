import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, Paperclip, FileText, Trash2, Plus, Search, MessageSquare, Menu, X } from 'lucide-react';

interface Message {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  references?: string[];
  timestamp: string;
}

interface ChatThread {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: string;
}

interface AIChatInterfaceProps {
  domain: 'database' | 'infrastructure';
  title: string;
  description: string;
  systemGreeting: string;
}

export default function AIChatInterface({ domain, title, description, systemGreeting }: AIChatInterfaceProps) {
  const storageKey = `redcloud_ai_threads_${domain}`;
  
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>('');
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load threads on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setThreads(parsed);
          setActiveThreadId(parsed[0].id);
          return;
        }
      } catch (e) {
        console.error("Failed to parse threads", e);
      }
    }
    
    // Create default thread if none exist
    createNewThread();
  }, [domain]);

  // Save threads when updated
  useEffect(() => {
    if (threads.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(threads));
    }
  }, [threads, storageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threads, activeThreadId]);

  const activeThread = threads.find(t => t.id === activeThreadId);

  const createNewThread = () => {
    const newId = Date.now().toString();
    const newThread: ChatThread = {
      id: newId,
      title: 'New Chat',
      messages: [{ 
        id: 1, 
        sender: 'ai', 
        text: systemGreeting, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }],
      updatedAt: new Date().toISOString()
    };
    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newId);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const deleteThread = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setThreads(prev => {
      const remaining = prev.filter(t => t.id !== id);
      if (remaining.length === 0) {
        setTimeout(createNewThread, 0);
        return [];
      }
      if (id === activeThreadId) {
        setActiveThreadId(remaining[0].id);
      }
      return remaining;
    });
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
    if (file && activeThreadId) {
      const newMessage: Message = {
        id: Date.now(),
        sender: 'user',
        text: `📎 Uploaded file: ${file.name}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      addMessageToThread(activeThreadId, newMessage);
      
      setTimeout(() => {
        const aiResponse: Message = {
          id: Date.now() + 1,
          sender: 'ai',
          text: `I have received the file "${file.name}". I am parsing the contents against our ${domain} parameters now. Please specify what analysis you require.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        addMessageToThread(activeThreadId, aiResponse);
      }, 1500);
    }
  };

  const addMessageToThread = (threadId: string, message: Message, newTitle?: string) => {
    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          title: newTitle || t.title,
          messages: [...t.messages, message],
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeThreadId) return;

    const currentInput = input;
    setInput('');

    const newMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: currentInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Auto-generate title for new chats based on first user message
    let newTitle = undefined;
    if (activeThread && activeThread.title === 'New Chat' && activeThread.messages.length === 1) {
      newTitle = currentInput.slice(0, 30) + (currentInput.length > 30 ? '...' : '');
    }

    addMessageToThread(activeThreadId, newMessage, newTitle);

    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: generateProfessionalResponse(currentInput),
        references: [`${title} Telemetry`, 'System Logs'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      addMessageToThread(activeThreadId, aiResponse);
    }, 1500);
  };

  const filteredThreads = threads.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex overflow-hidden relative bg-background/50">
      
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden absolute top-4 left-4 z-50 p-2 bg-surface border border-border rounded-lg text-textPrimary shadow-md"
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Inner Sidebar */}
      <div className={`
        absolute md:relative z-40 h-full w-64 flex flex-col bg-surface/80 border-r border-border backdrop-blur-md transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 pt-16 md:pt-4 border-b border-border">
          <button 
            onClick={createNewThread}
            className="w-full flex items-center justify-center py-2.5 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </button>
        </div>

        <div className="p-4 border-b border-border">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-textSecondary" />
            </div>
            <input 
              type="text" 
              placeholder="Search chats..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-textPrimary placeholder-textSecondary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
          <p className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2 px-2 mt-2">Recent</p>
          {filteredThreads.map(thread => (
            <button
              key={thread.id}
              onClick={() => { setActiveThreadId(thread.id); if(window.innerWidth < 768) setIsSidebarOpen(false); }}
              className={`w-full text-left group flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                activeThreadId === thread.id 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-textSecondary hover:bg-surfaceHover hover:text-textPrimary'
              }`}
            >
              <div className="flex items-center truncate">
                <MessageSquare className={`w-4 h-4 mr-2 flex-shrink-0 ${activeThreadId === thread.id ? 'text-primary' : 'text-textSecondary group-hover:text-textPrimary'}`} />
                <span className="truncate text-sm">{thread.title}</span>
              </div>
              <Trash2 
                onClick={(e) => deleteThread(e, thread.id)}
                className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity hover:text-danger flex-shrink-0 ml-2`} 
              />
            </button>
          ))}
          {filteredThreads.length === 0 && (
            <p className="text-xs text-textSecondary text-center py-4">No chats found.</p>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface/50 pl-16 md:pl-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 mr-3">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-textPrimary">{title}</h2>
              <p className="text-xs text-textSecondary flex items-center hidden sm:flex">
                <span className="w-2 h-2 rounded-full bg-success mr-1"></span> {description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
          {activeThread?.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[90%] md:max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.sender === 'user' ? 'bg-surface border border-border ml-3' : 'bg-primary/20 border border-primary/30 mr-3'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4 text-textSecondary" /> : <Bot className="w-4 h-4 text-primary" />}
                </div>
                
                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-tr-sm shadow-md' 
                      : 'bg-surface border border-border text-textPrimary rounded-tl-sm shadow-sm'
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

        <div className="p-4 bg-surface/50 border-t border-border">
          <form onSubmit={handleSend} className="flex items-center space-x-2 max-w-4xl mx-auto">
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
              className="p-2 text-textSecondary hover:text-primary transition-colors bg-surface border border-border rounded-lg shadow-sm"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${title}...`}
              className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-sm text-textPrimary placeholder-textSecondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
            />
            <button 
              type="submit" 
              disabled={!input.trim()}
              className="p-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="text-center mt-2">
            <p className="text-[10px] text-textSecondary">
              AI can make mistakes. Consider verifying critical operational metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
