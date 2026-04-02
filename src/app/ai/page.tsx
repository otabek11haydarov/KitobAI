'use client'

import React, { useState, useEffect } from 'react';
import { ChatSession } from '../../lib/data';
import { Sparkles, MessageSquare, ChevronLeft, Pin, ArrowRight, Clock, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIOptionsPage() {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChatBookName, setNewChatBookName] = useState('');

  // Load from local storage
  useEffect(() => {
    const savedChats = localStorage.getItem('kitobai_chats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  const handleCreateChat = (e: React.FormEvent) => {
    e.preventDefault();
    const newChat: ChatSession = {
      id: Date.now().toString(),
      bookName: newChatBookName.trim(),
      messages: [],
      createdAt: new Date().toISOString()
    };

    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    localStorage.setItem('kitobai_chats', JSON.stringify(updatedChats));
    setIsModalOpen(false);
    
    // Auto-navigate to the new chat
    window.location.href = `/ai/${newChat.id}`;
  };

  return (
    <main className="min-vh-100 d-flex flex-column bg-body-tertiary text-body" data-bs-theme="light">
      
      {/* Header */}
      <nav className="fixed-top w-100 bg-white border-bottom border-light-subtle shadow-sm z-3">
        <div className="container-fluid px-4 py-3 d-flex align-items-center mx-auto" style={{ maxWidth: '1400px' }}>
          <button onClick={() => window.location.href = '/'} className="btn btn-light d-flex align-items-center gap-2 border-0 bg-transparent text-secondary hover-text-primary px-0 transition-all">
            <ChevronLeft size={20} />
            <span className="fw-bold">Bosh sahifa</span>
          </button>
        </div>
      </nav>

      <section className="container py-5 mt-5">
        <div className="text-center mb-5 mt-4">
          <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 p-3 rounded-circle text-primary mb-3">
            <Sparkles size={40} strokeWidth={2} />
          </div>
          <h1 className="display-5 fw-black text-dark tracking-tight">AI Assistant</h1>
          <p className="lead text-secondary fw-bold">Kitoblar bo'yicha aqlli yordamchi</p>
        </div>

        {/* Top Section: Pinned + Create Chat */}
        <div className="mb-5">
          
          <div className="row g-4 mb-3">
            {/* Create Chat Card (First Position) */}
            <div className="col-12">
               <div 
                  className="card border-0 transition-all shadow-premium hover-scale-101 cursor-pointer d-flex align-items-center justify-content-center p-4 bg-white border border-light-subtle"
                  style={{ borderRadius: '1.5rem', minHeight: '120px' }}
                  onClick={() => setIsModalOpen(true)}
               >
                  <div className="d-flex align-items-center gap-3">
                     <div className="bg-primary-subtle text-primary p-3 rounded-circle d-flex justify-content-center align-items-center">
                       <Plus size={28} />
                     </div>
                     <h4 className="fw-bold m-0 text-dark">Yangi chat yaratish</h4>
                  </div>
               </div>
            </div>
          </div>

          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 mt-4">
             <Pin size={18} className="text-primary" /> Qadalgan Chatlar
          </h5>
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div 
                className="card h-100 border border-primary-subtle transition-all outline-none shadow-sm hover-scale-101 cursor-pointer p-4 d-flex flex-row align-items-center gap-4"
                style={{ borderRadius: '1.5rem', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}
                onClick={() => window.location.href = '/ai/read'}
              >
                <div className="bg-white p-3 rounded-circle shadow-sm text-primary flex-shrink-0">
                  <MessageSquare size={28} />
                </div>
                <div className="flex-grow-1">
                  <h5 className="fw-bold text-dark mb-1">O'qigan kitoblarim</h5>
                  <p className="text-secondary small mb-0 fw-medium">Barcha o'qib tugatilgan kitoblar bazasi.</p>
                </div>
                <ArrowRight size={24} className="text-primary opacity-50" />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div 
                className="card h-100 border border-success-subtle transition-all outline-none shadow-sm hover-scale-101 cursor-pointer p-4 d-flex flex-row align-items-center gap-4"
                style={{ borderRadius: '1.5rem', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' }}
                onClick={() => window.location.href = '/ai/planning'}
              >
                <div className="bg-white p-3 rounded-circle shadow-sm text-success flex-shrink-0">
                  <Clock size={28} />
                </div>
                <div className="flex-grow-1">
                  <h5 className="fw-bold text-dark mb-1">O'qimoqchi bo'lgan kitoblarim</h5>
                  <p className="text-secondary small mb-0 fw-medium">Kelajakda o'qish rejalashtirilgan kitoblar.</p>
                </div>
                <ArrowRight size={24} className="text-success opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic AI Chats Grid */}
        <div>
          <h4 className="fw-bold mb-4">Mening Chatlarim</h4>
          {chats.length > 0 ? (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
              {chats.map((chat) => (
                <div key={chat.id} className="col d-flex align-items-stretch">
                   <div 
                     className="card w-100 border border-light-subtle bg-white shadow-sm hover-scale-101 transition-all overflow-hidden cursor-pointer d-flex flex-column"
                     style={{ borderRadius: '1.5rem' }}
                     onClick={() => window.location.href = `/ai/${chat.id}`}
                   >
                     <div style={{ height: '180px', width: '100%', flexShrink: 0, backgroundColor: '#f3f4f6' }} className="d-flex align-items-center justify-content-center text-secondary">
                       {chat.image ? (
                          <img src={chat.image} alt={chat.bookName} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                       ) : (
                          <BookOpen size={48} className="opacity-25" />
                       )}
                     </div>
                     <div className="p-4 d-flex flex-column flex-grow-1">
                       <h5 className="fw-bold text-dark mb-1">{chat.bookName || "Nomsiz Chat"}</h5>
                       
                       <div className="mt-auto d-flex justify-content-between align-items-center border-top border-light-subtle pt-3 mt-3">
                         <span className="small text-secondary d-flex align-items-center gap-1">
                            <MessageSquare size={14}/> {chat.messages.length} xabarlar
                         </span>
                         <span className="badge bg-light text-secondary border border-light-subtle rounded-pill">Bugun</span>
                       </div>
                     </div>
                   </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-5 bg-white rounded-5 border border-light-subtle shadow-sm my-4">
               <MessageSquare className="text-secondary opacity-25 mb-3" size={48} />
               <p className="text-secondary fw-medium lead mb-0">Hozircha chatlar mavjud emas.</p>
             </div>
          )}
        </div>

      </section>

      {/* Internal Modal for Creating Chat */}
      <AnimatePresence>
         {isModalOpen && (
            <div className="position-fixed inset-0 z-3 d-flex align-items-center justify-content-center" style={{ top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}>
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 className="bg-white rounded-5 shadow-lg p-4 p-md-5 w-100 position-relative"
                 style={{ maxWidth: '500px', margin: '0 1rem' }}
               >
                 <button 
                   className="btn btn-light rounded-circle p-2 position-absolute top-0 end-0 m-3 d-flex align-items-center justify-content-center"
                   onClick={() => setIsModalOpen(false)}
                 >
                   <X size={20} />
                 </button>

                 <div className="text-center mb-4">
                    <div className="bg-primary-subtle text-primary d-inline-flex p-3 rounded-circle mb-3">
                       <MessageSquare size={32} />
                    </div>
                    <h3 className="fw-bold">Yangi chat yaratish</h3>
                    <p className="text-secondary mb-0">Qaysi kitob haqida suhbatlashni hohlaysiz?</p>
                 </div>

                 <form onSubmit={handleCreateChat}>
                    <div className="mb-4">
                      <label className="form-label fw-bold text-dark">Kitob nomini kiriting (ixtiyoriy)</label>
                      <input 
                        type="text" 
                        className="form-control rounded-4 py-3 px-4 shadow-sm border-light-subtle focus-ring-0" 
                        placeholder="Masalan: O'tgan kunlar..."
                        value={newChatBookName}
                        onChange={(e) => setNewChatBookName(e.target.value)}
                        autoFocus
                      />
                    </div>
                    
                    <button type="submit" className="btn btn-primary w-100 fw-bold py-3 rounded-4 shadow-sm hover-scale-101 transition-all">
                       Chatni boshlash
                    </button>
                 </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </main>
  );
}
