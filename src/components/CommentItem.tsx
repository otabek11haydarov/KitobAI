'use client'

import { motion } from 'framer-motion';
import { Comment } from '../types/community';

export default function CommentItem({ comment }: { comment: Comment }) {
  // Safe parsing of time, defaults to "Hozirgina" if not properly synced yet
  const dateStr = comment.createdAt 
    ? new Intl.DateTimeFormat('uz-UZ', { 
        hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' 
      }).format(comment.createdAt)
    : 'Hozirgina';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-3 bg-body rounded-4 shadow-sm mb-3 group transition-all hover-scale-101 border border-light-subtle"
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex gap-2 align-items-center">
            <div 
                className="bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center text-primary fw-black small" 
                style={{ width: '28px', height: '28px', fontSize: '11px' }}
            >
                {comment.user[0]}
            </div>
            <span className="small fw-black text-body">{comment.user}</span>
        </div>
        <span className="small text-secondary fw-bold" style={{ fontSize: '9px' }}>{dateStr}</span>
      </div>
      <p className="small m-0 text-body fw-medium" style={{ paddingLeft: '36px' }}>{comment.text}</p>
    </motion.div>
  );
}
