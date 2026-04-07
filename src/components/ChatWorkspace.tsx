'use client'

import { useState, useRef, useEffect } from 'react';
import { Send, BookOpen, Plus, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWorkspace({ bookTitle }: { bookTitle: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Salom! "${bookTitle}" asari bo'yicha tahlillarimizni boshlashga tayyorman. Qaysi qismini chuqurroq ko'rib chiqamiz?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    setError(null);
    const updatedMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          bookName: bookTitle,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        const errorText = data?.text || "Kechirasiz, AI bilan bog'lanishda xatolik yuz berdi.";
        setError(errorText);
        setMessages(prev => [...prev, { role: 'assistant', content: errorText }]);
        return;
      }

      const aiText = data?.text;
      if (!aiText) {
        throw new Error('Empty response from API');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch {
      const fallbackMsg = "Kechirasiz, tarmoq xatosi yuz berdi. Iltimos, qaytadan urinib ko'ring.";
      setError(fallbackMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: fallbackMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      { role: 'assistant', content: `"${bookTitle}" asari bo'yicha yangi suhbat boshlandi. Savolingizni bering!` }
    ]);
    setError(null);
    setInput('');
  };

  return (
    <div className="d-flex flex-column h-100 bg-body position-relative">
      {/* Header */}
      <div className="navbar bg-body border-bottom border-light-subtle p-4 d-flex align-items-center justify-content-between sticky-top z-index-2 glass">
         <div className="d-flex align-items-center gap-4">
            <div className="p-3 bg-dark-subtle rounded-4 d-flex align-items-center justify-content-center shadow-lg position-relative overflow-hidden">
               <BookOpen className="text-secondary" size={28} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span
                  className={`rounded-circle ${isLoading ? 'bg-warning' : 'bg-primary'} shadow-lg`}
                  style={{ width: '8px', height: '8px', display: 'inline-block' }}
                />
                <h2 className="h4 fw-black m-0 tracking-tight">{bookTitle}</h2>
              </div>
              <p className="small text-secondary fw-black text-uppercase tracking-widest mb-0 opacity-50" style={{ fontSize: '9px' }}>
                {isLoading ? 'AI javob yozmoqda...' : 'Expert adabiy tahlil tizimi'}
              </p>
            </div>
         </div>
         
         <div className="d-flex gap-3">
            <button className="btn btn-outline-secondary rounded-4 p-3 shadow-sm border-light-subtle"><History size={18} /></button>
            <button
              onClick={handleNewChat}
              className="btn btn-dark d-flex align-items-center gap-2 px-5 py-3 rounded-4 fw-black small text-uppercase tracking-widest hover-scale-105 transition-all shadow-lg"
            >
               <Plus size={18} /> YANGI CHAT
            </button>
         </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-grow-1 overflow-y-auto px-5 py-5 d-flex flex-column gap-5 scrollbar-hide container-md"
        style={{ maxWidth: '900px' }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
            >
              <div 
                className={`p-5 p-md-5 rounded-5 fs-5 fw-medium leading-relaxed transition-all shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-bottom-end-0 shadow-lg' 
                    : 'bg-body-secondary border border-light-subtle rounded-bottom-start-0 text-body'
                }`}
                style={{ maxWidth: '85%', whiteSpace: 'pre-wrap' }}
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
                      width: '8px', height: '8px', display: 'inline-block',
                      animation: `bounce 1s infinite ${delay}ms`
                    }}
                  />
                ))}
             </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="p-5 sticky-bottom bg-gradient-to-t from-body via-body to-transparent pt-10">
         <div className="container-md position-relative" style={{ maxWidth: '900px' }}>
            <div className="d-flex gap-2 overflow-x-auto scrollbar-hide mb-3">
               {['Asosiy qahramonlar', 'Falsafiy ma\'no', 'Yashirin ramzlar'].map(t => (
                 <button
                   key={t}
                   onClick={() => setInput(t)}
                   disabled={isLoading}
                   className="btn btn-sm btn-light border-light-subtle rounded-pill text-nowrap small px-3 py-2 fw-black"
                 >
                   {t}
                 </button>
               ))}
            </div>
            <div className="input-group p-2 bg-body border border-light-subtle rounded-5 shadow-lg position-relative z-index-1">
               <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Tanlangan kitob haqida savol bering..."
                disabled={isLoading}
                className="form-control border-0 bg-transparent py-4 px-5 fs-5 shadow-none ps-5"
               />
               <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="btn btn-dark rounded-4 px-5 py-4 fw-black ms-2 shadow-lg hover-scale-105 transition-all d-flex align-items-center justify-content-center"
               >
                 <Send size={24} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
