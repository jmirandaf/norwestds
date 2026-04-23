import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getGreeting, getResponse, getUserLabel, matchKeywords } from './responses';
import './ChatBot.css';

const DELAY_BOT = 480;

export default function ChatBot() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('en') ? 'en' : 'es';

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [notified, setNotified] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const greetedRef = useRef(false);

  // Show greeting once when first opened
  useEffect(() => {
    if (open && !greetedRef.current) {
      greetedRef.current = true;
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages([{ from: 'bot', ...getGreeting(lang) }]);
      }, DELAY_BOT);
    }
  }, [open, lang]);

  // Notification dot after 3s if never opened
  useEffect(() => {
    const t = setTimeout(() => setNotified(true), 3000);
    return () => clearTimeout(t);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const pushBot = (response) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: 'bot', ...response }]);
    }, DELAY_BOT);
  };

  const handleOpen = () => {
    setOpen(true);
    setNotified(false);
  };

  const handleQuickReply = (action) => {
    const userLabel = getUserLabel(action, lang);
    setMessages(prev => [...prev, { from: 'user', text: userLabel }]);
    pushBot(getResponse(action, lang));
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text }]);
    pushBot(matchKeywords(text, lang));
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="nds-chatbot">
      {/* ── Panel ── */}
      <div className={`nds-chatbot-panel${open ? ' open' : ''}`} role="dialog" aria-label="Chat NDS">
        {/* Header */}
        <div className="nds-chatbot-header">
          <div className="nds-chatbot-header-avatar">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div className="nds-chatbot-header-info">
            <span className="nds-chatbot-header-name">Asistente NDS</span>
            <span className="nds-chatbot-header-status">
              <span className="nds-chatbot-status-dot" />
              {lang === 'es' ? 'En línea' : 'Online'}
            </span>
          </div>
          <button
            className="nds-chatbot-close"
            onClick={() => setOpen(false)}
            aria-label="Cerrar chat"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M6 6l12 12M6 18L18 6"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="nds-chatbot-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`nds-chatbot-row nds-chatbot-row--${msg.from}`}>
              {msg.from === 'bot' && (
                <div className="nds-chatbot-avatar-sm">NDS</div>
              )}
              <div className="nds-chatbot-bubble-wrap">
                <div className={`nds-chatbot-msg nds-chatbot-msg--${msg.from}`}>
                  {msg.text}
                </div>
                {msg.link && (
                  <Link to={msg.link.href} className="nds-chatbot-link-btn" onClick={() => setOpen(false)}>
                    {msg.link.label}
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                )}
                {msg.quickReplies?.length > 0 && (
                  <div className="nds-chatbot-quick-replies">
                    {msg.quickReplies.map((qr) => (
                      <button
                        key={qr.action}
                        className="nds-chatbot-qr"
                        onClick={() => handleQuickReply(qr.action)}
                      >
                        {qr.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="nds-chatbot-row nds-chatbot-row--bot">
              <div className="nds-chatbot-avatar-sm">NDS</div>
              <div className="nds-chatbot-typing">
                <span /><span /><span />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="nds-chatbot-input-wrap">
          <input
            ref={inputRef}
            className="nds-chatbot-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={lang === 'es' ? 'Escribe tu pregunta…' : 'Type your question…'}
            maxLength={200}
          />
          <button
            className="nds-chatbot-send"
            onClick={handleSend}
            disabled={!input.trim()}
            aria-label="Enviar"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Bubble trigger ── */}
      <button
        className={`nds-chatbot-bubble${open ? ' active' : ''}`}
        onClick={open ? () => setOpen(false) : handleOpen}
        aria-label="Chat"
      >
        <span className="nds-chatbot-bubble-icon nds-chatbot-bubble-icon--chat">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </span>
        <span className="nds-chatbot-bubble-icon nds-chatbot-bubble-icon--close">
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M6 6l12 12M6 18L18 6"/>
          </svg>
        </span>
        {notified && !open && <span className="nds-chatbot-notif" aria-hidden="true" />}
      </button>
    </div>
  );
}
