import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, Paperclip, FileText, Trash2, Plus, Search, MessageSquare, Menu, X, Pin, Edit2, Download, Check } from 'lucide-react';
import html2pdf from 'html2pdf.js';

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
  isPinned?: boolean;
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
  
  // States for renaming thread
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // States for editing user prompt
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingMessageText, setEditingMessageText] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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

  const togglePinThread = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setThreads(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, isPinned: !t.isPinned };
      }
      return t;
    }));
  };

  const startRenameThread = (e: React.MouseEvent, thread: ChatThread) => {
    e.stopPropagation();
    setEditingThreadId(thread.id);
    setEditingTitle(thread.title);
  };

  const saveRenameThread = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editingThreadId && editingTitle.trim()) {
      setThreads(prev => prev.map(t => {
        if (t.id === editingThreadId) {
          return { ...t, title: editingTitle.trim() };
        }
        return t;
      }));
    }
    setEditingThreadId(null);
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
    processUserMessage(currentInput);
  };

  const processUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let newTitle = undefined;
    if (activeThread && activeThread.title === 'New Chat' && activeThread.messages.length === 1) {
      newTitle = text.slice(0, 30) + (text.length > 30 ? '...' : '');
    }

    addMessageToThread(activeThreadId, newMessage, newTitle);

    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: generateProfessionalResponse(text),
        references: [`${title} Telemetry`, 'System Logs'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      addMessageToThread(activeThreadId, aiResponse);
    }, 1500);
  };

  const startEditMessage = (msg: Message) => {
    setEditingMessageId(msg.id);
    setEditingMessageText(msg.text);
  };

  const saveEditedMessage = (msgId: number) => {
    if (!activeThread || !editingMessageText.trim()) {
      setEditingMessageId(null);
      return;
    }

    // Find index of the edited message
    const msgIndex = activeThread.messages.findIndex(m => m.id === msgId);
    if (msgIndex === -1) return;

    // Slice thread up to the edited message (excluding it, we'll re-add it)
    const previousMessages = activeThread.messages.slice(0, msgIndex);
    
    // Create new updated thread state
    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          messages: previousMessages,
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));
    
    setEditingMessageId(null);
    processUserMessage(editingMessageText);
  };

  const exportPDF = () => {
    if (!chatContainerRef.current) return;
    const opt = {
      margin:       0.5,
      filename:     `${activeThread?.title || 'Chat'}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    };
    html2pdf().set(opt).from(chatContainerRef.current).save();
  };

  const filteredThreads = threads.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

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
            <div
              key={thread.id}
              onClick={() => { setActiveThreadId(thread.id); if(window.innerWidth < 768) setIsSidebarOpen(false); }}
              className={`w-full text-left group flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                activeThreadId === thread.id 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-textSecondary hover:bg-surfaceHover hover:text-textPrimary'
              }`}
            >
              {editingThreadId === thread.id ? (
                <form onSubmit={saveRenameThread} className="flex-1 flex items-center mr-2">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => saveRenameThread()}
                    autoFocus
                    className="w-full bg-background border border-border rounded px-2 py-1 text-sm text-textPrimary focus:outline-none focus:border-primary"
                    onClick={e => e.stopPropagation()}
                  />
                </form>
              ) : (
                <div className="flex items-center truncate flex-1 pr-2">
                  <MessageSquare className={`w-4 h-4 mr-2 flex-shrink-0 ${activeThreadId === thread.id ? 'text-primary' : 'text-textSecondary group-hover:text-textPrimary'}`} />
                  <span className="truncate text-sm">{thread.title}</span>
                </div>
              )}
              
              {!editingThreadId && (
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => togglePinThread(e, thread.id)} className="p-1 hover:text-primary transition-colors" title={thread.isPinned ? "Unpin" : "Pin"}>
                    <Pin className={`w-3.5 h-3.5 ${thread.isPinned ? 'fill-current' : ''}`} />
                  </button>
                  <button onClick={(e) => startRenameThread(e, thread)} className="p-1 hover:text-primary transition-colors" title="Rename">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={(e) => deleteThread(e, thread.id)} className="p-1 hover:text-danger transition-colors" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {thread.isPinned && !editingThreadId && activeThreadId !== thread.id && (
                <Pin className="w-3.5 h-3.5 flex-shrink-0 ml-1 text-primary fill-current group-hover:hidden" />
              )}
            </div>
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
          <div className="flex items-center">
            <button
              onClick={exportPDF}
              className="flex items-center px-3 py-1.5 bg-surface border border-border text-textSecondary hover:text-textPrimary hover:bg-surfaceHover rounded-md text-sm font-medium transition-colors shadow-sm"
              title="Download as PDF"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar" ref={chatContainerRef}>
          {activeThread?.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} group`}>
              <div className={`flex max-w-[90%] md:max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                  msg.sender === 'user' ? 'bg-surface border border-border ml-3' : 'bg-primary/20 border border-primary/30 mr-3'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4 text-textSecondary" /> : <Bot className="w-4 h-4 text-primary" />}
                </div>
                
                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} w-full`}>
                  {editingMessageId === msg.id && msg.sender === 'user' ? (
                    <div className="w-full bg-surface border border-primary/50 rounded-xl p-3 shadow-md">
                      <textarea
                        value={editingMessageText}
                        onChange={(e) => setEditingMessageText(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg p-2 text-sm text-textPrimary focus:outline-none focus:border-primary resize-none"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button 
                          onClick={() => setEditingMessageId(null)}
                          className="px-3 py-1.5 text-xs font-medium text-textSecondary hover:text-textPrimary hover:bg-surfaceHover rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => saveEditedMessage(msg.id)}
                          className="px-3 py-1.5 text-xs font-medium bg-primary text-white hover:bg-primary/90 rounded-md transition-colors"
                        >
                          Save & Submit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={`px-4 py-3 rounded-2xl relative ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-white rounded-tr-sm shadow-md' 
                        : 'bg-surface border border-border text-textPrimary rounded-tl-sm shadow-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      
                      {msg.sender === 'user' && (
                        <button
                          onClick={() => startEditMessage(msg)}
                          className="absolute top-2 -left-8 p-1 text-textSecondary hover:text-primary transition-colors opacity-0 group-hover:opacity-100 bg-surface rounded-full shadow-sm border border-border"
                          title="Edit prompt"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                  
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
