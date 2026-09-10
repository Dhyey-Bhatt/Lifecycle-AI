import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Copy, 
  Check, 
  Trash2, 
  Edit2, 
  CheckSquare, 
  ThumbsUp, 
  ThumbsDown, 
  RotateCcw, 
  Search, 
  ShieldCheck, 
  Cpu, 
  Lightbulb, 
  AlertCircle,
  Square,
  X,
  Server,
  Cloud,
  CheckCircle,
  Terminal
} from 'lucide-react';

import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

export const AIChatPage = () => {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'Admin';

  // State
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editTitleValue, setEditTitleValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const [feedbackMap, setFeedbackMap] = useState({});
  const [modelInfo, setModelInfo] = useState({ provider: 'openai', model: 'gpt-4o-mini' });
  const [providersStatus, setProvidersStatus] = useState(null);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [errorBanner, setErrorBanner] = useState(null);
  const [isMobileChatSidebarOpen, setIsMobileChatSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, streaming]);

  // Load Model Info & Conversations on mount and when user role changes
  useEffect(() => {
    loadModelInfo();
    loadProviders();
    loadConversations();
  }, [currentUser]);

  const loadModelInfo = async () => {
    try {
      const info = await api.chat.getModelInfo();
      if (info) setModelInfo(info);
    } catch (e) {
      console.warn('Could not fetch model info:', e);
    }
  };

  const loadProviders = async () => {
    try {
      const data = await api.chat.getProviders();
      if (data) setProvidersStatus(data);
    } catch (e) {
      console.warn('Could not fetch providers status:', e);
    }
  };

  const handleSwitchProvider = async (providerKey) => {
    try {
      const res = await api.chat.switchProvider(providerKey);
      if (res && res.modelInfo) {
        setModelInfo(res.modelInfo);
        loadProviders();
        setIsProviderModalOpen(false);
      }
    } catch (e) {
      console.error('Failed to switch provider:', e);
    }
  };

  const loadConversations = async () => {
    try {
      const list = await api.chat.getConversations();
      setConversations(list || []);

      if (list && list.length > 0) {
        // Select first conversation by default if none selected
        if (!activeConversationId || !list.some(c => c.id === activeConversationId)) {
          selectConversation(list[0].id);
        }
      } else {
        // Create initial default conversation
        handleNewChat();
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  };

  const selectConversation = async (convId) => {
    setActiveConversationId(convId);
    setErrorBanner(null);
    try {
      const msgs = await api.chat.getMessages(convId);
      setMessages(msgs || []);
    } catch (err) {
      console.error('Failed to fetch messages for conversation:', err);
      setMessages([]);
    }
  };

  const handleNewChat = async () => {
    try {
      const newConv = await api.chat.createConversation({
        title: 'New Conversation',
        persona: role.toUpperCase()
      });

      setConversations(prev => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
      setMessages([]);
      setErrorBanner(null);
    } catch (err) {
      console.error('Failed to create new chat:', err);
    }
  };

  const handleRename = async (convId) => {
    if (!editTitleValue.trim()) {
      setEditingTitleId(null);
      return;
    }
    try {
      const updated = await api.chat.renameConversation(convId, editTitleValue.trim());
      setConversations(prev => prev.map(c => c.id === convId ? { ...c, title: updated.title } : c));
      setEditingTitleId(null);
    } catch (err) {
      console.error('Failed to rename conversation:', err);
    }
  };

  const handleDelete = async (e, convId) => {
    e.stopPropagation();
    try {
      await api.chat.deleteConversation(convId);
      const remaining = conversations.filter(c => c.id !== convId);
      setConversations(remaining);

      if (activeConversationId === convId) {
        if (remaining.length > 0) {
          selectConversation(remaining[0].id);
        } else {
          handleNewChat();
        }
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  // Persona Prompts Chips
  const promptChips = role === 'Househelp' ? [
    "How do I clean the Samsung refrigerator coils safely?",
    "Step by step guide to run dishwasher self-clean",
    "How to clean the Dyson vacuum HEPA filter?",
    "What maintenance schedule is recommended for the oven?"
  ] : role === 'Senior' ? [
    "What are my blood pressure readings and medications today?",
    "Give me gentle indoor walking and hydration tips",
    "When is my next scheduled heart medication?",
    "How do I use the microwave safely without burns?"
  ] : [
    "Which warranties are expiring in the next 45 days?",
    "Show me complete details for my MacBook Pro M3",
    "Is my Samsung Refrigerator still under active warranty?",
    "Help me prepare a formal warranty claim for a broken device",
    "Summarize total portfolio value in my Family Vault"
  ];

  const handleSend = async (queryText) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || loading || streaming) return;

    setInputQuery('');
    setErrorBanner(null);

    // Ensure we have an active conversation
    let convId = activeConversationId;
    if (!convId) {
      const newConv = await api.chat.createConversation({ title: textToSend.slice(0, 30) });
      setConversations(prev => [newConv, ...prev]);
      convId = newConv.id;
      setActiveConversationId(convId);
    }

    // Optimistically add user message
    const tempUserMsg = {
      id: `temp_u_${Date.now()}`,
      role: 'user',
      content: textToSend,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setLoading(true);

    // Try Real-Time Streaming First
    let streamText = '';
    const tempBotMsgId = `temp_b_${Date.now()}`;

    try {
      setStreaming(true);
      await api.chat.streamMessage(convId, textToSend, {
        onToken: (token) => {
          setLoading(false);
          streamText += token;
          setMessages(prev => {
            const hasBot = prev.some(m => m.id === tempBotMsgId);
            if (!hasBot) {
              return [...prev, {
                id: tempBotMsgId,
                role: 'assistant',
                content: streamText,
                metadata: { model: modelInfo.model, provider: modelInfo.provider },
                created_at: new Date().toISOString()
              }];
            }
            return prev.map(m => m.id === tempBotMsgId ? { ...m, content: streamText } : m);
          });
        },
        onDone: (result) => {
          setStreaming(false);
          setLoading(false);
          if (result && result.assistantMessage) {
            setMessages(prev => prev.map(m => m.id === tempBotMsgId ? result.assistantMessage : m));
            if (result.conversation) {
              setConversations(prev => prev.map(c => c.id === convId ? { ...c, title: result.conversation.title } : c));
            }
          }
        },
        onError: async (streamErr) => {
          console.warn('Stream failed or not supported, falling back to standard HTTP completion:', streamErr.message);
          // Fallback to standard HTTP completion
          const response = await api.chat.sendMessage(convId, textToSend);
          setMessages(prev => {
            const filtered = prev.filter(m => m.id !== tempBotMsgId);
            return [...filtered, response.assistantMessage];
          });
          if (response.conversation) {
            setConversations(prev => prev.map(c => c.id === convId ? { ...c, title: response.conversation.title } : c));
          }
          setStreaming(false);
          setLoading(false);
        }
      });
    } catch (err) {
      console.error('Chat dispatch error:', err);
      setLoading(false);
      setStreaming(false);
      setErrorBanner(err.message || 'Failed to generate AI response. Please try again.');
    }
  };

  const handleCopyMessage = (msgId, content) => {
    navigator.clipboard.writeText(content);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleFeedback = async (msgId, rating) => {
    try {
      setFeedbackMap(prev => ({ ...prev, [msgId]: rating }));
      await api.chat.sendFeedback(msgId, { rating });
    } catch (e) {
      console.warn('Feedback save failed:', e);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const filteredConversations = conversations.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-content chat-page-content">
      <div className="chat-app-layout">
        
        {/* Mobile Chat Sidebar Overlay Backdrop */}
        {isMobileChatSidebarOpen && (
          <div 
            className="chat-mobile-backdrop active" 
            onClick={() => setIsMobileChatSidebarOpen(false)} 
          />
        )}

        {/* ========================================================
            1. CHAT SIDEBAR (Conversations List & New Chat)
            ======================================================== */}
        <aside className={`chat-sidebar-pane ${isMobileChatSidebarOpen ? 'mobile-open' : ''}`}>
          {/* Top Row: New Chat + Mobile Close Button */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button 
              onClick={() => {
                handleNewChat();
                setIsMobileChatSidebarOpen(false);
              }} 
              className="btn btn-primary chat-new-btn"
              id="btn-new-chat"
            >
              <Plus size={18} />
              <span>New Chat</span>
            </button>
            <button 
              className="btn btn-secondary btn-icon mobile-chat-close-btn"
              onClick={() => setIsMobileChatSidebarOpen(false)}
              title="Close history"
            >
              <Trash2 size={16} style={{ display: 'none' }} />
              &times;
            </button>
          </div>

          {/* Search Conversations */}
          <div className="chat-search-wrapper">
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search chats..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="chat-search-input"
            />
          </div>

          {/* Conversations Group List */}
          <div className="chat-history-list">
            {filteredConversations.length === 0 ? (
              <div className="chat-history-empty">
                <MessageSquare size={24} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
                <p>No conversations found</p>
              </div>
            ) : (
              filteredConversations.map(conv => {
                const isActive = conv.id === activeConversationId;
                const isEditing = editingTitleId === conv.id;

                return (
                  <div 
                    key={conv.id}
                    onClick={() => {
                      selectConversation(conv.id);
                      setIsMobileChatSidebarOpen(false);
                    }}
                    className={`chat-history-item ${isActive ? 'active' : ''}`}
                  >
                    <MessageSquare size={16} className="history-icon" />

                    {isEditing ? (
                      <div className="history-edit-row" onClick={e => e.stopPropagation()}>
                        <input 
                          type="text" 
                          value={editTitleValue}
                          onChange={(e) => setEditTitleValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRename(conv.id);
                            if (e.key === 'Escape') setEditingTitleId(null);
                          }}
                          autoFocus
                          className="history-rename-input"
                        />
                        <button onClick={() => handleRename(conv.id)} className="history-action-btn">
                          <CheckSquare size={14} color="#10B981" />
                        </button>
                      </div>
                    ) : (
                      <span className="history-title" title={conv.title}>
                        {conv.title}
                      </span>
                    )}

                    {!isEditing && isActive && (
                      <div className="history-actions" onClick={e => e.stopPropagation()}>
                        <button 
                          onClick={() => {
                            setEditingTitleId(conv.id);
                            setEditTitleValue(conv.title);
                          }} 
                          className="history-action-btn"
                          title="Rename chat"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(e, conv.id)} 
                          className="history-action-btn delete"
                          title="Delete chat"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Persona Card in Sidebar Footer */}
          <div className="chat-sidebar-footer">
            <div className="persona-badge-card">
              <div className="persona-indicator">
                <ShieldCheck size={14} color="var(--color-primary)" />
                <span>Persona: <strong>{role}</strong></span>
              </div>
              <button 
                onClick={() => setIsProviderModalOpen(true)}
                className="model-indicator-pill clickable"
                title="Click to change AI Provider"
              >
                <Cpu size={12} />
                <span>{modelInfo.provider === 'openai' ? 'Cloud: OpenAI' : 'Local: Ollama'}: {modelInfo.model}</span>
                <span className="provider-pill-badge">{modelInfo.provider}</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ========================================================
            2. MAIN CHAT AREA
            ======================================================== */}
        <main className="chat-main-pane">
          {/* Conversation Top Header */}
          <header className="chat-pane-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0, flex: 1 }}>
              {/* Mobile Chat History Drawer Toggle Button */}
              <button 
                onClick={() => setIsMobileChatSidebarOpen(!isMobileChatSidebarOpen)}
                className="btn btn-secondary btn-icon mobile-chat-history-toggle"
                title="View Chats"
              >
                <MessageSquare size={16} color="var(--color-primary)" />
              </button>

              <div className="chat-header-info">
                <h2 className="chat-header-title">
                  {activeConversation?.title || 'Lifecycle AI Chat'}
                </h2>
                <div className="chat-header-meta">
                  <span className={`persona-tag tag-${role.toLowerCase()}`}>
                    {role === 'Househelp' ? 'HomeCare Specialist' : role === 'Senior' ? 'SeniorCare Wellness' : 'Household Admin'}
                  </span>
                  <span className="meta-divider">&bull;</span>
                  <button 
                    onClick={() => setIsProviderModalOpen(true)}
                    className="model-tag-btn"
                    title="Change AI Provider (OpenAI / Ollama)"
                  >
                    <Cpu size={12} />
                    <span>{modelInfo.provider === 'openai' ? 'OpenAI Cloud' : 'Local Ollama'} ({modelInfo.model})</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="chat-header-actions">
              <button 
                onClick={() => setIsProviderModalOpen(true)}
                className="btn btn-secondary btn-sm hide-on-mobile"
                title="Switch between OpenAI and Local Ollama"
              >
                <Cpu size={13} color="var(--color-primary)" />
                <span>Provider</span>
              </button>
              <button 
                onClick={handleNewChat}
                className="btn btn-primary btn-sm"
                title="Start fresh conversation"
              >
                <Plus size={14} />
                <span className="hide-on-mobile">New Session</span>
              </button>
            </div>
          </header>

          {/* Error Banner */}
          {errorBanner && (
            <div className="chat-error-banner">
              <AlertCircle size={16} color="#DC2626" />
              <span>{errorBanner}</span>
              <button onClick={() => handleSend(messages[messages.length - 1]?.content)} className="btn-retry">
                <RotateCcw size={13} />
                Retry
              </button>
            </div>
          )}

          {/* Message Stream */}
          <div className="chat-messages-scrollview">
            {messages.length === 0 ? (
              /* Welcoming Empty State */
              <div className="chat-empty-hero">
                <div className="hero-icon-bubble">
                  <Bot size={36} color="var(--color-primary)" />
                </div>
                <h3>
                  {role === 'Househelp' ? 'Welcome to HomeCare AI' : role === 'Senior' ? 'Welcome to SeniorCare AI' : 'Welcome to LifecycleBot'}
                </h3>
                <p>
                  {role === 'Househelp'
                    ? 'Your dedicated assistant for appliance operations, step-by-step cleaning guides, error codes, and maintenance schedules.'
                    : role === 'Senior'
                    ? 'Your personal health and home companion. Ask about your daily medication schedules, blood pressure vitals, or safe appliance operation.'
                    : 'Your AI Document & Warranty Copilot. Grounded directly in your active household assets, invoices, warranty terms, and claim entitlements.'}
                </p>

                <div className="empty-chips-grid">
                  {promptChips.map((chip, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSend(chip)}
                      className="hero-prompt-chip"
                    >
                      <Sparkles size={14} color="var(--color-primary)" />
                      <span>{chip}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Message Bubbles */
              messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                const isCopied = copiedMsgId === msg.id;
                const feedback = feedbackMap[msg.id];

                return (
                  <div key={msg.id || index} className={`chat-message-row ${isUser ? 'user-row' : 'bot-row'}`}>
                    <div className="message-avatar">
                      {isUser ? <User size={16} /> : <Bot size={18} />}
                    </div>

                    <div className="message-content-wrapper">
                      <div className="message-meta-header">
                        <strong>{isUser ? (currentUser?.name || 'You') : (role === 'Househelp' ? 'HomeCare AI' : role === 'Senior' ? 'SeniorCare AI' : 'LifecycleBot')}</strong>
                        <span className="msg-time">
                          {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                        </span>
                        {!isUser && msg.metadata?.model && (
                          <span className="msg-model-badge">{msg.metadata.model}</span>
                        )}
                      </div>

                      <div className="message-body">
                        {isUser ? (
                          <div className="user-text-content">{msg.content}</div>
                        ) : (
                          <MarkdownRenderer content={msg.content} />
                        )}
                      </div>

                      {/* Bot Action Bar (Copy & Thumbs Feedback) */}
                      {!isUser && msg.content && (
                        <div className="message-actions-bar">
                          <button 
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            className="msg-action-btn"
                            title="Copy response"
                          >
                            {isCopied ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                            <span>{isCopied ? 'Copied' : 'Copy'}</span>
                          </button>

                          <div className="msg-feedback-group">
                            <button 
                              onClick={() => handleFeedback(msg.id, 'thumbs_up')}
                              className={`feedback-btn ${feedback === 'thumbs_up' ? 'active-good' : ''}`}
                              title="Helpful response"
                            >
                              <ThumbsUp size={13} />
                            </button>
                            <button 
                              onClick={() => handleFeedback(msg.id, 'thumbs_down')}
                              className={`feedback-btn ${feedback === 'thumbs_down' ? 'active-bad' : ''}`}
                              title="Unhelpful response"
                            >
                              <ThumbsDown size={13} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* Loading / Typing Indicator */}
            {loading && !streaming && (
              <div className="chat-message-row bot-row loading-row">
                <div className="message-avatar">
                  <Bot size={18} />
                </div>
                <div className="loading-pulse-box">
                  <Sparkles size={16} className="animate-spin" color="var(--color-primary)" />
                  <span>Consulting grounded vault documents & failure models...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips Bar */}
          {messages.length > 0 && (
            <div className="chat-chips-bar">
              <div className="chips-label">
                <Lightbulb size={13} color="#F59E0B" />
                <span>Try:</span>
              </div>
              <div className="chips-scroll-container">
                {promptChips.map((chip, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleSend(chip)}
                    className="quick-chip-btn"
                    disabled={loading || streaming}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Bar */}
          <footer className="chat-composer-footer">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="chat-input-container"
            >
              <textarea 
                ref={textareaRef}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  role === 'Househelp' 
                    ? 'Ask about appliance manuals, step-by-step cleaning guides, or safety procedures...' 
                    : role === 'Senior' 
                    ? 'Ask about today’s wellness tips, medication schedule, or safe appliance use...' 
                    : 'Ask about warranties, expiration dates, serial numbers, claims, or repair risk...'
                }
                rows={1}
                className="chat-textarea"
                disabled={loading && !streaming}
              />

              <div className="chat-input-controls">
                {streaming ? (
                  <button 
                    type="button" 
                    onClick={() => setStreaming(false)}
                    className="btn btn-secondary btn-stop"
                    title="Stop Generating"
                  >
                    <Square size={14} color="#DC2626" />
                    <span>Stop</span>
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    disabled={!inputQuery.trim() || loading}
                    className="btn btn-primary btn-send"
                    id="btn-send-message"
                  >
                    <Send size={15} />
                    <span>Send</span>
                  </button>
                )}
              </div>
            </form>

            <div className="chat-footer-disclaimer">
              {role === 'Senior' 
                ? 'SeniorCare AI provides wellness information, not medical diagnoses. In an emergency, contact your physician immediately.'
                : 'Lifecycle AI generates grounded answers using your authorized household data. Verify critical warranty terms with official invoices.'}
            </div>
          </footer>

        </main>
      </div>

      {/* ========================================================
          3. AI PROVIDER CONFIGURATION MODAL
          ======================================================== */}
      {isProviderModalOpen && (
        <div className="provider-modal-overlay" onClick={() => setIsProviderModalOpen(false)}>
          <div className="provider-modal-card" onClick={e => e.stopPropagation()}>
            <div className="provider-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Cpu size={20} color="var(--color-primary)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>AI Gateway Provider Settings</h3>
              </div>
              <button 
                onClick={() => setIsProviderModalOpen(false)}
                className="btn-close-modal"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="provider-modal-body">
              <p className="provider-modal-desc">
                Lifecycle AI supports dual interchangeable AI backends. Choose between <strong>OpenAI Cloud</strong> and <strong>Local AI (Ollama)</strong> for free private inference.
              </p>

              <div className="provider-cards-grid">
                {/* OpenAI Cloud Provider Card */}
                <div 
                  className={`provider-select-card ${modelInfo.provider === 'openai' ? 'active-provider' : ''}`}
                  onClick={() => handleSwitchProvider('openai')}
                >
                  <div className="provider-card-top">
                    <div className="provider-type-icon cloud-icon">
                      <Cloud size={20} />
                    </div>
                    <div>
                      <h4 className="provider-title">OpenAI Cloud</h4>
                      <span className="provider-subtitle">Direct Cloud API</span>
                    </div>
                    {modelInfo.provider === 'openai' && (
                      <span className="active-badge"><CheckCircle size={14} /> Active</span>
                    )}
                  </div>
                  <div className="provider-details">
                    <div className="detail-row">
                      <span className="detail-label">Model:</span>
                      <code className="detail-code">
                        {providersStatus?.providers?.openai?.model || 'gpt-4o-mini'}
                      </code>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Status:</span>
                      <span className={`status-pill ${providersStatus?.providers?.openai?.status === 'ready' ? 'status-ready' : 'status-warn'}`}>
                        {providersStatus?.providers?.openai?.status === 'ready' ? '● Configured' : '○ Missing API Key'}
                      </span>
                    </div>
                  </div>
                  <button 
                    className={`btn btn-sm ${modelInfo.provider === 'openai' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ width: '100%', marginTop: '0.75rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSwitchProvider('openai');
                    }}
                  >
                    {modelInfo.provider === 'openai' ? 'Active Provider' : 'Select OpenAI'}
                  </button>
                </div>

                {/* Local Ollama Provider Card */}
                <div 
                  className={`provider-select-card ${modelInfo.provider === 'local' ? 'active-provider' : ''}`}
                  onClick={() => handleSwitchProvider('local')}
                >
                  <div className="provider-card-top">
                    <div className="provider-type-icon local-icon">
                      <Server size={20} />
                    </div>
                    <div>
                      <h4 className="provider-title">Local AI (Ollama)</h4>
                      <span className="provider-subtitle">Zero API Cost &bull; Private</span>
                    </div>
                    {modelInfo.provider === 'local' && (
                      <span className="active-badge"><CheckCircle size={14} /> Active</span>
                    )}
                  </div>
                  <div className="provider-details">
                    <div className="detail-row">
                      <span className="detail-label">Model:</span>
                      <code className="detail-code">
                        {providersStatus?.providers?.local?.model || 'llama3:latest'}
                      </code>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Status:</span>
                      <span className={`status-pill ${providersStatus?.providers?.local?.status === 'ready' ? 'status-ready' : 'status-warn'}`}>
                        {providersStatus?.providers?.local?.status === 'ready' ? '● Connected' : '○ Standby / Offline'}
                      </span>
                    </div>
                  </div>
                  <button 
                    className={`btn btn-sm ${modelInfo.provider === 'local' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ width: '100%', marginTop: '0.75rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSwitchProvider('local');
                    }}
                  >
                    {modelInfo.provider === 'local' ? 'Active Provider' : 'Select Local AI'}
                  </button>
                </div>
              </div>

              {/* Developer / Setup Instruction Callout */}
              <div className="provider-setup-tip">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: '#3B82F6', marginBottom: '0.35rem' }}>
                  <Terminal size={14} />
                  <span>How to use Local AI (Free):</span>
                </div>
                <ol style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  <li>Install Ollama from <code>ollama.com</code></li>
                  <li>Run <code>ollama run llama3</code> or <code>ollama run mistral</code> in your terminal</li>
                  <li>Set <code>AI_PROVIDER=local</code> in <code>backend/.env</code> or switch anytime via this dialog!</li>
                </ol>
              </div>
            </div>

            <div className="provider-modal-footer">
              <button 
                onClick={() => setIsProviderModalOpen(false)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatPage;
