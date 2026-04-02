'use client'

import React, { useState, useEffect } from 'react';
import { ChatSession, booksData, Book } from '../../lib/data';
import { Sparkles, MessageSquare, ChevronLeft, Pin, ArrowRight, Clock, Plus, X, Search, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIOptionsPage() {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChatBookName, setNewChatBookName] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load from local storage
  useEffect(() => {
    const savedChats = localStorage.getItem('kitobai_chats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  const handleCreateChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const chatTitle = selectedBook ? selectedBook.title : (newChatBookName.trim() || "Yangi Chat");
    const chatImage = selectedBook ? selectedBook.image : undefined;

    const newChat: ChatSession = {
      id: Date.now().toString(),
      bookName: chatTitle,
      image: chatImage,
      messages: [
        { role: 'ai', text: "Qaysi kitob haqida gaplashmoqchisiz?" }
      ],
      createdAt: new Date().toISOString()
    };

    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    localStorage.setItem('kitobai_chats', JSON.stringify(updatedChats));
    setIsModalOpen(false);
    
    // Auto-navigate to the new chat
    window.location.href = `/ai/${newChat.id}`;
  };

  const filteredBooks = booksData.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-vh-100 d-flex flex-column bg-body-tertiary text-body pb-5" data-bs-theme="light">
      
      {/* Header */}
      <nav className="fixed-top w-100 bg-white border-bottom border-light-subtle shadow-sm z-3">
        <div className="container px-4 py-3 d-flex align-items-center justify-content-between mx-auto">
          <button onClick={() => window.location.href = '/'} className="btn btn-light d-flex align-items-center gap-2 border-0 bg-transparent text-secondary hover-text-primary px-0 transition-all">
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
        <div className="text-center mb-5 mt-4">
          <h1 className="display-5 fw-black text-dark tracking-tight">AI Chatlar</h1>
          <p className="lead text-secondary fw-medium">Sizning shaxsiy kitobxon yordamchingiz</p>
        </div>

        {/* Top Section: Pinned + Create Chat */}
        <div className="row g-4 mb-5">
          {/* Create Chat Card (First Position) - Large Card Layout */}
          <div className="col-12">
             <motion.div 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="card border-0 shadow-premium cursor-pointer p-4 bg-primary text-white overflow-hidden position-relative"
                style={{ borderRadius: '1.5rem', minHeight: '160px' }}
                onClick={() => setIsModalOpen(true)}
             >
                <div className="position-relative z-1 d-flex flex-column justify-content-center h-100">
                  <div className="d-flex align-items-center gap-4">
                     <div className="bg-white text-primary p-3 rounded-circle d-flex justify-content-center align-items-center shadow-sm">
                       <Plus size={32} strokeWidth={3} />
                     </div>
                     <div>
                        <h3 className="fw-bold m-0">Yangi chat yaratish</h3>
                        <p className="opacity-75 mb-0 fw-medium">Yangi kitob tahlilini hoziroq boshlang</p>
                     </div>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="position-absolute end-0 top-0 p-4 opacity-10">
                   <MessageSquare size={120} />
                </div>
             </motion.div>
          </div>

          {/* Pinned Chats Section */}
          <div className="col-12 col-md-6">
            <div 
              className="card h-100 border-0 transition-all shadow-sm hover-scale-101 cursor-pointer p-4 d-flex flex-row align-items-center gap-4 position-relative"
              style={{ borderRadius: '1.5rem', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}
              onClick={() => window.location.href = '/ai/read'}
            >
              <div className="position-absolute top-0 end-0 p-3 pt-4">
                <Pin size={18} className="text-primary opacity-50 rotate-45" />
              </div>
              <div className="bg-white p-3 rounded-circle shadow-sm text-primary flex-shrink-0">
                <BookOpen size={28} />
              </div>
              <div className="flex-grow-1">
                <h5 className="fw-bold text-dark mb-1">O‘qigan kitoblarim</h5>
                <p className="text-secondary small mb-0 fw-medium">Barcha o‘qib tugatilgan kitoblar bazasi</p>
              </div>
              <ArrowRight size={24} className="text-primary opacity-50" />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div 
              className="card h-100 border-0 transition-all shadow-sm hover-scale-101 cursor-pointer p-4 d-flex flex-row align-items-center gap-4 position-relative"
              style={{ borderRadius: '1.5rem', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' }}
              onClick={() => window.location.href = '/ai/planning'}
            >
              <div className="position-absolute top-0 end-0 p-3 pt-4">
                <Pin size={18} className="text-success opacity-50 rotate-45" />
              </div>
              <div className="bg-white p-3 rounded-circle shadow-sm text-success flex-shrink-0">
                <Clock size={28} />
              </div>
              <div className="flex-grow-1">
                <h5 className="fw-bold text-dark mb-1">O‘qimoqchi bo‘lganlarim</h5>
                <p className="text-secondary small mb-0 fw-medium">Kelajakda o‘qish rejalashtirilgan kitoblar</p>
              </div>
              <ArrowRight size={24} className="text-success opacity-50" />
            </div>
          </div>
        </div>

        {/* Dynamic AI Chats Grid */}
        <div className="mt-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold m-0">Oxirgi chatlar</h4>
            <span className="badge bg-light text-secondary border border-light-subtle rounded-pill px-3 py-2 fw-bold">
              Jami: {chats.length}
            </span>
          </div>
          
          {chats.length > 0 ? (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
              {chats.map((chat) => (
                <div key={chat.id} className="col d-flex align-items-stretch">
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="card w-100 border-0 bg-white shadow-sm hover-scale-101 transition-all overflow-hidden cursor-pointer d-flex flex-column"
                     style={{ borderRadius: '1.5rem' }}
                     onClick={() => window.location.href = `/ai/${chat.id}`}
                   >
                     <div style={{ height: '160px', width: '100%', flexShrink: 0, backgroundColor: '#f8fafc' }} className="d-flex align-items-center justify-content-center text-secondary border-bottom border-light-subtle">
                       {chat.image ? (
                          <img src={chat.image} alt={chat.bookName} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                       ) : (
                          <div className="text-center opacity-25">
                            <BookOpen size={48} />
                            <p className="small mb-0 mt-2 fw-bold">Kitob surati yo'q</p>
                          </div>
                       )}
                     </div>
                     <div className="p-4 d-flex flex-column flex-grow-1">
                       <h5 className="fw-bold text-dark mb-1 line-clamp-1">{chat.bookName || "Nomsiz Chat"}</h5>
                       
                       <div className="mt-auto d-flex justify-content-between align-items-center pt-3 mt-3">
                         <span className="small text-secondary d-flex align-items-center gap-1 fw-medium">
                            <MessageSquare size={14}/> {chat.messages.length} xabar
                         </span>
                         <span className="small text-muted" style={{ fontSize: '11px' }}>
                           {new Date(chat.createdAt).toLocaleDateString('uz-UZ')}
                         </span>
                       </div>
                     </div>
                   </motion.div>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-5 bg-white rounded-5 border border-dashed border-light-subtle my-2">
               <div className="bg-light d-inline-flex p-4 rounded-circle mb-3">
                 <MessageSquare className="text-secondary opacity-25" size={48} />
               </div>
               <p className="text-secondary fw-bold lead mb-1">Hozircha chatlar yo‘q</p>
               <p className="text-muted small">Yangi chat yaratish uchun yuqoridagi tugmani bosing</p>
             </div>
          )}
        </div>

      </section>

      {/* Modern Modal for Creating Chat */}
      <AnimatePresence>
         {isModalOpen && (
            <div className="position-fixed inset-0 z-1050 d-flex align-items-center justify-content-center" style={{ top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
               <motion.div 
                 initial={{ opacity: 0, y: 50, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: 50, scale: 0.95 }}
                 className="bg-white rounded-5 shadow-2xl p-4 p-md-5 w-100 position-relative animate-in"
                 style={{ maxWidth: '550px', margin: '0 1rem' }}
               >
                 <button 
                   className="btn btn-light rounded-circle p-2 position-absolute top-0 end-0 m-4 d-flex align-items-center justify-content-center border-0 shadow-sm transition-all hover-bg-danger hover-text-white"
                   onClick={() => setIsModalOpen(false)}
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
                        onChange={(e) => {
                          setNewChatBookName(e.target.value);
                          setSearchQuery(e.target.value);
                          setSelectedBook(null);
                        }}
                        autoFocus
                      />
                    </div>
                 </div>

                 {searchQuery && !selectedBook && (
                   <div className="mb-4 bg-light rounded-4 p-2 overflow-auto" style={{ maxHeight: '200px' }}>
                     {filteredBooks.length > 0 ? filteredBooks.map(book => (
                       <div 
                         key={book.id} 
                         onClick={() => {
                           setSelectedBook(book);
                           setSearchQuery(book.title);
                           setNewChatBookName(book.title);
                         }}
                         className="d-flex align-items-center gap-3 p-3 rounded-3 cursor-pointer hover-bg-white transition-all mb-1 border border-transparent hover-border-light-subtle"
                       >
                         <img src={book.image} alt={book.title} style={{ width: '40px', height: '55px', objectFit: 'cover' }} className="rounded shadow-sm" />
                         <div>
                            <p className="fw-bold mb-0 text-dark small">{book.title}</p>
                            <p className="mb-0 text-secondary" style={{ fontSize: '11px' }}>{book.author}</p>
                         </div>
                       </div>
                     )) : (
                       <div className="p-3 text-center text-muted small fw-medium">Kitob topilmadi, o'zingiz yozing.</div>
                     )}
                   </div>
                 )}

                 {selectedBook && (
                   <div className="mb-4 d-flex align-items-center justify-content-between p-3 rounded-4 bg-primary bg-opacity-10 border border-primary-subtle text-primary shadow-sm">
                     <div className="d-flex align-items-center gap-3">
                        <img src={selectedBook.image} alt="selected" style={{ width: '40px', height: '55px', objectFit: 'cover' }} className="rounded shadow-sm" />
                        <div>
                          <p className="fw-bold mb-0 small">Tanlangan kitob:</p>
                          <p className="mb-0 fw-medium line-clamp-1">{selectedBook.title}</p>
                        </div>
                     </div>
                     <button onClick={() => setSelectedBook(null)} className="btn btn-sm btn-link text-primary p-0"><X size={16}/></button>
                   </div>
                 )}
                 
                 <button 
                  onClick={() => handleCreateChat()}
                  className="btn btn-primary w-100 fw-bold py-3 rounded-4 shadow-premium hover-scale-101 transition-all d-flex align-items-center justify-content-center gap-2"
                 >
                    Chatni boshlash
                    <ArrowRight size={20} />
                 </button>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      <style jsx global>{`
        .shadow-premium {
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 5px 15px -5px rgba(0, 0, 0, 0.03) !important;
        }
        .shadow-premium-lg {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15) !important;
        }
        .hover-scale-101:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1) !important;
        }
        .animate-in {
          animation: modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </main>
  );
}
