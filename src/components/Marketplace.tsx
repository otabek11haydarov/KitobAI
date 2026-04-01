'use client'

import { useState, useMemo } from 'react';
import { Search, ShoppingBag, Star, Filter, TrendingUp, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BOOKS, Book } from '../lib/data';

export default function Marketplace() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'popular'>('popular');

  const filteredBooks = useMemo(() => {
    let result = [...BOOKS];
    if (search) {
      result = result.filter(b => 
        b.title.toLowerCase().includes(search.toLowerCase()) || 
        b.author.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (sortBy === 'price') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    
    return result;
  }, [search, sortBy]);

  // SMART LOGIC: Identify badges for items
  const cheapest = [...BOOKS].sort((a, b) => a.price - b.price)[0];
  const bestQuality = [...BOOKS].find(b => b.quality === 'Excellent');

  return (
    <div className="card glass p-4 p-md-5 border-light-subtle rounded-5 shadow-lg">
      <div className="row g-4 mb-5 align-items-center">
        <div className="col-lg-6">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="p-3 bg-warning-subtle rounded-4">
              <ShoppingBag className="text-warning" size={32} />
            </div>
            <h2 className="display-6 fw-black tracking-tight mb-0">Marketpleys</h2>
          </div>
          <p className="text-secondary fw-medium lead mb-0">
            AI yordamida eng maqbul kitoblarni toping. Sifat va narxni taqqoslab, siz uchun eng yaxshisini tanlaymiz.
          </p>
        </div>

        <div className="col-lg-6">
          <div className="d-flex flex-column flex-sm-row gap-3">
             <div className="position-relative flex-grow-1">
                <Search className="position-absolute translate-middle-y top-50 start-0 ms-4 text-secondary" size={18} />
                <input 
                  type="text" 
                  placeholder="Kitob yoki muallif..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control rounded-pill py-3 px-5 shadow-sm border-light-subtle focus-ring-0 ps-5"
                />
             </div>
             <div className="d-flex gap-2">
                <button 
                  onClick={() => setSortBy('price')}
                  className={`btn btn-sm rounded-pill fw-bold px-4 py-3 border-light-subtle shadow-sm ${sortBy === 'price' ? 'btn-warning text-dark' : 'btn-light-subtle bg-white text-secondary'}`}
                >
                  Eng arzon
                </button>
                <button 
                  onClick={() => setSortBy('rating')}
                  className={`btn btn-sm rounded-pill fw-bold px-4 py-3 border-light-subtle shadow-sm ${sortBy === 'rating' ? 'btn-warning text-dark' : 'btn-light-subtle bg-white text-secondary'}`}
                >
                  Eng sifatli
                </button>
             </div>
          </div>
        </div>
      </div>

      <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-lg-3">
        <AnimatePresence mode="popLayout">
          {filteredBooks.map((book) => {
            const isCheapest = book.id === cheapest?.id;
            const isBestQuality = book.id === bestQuality?.id;
            
            return (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="col"
              >
                <BookCard 
                  book={book} 
                  badge={
                    book.isAIRecommended ? "AI tavsiya" : 
                    isCheapest ? "Eng arzon" : 
                    isBestQuality ? "Eng sifatli" : ""
                  }
                  badgeType={
                    book.isAIRecommended ? "primary" : 
                    isCheapest ? "success" : 
                    isBestQuality ? "info" : ""
                  }
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-5">
           <Info className="text-secondary opacity-25 mb-4" size={48} />
           <p className="text-secondary fw-bold italic lead">Kechirasiz, bunday kitob topilmadi.</p>
        </div>
      )}
    </div>
  );
}

function BookCard({ book, badge, badgeType }: { book: Book; badge?: string; badgeType?: string }) {
  return (
    <div className="card h-100 p-3 rounded-5 border-light-subtle bg-body shadow-premium shadow-hover transition-all position-relative">
      {badge && (
        <span className={`position-absolute top-0 start-0 m-4 badge rounded-3 text-uppercase fw-black small shadow-sm z-1 bg-${badgeType}`} style={{ fontSize: '10px', padding: '0.5rem 0.8rem' }}>
          {badge}
        </span>
      )}
      
      <div className="aspect-ratio-3-4 bg-body-tertiary rounded-4 overflow-hidden mb-4 position-relative group">
        <img 
          src={book.image} 
          alt={book.title}
          className="w-100 h-100 object-fit-cover transition-all"
        />
        <div className="position-absolute inset-0 bg-dark-60 opacity-0 transition-opacity d-flex align-items-end p-3">
           <button className="btn btn-white w-100 rounded-3 fw-bold small">Sotib olish</button>
        </div>
      </div>

      <div className="px-1 d-flex flex-column h-100">
         <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
            <h3 className="h6 fw-black m-0 tracking-tight leading-tight">{book.title}</h3>
            <div className="badge bg-warning-subtle text-warning-emphasis d-flex align-items-center gap-1">
               <Star size={10} fill="currentColor" /> {book.rating}
            </div>
         </div>
         <p className="text-secondary small fw-bold text-uppercase tracking-widest mb-3" style={{ fontSize: '10px' }}>{book.author}</p>
         
         <div className="mt-auto pt-3 border-top border-light-subtle d-flex justify-content-between align-items-center">
            <div>
              <p className="text-secondary fw-black text-uppercase tracking-tighter m-0" style={{ fontSize: '9px' }}>Narx</p>
              <p className="h5 fw-black m-0">{book.price.toLocaleString()} so'm</p>
            </div>
            <div className="text-end">
              <p className="text-secondary fw-black text-uppercase tracking-tighter m-0" style={{ fontSize: '9px' }}>Do'kon</p>
              <p className="fw-black text-dark m-0 small">{book.source}</p>
            </div>
         </div>
      </div>
    </div>
  );
}
