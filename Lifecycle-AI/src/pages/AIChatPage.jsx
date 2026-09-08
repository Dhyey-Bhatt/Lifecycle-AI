import React, { useState } from 'react';
import { 
  MessageSquareText, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Clock, 
  ShieldCheck, 
  FileText,
  Lightbulb
} from 'lucide-react';

import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export const AIChatPage = () => {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'Househelp';

  const getInitialGreeting = () => {
    if (role === 'Househelp') {
      return `Hello ${currentUser?.name || 'Maria'}! I am **HomeCare AI**, your household appliance and maintenance assistant. I can help you with cleaning instructions, appliance operating manuals, troubleshooting error codes, and checking when maintenance is due. What would you like help with?`;
    }
    if (role === 'Senior') {
      return `Hello ${currentUser?.name || 'Robert'}! I am **SeniorCare AI**, your dedicated wellness and home assistant. I can help you with your daily health precautions, medication reminders, blood pressure advice, or guide you through operating any home appliance safely. How can I assist you today?`;
    }
    return `Hello ${currentUser?.name || 'Dhyey'}! I am **LifecycleBot**, your AI Document & Warranty Copilot. I have full access to your stored assets, serial numbers, warranty terms, failure risk profiles, claims, and Senior Health telemetry. How can I help you today?`;
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: getInitialGreeting()
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const promptChips = role === 'Househelp' ? [
    "How to clean the Samsung refrigerator coils?",
    "Check warranty expiry for the microwave",
    "How do I clean the Dyson vacuum filter?",
    "Step by step guide to run dishwasher self-clean"
  ] : role === 'Senior' ? [
    "What precautions should I take for my blood pressure today?",
    "When is my next medication scheduled?",
    "Give me gentle indoor walking and hydration tips",
    "How do I use the microwave safely?"
  ] : [
    "Which warranties are expiring soon?",
    "Show me details for my MacBook Pro",
    "How many items are registered in my vault?",
    "Help me file a claim for a broken device",
    "Check Senior Health vitals status"
  ];

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const data = await api.ai.chat({
        query: textToSend,
        conversationHistory: messages
      });

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.reply
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: `I had trouble connecting to the Lifecycle AI server. Please make sure the backend is active on port 5000.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-valid">
            <Sparkles size={14} /> Feature 7: Natural Language RAG Assistant
          </span>
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-heading)' }}>
          Lifecycle AI Chat Assistant
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Ask natural language questions about your stored receipts, warranties, repair risks, and claim entitlements.
        </p>
      </div>

      {/* Main Chat Box */}
      <div className="chat-container">
        {/* Messages Feed */}
        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem', fontSize: '0.75rem', opacity: 0.85 }}>
                {msg.sender === 'bot' ? <Bot size={14} /> : <User size={14} />}
                <strong>{msg.sender === 'bot' ? 'LifecycleBot' : 'You'}</strong>
              </div>
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-bubble bot" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} color="var(--color-primary)" className="animate-spin" />
              <span>Analyzing vault documents & failure telemetry...</span>
            </div>
          )}
        </div>

        {/* Prompt Chips */}
        <div style={{ padding: '0.5rem 1.5rem', background: '#F8FAFC', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            <Lightbulb size={14} color="#F59E0B" />
            <span>Try asking:</span>
          </div>
          {promptChips.map((chip, i) => (
            <button
              key={i}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '0.3rem 0.65rem', whiteSpace: 'nowrap', borderRadius: '50px' }}
              onClick={() => handleSend(chip)}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form 
          className="chat-input-bar"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input 
            type="text" 
            className="form-input"
            placeholder="Ask about expiration dates, serial numbers, claims, or coverage terms..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !inputQuery.trim()}
          >
            <Send size={16} />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
