'use client'

import { useState, useRef, useEffect } from 'react';
import { Send, BookOpen, MessageSquare, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Salom! Men KitobAI asistentiman. Qaysi kitob haqida suhbatlashamiz?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: `"${userMsg}" haqida gapirganda, uning falsafiy qatlamlari va muallifning badiiy mahoratiga e'tibor berish lozim.` }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="card h-100 flex-column glass overflow-hidden border-light-subtle shadow-lg rounded-5">
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
        <div className="d-flex gap-2">
          <span className="bg-success rounded-circle animate-pulse" style={{ width: '8px', height: '8px' }} />
          <span className="text-secondary small fw-bold">Onlayn</span>
        </div>
      </div>

      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="card-body overflow-y-auto p-4 d-flex flex-column gap-4 scrollbar-hide"
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
                style={{ maxWidth: '85%', fontSize: '15px', fontWeight: '500' }}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="d-flex justify-content-start p-2">
             <div className="d-flex gap-1">
                <span className="bg-primary rounded-circle animate-bounce" style={{ width: '6px', height: '6px', animationDelay: '0ms' }} />
                <span className="bg-primary rounded-circle animate-bounce" style={{ width: '6px', height: '6px', animationDelay: '150ms' }} />
                <span className="bg-primary rounded-circle animate-bounce" style={{ width: '6px', height: '6px', animationDelay: '300ms' }} />
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
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Kitob haqida savol bering..."
            className="form-control rounded-pill py-3 px-4 shadow-sm border-light-subtle focus-ring-0"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
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
