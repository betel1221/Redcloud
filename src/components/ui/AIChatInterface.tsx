import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, Paperclip, FileText, Trash2, Plus, Search, MessageSquare, Menu, X, Pin, Edit2, Download, Loader2, Database, ShieldAlert, Server } from 'lucide-react';

interface Message {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  references?: string[];
  timestamp: string;
}

interface ChatThread {
  id: string; // Session ID from n8n (e.g. "17") or temporary local ID
  title: string;
  messages: Message[];
  updatedAt: string;
  isPinned?: boolean;
}

interface AIChatInterfaceProps {
  domain: 'database' | 'infrastructure';
  title: string;
  description: string;
  systemGreeting?: string;
}

function parseInlineMarkdown(text: string) {
  const parts = [];
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  let lastIdx = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(<strong key={match.index} className="font-semibold text-textPrimary">{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(<code key={match.index} className="bg-surfaceHover border border-border px-1.5 py-0.5 rounded text-primary font-mono text-xs">{token.slice(1, -1)}</code>);
    }
    lastIdx = match.index + token.length;
  }
  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }
  return parts.length > 0 ? parts : text;
}

function FormattedMarkdown({ content }: { content: string }) {
  if (!content) return null;

  const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'code', lang: match[1] || 'sql', value: match[2].trim() });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    parts.push({ type: 'text', value: content.slice(lastIndex) });
  }

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {parts.map((part, pIdx) => {
        if (part.type === 'code') {
          return (
            <div key={pIdx} className="my-3 rounded-lg border border-border bg-slate-950 p-3 font-mono text-xs text-slate-100 overflow-x-auto relative group/code shadow-inner">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 border-b border-slate-800 pb-1 flex justify-between items-center">
                <span>{part.lang}</span>
                <button 
                  type="button"
                  onClick={() => navigator.clipboard.writeText(part.value)} 
                  className="hover:text-primary transition-colors text-[10px] px-1.5 py-0.5 rounded bg-slate-800"
                >
                  Copy
                </button>
              </div>
              <pre className="whitespace-pre overflow-x-auto"><code>{part.value}</code></pre>
            </div>
          );
        }

        const lines = part.value.split('\n');
        return (
          <div key={pIdx} className="space-y-1">
            {lines.map((line, lIdx) => {
              if (!line.trim()) return <div key={lIdx} className="h-1" />;

              if (line.startsWith('### ')) {
                return <h3 key={lIdx} className="text-base font-bold text-textPrimary mt-3 mb-1">{parseInlineMarkdown(line.slice(4))}</h3>;
              }
              if (line.startsWith('## ')) {
                return <h2 key={lIdx} className="text-lg font-bold text-textPrimary mt-3 mb-1">{parseInlineMarkdown(line.slice(3))}</h2>;
              }
              if (line.startsWith('# ')) {
                return <h1 key={lIdx} className="text-xl font-bold text-textPrimary mt-3 mb-1">{parseInlineMarkdown(line.slice(2))}</h1>;
              }

              if (line.trim().startsWith('• ') || line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                const bulletContent = line.trim().replace(/^[•\-\*]\s*/, '');
                return (
                  <div key={lIdx} className="flex items-start ml-2 my-0.5">
                    <span className="text-primary mr-2 font-bold">•</span>
                    <div>{parseInlineMarkdown(bulletContent)}</div>
                  </div>
                );
              }

              return <p key={lIdx}>{parseInlineMarkdown(line)}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function AIChatInterface({ domain, title, description }: AIChatInterfaceProps) {
  const storageKey = `redcloud_ai_threads_${domain}`;
  
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>('');
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // States for renaming thread
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // States for editing user prompt
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingMessageText, setEditingMessageText] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isLoadedRef = useRef<boolean>(false);

  // Load saved threads from PostgreSQL erp_demo via n8n backend endpoint
  useEffect(() => {
    isLoadedRef.current = false;
    const saved = localStorage.getItem(storageKey);
    let loadedThreads: ChatThread[] = [];
    if (saved) {
      try {
        const parsed: ChatThread[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedThreads = parsed.filter(t => t.messages && t.messages.length > 0 || t.title === 'New Chat');
        }
      } catch (e) {
        console.error("Failed to parse threads", e);
      }
    }

    const chatHistoryUrl = import.meta.env.VITE_N8N_CHAT_HISTORY_URL || 'http://localhost:5678/webhook/chat-history';
    fetch(chatHistoryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation: 'get_history', domain: domain })
    })
      .then(res => res.ok ? res.json() : null)
      .then(dbData => {
        if (Array.isArray(dbData) && dbData.length > 0) {
          const formatted: ChatThread[] = dbData.map((s: any) => ({
            id: s.id,
            title: s.title || 'New Chat',
            isPinned: !!s.is_pinned,
            updatedAt: s.updated_at || new Date().toISOString(),
            messages: Array.isArray(s.messages) ? s.messages : []
          }));
          setThreads(formatted);
          setActiveThreadId(formatted[0].id);
        } else if (loadedThreads.length > 0) {
          setThreads(loadedThreads);
          setActiveThreadId(loadedThreads[0].id);
        } else {
          const newId = `session_${Date.now()}`;
          const initialThread: ChatThread = {
            id: newId,
            title: 'New Chat',
            messages: [],
            updatedAt: new Date().toISOString()
          };
          setThreads([initialThread]);
          setActiveThreadId(newId);
        }
      })
      .catch(() => {
        if (loadedThreads.length > 0) {
          setThreads(loadedThreads);
          setActiveThreadId(loadedThreads[0].id);
        } else {
          const newId = `session_${Date.now()}`;
          const initialThread: ChatThread = {
            id: newId,
            title: 'New Chat',
            messages: [],
            updatedAt: new Date().toISOString()
          };
          setThreads([initialThread]);
          setActiveThreadId(newId);
        }
      })
      .finally(() => {
        isLoadedRef.current = true;
      });
  }, [domain, storageKey]);

  // Sync state with localStorage
  useEffect(() => {
    if (isLoadedRef.current) {
      localStorage.setItem(storageKey, JSON.stringify(threads));
    }
  }, [threads, storageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threads, activeThreadId]);

  const activeThread = threads.find(t => t.id === activeThreadId);

  const createNewThread = () => {
    // Check if an empty 'New Chat' session already exists
    const existingEmpty = threads.find(t => t.messages.length === 0);
    if (existingEmpty) {
      setActiveThreadId(existingEmpty.id);
      if (window.innerWidth < 768) setIsSidebarOpen(false);
      return;
    }

    const newId = `session_${Date.now()}`;
    const newThread: ChatThread = {
      id: newId,
      title: 'New Chat',
      messages: [],
      updatedAt: new Date().toISOString()
    };
    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newId);

    // Save session to PostgreSQL via n8n
    const chatHistoryUrl = import.meta.env.VITE_N8N_CHAT_HISTORY_URL || 'http://localhost:5678/webhook/chat-history';
    fetch(chatHistoryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation: 'save_session',
        session_id: newId,
        domain: domain,
        title: 'New Chat',
        is_pinned: false
      })
    }).catch(() => {});

    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const deleteThread = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    setThreads(prev => {
      const remaining = prev.filter(t => t.id !== id);
      if (remaining.length === 0) {
        const newId = `session_${Date.now()}`;
        const newThread: ChatThread = {
          id: newId,
          title: 'New Chat',
          messages: [],
          updatedAt: new Date().toISOString()
        };
        setActiveThreadId(newId);
        return [newThread];
      }
      if (id === activeThreadId) {
        setActiveThreadId(remaining[0].id);
      }
      return remaining;
    });
  };

  const togglePinThread = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    setThreads(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, isPinned: !t.isPinned };
      }
      return t;
    }));
  };

  const startRenameThread = (e: React.MouseEvent, thread: ChatThread) => {
    e.stopPropagation();
    e.preventDefault();
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

  const extractTextFromN8nData = (resData: any): { text: string; session_id?: number } => {
    if (!resData) return { text: "" };
    let parsed = resData;
    let returnedSessionId: number | undefined = undefined;

    if (Array.isArray(parsed) && parsed.length > 0) {
      parsed = parsed[0];
    }

    if (typeof parsed === 'object' && parsed !== null) {
      if (parsed.session_id && typeof parsed.session_id === 'number') {
        returnedSessionId = parsed.session_id;
      }
    }

    if (typeof parsed === 'string') {
      const trimmed = parsed.trim();
      if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        try {
          const jsonParsed = JSON.parse(trimmed);
          if (jsonParsed && typeof jsonParsed === 'object') {
            const nested = extractTextFromN8nData(jsonParsed);
            return {
              text: nested.text,
              session_id: returnedSessionId || nested.session_id
            };
          }
        } catch (e) {
          try {
            const sanitized = trimmed.replace(/\r?\n/g, "\\n");
            const jsonParsed = JSON.parse(sanitized);
            if (jsonParsed && typeof jsonParsed === 'object') {
              const nested = extractTextFromN8nData(jsonParsed);
              return {
                text: nested.text,
                session_id: returnedSessionId || nested.session_id
              };
            }
          } catch (e2) {
            const textMatch = trimmed.match(/"(?:text|answer|output|message)"\s*:\s*"([\s\S]*?)"\s*\}?\s*$/);
            if (textMatch && textMatch[1]) {
              return {
                text: textMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').trim(),
                session_id: returnedSessionId
              };
            }
          }
        }
      }
      return { text: parsed, session_id: returnedSessionId };
    }

    if (typeof parsed === 'object' && parsed !== null) {
      for (const key of ['answer', 'text', 'output', 'message', 'response']) {
        if (parsed[key] && typeof parsed[key] === 'string') {
          return { text: parsed[key], session_id: returnedSessionId };
        }
      }
    }

    return { text: typeof parsed === 'string' ? parsed : JSON.stringify(parsed), session_id: returnedSessionId };
  };

  const fetchN8nAIResponse = async (query: string, currentThreadId: string): Promise<{ text: string; session_id?: number }> => {
    const endpoint = domain === 'database' 
      ? (import.meta.env.VITE_N8N_DB_URL || 'http://localhost:5678/webhook/erp-chat')
      : (import.meta.env.VITE_N8N_SERVER_URL || 'http://localhost:5678/webhook/sre-chatbot');
    
    // Check if currentThreadId is a numeric session ID (from n8n database)
    const numSessionId = parseInt(currentThreadId.replace('session_', ''));
    const sessionIdToSend = !isNaN(numSessionId) && numSessionId > 0 && !currentThreadId.startsWith('session_') ? numSessionId : 0;

    const payload = domain === 'database' 
      ? { message: query, session_id: sessionIdToSend, domain: 'database', database_name: 'FOODAPPANDDB' }
      : { question: query, server_name: 'ERP-Postgres-Primary', session_id: sessionIdToSend, domain: 'infrastructure', database_name: 'erp_demo' };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const text = await response.text();
        const rawData = text ? JSON.parse(text) : {};
        const extracted = extractTextFromN8nData(rawData);
        if (extracted.text) return extracted;
      }
    } catch (err) {
      console.warn("n8n Webhook connection attempt failed:", err);
    }

    return { text: "Error: Unable to connect to n8n AI service. Please verify the n8n backend endpoint." };
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
      setIsGenerating(true);
      
      setTimeout(async () => {
        const res = await fetchN8nAIResponse(`Uploaded file: ${file.name}`, activeThreadId);
        const aiResponse: Message = {
          id: Date.now() + 1,
          sender: 'ai',
          text: res.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        addMessageToThread(activeThreadId, aiResponse, undefined, res.session_id);
        setIsGenerating(false);
      }, 1000);
    }
  };

  const addMessageToThread = (threadId: string, message: Message, newTitle?: string, returnedSessionId?: number) => {
    const finalSessionId = returnedSessionId ? String(returnedSessionId) : threadId;

    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          id: finalSessionId,
          title: newTitle || t.title,
          messages: [...t.messages, message],
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));

    if (returnedSessionId) {
      setActiveThreadId(String(returnedSessionId));
    }

    // Persist message to PostgreSQL erp_demo via n8n
    const chatHistoryUrl = import.meta.env.VITE_N8N_CHAT_HISTORY_URL || 'http://localhost:5678/webhook/chat-history';
    fetch(chatHistoryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation: 'save_message',
        session_id: finalSessionId,
        domain: domain,
        message: message
      })
    }).catch(() => {});
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeThreadId || isGenerating) return;

    const currentInput = input;
    setInput('');
    processUserMessage(currentInput);
  };

  const processUserMessage = async (text: string) => {
    const newMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let newTitle = undefined;
    if (activeThread && (activeThread.title === 'New Chat' || activeThread.messages.length === 0)) {
      newTitle = text.slice(0, 28) + (text.length > 28 ? '...' : '');
    }

    const currentThreadId = activeThreadId;
    addMessageToThread(currentThreadId, newMessage, newTitle);
    setIsGenerating(true);

    const res = await fetchN8nAIResponse(text, currentThreadId);
    
    const aiResponse: Message = {
      id: Date.now() + 1,
      sender: 'ai',
      text: res.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    addMessageToThread(currentThreadId, aiResponse, undefined, res.session_id);
    setIsGenerating(false);
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

    const msgIndex = activeThread.messages.findIndex(m => m.id === msgId);
    if (msgIndex === -1) return;

    const previousMessages = activeThread.messages.slice(0, msgIndex);
    
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

  const exportMarkdown = () => {
    if (!activeThread || activeThread.messages.length === 0) return;
    
    let content = `# ${activeThread.title}\n\n`;
    content += `*Exported on: ${new Date().toLocaleString()}*\n\n---\n\n`;
    
    activeThread.messages.forEach(msg => {
      const sender = msg.sender === 'user' ? '👤 User' : '🤖 AI Assistant';
      content += `### ${sender} [${msg.timestamp}]\n\n${msg.text}\n\n---\n\n`;
    });
    
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${activeThread.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_chat.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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

      {/* Sidebar */}
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
          <p className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2 px-2 mt-2">
            {domain === 'database' ? 'Database Chat History' : 'Server & Cyber History'}
          </p>
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
                <form onSubmit={saveRenameThread} className="flex-1 flex items-center mr-2" onClick={e => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => saveRenameThread()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveRenameThread();
                      if (e.key === 'Escape') setEditingThreadId(null);
                    }}
                    autoFocus
                    className="w-full bg-background border border-primary rounded px-2 py-1 text-sm text-textPrimary focus:outline-none"
                  />
                </form>
              ) : (
                <div className="flex items-center truncate flex-1 pr-2">
                  <MessageSquare className={`w-4 h-4 mr-2 flex-shrink-0 ${activeThreadId === thread.id ? 'text-primary' : 'text-textSecondary group-hover:text-textPrimary'}`} />
                  <span className="truncate text-sm">{thread.title}</span>
                </div>
              )}
              
              {!editingThreadId && (
                <div className={`flex items-center space-x-1 transition-opacity ${
                  activeThreadId === thread.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  <button 
                    onClick={(e) => togglePinThread(e, thread.id)} 
                    className="p-1 hover:text-primary transition-colors text-textSecondary hover:bg-surface rounded" 
                    title={thread.isPinned ? "Unpin" : "Pin"}
                  >
                    <Pin className={`w-3.5 h-3.5 ${thread.isPinned ? 'fill-current text-primary' : ''}`} />
                  </button>
                  <button 
                    onClick={(e) => startRenameThread(e, thread)} 
                    className="p-1 hover:text-primary transition-colors text-textSecondary hover:bg-surface rounded" 
                    title="Rename"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => deleteThread(e, thread.id)} 
                    className="p-1 hover:text-danger transition-colors text-textSecondary hover:bg-surface rounded" 
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
          {filteredThreads.length === 0 && (
            <p className="text-xs text-textSecondary text-center py-4">No chats yet.</p>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface/50 pl-16 md:pl-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 mr-3">
              {domain === 'database' ? <Database className="w-5 h-5 text-primary" /> : <ShieldAlert className="w-5 h-5 text-primary" />}
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
              onClick={exportMarkdown}
              className="flex items-center px-3 py-1.5 bg-surface border border-border text-textSecondary hover:text-textPrimary hover:bg-surfaceHover rounded-md text-sm font-medium transition-colors shadow-sm"
              title="Download as Markdown"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar" ref={chatContainerRef}>
          {(!activeThread || activeThread.messages.length === 0) ? (
            domain === 'database' ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 mb-4">
                  <Database className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-textPrimary mb-2">Database AI Assistant</h3>
                <p className="text-sm text-textSecondary max-w-md mb-6">
                  Query real-time SQL schemas, table structures, foreign key relationships, or diagnose database errors.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
                  <button 
                    onClick={() => processUserMessage("List database tables and schemas")}
                    className="p-3.5 bg-surface border border-border rounded-xl text-left hover:border-primary/50 text-xs text-textSecondary hover:text-textPrimary transition-all shadow-sm group"
                  >
                    💡 <strong className="text-textPrimary block mb-0.5 text-sm group-hover:text-primary transition-colors">List Tables & Schemas</strong> View all schemas, table counts & columns
                  </button>
                  <button 
                    onClick={() => processUserMessage("Describe table security.User")}
                    className="p-3.5 bg-surface border border-border rounded-xl text-left hover:border-primary/50 text-xs text-textSecondary hover:text-textPrimary transition-all shadow-sm group"
                  >
                    📋 <strong className="text-textPrimary block mb-0.5 text-sm group-hover:text-primary transition-colors">Describe Table</strong> Inspect columns, PKs & FK constraints
                  </button>
                  <button 
                    onClick={() => processUserMessage("Join User with Role")}
                    className="p-3.5 bg-surface border border-border rounded-xl text-left hover:border-primary/50 text-xs text-textSecondary hover:text-textPrimary transition-all shadow-sm group"
                  >
                    🔗 <strong className="text-textPrimary block mb-0.5 text-sm group-hover:text-primary transition-colors">Trace FK Relationships</strong> Find foreign key join paths
                  </button>
                  <button 
                    onClick={() => processUserMessage("Show database stats summary")}
                    className="p-3.5 bg-surface border border-border rounded-xl text-left hover:border-primary/50 text-xs text-textSecondary hover:text-textPrimary transition-all shadow-sm group"
                  >
                    📊 <strong className="text-textPrimary block mb-0.5 text-sm group-hover:text-primary transition-colors">Database Overview</strong> Summary of tables, FKs & breakdown
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 mb-4">
                  <ShieldAlert className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-textPrimary mb-2">Server & Cyber Security AI</h3>
                <p className="text-sm text-textSecondary max-w-md mb-6">
                  Monitor compute node health, analyze high CPU/RAM load, inspect firewall events, or review security logs.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
                  <button 
                    onClick={() => processUserMessage("Show Server Health Report for all servers")}
                    className="p-3.5 bg-surface border border-border rounded-xl text-left hover:border-primary/50 text-xs text-textSecondary hover:text-textPrimary transition-all shadow-sm group"
                  >
                    🖥️ <strong className="text-textPrimary block mb-0.5 text-sm group-hover:text-primary transition-colors">Server Health Report</strong> Full compute, RAM & status report
                  </button>
                  <button 
                    onClick={() => processUserMessage("Summarize security alerts and blocked IPs")}
                    className="p-3.5 bg-surface border border-border rounded-xl text-left hover:border-primary/50 text-xs text-textSecondary hover:text-textPrimary transition-all shadow-sm group"
                  >
                    🛡️ <strong className="text-textPrimary block mb-0.5 text-sm group-hover:text-primary transition-colors">Security Alert Summary</strong> Check failed logins & threat levels
                  </button>
                  <button 
                    onClick={() => processUserMessage("Check high CPU and memory load across nodes")}
                    className="p-3.5 bg-surface border border-border rounded-xl text-left hover:border-primary/50 text-xs text-textSecondary hover:text-textPrimary transition-all shadow-sm group"
                  >
                    ⚡ <strong className="text-textPrimary block mb-0.5 text-sm group-hover:text-primary transition-colors">Resource Spikes</strong> Analyze CPU & RAM spikes
                  </button>
                  <button 
                    onClick={() => processUserMessage("Report firewall events and suspicious activity")}
                    className="p-3.5 bg-surface border border-border rounded-xl text-left hover:border-primary/50 text-xs text-textSecondary hover:text-textPrimary transition-all shadow-sm group"
                  >
                    🔒 <strong className="text-textPrimary block mb-0.5 text-sm group-hover:text-primary transition-colors">Firewall & Cyber Logs</strong> Review blocked IPs & security rules
                  </button>
                </div>
              </div>
            )
          ) : (
            activeThread.messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} group`}>
                <div className={`flex max-w-[90%] md:max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                    msg.sender === 'user' ? 'bg-surface border border-border ml-3' : 'bg-primary/20 border border-primary/30 mr-3'
                  }`}>
                    {msg.sender === 'user' ? <User className="w-4 h-4 text-textSecondary" /> : <Bot className="w-4 h-4 text-primary" />}
                  </div>
                  
                  <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} w-full min-w-0`}>
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
                      <div className={`px-4 py-3 rounded-2xl relative max-w-full ${
                        msg.sender === 'user' 
                          ? 'bg-primary text-white rounded-tr-sm shadow-md' 
                          : 'bg-surface border border-border text-textPrimary rounded-tl-sm shadow-sm'
                      }`}>
                        {msg.sender === 'user' ? (
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        ) : (
                          <FormattedMarkdown content={msg.text} />
                        )}
                        
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
            ))
          )}
          {isGenerating && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 bg-surface border border-border px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm text-textSecondary text-xs">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span>AI Assistant querying database and schema...</span>
              </div>
            </div>
          )}
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
              disabled={!input.trim() || isGenerating}
              className="p-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
