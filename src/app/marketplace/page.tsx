'use client';

import { useMemo } from 'react';
import { BookOpen, ShoppingBag, Star, ArrowLeft, Heart, Scale, ChevronDown } from 'lucide-react';
import { booksData, Book } from '../../lib/data';
import Link from 'next/link';

export default function MarketplacePage() {
  // Sort from lowest price to highest
  const sortedBooks = useMemo(() => {
    return [...booksData].sort((a, b) => {
      const getPrice = (p: string) => parseInt(p.replace(/\D/g, ''), 10) || 0;
      return getPrice(a.price) - getPrice(b.price);
    });
  }, []);

  const categories = [
    "Asaxiy Books kitoblari",
    "Badiiy adabiyot",
    "Psixologiya va shaxsiy rivojlanish",
    "Biznes kitoblar",
    "Bolalar adabiyoti",
    "Diniy adabiyot",
    "Rus tilidagi kitoblar",
    "O'quv adabiyotlari",
    "TOP-100 bestsellerlar"
  ];

  return (
    <main className="min-vh-100 bg-light font-sans text-dark" data-bs-theme="light">
      {/* Simple Marketplace Navbar */}
      <nav className="fixed-top w-100 bg-white border-bottom shadow-sm z-50">
        <div className="container-fluid px-4 py-3 d-flex justify-content-between align-items-center" style={{ maxWidth: '1400px' }}>
          <Link href="/" className="d-flex align-items-center gap-2 text-decoration-none text-dark transition-all hover-opacity-75">
            <ArrowLeft size={20} className="text-secondary" />
            <span className="fw-bold">Bosh sahifaga qaytish</span>
          </Link>
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center">
              <ShoppingBag size={24} strokeWidth={2.5} />
            </div>
            <span className="fs-4 fw-black m-0 tracking-tight">Market<span className="text-primary">place</span></span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="container-fluid pt-5 mt-4 pb-5 px-4" style={{ maxWidth: '1440px' }}>
        <div className="row g-4 mt-3">
          
          {/* Left Sidebar (Categories) */}
          <div className="col-12 col-lg-3 d-none d-lg-block">
            <div className="bg-white rounded-3 shadow-sm p-4 h-100 border border-light-subtle">
              <h5 className="fw-bold mb-4 fs-4">Подкатегории</h5>
              <div className="d-flex flex-column gap-3">
                {categories.map((cat, idx) => (
                  <button 
                    key={idx} 
                    className="btn btn-link text-decoration-none text-start text-dark p-0 fw-medium opacity-75 hover-opacity-100 transition-all border-0 bg-transparent"
                    style={{ fontSize: '15px' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="mt-5 border-top pt-4">
                <h6 className="fw-bold mb-3 d-flex justify-content-between align-items-center">
                  Цена <ChevronDown size={16} />
                </h6>
              </div>
            </div>
          </div>

          {/* Right Main Grid Area */}
          <div className="col-12 col-lg-9">
            {/* Header controls */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
              <div>
                <h1 className="fw-bold mb-1 display-6">Книги</h1>
                <p className="text-secondary small mb-0">{sortedBooks.length * 1530} товаров в наличии</p>
              </div>
              <div className="d-flex gap-2 mt-3 mt-md-0">
                <select className="form-select form-select-sm border-primary text-primary fw-medium rounded-pill px-4 shadow-sm" style={{ width: 'auto' }}>
                  <option>24</option>
                  <option>48</option>
                </select>
                <select className="form-select form-select-sm border-primary text-primary fw-medium rounded-pill px-4 shadow-sm" style={{ width: 'auto' }}>
                  <option>Сортировка</option>
                  <option>Сначала дешевые</option>
                </select>
              </div>
            </div>

            {/* Asaxiy-style Grid */}
            <div className="row g-3">
              {sortedBooks.map((book: Book) => {
                const numericPrice = parseInt(book.price.replace(/\D/g, ''), 10) || 0;
                const installmentPrice = Math.round(numericPrice / 3).toLocaleString('ru-RU');
                
                return (
                  <div key={book.id} className="col-6 col-md-4 col-xl-3">
                    <div className="card h-100 border-0 shadow-sm rounded-4 position-relative bg-white transition-all hover-scale-101 overflow-hidden" style={{ minHeight: '400px' }}>
                      
                      {/* Top Badges */}
                      <div className="position-absolute top-0 start-0 m-2 pt-1 z-2">
                        {book.discount ? (
                          <div className="badge bg-warning text-white fw-bold px-2 py-1 rounded-2 shadow-sm text-uppercase" style={{ fontSize: '10px', backgroundColor: '#ffa000 !important' }}>Скидка</div>
                        ) : book.isTopSeller ? (
                          <div className="badge text-white fw-bold px-2 py-1 rounded-2 shadow-sm text-uppercase" style={{ fontSize: '10px', backgroundColor: '#ffa000' }}>Супер Цена</div>
                        ) : null}
                      </div>

                      {/* Corner Diagonal Banner 0-0-3 */}
                      <div 
                        className="position-absolute fw-bold text-white shadow-sm" 
                        style={{ 
                          top: '18px', 
                          right: '-30px', 
                          backgroundColor: '#00c3b0', 
                          transform: 'rotate(45deg)', 
                          width: '100px', 
                          textAlign: 'center', 
                          fontSize: '11px',
                          padding: '2px 0',
                          zIndex: 2
                        }}
                      >
                        0-0-3
                      </div>

                      {/* Icons Action Area */}
                      <div className="position-absolute d-flex flex-column gap-2 z-2" style={{ top: '45px', right: '12px' }}>
                        <button className="btn btn-sm btn-link text-secondary p-0 bg-transparent border-0 opacity-50 hover-opacity-100 transition-all">
                          <Heart size={20} />
                        </button>
                        <button className="btn btn-sm btn-link text-secondary p-0 bg-transparent border-0 opacity-50 hover-opacity-100 transition-all">
                          <Scale size={20} />
                        </button>
                      </div>

                      {/* Book Cover Image */}
                      <Link href={`/book/${book.id}`} className="p-4 mt-2 d-flex justify-content-center align-items-center text-decoration-none" style={{ height: '230px' }}>
                        <img 
                          src={book.image} 
                          alt={book.title} 
                          className="img-fluid h-100 object-fit-contain transition-transform duration-300" 
                        />
                      </Link>

                      {/* Card Content Footer */}
                      <div className="card-body d-flex flex-column px-3 pb-3 pt-0 text-start">
                        {/* Title */}
                        <Link href={`/book/${book.id}`} className="text-decoration-none text-dark hover-text-primary transition-all">
                          <h6 className="card-title fw-medium mb-2" style={{ fontSize: '13.5px', lineHeight: '1.4', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {book.author}: {book.title}
                          </h6>
                        </Link>
                        
                        {/* Rating */}
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <div className="d-flex" style={{ color: '#ff9800' }}>
                            <Star size={13} fill="currentColor" strokeWidth={0} />
                            <Star size={13} fill="currentColor" strokeWidth={0} />
                            <Star size={13} fill="currentColor" strokeWidth={0} />
                            <Star size={13} fill="currentColor" strokeWidth={0} />
                            <Star size={13} fill="currentColor" strokeWidth={0} />
                          </div>
                          <span className="text-secondary opacity-75" style={{ fontSize: '11px' }}>{book.reviewsCount || 49} отзывов</span>
                        </div>

                        {/* Price Details */}
                        <div className="mt-auto pt-2">
                          {book.originalPrice ? (
                            <div className="text-secondary text-decoration-line-through opacity-75" style={{ fontSize: '12px', minHeight: '18px' }}>{book.originalPrice} сум</div>
                          ) : (
                            <div style={{ minHeight: '18px' }}></div>
                          )}
                          <div className="text-primary fw-bold mb-2" style={{ fontSize: '20px', color: '#005bff !important' }}>{book.price}</div>
                          
                          {/* Installments Box */}
                          <div className="rounded border fw-bold text-center py-1 mb-3" style={{ fontSize: '11.5px', borderColor: '#ff9800', color: '#ff9800' }}>
                            {installmentPrice} сум х 3 мес
                          </div>

                          {/* Action Buttons */}
                          <div className="d-flex gap-2">
                            <button className="btn flex-grow-1 fw-bold text-white transition-all active-scale-95 border-0" style={{ fontSize: '13px', padding: '8px 0', backgroundColor: '#005bff' }}>
                              Купить в один клик
                            </button>
                            <button className="btn text-white d-flex align-items-center justify-content-center transition-all active-scale-95 border-0" style={{ backgroundColor: '#00c3b0', width: '42px', padding: '0' }}>
                              <ShoppingBag size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
