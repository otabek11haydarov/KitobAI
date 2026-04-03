'use client'

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase-firestore';
import { Discussion, Comment } from '../types/community';
import CommentItem from './CommentItem';

type CommentModalProps = {
  post: Discussion;
  onClose: () => void;
};

export default function CommentModal({ post, onClose }: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reference to this specific post's comments collection in Firestore
    const commentsRef = collection(db, `posts/${post.id}/comments`);
    const q = query(commentsRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        user: doc.data().user,
        text: doc.data().text,
        createdAt: doc.data().createdAt?.toMillis() || Date.now() // Handles pending serverTimestamp
      })) as Comment[];
      
      setComments(fetchedComments);
      setFirebaseError(false);
      setLoading(false);
      
      // Auto-scroll to bottom on new comments
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    }, (error) => {
      console.error("Firebase connection error (Check config):", error);
      setFirebaseError(true);
      setLoading(false); 
    });

    return () => unsubscribe();
  }, [post.id]);

  const handleSend = async () => {
    if (!newComment.trim()) return;
    const text = newComment;
    
    // Optimistic UI clear
    setNewComment('');

    try {
      const commentsRef = collection(db, `posts/${post.id}/comments`);
      await addDoc(commentsRef, {
        user: 'Hozirgi Foydalanuvchi', // Replace with real auth user
        text,
        createdAt: serverTimestamp()
      });
      // Scroll to bottom logic is handled by onSnapshot listener automatically
    } catch (error) {
      console.error("Error adding comment: ", error);
      setFirebaseError(true);
    }
  };

  return (
    <div className="position-fixed inset-0 z-index-master d-flex align-items-center justify-content-center p-3 p-md-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="position-absolute h-100 w-100"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', top: 0, left: 0 }}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="card position-relative bg-body border border-light-subtle rounded-5 shadow-premium overflow-hidden d-flex flex-column"
        style={{ width: '100%', maxWidth: '600px', maxHeight: '85vh', zIndex: 1 }}
        data-bs-theme="dark"
      >
        {/* Header - Post Content */}
        <div className="p-4 p-md-5 border-bottom border-light-subtle bg-body-tertiary">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div className="d-flex align-items-center gap-3">
                 <div className="bg-primary border border-primary-subtle rounded-pill d-flex align-items-center justify-content-center text-white fw-black shadow-sm" style={{ width: '48px', height: '48px', fontSize: '18px' }}>
                    {post.user[0]}
                 </div>
                 <div>
                    <h3 className="h5 fw-black m-0 mb-1">{post.user}</h3>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill small fst-italic italic" style={{ fontSize: '10px' }}>{post.book}</span>
                 </div>
              </div>
              <button onClick={onClose} className="btn btn-light rounded-circle shadow-sm p-2 transition-all hover-scale-105 border-light-subtle">
                 <X size={20} />
              </button>
            </div>
            
            <p className="h5 fw-medium text-body m-0 leading-relaxed">{post.content}</p>
        </div>

        {/* Body - Comments list */}
        <div ref={scrollRef} className="p-4 flex-grow-1 overflow-y-auto scrollbar-hide bg-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
               <div className="d-flex align-items-center gap-2 text-secondary opacity-50">
                  <MessageSquare size={16} />
                  <span className="small fw-black text-uppercase tracking-widest">{comments.length} izohlar</span>
               </div>
               {firebaseError && (
                  <span className="badge bg-danger-subtle text-danger border border-danger small">Firebase ulanmagan</span>
               )}
            </div>

            {loading ? (
               <div className="d-flex justify-content-center py-5 opacity-50">
                 <div className="spinner-grow text-primary spinner-grow-sm" role="status">
                   <span className="visually-hidden">Loading...</span>
                 </div>
               </div>
            ) : comments.length > 0 ? (
              <AnimatePresence>
                {comments.map((c) => (
                  <CommentItem key={c.id} comment={c} />
                ))}
              </AnimatePresence>
            ) : (
              <div className="text-center py-5 opacity-25">
                 <MessageSquare className="mb-4 mx-auto" size={48} />
                 <p className="fw-black italic lead">Hali izohlar yo'q. Birinchi bo'lib yozing!</p>
              </div>
            )}
        </div>

        {/* Footer - Input */}
        <div className="p-4 border-top border-light-subtle bg-body-tertiary">
            <div className="input-group p-1 bg-body border border-light-subtle rounded-pill shadow-sm transition-all focus-within-shadow-premium">
              <input 
                type="text" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Izoh yozish..."
                className="form-control border-0 bg-transparent rounded-pill py-3 px-4 shadow-none fw-medium"
              />
              <button 
                onClick={handleSend}
                disabled={!newComment.trim() || firebaseError}
                className="btn btn-primary rounded-circle m-1 d-flex align-items-center justify-content-center transition-all hover-scale-105"
                style={{ width: '45px', height: '45px' }}
              >
                  <Send size={18} />
              </button>
            </div>
            {firebaseError && (
                <p className="text-danger small mt-2 mb-0 text-center fw-medium">
                    Izoh qoldirish uchun Firebase klitlari (API KEY) .env ga kiritilishi shart.
                </p>
            )}
        </div>
      </motion.div>
    </div>
  );
}
