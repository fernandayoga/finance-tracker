import { useState, useRef, useEffect } from 'react';
import api from '../services/api.js';

const Chatbot = () => {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Halo! 👋 Aku asisten keuangan kamu. Tanya apa saja tentang keuangan kamu, misalnya:\n\n• "Berapa pengeluaran aku bulan ini?"\n• "Kategori apa yang paling boros?"\n• "Gimana kondisi keuangan aku?"',
    },
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef             = useRef(null);
  const inputRef              = useRef(null);

  // Auto scroll ke bawah setiap ada pesan baru
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input saat chat dibuka
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  // Disable scroll halaman saat chat terbuka 
  useEffect(() => {
  if (open) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }

  // Cleanup saat komponen unmount
  return () => {
    document.body.style.overflow = '';
  };
}, [open]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');

    // Tambah pesan user ke UI
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Kirim history percakapan (kecuali pesan selamat datang)
      const history = messages
        .slice(1)
        .map(({ role, content }) => ({ role, content }));

      const { data } = await api.post('/chat', {
        message: userMessage,
        history,
      });

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: '❌ Maaf, terjadi error. Coba lagi ya!',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    'Berapa pengeluaran bulan ini?',
    'Kategori paling boros?',
    'Kondisi keuangan aku gimana?',
    'Bandingkan bulan ini vs bulan lalu',
  ];

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="fixed bottom-24 right-5 lg:bottom-6 lg:right-6 z-40 w-13 h-13 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 glow-green"
        style={{
          backgroundColor: '#22c55e',
          width: '52px',
          height: '52px',
        }}
      >
        <i className={`fa-solid fa-${open ? 'xmark' : 'robot'} text-dark-900 text-lg`} />
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className="fixed z-50 flex flex-col border border-dark-500 shadow-2xl"
          style={{
            bottom: '90px',
            right: '16px',
            width: 'min(380px, calc(100vw - 32px))',
            height: 'min(520px, calc(100vh - 120px))',
            backgroundColor: '#161b26',
            borderRadius: '1.25rem',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-dark-600"
            style={{ borderRadius: '1.25rem 1.25rem 0 0' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center glow-green"
              style={{ backgroundColor: '#22c55e' }}>
              <i className="fa-solid fa-robot text-dark-900 text-sm" />
            </div>
            <div>
              <p className="text-text-primary text-sm font-semibold">Finance AI</p>
              <p className="text-text-muted text-xs">Powered by Groq</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-text-muted hover:text-text-primary transition-colors"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3"
            style={{ scrollbarWidth: 'none' }}>

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap"
                  style={{
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user'
                      ? '18px 18px 4px 18px'
                      : '18px 18px 18px 4px',
                    backgroundColor: msg.role === 'user'
                      ? '#22c55e'
                      : '#1c2333',
                    color: msg.role === 'user' ? '#0f1117' : '#f1f5f9',
                    border: msg.role === 'assistant'
                      ? '1px solid #232d42'
                      : 'none',
                    fontWeight: msg.role === 'user' ? '500' : '400',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-dark-600"
                  style={{ backgroundColor: '#1c2333' }}>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-primary-400"
                      style={{
                        animation: 'bounce 1s infinite',
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick Questions — hanya tampil kalau baru 1 pesan */}
          

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-dark-600">
            <div className="flex items-end gap-2 rounded-xl border border-dark-500 px-3 py-2"
              style={{ backgroundColor: '#1c2333' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tanya tentang keuangan kamu..."
                rows={1}
                className="flex-1 bg-transparent text-text-primary text-sm outline-none resize-none placeholder:text-text-muted "
                style={{ maxHeight: '80px' }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
                style={{ backgroundColor: '#22c55e' }}
              >
                <i className="fa-solid fa-paper-plane text-dark-900 text-xs" />
              </button>
            </div>
            <p className="text-text-muted text-xs text-center mt-1.5">
              Enter to send · Shift+Enter new line
            </p>
          </div>

        </div>
      )}

      {/* Bounce animation untuk loading dots */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default Chatbot;