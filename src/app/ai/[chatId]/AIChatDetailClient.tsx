'use client'

import React, { useState } from 'react';
import { Book, booksData } from '../../../lib/data';
import { Send, ChevronLeft, Bot, User, BookOpen, Clock, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIChatDetailClient({ chatId, book }: { chatId: string; book?: Book }) {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: book ? `Salom! Men ${book.title} kitobi bo'yicha sizning shaxsiy yordamchingizman. Savollaringiz bo'lsa marhamat.` : `Salom! Men sizning kitoblar bo'yicha aqlli yordamchingizman.` }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages([...messages, { role: 'user', text: userMsg }]);
    setInput('');

    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: 'Kechirasiz, hozircha ushbu Demo loyihada AI serveri ulanmagan. Iltimos keyinroq urinib ko\'ring.' }]);
    }, 1000);
  };

  const getChatTitle = () => {
    if (book) return book.title;
    if (chatId === 'read') return "O'qigan kitoblarim tahlili";
    if (chatId === 'planning') return "O'qimoqchi bo'lgan kitoblarim";
    return "AI Chat";
  };

  return (
    <div className="vh-100 d-flex flex-column bg-body-tertiary">
      {/* Header */}
      <nav className="bg-white border-bottom border-light-subtle shadow-sm flex-shrink-0 z-3 p-3">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <button onClick={() => window.location.href = '/ai'} className="btn btn-light rounded-circle p-2 d-flex justify-content-center align-items-center transition-all hover-scale-105 border-0">
              <ChevronLeft size={20} />
            </button>

            <div className="d-flex align-items-center gap-3">
              {book ? (
                <div className="rounded-3 overflow-hidden shadow-sm" style={{ width: '40px', height: '50px', flexShrink: 0 }}>
                  <img src={book.image} alt={book.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                </div>
              ) : (
                <div className="bg-primary-subtle text-primary p-2 rounded-3 shadow-sm d-flex justify-content-center align-items-center">
                  {chatId === 'read' ? <MessageSquare size={24} /> : <Clock size={24} />}
                </div>
              )}
              <div>
                <h5 className="fw-bold m-0 text-dark">{getChatTitle()}</h5>
                <p className="text-secondary small m-0 fw-medium">
                  {book ? book.author : "Umumiy tahlil"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout containing Sidebar + Chat */}
      <div className="d-flex flex-grow-1 overflow-hidden container-fluid p-0">

        {/* Sidebar (Optional chats list) */}
        <aside className="d-none d-lg-flex flex-column border-end border-light-subtle bg-white flex-shrink-0" style={{ width: '320px' }}>
          <div className="p-3 border-bottom border-light-subtle fw-bold text-secondary d-flex align-items-center gap-2">
            <BookOpen size={18} /> Barcha Chatlar
          </div>
          <div className="overflow-auto p-2 d-flex flex-column gap-2" style={{ scrollbarWidth: 'thin' }}>
            <div
              className={`p-3 rounded-4 cursor-pointer transition-all ${chatId === 'read' ? 'bg-primary-subtle text-primary fw-bold' : 'bg-transparent hover-bg-light border border-transparent'}`}
              onClick={() => window.location.href = '/ai/read'}
            >
              <div className="d-flex align-items-center gap-2">
                <MessageSquare size={18} /> O'qigan kitoblarim
              </div>
            </div>
            <div
              className={`p-3 rounded-4 cursor-pointer transition-all ${chatId === 'planning' ? 'bg-success-subtle text-success fw-bold' : 'bg-transparent hover-bg-light border border-transparent'}`}
              onClick={() => window.location.href = '/ai/planning'}
            >
              <div className="d-flex align-items-center gap-2">
                <Clock size={18} /> O'qimoqchi bo'lgan
              </div>
            </div>

            <hr className="my-2 border-light-subtle" />
            <p className="small text-secondary px-2 fw-medium mb-1">Kitoblar:</p>

            {booksData.map((b) => (
              <div
                key={b.id}
                className={`p-2 rounded-4 cursor-pointer transition-all d-flex align-items-center gap-3 ${chatId === b.id ? 'bg-light border border-light-subtle shadow-sm' : 'bg-transparent hover-bg-light border border-transparent'}`}
                onClick={() => window.location.href = `/ai/${b.id}`}
              >
                <div className="rounded-3 overflow-hidden shadow-sm" style={{ width: '30px', height: '40px', flexShrink: 0 }}>
                  <img src={b.image} className="w-100 h-100" style={{ objectFit: 'cover' }} alt="book" />
                </div>
                <div className="flex-grow-1 text-truncate">
                  <span className="fw-medium small text-dark d-block text-truncate">{b.title}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
        {/* Chat Interface */}
        <section className="flex-grow-1 d-flex flex-column bg-body position-relative">
          {/* Messages Area */}
          <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3" style={{ paddingBottom: '100px' }}>
            <div className="text-center mb-3">
              <span className="badge bg-light text-secondary border border-light-subtle rounded-pill py-2 px-3 shadow-none fw-medium small">
                Bugun
              </span>
            </div>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`d-flex gap-2 ${msg.role === 'user' ? 'align-self-end flex-row-reverse' : 'align-self-start'}`}
                style={{ maxWidth: '85%' }}
              >
                <div className={`p-2 rounded-circle flex-shrink-0 shadow-sm align-self-end ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white text-primary border border-light-subtle'}`} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div
                  className={`p-3 rounded-4 shadow-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white text-dark border border-light-subtle'}`}
                  style={{ borderBottomRightRadius: msg.role === 'user' ? '4px' : '1rem', borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '1rem' }}
                >
                  <p className="m-0 fs-6" style={{ lineHeight: '1.5' }}>{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-top border-light-subtle position-absolute bottom-0 w-100 z-1 shadow-sm">
            <form onSubmit={handleSend} className="mx-auto position-relative" style={{ maxWidth: '1000px' }}>
              <div className="input-group bg-light rounded-4 border border-light-subtle p-1 shadow-sm transition-all focus-within-shadow">
                <input
                  type="text"
                  className="form-control border-0 bg-transparent py-3 px-4 shadow-none focus-ring-0 fs-5"
                  placeholder={book ? `${book.title} haqida savol so'rang...` : "Xabar yozing..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-primary rounded-circle m-1 d-flex align-items-center justify-content-center transition-all hover-scale-105"
                  style={{ width: '50px', height: '50px' }}
                  disabled={!input.trim()}
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
