'use client'

import { useState } from 'react';
import { MessageSquare, Users, Star, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Discussion } from '../types/community';
import CommentModal from './CommentModal';

export default function CommunityPanel() {
  const [activeTab, setActiveTab] = useState<'discussions' | 'reviews'>('discussions');
  const [selectedPost, setSelectedPost] = useState<Discussion | null>(null);

  const discussions: Discussion[] = [
    { id: 'post-1', user: 'Asror G', book: '1984', content: 'Oxiri shunchalar daxshatli...', replies: 12 },
    { id: 'post-2', user: 'Malika', book: 'Alkimyogar', content: 'Santiagoning sayohati aslida...', replies: 8 },
    { id: 'post-3', user: 'Davron', book: 'Sapiens', content: 'Insoniyat tarixi haqida yangicha...', replies: 5 }
  ];

  const reviews = [
    { id: 1, user: 'Dilnoza', book: 'Kichik Shaxzoda', rating: 5, text: 'Har bir yoshda o‘qilishi shart.' },
    { id: 2, user: 'Ali', book: 'Boy ota, kambag‘al ota', rating: 4, text: 'Moliyaviy savodxonlik uchun darslik.' }
  ];

  return (
    <div className="card glass p-4 p-md-5 border-light-subtle rounded-5 shadow-lg h-100 bg-secondary position-relative">
      <div className="d-flex flex-column gap-4 h-100">
        <div className="d-flex gap-2 bg-body-tertiary p-2 rounded-4 shadow-sm border">
          <button 
            onClick={() => setActiveTab('discussions')}
            className={`btn btn-sm w-50 rounded-3 fw-black text-uppercase shadow-none ${activeTab === 'discussions' ? 'btn-dark' : 'btn-light-subtle text-secondary'}`}
            style={{ fontSize: '10px' }}
          >
            Muhokamalar
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`btn btn-sm w-50 rounded-3 fw-black text-uppercase shadow-none ${activeTab === 'reviews' ? 'btn-dark' : 'btn-light-subtle text-secondary'}`}
            style={{ fontSize: '10px' }}
          >
            Taqrizlar
          </button>
        </div>

        <div className="flex-grow-1 overflow-y-auto scrollbar-hide py-2" style={{ maxHeight: '600px' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'discussions' ? (
              <motion.div 
                key="discussions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="d-flex flex-column gap-3"
              >
                {discussions.map((d) => (
                  <div 
                    key={d.id} 
                    className="card p-4 rounded-4 border-light-subtle shadow-sm transition-all hover-scale-101 cursor-pointer"
                    onClick={() => setSelectedPost(d)}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-secondary-subtle border rounded-pill d-flex align-items-center justify-content-center text-secondary small fw-bold" style={{ width: '28px', height: '28px' }}>{d.user[0]}</div>
                        <span className="small fw-black text-dark">{d.user}</span>
                      </div>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill small fst-italic italic" style={{ fontSize: '9px' }}>{d.book}</span>
                    </div>
                    <p className="small mb-3 fw-medium text-secondary">{d.content}</p>
                    <div className="d-flex align-items-center gap-2 text-secondary opacity-50 transition-all group hover-opacity-100">
                      <MessageSquare size={12} className="group-hover-text-primary" />
                      <span className="small fw-bold text-primary group-hover-text-primary transition-all" style={{ fontSize: '9px' }}>
                        {d.replies} javoblar
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="reviews"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="d-flex flex-column gap-3"
              >
                {reviews.map((r) => (
                  <div key={r.id} className="card p-4 rounded-4 border-light-subtle shadow-sm transition-all hover-scale-101 cursor-default">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-2">
                          <div className="bg-warning-subtle border rounded-pill d-flex align-items-center justify-content-center text-warning small fw-bold" style={{ width: '28px', height: '28px' }}>{r.user[0]}</div>
                          <span className="small fw-black text-dark">{r.user}</span>
                      </div>
                      <div className="d-flex align-items-center gap-1 text-warning">
                        {[...Array(r.rating)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                      </div>
                    </div>
                    <p className="small mb-1 fw-black text-dark tracking-tight">{r.book}</p>
                    <p className="small mb-0 text-secondary italic font-medium">"{r.text}"</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button className="btn btn-dark w-100 rounded-4 py-3 fw-black small text-uppercase tracking-widest d-flex align-items-center justify-content-center gap-2 shadow-lg mt-auto">
          <Plus size={18} /> Yangi Post
        </button>
      </div>

      <AnimatePresence>
        {selectedPost && (
           <CommentModal 
             post={selectedPost} 
             onClose={() => setSelectedPost(null)} 
           />
        )}
      </AnimatePresence>
    </div>
  );
}
