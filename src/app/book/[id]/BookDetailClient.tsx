'use client'

import React, { useState } from 'react';
import { BookOpen, Star, ShoppingCart, CreditCard, CheckCircle, Globe, Layout, ChevronLeft, MessageSquare, Send } from 'lucide-react';
import { Book, Comment } from '../../../lib/data';

export default function BookDetailClient({ initialBook }: { initialBook: Book }) {
  const [selectedLanguage, setSelectedLanguage] = useState(initialBook.languageOptions[0] || '');
  const [selectedType, setSelectedType] = useState(initialBook.bookTypes[0] || '');
  const [activeImage, setActiveImage] = useState(initialBook.image);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>(initialBook.comments || []);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: Date.now(),
      user: 'Foydalanuvchi',
      text: commentText,
      date: 'Hozirgin'
    };
    setComments([newComment, ...comments]);
    setCommentText('');
  };

  return (
    <main className="min-vh-100 d-flex flex-column bg-body-tertiary text-body" data-bs-theme="light">
      
      {/* Simple Nav for this page */}
      <nav className="fixed-top w-100 bg-white border-bottom border-light-subtle shadow-sm z-3">
        <div className="container-fluid px-4 py-3 d-flex align-items-center mx-auto" style={{ maxWidth: '1400px' }}>
          <button onClick={() => window.location.href = '/'} className="btn btn-light d-flex align-items-center gap-2 border-0 bg-transparent text-secondary hover-text-primary px-0 transition-all">
            <ChevronLeft size={20} />
            <span className="fw-bold">Orqaga Qaytish</span>
          </button>
        </div>
      </nav>

      {/* Product Section */}
      <section className="container py-5 mt-5">
        <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 mt-4">
          <div className="row g-5">
            {/* Left Box: Gallery */}
            <div className="col-lg-5">
              <div className="position-relative bg-light rounded-4 overflow-hidden mb-3 border border-light-subtle" style={{ height: '500px', width: '100%' }}>
                <img src={activeImage} alt={initialBook.title} className="w-100 h-100 transition-all" style={{ objectFit: 'cover' }} />
              </div>
              <div className="d-flex gap-2 overflow-auto" style={{ scrollbarWidth: 'none' }}>
                {initialBook.thumbnails.map((thumb, idx) => (
                  <div 
                    key={idx} 
                    className={`rounded-3 overflow-hidden cursor-pointer border ${activeImage === thumb ? 'border-primary border-2' : 'border-light-subtle'} hover-scale-105 transition-all`}
                    style={{ width: '80px', height: '100px', flexShrink: 0 }}
                    onClick={() => setActiveImage(thumb)}
                  >
                    <img src={thumb} className="w-100 h-100" style={{ objectFit: 'cover' }} alt="thumbnail" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Box: Details */}
            <div className="col-lg-7 d-flex flex-column">
              <div className="mb-4">
                {initialBook.isTopSeller && (
                  <span className="badge bg-success-subtle text-success fs-6 fw-bold mb-3 px-3 py-2 rounded-pill">Top Seller</span>
                )}
                <h1 className="display-5 fw-bold text-dark mb-2 tracking-tight">{initialBook.title} - {initialBook.author}</h1>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="d-flex text-warning">
                    <Star fill="currentColor" size={18} />
                    <Star fill="currentColor" size={18} />
                    <Star fill="currentColor" size={18} />
                    <Star fill="currentColor" size={18} />
                    <Star fill={initialBook.rating >= 4.5 ? "currentColor" : "none"} size={18} />
                  </div>
                  <span className="text-secondary fw-medium small">({initialBook.rating}/5 - {initialBook.reviewsCount} sharhlar)</span>
                </div>
                <p className="fs-5 text-secondary">{initialBook.description}</p>
              </div>

              <div className="mb-4 p-3 bg-light rounded-4 border border-light-subtle">
                <div className="d-flex align-items-end gap-3 mb-1">
                  <h2 className="fs-1 fw-black text-primary mb-0">{initialBook.price}</h2>
                  {initialBook.originalPrice && (
                    <span className="text-decoration-line-through text-secondary fw-medium fs-5">{initialBook.originalPrice}</span>
                  )}
                </div>
                {initialBook.discount && (
                  <span className="badge bg-danger text-white mt-2">{initialBook.discount}</span>
                )}
              </div>

              <div className="row g-4 mb-4">
                <div className="col-sm-6">
                  <p className="fw-bold mb-2 text-dark d-flex align-items-center gap-2">
                    <Globe size={18} className="text-secondary"/> Tilni tanlang
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    {initialBook.languageOptions.map((lang, idx) => (
                      <button 
                        key={idx}
                        className={`btn flex-grow-1 fw-bold py-2 rounded-3 text-capitalize ${selectedLanguage === lang ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setSelectedLanguage(lang)}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-sm-6">
                  <p className="fw-bold mb-2 text-dark d-flex align-items-center gap-2">
                    <Layout size={18} className="text-secondary"/> Kitob turi
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    {initialBook.bookTypes.map((type, idx) => (
                      <button 
                        key={idx}
                        className={`btn flex-grow-1 fw-bold py-2 rounded-3 text-capitalize ${selectedType === type ? 'btn-dark' : 'btn-outline-secondary'}`}
                        onClick={() => setSelectedType(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                {initialBook.stock > 0 ? (
                  <p className="d-flex align-items-center gap-2 text-success fw-bold bg-success bg-opacity-10 w-inline-block d-inline-flex px-3 py-2 rounded-pill">
                    <CheckCircle size={18} /> Sotuvda mavjud ({initialBook.stock} dona)
                  </p>
                ) : (
                  <p className="d-flex align-items-center gap-2 text-danger fw-bold bg-danger bg-opacity-10 w-inline-block d-inline-flex px-3 py-2 rounded-pill">
                    <CheckCircle size={18} /> Vaqtinchalik yo'q
                  </p>
                )}
              </div>

              <div className="d-flex flex-column flex-sm-row gap-3 mt-auto">
                <button className="btn btn-light fw-bold py-3 px-4 border border-light-subtle shadow-sm rounded-4 hover-scale-105 transition-all text-dark d-flex align-items-center justify-content-center gap-2 fs-5 flex-grow-1" disabled={initialBook.stock === 0}>
                  <ShoppingCart size={22} /> Savatga Qo'shish
                </button>
                <button className="btn btn-primary fw-bold py-3 px-4 shadow-sm rounded-4 hover-scale-105 transition-all d-flex align-items-center justify-content-center gap-2 fs-5 flex-grow-1" disabled={initialBook.stock === 0}>
                   <CreditCard size={22} /> Hozir Xarid Qilish
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Sections */}
      <section className="container pb-5">
        <div className="row g-5">
          {/* Comments Section */}
          <div className="col-lg-7">
            <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 h-100">
              <h3 className="h4 fw-bold mb-4 d-flex align-items-center gap-2">
                <MessageSquare className="text-primary"/> Sharhlar va Fikrlar
              </h3>

              <form onSubmit={handleCommentSubmit} className="mb-4">
                <div className="position-relative">
                  <textarea 
                    className="form-control rounded-4 bg-light border-light-subtle p-3 pe-5 focus-ring-0 shadow-none h-auto"
                    rows={3}
                    placeholder="O'z fikringizni bildiring..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  ></textarea>
                  <button type="submit" className="btn btn-primary position-absolute bottom-0 end-0 m-2 rounded-circle p-2 d-flex align-items-center justify-content-center transition-all hover-scale-110" disabled={!commentText.trim()}>
                    <Send size={18} />
                  </button>
                </div>
              </form>

              <div className="d-flex flex-column gap-3">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="p-3 bg-light rounded-4 border border-light-subtle">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                         <span className="fw-bold text-dark">{comment.user}</span>
                         <span className="small text-secondary">{comment.date}</span>
                      </div>
                      <p className="mb-0 text-secondary">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-secondary text-center py-4">Hozircha sharhlar yo'q. Birinchi bo'lib fikr bildiring!</p>
                )}
              </div>
            </div>
          </div>

          {/* Related / Alternative Markets */}
          <div className="col-lg-5">
             <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 h-100">
               <h3 className="h5 fw-bold mb-4">Boshqa do'konlarda</h3>
               <div className="d-flex flex-column gap-3">
                 {initialBook.alternativeSellers && initialBook.alternativeSellers.length > 0 ? (
                   initialBook.alternativeSellers.map((item, idx) => (
                     <div 
                       key={idx} 
                       className="d-flex align-items-center gap-3 p-2 bg-light rounded-4 border border-light-subtle hover-scale-101 transition-all cursor-pointer"
                       onClick={() => window.location.href = `/book/${item.linkId}`}
                     >
                        <div className="rounded-3 overflow-hidden" style={{ width: '60px', height: '80px', flexShrink: 0 }}>
                          <img src={item.img} className="w-100 h-100" style={{ objectFit: 'cover' }} alt="book alternative" />
                        </div>
                        <div className="flex-grow-1">
                          <span className="badge bg-secondary mb-1">{item.store}</span>
                          <h6 className="fw-bold mb-0 text-dark">{initialBook.title}</h6>
                        </div>
                        <div className="pe-2 text-end">
                           <span className="fw-black text-primary d-block">{item.price}</span>
                           <span className="small text-secondary">Sotib olish</span>
                        </div>
                     </div>
                   ))
                 ) : (
                    <p className="text-secondary small">Ushbu kitob faqat bizning do'konda mavjud.</p>
                 )}
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 border-top border-light-subtle bg-white mt-auto">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <BookOpen className="text-primary" size={20} />
              <span className="fw-bold">KitobAI</span>
            </div>
            
            <div className="d-flex gap-4 small fw-medium">
              <span className="text-secondary hover-text-primary transition-all cursor-pointer">About</span>
              <span className="text-secondary hover-text-primary transition-all cursor-pointer">Contact</span>
              <span className="text-secondary hover-text-primary transition-all cursor-pointer">Privacy</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
