'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Book, booksData, ChatSession } from '../../../lib/data';
import { Send, ChevronLeft, Bot, User, BookOpen, Clock, MessageSquare, Sparkles, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIChatDetailClient({ chatId }: { chatId: string }) {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [allSessions, setAllSessions] = useState<ChatSession[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load session from dynamic data (localStorage)
  useEffect(() => {
    const saved = localStorage.getItem('kitobai_chats');
    if (saved) {
      const chats: ChatSession[] = JSON.parse(saved);
      setAllSessions(chats);
      
      let current = chats.find(c => c.id === chatId);
      
      // Handle special pinned IDs if they don't exist yet
      if (!current && (chatId === 'read' || chatId === 'planning')) {
        current = {
          id: chatId,
          bookName: chatId === 'read' ? "O'qigan kitoblarim" : "O'qimoqchi bo'lganlarim",
          messages: [{ role: 'ai', text: "Salom! Ushbu ro'yxatingizdagi kitoblar haqida nimalarni bilmoqchisiz?" }],
          createdAt: new Date().toISOString()
        };
      }
      
      if (current) {
        setSession(current);
      }
    }
  }, [chatId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session?.messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !session || isTyping) return;

    const userMsg = input.trim();
    const updatedMessages = [...session.messages, { role: 'user' as const, text: userMsg }];
    
    // Update local state first for immediate UI feedback
    const updatedSession = { ...session, messages: updatedMessages };
    setSession(updatedSession);
    setInput('');

    // Persistence logic
    saveSession(updatedSession);

    // Call Real AI API
    setIsTyping(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          bookName: session.bookName
        })
      });
      
      const data = await response.json();
      const aiResponse = { role: 'ai' as const, text: data.text || "Kechirasiz, javob olishda xatolik yuz berdi." };
      
      const finalMessages = [...updatedMessages, aiResponse];
      const finalSession = { ...updatedSession, messages: finalMessages };
      
      // If the chat didn't have a book name, attempt to update it from first real user message
      if (session.bookName === "Yangi Chat" || session.bookName === "Nomsiz Chat") {
         finalSession.bookName = userMsg.length < 30 ? userMsg : "Kitob Tahlili";
      }

      setSession(finalSession);
      saveSession(finalSession);
    } catch (error) {
      console.error("Chat API fetch error:", error);
      const errorMsg = { role: 'ai' as const, text: "Tarmoq xatosi. Iltimos keyinroq urinib ko'ring." };
      setSession(prev => prev ? { ...prev, messages: [...prev.messages, errorMsg] } : null);
    } finally {
      setIsTyping(false);
    }
  };

  const saveSession = (updated: ChatSession) => {
    const saved = localStorage.getItem('kitobai_chats');
    let chats: ChatSession[] = saved ? JSON.parse(saved) : [];
    
    const index = chats.findIndex(c => c.id === updated.id);
    if (index !== -1) {
      chats[index] = updated;
    } else {
      chats.push(updated);
    }
    
    localStorage.setItem('kitobai_chats', JSON.stringify(chats));
    setAllSessions(chats);
  };

  if (!session) return <div className="vh-100 d-flex align-items-center justify-content-center bg-light">Loading...</div>;

  return (
    <div className="vh-100 d-flex flex-column bg-body-tertiary overflow-hidden">
      {/* Header */}
      <nav className="bg-white border-bottom border-light-subtle shadow-sm flex-shrink-0 z-3 p-3">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <button onClick={() => window.location.href = '/ai'} className="btn btn-light rounded-circle p-2 d-flex justify-content-center align-items-center transition-all hover-scale-105 border-0">
              <ChevronLeft size={20} />
            </button>

            <div className="d-flex align-items-center gap-3">
              {session.image ? (
                <div className="rounded-3 overflow-hidden shadow-premium-sm" style={{ width: '45px', height: '60px', flexShrink: 0 }}>
                  <img src={session.image} alt={session.bookName} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                </div>
              ) : (
                <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-4 shadow-sm">
                   {chatId === 'read' ? <BookOpen size={24} /> : <Sparkles size={24} />}
                </div>
              )}
              <div>
                <h5 className="fw-black m-0 text-dark">{session.bookName}</h5>
                <p className="text-primary small m-0 fw-bold d-flex align-items-center gap-1">
                   <div className="bg-success rounded-circle" style={{ width: '6px', height: '6px' }}></div>
                   AI Assistant Onlayn
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout containing Sidebar + Chat */}
      <div className="d-flex flex-grow-1 overflow-hidden container-fluid p-0">

        {/* Sidebar */}
        <aside className="d-none d-lg-flex flex-column border-end border-light-subtle bg-white flex-shrink-0" style={{ width: '320px' }}>
          <div className="p-4 border-bottom border-light-subtle fw-bold text-dark d-flex align-items-center justify-content-between">
            <span className="d-flex align-items-center gap-2"><MessageSquare size={18} className="text-primary" /> Tarix</span>
            <button onClick={() => window.location.href='/ai'} className="btn btn-light btn-sm rounded-circle"><Plus size={16}/></button>
          </div>
          <div className="overflow-auto p-2 d-flex flex-column gap-1" style={{ scrollbarWidth: 'thin' }}>
            {allSessions.map((s) => (
              <div
                key={s.id}
                className={`p-3 rounded-4 cursor-pointer transition-all d-flex align-items-center gap-3 ${chatId === s.id ? 'bg-primary text-white shadow-premium-sm fw-bold' : 'bg-transparent hover-bg-light border border-transparent text-secondary'}`}
                onClick={() => window.location.href = `/ai/${s.id}`}
              >
                <div className={`rounded-3 overflow-hidden flex-shrink-0 ${chatId === s.id ? 'opacity-100' : 'opacity-75'}`} style={{ width: '30px', height: '40px' }}>
                  {s.image ? <img src={s.image} className="w-100 h-100" style={{ objectFit: 'cover' }} alt="book" /> : <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center"><BookOpen size={14}/></div>}
                </div>
                <span className="flex-grow-1 text-truncate small">{s.bookName}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat Interface */}
        <section className="flex-grow-1 d-flex flex-column bg-white overflow-hidden">
          {/* Messages Area - Scrollable */}
          <div 
            ref={scrollRef} 
            className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-4" 
            style={{ 
              scrollBehavior: 'smooth',
              scrollbarWidth: 'thin'
            }}
          >
            <div className="text-center mb-2">
              <span className="badge bg-light text-muted border border-light-subtle rounded-pill py-2 px-3 fw-medium" style={{ fontSize: '11px' }}>
                SUHBAT BOSHLANDI • {new Date(session.createdAt).toLocaleDateString()}
              </span>
            </div>

            {session.messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`d-flex gap-3 ${msg.role === 'user' ? 'align-self-end flex-row-reverse' : 'align-self-start'}`}
                style={{ maxWidth: '80%' }}
              >
                <div className={`p-2 rounded-circle flex-shrink-0 shadow-sm align-self-end d-flex align-items-center justify-content-center ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white text-primary border border-light-subtle'}`} style={{ width: '38px', height: '38px' }}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div
                  className={`p-3 px-4 rounded-4 shadow-premium-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-light text-dark border-0'}`}
                  style={{ 
                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '1.25rem', 
                    borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '1.25rem',
                    fontSize: '0.95rem',
                    lineHeight: '1.6'
                  }}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="d-flex gap-3 align-self-start">
                <div className="p-2 rounded-circle bg-white text-primary border border-light-subtle shadow-sm d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
                  <Bot size={20} />
                </div>
                <div className="bg-light p-3 px-4 rounded-4 d-flex align-items-center gap-2 shadow-sm">
                   <div className="typing-dot"></div>
                   <div className="typing-dot"></div>
                   <div className="typing-dot"></div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area - Now in standard flex flow (no absolute positioning) */}
          <div className="p-4 bg-white border-top border-light-subtle w-100 mt-auto">
            <form onSubmit={handleSend} className="mx-auto position-relative" style={{ maxWidth: '900px' }}>
              <div className="search-container bg-light rounded-pill border border-light-subtle p-2 shadow-sm d-flex align-items-center transition-all focus-within-shadow">
                <input
                  type="text"
                  className="form-control border-0 bg-transparent py-2 px-4 shadow-none focus-ring-0 fs-6 fw-bold"
                  placeholder={isTyping ? "AI javob tayyorlayapti..." : "Xabaringizni yozing..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  className="btn btn-primary rounded-pill px-4 d-flex align-items-center justify-content-center transition-all hover-scale-110 shadow-sm h-100"
                  style={{ minWidth: '48px', height: '48px', flexShrink: 0 }}
                  disabled={!input.trim() || isTyping}
                >
                  <Send size={20} strokeWidth={2.5} />
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

      <style jsx>{`
        .shadow-premium-sm {
          box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03) !important;
        }
        .typing-dot {
          width: 6px;
          height: 6px;
          background: #3b82f6;
          border-radius: 50%;
          animation: typing 1.4s infinite;
          opacity: 0.4;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes typing {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
        
        .hover-bg-light:hover { background-color: #f8fafc !important; }
        .focus-within-shadow:focus-within {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          border-color: #3b82f6 !important;
        }
      `}</style>
    </div>
  );
}
