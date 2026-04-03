'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, ChevronLeft, Clock3, MessageSquare, Plus, Search, Sparkles, X } from 'lucide-react';

import BookCoverImage from '@/components/BookCoverImage';
import { Book, booksData, ChatSession, getBookPromptSuggestions, searchBooks } from '@/lib/data';

type SuggestedTrack = {
  id: string;
  title: string;
  description: string;
  href: string;
  color: string;
  icon: ReactNode;
};

const suggestedTracks: SuggestedTrack[] = [
  {
    id: 'reading-history',
    title: "O'qigan kitoblarim",
    description: "Tugallangan kitoblar asosida xulosa, tahlil, va qayta ko'rib chiqish savollari.",
    href: '/ai/read',
    color: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    icon: <BookOpen size={24} />,
  },
  {
    id: 'reading-plan',
    title: "O'qimoqchi bo'lganlarim",
    description: "Keyingi o'qish rejangiz, ketma-ketlik, va qiziqishlarga mos tavsiyalar.",
    href: '/ai/planning',
    color: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    icon: <Clock3 size={24} />,
  },
];

function createInitialMessage(bookName: string) {
  return {
    role: 'ai' as const,
    text: `${bookName} bo'yicha nimani bilmoqchisiz? Men sizga summary, theme, character, discussion savollari, va tavsiyalar bilan yordam bera olaman.`,
  };
}

export default function AIOptionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialBookId = searchParams.get('book');
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChatBookName, setNewChatBookName] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  useEffect(() => {
    const savedChats = localStorage.getItem('kitobai_chats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  useEffect(() => {
    if (!initialBookId) return;

    const matchedBook = booksData.find((book) => book.id === initialBookId || book.slug === initialBookId);
    if (!matchedBook) return;

    setSelectedBook(matchedBook);
    setSearchQuery(matchedBook.title);
    setNewChatBookName(matchedBook.title);
    setIsModalOpen(true);
  }, [initialBookId]);

  const filteredBooks = useMemo(() => searchBooks(deferredSearchQuery, 'All', 'popular').slice(0, 6), [deferredSearchQuery]);
  const featuredBooks = useMemo(() => booksData.filter((book) => book.isFeatured).slice(0, 4), []);
  const suggestedPrompts = selectedBook ? getBookPromptSuggestions(selectedBook) : [];

  const handleCreateChat = () => {
    const chatTitle = selectedBook ? selectedBook.title : newChatBookName.trim();
    if (!chatTitle) return;

    const newChat: ChatSession = {
      id: Date.now().toString(),
      bookName: chatTitle,
      image: selectedBook?.image,
      messages: [createInitialMessage(chatTitle)],
      createdAt: new Date().toISOString(),
    };

    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    localStorage.setItem('kitobai_chats', JSON.stringify(updatedChats));
    setIsModalOpen(false);
    router.push(`/ai/${newChat.id}`);
  };

  return (
    <main className="min-vh-100 d-flex flex-column bg-body-tertiary text-body pb-5" data-bs-theme="light">
      <nav className="fixed-top w-100 bg-white border-bottom border-light-subtle shadow-sm z-3">
        <div className="container px-4 py-3 d-flex align-items-center justify-content-between mx-auto">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="btn btn-light d-flex align-items-center gap-2 border-0 bg-transparent text-secondary hover-text-primary px-0 transition-all"
          >
            <ChevronLeft size={20} />
            <span className="fw-bold">Bosh sahifa</span>
          </button>
          <div className="d-flex align-items-center gap-2 text-primary">
            <Sparkles size={20} />
            <span className="fw-bold">KitobAI Premium</span>
          </div>
        </div>
      </nav>

      <section className="container py-5 mt-5">
        <div className="row g-4 align-items-stretch mt-4">
          <div className="col-lg-7">
            <div className="card border-0 shadow-premium rounded-5 p-4 p-md-5 h-100 overflow-hidden position-relative">
              <div className="position-absolute top-0 end-0 translate-middle-y opacity-10">
                <MessageSquare size={240} />
              </div>
              <div className="position-relative">
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2 mb-3">
                  AI reading companion
                </span>
                <h1 className="display-5 fw-black text-dark tracking-tight mb-3">Fikrli, foydali, va kitobga mos AI suhbatlar</h1>
                <p className="lead text-secondary fw-medium mb-4">
                  Book discovery, summaries, themes, discussion prompts, character analysis, reading guidance, and recommendations in one place.
                </p>
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <button type="button" className="btn btn-primary rounded-pill fw-bold px-4 py-3 d-inline-flex align-items-center gap-2" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} />
                    Yangi chat yaratish
                  </button>
                  <Link href="/books" className="btn btn-light rounded-pill fw-bold px-4 py-3 border border-light-subtle">
                    Book catalog
                  </Link>
                </div>
                <div className="row g-3">
                  {['Quick summary', 'Discussion questions', 'Reading order', 'Theme breakdown'].map((item) => (
                    <div key={item} className="col-sm-6">
                      <div className="rounded-4 border border-light-subtle bg-light p-3 h-100">
                        <p className="fw-bold text-dark mb-1">{item}</p>
                        <p className="small text-secondary mb-0">Premium helper flow with real LLM responses.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-5 p-4 p-md-5 h-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h4 fw-bold text-dark mb-0">Jump-start tracks</h2>
                <span className="small text-secondary">2 curated flows</span>
              </div>
              <div className="d-flex flex-column gap-3">
                {suggestedTracks.map((track) => (
                  <button
                    key={track.id}
                    type="button"
                    className="card border-0 shadow-sm p-4 text-start hover-scale-101"
                    style={{ borderRadius: '1.5rem', background: track.color }}
                    onClick={() => router.push(track.href)}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-white rounded-circle shadow-sm d-flex align-items-center justify-content-center text-primary" style={{ width: '52px', height: '52px' }}>
                        {track.icon}
                      </div>
                      <div className="flex-grow-1">
                        <h3 className="h5 fw-bold text-dark mb-1">{track.title}</h3>
                        <p className="small text-secondary mb-0">{track.description}</p>
                      </div>
                      <ArrowRight size={18} className="text-secondary" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-2">
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h4 fw-bold m-0">Oxirgi chatlar</h2>
              <span className="badge bg-light text-secondary border border-light-subtle rounded-pill px-3 py-2 fw-bold">
                Jami: {chats.length}
              </span>
            </div>

            {chats.length > 0 ? (
              <div className="row row-cols-1 row-cols-md-2 g-4">
                {chats.map((chat) => (
                  <div key={chat.id} className="col d-flex align-items-stretch">
                    <button
                      type="button"
                      className="card w-100 border-0 bg-white shadow-sm hover-scale-101 transition-all overflow-hidden d-flex flex-column text-start"
                      style={{ borderRadius: '1.5rem' }}
                      onClick={() => router.push(`/ai/${chat.id}`)}
                    >
                      <div style={{ height: '160px', width: '100%', flexShrink: 0, backgroundColor: '#f8fafc' }} className="d-flex align-items-center justify-content-center text-secondary border-bottom border-light-subtle">
                        {chat.image ? (
                          <BookCoverImage src={chat.image} alt={chat.bookName} title={chat.bookName} className="w-100 h-100 object-fit-cover" />
                        ) : (
                          <div className="text-center opacity-25">
                            <BookOpen size={48} />
                            <p className="small mb-0 mt-2 fw-bold">Kitob surati yo'q</p>
                          </div>
                        )}
                      </div>
                      <div className="p-4 d-flex flex-column flex-grow-1">
                        <h3 className="h5 fw-bold text-dark mb-1">{chat.bookName || 'Nomsiz chat'}</h3>
                        <p className="small text-secondary mb-4">AI discussion history saved locally on this device.</p>
                        <div className="mt-auto d-flex justify-content-between align-items-center pt-3 mt-3">
                          <span className="small text-secondary d-flex align-items-center gap-1 fw-medium">
                            <MessageSquare size={14} /> {chat.messages.length} xabar
                          </span>
                          <span className="small text-muted" style={{ fontSize: '11px' }}>
                            {new Date(chat.createdAt).toLocaleDateString('uz-UZ')}
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 bg-white rounded-5 border border-dashed border-light-subtle my-2">
                <div className="bg-light d-inline-flex p-4 rounded-circle mb-3">
                  <MessageSquare className="text-secondary opacity-25" size={48} />
                </div>
                <p className="text-secondary fw-bold lead mb-1">Hozircha chatlar yo'q</p>
                <p className="text-muted small">Yangi chat yaratish uchun yuqoridagi tugmani bosing.</p>
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-5 p-4 p-md-5 h-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h4 fw-bold text-dark mb-0">Try these books</h2>
                <Link href="/books" className="small fw-bold text-decoration-none">View all</Link>
              </div>
              <div className="d-flex flex-column gap-3">
                {featuredBooks.map((book) => (
                  <button
                    key={book.id}
                    type="button"
                    className="rounded-4 border border-light-subtle bg-light p-3 d-flex align-items-center gap-3 text-start hover-scale-101"
                    onClick={() => {
                      setSelectedBook(book);
                      setSearchQuery(book.title);
                      setNewChatBookName(book.title);
                      setIsModalOpen(true);
                    }}
                  >
                    <div style={{ width: '56px', height: '76px', flexShrink: 0 }}>
                      <BookCoverImage src={book.image} alt={book.title} title={book.title} className="w-100 h-100 rounded-3 object-fit-cover" />
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="h6 fw-bold text-dark mb-1">{book.title}</h3>
                      <p className="small text-secondary mb-1">{book.author}</p>
                      <span className="small text-primary fw-bold">{book.categories[0]}</span>
                    </div>
                    <ArrowRight size={16} className="text-secondary" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen ? (
        <div className="position-fixed d-flex align-items-center justify-content-center" style={{ inset: 0, zIndex: 1050, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
          <div
            className="bg-white rounded-5 shadow-2xl p-4 p-md-5 w-100 position-relative animate-in"
            style={{ maxWidth: '620px', margin: '0 1rem' }}
          >
            <button
              type="button"
              className="btn btn-light rounded-circle p-2 position-absolute top-0 end-0 m-4 d-flex align-items-center justify-content-center border-0 shadow-sm"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close create chat modal"
            >
              <X size={20} />
            </button>

            <div className="mb-4">
              <div className="bg-primary-subtle text-primary d-inline-flex p-3 rounded-circle mb-3 shadow-premium-sm">
                <Sparkles size={32} />
              </div>
              <h2 className="fw-black text-dark">Yangi suhbat</h2>
              <p className="text-secondary fw-medium">AI bilan qaysi asar tahlilini boshlamoqchisiz?</p>
            </div>

            <div className="mb-4">
              <div className="position-relative">
                <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary opacity-50" size={18} />
                <input
                  type="text"
                  className="form-control rounded-4 py-3 ps-5 border-light-subtle shadow-none focus-ring-0 fw-medium"
                  placeholder="Kitob nomini kiriting yoki qidiring..."
                  value={searchQuery || newChatBookName}
                  onChange={(event) => {
                    setNewChatBookName(event.target.value);
                    setSearchQuery(event.target.value);
                    setSelectedBook(null);
                  }}
                  autoFocus
                />
              </div>
            </div>

            {searchQuery && !selectedBook ? (
              <div className="mb-4 bg-light rounded-4 p-2 overflow-auto" style={{ maxHeight: '220px' }}>
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <button
                      key={book.id}
                      type="button"
                      onClick={() => {
                        setSelectedBook(book);
                        setSearchQuery(book.title);
                        setNewChatBookName(book.title);
                      }}
                      className="w-100 d-flex align-items-center gap-3 p-3 rounded-3 cursor-pointer bg-transparent hover-bg-white transition-all mb-1 border border-transparent hover-border-light-subtle text-start"
                    >
                      <div style={{ width: '42px', height: '56px', flexShrink: 0 }}>
                        <BookCoverImage src={book.image} alt={book.title} title={book.title} className="w-100 h-100 rounded shadow-sm object-fit-cover" />
                      </div>
                      <div>
                        <p className="fw-bold mb-0 text-dark small">{book.title}</p>
                        <p className="mb-0 text-secondary" style={{ fontSize: '11px' }}>
                          {book.author} · {book.categories[0]}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-muted small fw-medium">Kitob topilmadi. O'zingiz nom kiriting.</div>
                )}
              </div>
            ) : null}

            {selectedBook ? (
              <div className="mb-4 p-3 rounded-4 bg-primary bg-opacity-10 border border-primary-subtle text-primary shadow-sm">
                <div className="d-flex align-items-center justify-content-between gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ width: '44px', height: '60px', flexShrink: 0 }}>
                      <BookCoverImage src={selectedBook.image} alt={selectedBook.title} title={selectedBook.title} className="w-100 h-100 rounded shadow-sm object-fit-cover" />
                    </div>
                    <div>
                      <p className="fw-bold mb-0 small">Tanlangan kitob</p>
                      <p className="mb-0 fw-medium">{selectedBook.title}</p>
                      <p className="mb-0 small opacity-75">{selectedBook.author}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setSelectedBook(null)} className="btn btn-sm btn-link text-primary p-0">
                    <X size={16} />
                  </button>
                </div>
                {suggestedPrompts.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {suggestedPrompts.map((prompt) => (
                      <button key={prompt} type="button" className="btn btn-sm btn-light rounded-pill border border-primary-subtle text-primary" onClick={() => setNewChatBookName(prompt)}>
                        {prompt}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleCreateChat}
              disabled={!selectedBook && !newChatBookName.trim()}
              className="btn btn-primary w-100 fw-bold py-3 rounded-4 shadow-premium hover-scale-101 transition-all d-flex align-items-center justify-content-center gap-2"
            >
              Chatni boshlash
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      ) : null}

      <style jsx global>{`
        .shadow-premium {
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 5px 15px -5px rgba(0, 0, 0, 0.03) !important;
        }
        .animate-in {
          animation: modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </main>
  );
}
