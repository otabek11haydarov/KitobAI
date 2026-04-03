'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Bot, ChevronLeft, MessageSquare, Plus, Send, Sparkles, User } from 'lucide-react';

import { ChatSession } from '@/lib/data';

export default function AIChatDetailClient({ chatId }: { chatId: string }) {
  const router = useRouter();
  const [session, setSession] = useState<ChatSession | null>(null);
  const [allSessions, setAllSessions] = useState<ChatSession[]>([]);
  const [hasResolvedSession, setHasResolvedSession] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isWaitingForFirstChunk, setIsWaitingForFirstChunk] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior,
        });
      }
    });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('kitobai_chats');
    const chats: ChatSession[] = saved ? JSON.parse(saved) : [];
    setAllSessions(chats);

    let current = chats.find((item) => item.id === chatId) ?? null;
    if (!current && (chatId === 'read' || chatId === 'planning')) {
      current = {
        id: chatId,
        bookName: chatId === 'read' ? "O'qigan kitoblarim" : "O'qimoqchi bo'lganlarim",
        messages: [{ role: 'ai', text: "Salom! Ushbu ro'yxatingizdagi kitoblar haqida nimalarni bilmoqchisiz?" }],
        createdAt: new Date().toISOString(),
      };
    }

    setSession(current);
    setHasResolvedSession(true);
  }, [chatId]);

  useEffect(() => {
    scrollToBottom(isTyping ? 'auto' : 'smooth');
  }, [isTyping, scrollToBottom, session?.messages]);

  const saveSession = useCallback((updated: ChatSession) => {
    const saved = localStorage.getItem('kitobai_chats');
    const chats: ChatSession[] = saved ? JSON.parse(saved) : [];
    const index = chats.findIndex((item) => item.id === updated.id);

    if (index !== -1) {
      chats[index] = updated;
    } else {
      chats.unshift(updated);
    }

    localStorage.setItem('kitobai_chats', JSON.stringify(chats));
    setAllSessions(chats);
  }, []);

  const sidebarItems = useMemo(() => allSessions, [allSessions]);

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim() || !session || isTyping) return;

    const userMessage = input.trim();
    const optimisticMessages = [
      ...session.messages,
      { role: 'user' as const, text: userMessage },
      { role: 'ai' as const, text: '' },
    ];
    const optimisticSession = { ...session, messages: optimisticMessages };

    setSession(optimisticSession);
    setInput('');
    setIsTyping(true);
    setIsWaitingForFirstChunk(true);
    saveSession({ ...session, messages: [...session.messages, { role: 'user' as const, text: userMessage }] });
    scrollToBottom();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: optimisticMessages,
          bookName: session.bookName,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.text || "Kechirasiz, javob olishda xatolik yuz berdi.");
      }

      if (!response.body) {
        throw new Error("AI javobi bo'sh keldi.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) {
          continue;
        }

        streamedText += chunk;
        setIsWaitingForFirstChunk(false);
        setSession((current) => {
          if (!current) return current;
          const nextMessages = [...current.messages];
          nextMessages[nextMessages.length - 1] = { role: 'ai', text: streamedText };
          return { ...current, messages: nextMessages };
        });
        scrollToBottom('auto');
      }

      const finalSession = {
        ...optimisticSession,
        messages: [
          ...optimisticSession.messages.slice(0, -1),
          { role: 'ai' as const, text: streamedText || "Kechirasiz, javob olishda xatolik yuz berdi." },
        ],
      };

      if (session.bookName === 'Yangi Chat' || session.bookName === 'Nomsiz Chat') {
        finalSession.bookName = userMessage.length < 30 ? userMessage : 'Kitob Tahlili';
      }

      setSession(finalSession);
      saveSession(finalSession);
    } catch (error) {
      console.error('Chat API fetch error:', error);
      const fallbackText = error instanceof Error ? error.message : "Tarmoq xatosi. Iltimos keyinroq urinib ko'ring.";
      const finalFallback = {
        ...optimisticSession,
        messages: [
          ...optimisticSession.messages.slice(0, -1),
          { role: 'ai' as const, text: fallbackText },
        ],
      };
      setSession(finalFallback);
      saveSession(finalFallback);
    } finally {
      setIsTyping(false);
      setIsWaitingForFirstChunk(false);
    }
  };

  if (!hasResolvedSession) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="d-flex gap-2 align-items-center text-secondary">
          <span className="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
          Yuklanmoqda...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <main className="vh-100 d-flex align-items-center justify-content-center bg-body-tertiary p-4">
        <div className="card border-0 shadow-sm rounded-5 p-4 p-md-5 text-center" style={{ maxWidth: '540px' }}>
          <h1 className="h3 fw-bold text-dark mb-3">Chat topilmadi</h1>
          <p className="text-secondary mb-4">
            Bu chat sessiyasi mavjud emas yoki shu brauzerda saqlanmagan. Yangi AI chat ochib davom etishingiz mumkin.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <button type="button" className="btn btn-primary rounded-pill fw-bold px-4" onClick={() => router.push('/ai')}>
              AI sahifasiga qaytish
            </button>
            <button type="button" className="btn btn-light rounded-pill fw-bold px-4 border border-light-subtle" onClick={() => router.push('/books')}>
              Kitoblarni ko'rish
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="vh-100 d-flex flex-column bg-body-tertiary overflow-hidden">
      <nav className="bg-white border-bottom border-light-subtle shadow-sm flex-shrink-0 z-3 p-3">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <button type="button" onClick={() => router.push('/ai')} className="btn btn-light rounded-circle p-2 d-flex justify-content-center align-items-center transition-all hover-scale-105 border-0">
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
                <div className="text-primary small m-0 fw-bold d-flex align-items-center gap-1">
                  <span className="bg-success rounded-circle d-inline-block" style={{ width: '6px', height: '6px' }}></span>
                  AI Assistant online
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="d-flex flex-grow-1 overflow-hidden container-fluid p-0">
        <aside className="d-none d-lg-flex flex-column border-end border-light-subtle bg-white flex-shrink-0" style={{ width: '320px' }}>
          <div className="p-4 border-bottom border-light-subtle fw-bold text-dark d-flex align-items-center justify-content-between">
            <span className="d-flex align-items-center gap-2"><MessageSquare size={18} className="text-primary" /> Tarix</span>
            <button type="button" onClick={() => router.push('/ai')} className="btn btn-light btn-sm rounded-circle"><Plus size={16} /></button>
          </div>
          <div className="overflow-auto p-2 d-flex flex-column gap-1" style={{ scrollbarWidth: 'thin' }}>
            {sidebarItems.map((item) => (
              <SidebarItem key={item.id} item={item} isActive={chatId === item.id} onOpen={() => router.push(`/ai/${item.id}`)} />
            ))}
          </div>
        </aside>

        <section className="flex-grow-1 d-flex flex-column bg-white overflow-hidden">
          <div ref={scrollRef} className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-4" style={{ scrollBehavior: 'smooth', scrollbarWidth: 'thin' }}>
            <div className="text-center mb-2">
              <span className="badge bg-light text-muted border border-light-subtle rounded-pill py-2 px-3 fw-medium" style={{ fontSize: '11px' }}>
                SUHBAT BOSHLANDI • {new Date(session.createdAt).toLocaleDateString('uz-UZ')}
              </span>
            </div>

            {session.messages.map((message, index) => (
              <MessageBubble
                key={`${message.role}-${index}`}
                message={message}
                isStreaming={index === session.messages.length - 1 && message.role === 'ai' && isTyping}
                isWaitingForFirstChunk={isWaitingForFirstChunk}
              />
            ))}
          </div>

          <div className="p-4 bg-white border-top border-light-subtle w-100 mt-auto">
            <form onSubmit={handleSend} className="mx-auto position-relative" style={{ maxWidth: '900px' }}>
              <div className="search-container bg-light rounded-pill border border-light-subtle p-2 shadow-sm d-flex align-items-center transition-all focus-within-shadow">
                <input
                  type="text"
                  className="form-control border-0 bg-transparent py-2 px-4 shadow-none focus-ring-0 fs-6 fw-bold"
                  placeholder={isTyping ? 'AI javob tayyorlayapti...' : 'Xabaringizni yozing...'}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
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
        .hover-bg-light:hover { background-color: #f8fafc !important; }
        .focus-within-shadow:focus-within {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          border-color: #3b82f6 !important;
        }
      `}</style>
    </div>
  );
}

const SidebarItem = memo(function SidebarItem({
  item,
  isActive,
  onOpen,
}: {
  item: ChatSession;
  isActive: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      className={`p-3 rounded-4 cursor-pointer transition-all d-flex align-items-center gap-3 text-start border ${isActive ? 'bg-primary text-white shadow-premium-sm fw-bold border-primary' : 'bg-transparent hover-bg-light border-transparent text-secondary'}`}
      onClick={onOpen}
    >
      <div className={`rounded-3 overflow-hidden flex-shrink-0 ${isActive ? 'opacity-100' : 'opacity-75'}`} style={{ width: '30px', height: '40px' }}>
        {item.image ? (
          <img src={item.image} className="w-100 h-100" style={{ objectFit: 'cover' }} alt={item.bookName} />
        ) : (
          <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center"><BookOpen size={14} /></div>
        )}
      </div>
      <span className="flex-grow-1 text-truncate small">{item.bookName}</span>
    </button>
  );
});

const MessageBubble = memo(function MessageBubble({
  message,
  isStreaming,
  isWaitingForFirstChunk,
}: {
  message: ChatSession['messages'][number];
  isStreaming: boolean;
  isWaitingForFirstChunk: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`d-flex gap-3 ${message.role === 'user' ? 'align-self-end flex-row-reverse' : 'align-self-start'}`}
      style={{ maxWidth: '80%' }}
    >
      <div className={`p-2 rounded-circle flex-shrink-0 shadow-sm align-self-end d-flex align-items-center justify-content-center ${message.role === 'user' ? 'bg-primary text-white' : 'bg-white text-primary border border-light-subtle'}`} style={{ width: '38px', height: '38px' }}>
        {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
      </div>
      <div
        className={`p-3 px-4 rounded-4 shadow-premium-sm ${message.role === 'user' ? 'bg-primary text-white' : 'bg-light text-dark border-0'}`}
        style={{
          borderBottomRightRadius: message.role === 'user' ? '4px' : '1.25rem',
          borderBottomLeftRadius: message.role === 'ai' ? '4px' : '1.25rem',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          minWidth: message.role === 'ai' ? '96px' : undefined,
        }}
      >
        {message.text ? (
          <>
            {message.text}
            {isStreaming && <span className="ms-1 opacity-50">|</span>}
          </>
        ) : (
          <span className="text-secondary">{isWaitingForFirstChunk ? 'AI is thinking...' : '...'}</span>
        )}
      </div>
    </motion.div>
  );
});
