import { useState, useRef, useEffect } from 'react';
import api from '../services/api.js';
import { Bot, X, ArrowUp, ArrowRight } from 'lucide-react';

const quickPrompts = [
  'Berapa pengeluaran aku bulan ini?',
  'Kategori apa yang paling boros?',
  'Kondisi keuangan aku gimana?',
  'Bandingkan bulan ini vs bulan lalu',
];

const Chatbot = () => {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Halo! 👋 Saya asisten keuangan personal kamu. Tanyakan apa saja tentang kondisi finansial, tren pengeluaran, atau rekomendasi tabungan kamu.',
    },
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef             = useRef(null);
  const inputRef              = useRef(null);

  // Auto scroll ke bawah setiap ada pesan baru
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input saat chat dibuka
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  // Disable scroll halaman saat chat terbuka di mobile
  useEffect(() => {
    if (open && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleSend = async (messageText) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: textToSend }]);
    setLoading(true);

    try {
      // Kirim history percakapan (kecuali pesan selamat datang)
      const history = messages
        .slice(1)
        .map(({ role, content }) => ({ role, content }));

      const { data } = await api.post('/chat', {
        message: textToSend,
        history,
      });

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '❌ Maaf, terjadi gangguan saat menganalisis data keuangan kamu. Silakan coba lagi sebentar lagi.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen((p) => !p)}
        aria-label="Toggle Financial AI Assistant"
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 w-13 h-13 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 bg-primary-500 hover:bg-primary-600 text-white font-bold cursor-pointer"
        style={{
          width: '52px',
          height: '52px',
          boxShadow: '0 8px 24px -4px rgba(99, 102, 241, 0.4)',
        }}
      >
        {open ? <X size={22} strokeWidth={2.2} /> : <Bot size={22} strokeWidth={2.2} />}
      </button>

      {/* Chat Window Panel */}
      {open && (
        <div
          className="fixed z-50 flex flex-col bg-dark-850/95 backdrop-blur-xl border border-dark-600 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          style={{
            bottom: '84px',
            right: '16px',
            width: 'min(400px, calc(100vw - 32px))',
            height: 'min(540px, calc(100vh - 110px))',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-dark-600/70 bg-dark-900/60">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-sm shadow-primary-500/20">
              <Bot size={16} strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-text-primary text-xs font-bold tracking-tight">Finance AI Assistant</p>
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-text-muted">Real-time context analysis</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-dark-750 transition-colors cursor-pointer"
            >
              <X size={15} strokeWidth={2} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 text-xs leading-relaxed">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-primary-500 text-white font-medium rounded-tr-xs shadow-sm shadow-primary-500/10'
                      : 'bg-dark-750/90 text-text-primary border border-dark-600/60 rounded-tl-xs'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Quick Prompts (Only shown if 1 message exists) */}
            {messages.length === 1 && (
              <div className="mt-2 space-y-1.5">
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider px-1">
                  Quick Inquiries
                </p>
                <div className="flex flex-col gap-1.5">
                  {quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="text-left px-3 py-2 rounded-xl bg-dark-750/50 hover:bg-dark-700/80 border border-dark-600/50 text-text-secondary hover:text-text-primary text-xs transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <span className="truncate">{prompt}</span>
                      <ArrowRight size={13} strokeWidth={2} className="text-text-muted group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl rounded-tl-xs bg-dark-750/90 border border-dark-600/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse [animation-delay:200ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse [animation-delay:400ms]" />
                  <span className="text-[11px] text-text-muted ml-1">Analyzing finances...</span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input Box Footer */}
          <div className="p-3 border-t border-dark-600/70 bg-dark-900/60">
            <div className="flex items-end gap-2 rounded-xl bg-dark-750/70 border border-dark-600/80 px-3 py-2 focus-within:border-primary-500/60 focus-within:ring-1 focus-within:ring-primary-500/20 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your finances..."
                rows={1}
                className="flex-1 bg-transparent text-text-primary text-xs outline-none resize-none placeholder:text-text-muted max-h-20"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all bg-primary-500 hover:bg-primary-400 text-white disabled:opacity-30 disabled:hover:bg-primary-500 cursor-pointer"
              >
                <ArrowUp size={14} strokeWidth={2.5} />
              </button>
            </div>
            <p className="text-[10px] text-text-muted text-center mt-1.5">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>

        </div>
      )}
    </>
  );
};

export default Chatbot;