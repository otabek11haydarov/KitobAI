'use client'

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Salom! Men KitobAI asistentiman. Qaysi kitob haqida suhbatlashamiz?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    const userMsg = input.trim();
    if (!userMsg || isLoading) return;

    setInput('');
    const updatedMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          bookName: 'Kitob',
        }),
      });

      const data = await response.json();
      const aiText = data?.text || "Kechirasiz, AI bilan bog'lanishda xatolik yuz berdi.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Kechirasiz, tarmoq xatosi yuz berdi. Iltimos, qaytadan urinib ko'ring." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card h-100 flex-column glass overflow-hidden border-light-subtle shadow-lg rounded-5" style={{ display: 'flex' }}>
      {/* Header */}
      <div className="card-header bg-transparent border-light-subtle p-4 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <div className="p-2 bg-primary-subtle rounded-3">
            <Sparkles className="text-primary" size={20} />
          </div>
          <div>
            <h2 className="h5 fw-black m-0 tracking-tight">KitobAI Asistent</h2>
            <p className="text-secondary m-0" style={{ fontSize: '10px' }}>Expert adabiy tahlil</p>
          </div>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <span
            className={`rounded-circle ${isLoading ? 'bg-warning' : 'bg-success'}`}
            style={{ width: '8px', height: '8px', display: 'inline-block' }}
          />
          <span className="text-secondary small fw-bold">{isLoading ? 'Yozmoqda...' : 'Onlayn'}</span>
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="card-body overflow-y-auto p-4 d-flex flex-column gap-4 scrollbar-hide"
        style={{ flex: 1 }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
            >
              <div
                className={`p-4 rounded-4 shadow-sm m-0 ${
                  msg.role === 'user'
                    ? 'bg-primary text-white text-end rounded-bottom-end-0'
                    : 'bg-body-secondary border rounded-bottom-start-0'
                }`}
                style={{ maxWidth: '85%', fontSize: '18px', lineHeight: '1.7', fontWeight: '500', whiteSpace: 'pre-wrap' }}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="d-flex justify-content-start p-2">
            <div className="d-flex gap-1 align-items-center">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="bg-primary rounded-circle"
                  style={{
                    width: '6px', height: '6px', display: 'inline-block',
                    animation: `bounce 1s infinite ${delay}ms`
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="card-footer bg-transparent border-light-subtle p-4">
        <div className="position-relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Kitob haqida savol bering..."
            disabled={isLoading}
            className="form-control rounded-pill py-3 px-4 shadow-sm border-light-subtle"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="btn btn-primary rounded-circle position-absolute top-50 translate-middle-y end-0 me-1 p-2 d-flex align-items-center justify-content-center"
            style={{ width: '45px', height: '45px' }}
          >
            <Send size={18} />
          </button>
        </div>

        <div className="mt-3 d-flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['1984 tahlili', 'Badiiy uslub', 'Sapiens xulosasi'].map((p) => (
            <button
              key={p}
              onClick={() => setInput(p)}
              disabled={isLoading}
              className="btn btn-sm btn-outline-primary rounded-pill text-nowrap small px-3 py-1 font-bold"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
