'use client';

import { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Star, ArrowLeft, Heart, Filter, Loader2, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface Book {
  id: string;
  url: string;
  title: string;
  store: string;
  category: string;
  price: number;
  image: string;
}

export default function MarketplacePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("Barchasi");
  const [maxPrice, setMaxPrice] = useState<number>(1000000); // 1M UZS as default max
  const [sortBy, setSortBy] = useState<string>("default");

  // Fetch data from API
  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch('/api/books');
        const result = await response.json();
        if (result.success) {
          setBooks(result.data);
        }
      } catch (error) {
        console.error("Kitoblarni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  // Filter Categories directly from data for dynamism
  const dynamicCategories = useMemo(() => {
    const cats = new Set(books.map(b => b.category));
    return ["Barchasi", ...Array.from(cats)].filter(c => c && c !== 'null' && c !== 'General');
  }, [books]);

  // Combined Filtering Logic
  const filteredBooks = useMemo(() => {
    let result = books.filter(book => {
      const matchCategory = activeCategory === "Barchasi" || book.category === activeCategory;
      const matchPrice = book.price <= maxPrice;
      return matchCategory && matchPrice;
    });

    if (sortBy === "price_asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }
    
    return result;
  }, [books, activeCategory, maxPrice, sortBy]);

  return (
    <main className="min-vh-100 bg-light font-sans text-dark" data-bs-theme="light">
      {/* Marketplace Navbar */}
      <nav className="fixed-top w-100 bg-white border-bottom shadow-sm z-50">
        <div className="container-fluid px-4 py-3 d-flex justify-content-between align-items-center" style={{ maxWidth: '1400px' }}>
          <Link href="/" className="d-flex align-items-center gap-2 text-decoration-none text-dark transition-all hover-opacity-75">
            <ArrowLeft size={20} className="text-secondary" />
            <span className="fw-bold">Bosh sahifaga qaytish</span>
          </Link>
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center border-0">
              <ShoppingBag size={24} strokeWidth={2.5} />
            </div>
            <span className="fs-4 fw-black m-0 tracking-tight">Market<span className="text-primary">place</span></span>
          </div>
        </div>
      </nav>

      <div className="container-fluid pt-5 mt-4 pb-5 px-4" style={{ maxWidth: '1440px' }}>
        <div className="row g-4 mt-3">
          
          {/* Filter Sidebar */}
          <div className="col-12 col-lg-3 d-none d-lg-block">
            <div className="bg-white rounded-4 shadow-sm p-4 sticky-top" style={{ top: '100px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div className="d-flex align-items-center gap-2 mb-4">
                <Filter size={20} className="text-primary" />
                <h5 className="fw-bold mb-0 fs-5">Kategoriyalar</h5>
              </div>
              
              <div className="d-flex flex-column gap-2 mb-5">
                {dynamicCategories.map((cat, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveCategory(cat)}
                    className={`btn text-start p-2 px-3 rounded-3 transition-all border-0 shadow-none d-flex justify-content-between align-items-center ${
                      activeCategory === cat 
                        ? 'bg-primary text-white fw-bold shadow-sm translate-x-1' 
                        : 'text-dark hover-bg-light-primary'
                    }`}
                    style={{ fontSize: '14.5px', transform: activeCategory === cat ? 'translateX(4px)' : 'none' }}
                  >
                    <span className="text-capitalize">{cat === 'Barchasi' ? 'Barchasi' : cat.replace(/-/g, ' ')}</span>
                    <span className={`badge rounded-pill ${activeCategory === cat ? 'bg-white text-primary' : 'bg-light text-secondary'}`} style={{ fontSize: '10px' }}>
                      {cat === "Barchasi" ? books.length : books.filter(b => b.category === cat).length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Price Filter Container */}
              <div className="mt-5 border-top pt-4">
                <h6 className="fw-bold mb-4 d-flex justify-content-between align-items-center">
                  Narx oralig'i <span className="badge bg-primary rounded-pill small" style={{ fontSize: '10px' }}>so'm</span>
                </h6>
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-secondary small fw-medium">0</span>
                    <span className="text-primary fw-bold">{maxPrice.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    className="form-range custom-slider" 
                    min="0" 
                    max="1000000" 
                    step="5000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  />
                </div>
                <div className="input-group input-group-sm mb-3 shadow-none">
                   <span className="input-group-text bg-white border-end-0 rounded-start-pill opacity-75">Maks</span>
                   <input 
                      type="number" 
                      className="form-control border-start-0 rounded-end-pill px-3 fw-bold" 
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(parseInt(e.target.value) || 0)}
                   />
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="col-12 col-lg-9">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
              <div>
                <h1 className="fw-bold mb-1 display-6">Barcha Kitoblar</h1>
                <p className="text-secondary small mb-0 fw-medium">
                  {loading ? 'Yuklanmoqda...' : `${filteredBooks.length} ta kitob topildi`}
                </p>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <select 
                  className="form-select form-select-sm border-0 bg-white shadow-sm rounded-pill px-4" 
                  style={{ width: 'auto', minWidth: '180px' }}
                  onChange={(e) => setSortBy(e.target.value)}
                  value={sortBy}
                >
                  <option value="default">Saralash</option>
                  <option value="price_asc">Arzonroqdan boshlab</option>
                  <option value="price_desc">Qimmatroqdan boshlab</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="d-flex flex-column align-items-center justify-content-center py-5 mt-5">
                <Loader2 className="text-primary spin-animation mb-3" size={48} />
                <p className="text-secondary fw-medium">Kitoblar bazasi yuklanmoqda...</p>
              </div>
            ) : filteredBooks.length === 0 ? (
               <div className="text-center py-5 mt-5 bg-white rounded-4 shadow-sm">
                  <BookOpen size={64} className="text-secondary mb-3 opacity-25" />
                  <h4 className="fw-bold text-dark">Kitoblar topilmadi</h4>
                  <p className="text-secondary">Tanlangan filtrlar bo'yicha mahsulot yo'q.</p>
                  <button className="btn btn-primary rounded-pill px-4 mt-2" onClick={() => { setActiveCategory("Barchasi"); setMaxPrice(1000000); }}>Filtrlarni tozalash</button>
               </div>
            ) : (
              <div className="row g-3">
                {filteredBooks.map((book) => {
                  const installmentPrice = Math.round(book.price / 3).toLocaleString('uz-UZ');
                  
                  return (
                    <div key={book.id} className="col-6 col-md-4 col-xl-3">
                      <div className="card h-100 border-0 shadow-sm rounded-4 position-relative bg-white transition-all hover-scale-101 overflow-hidden" style={{ minHeight: '400px' }}>
                        
                        <div className="position-absolute top-0 start-0 m-2 pt-1 z-2">
                           <div className="badge text-white fw-bold px-2 py-1 rounded-2 shadow-sm text-uppercase" style={{ fontSize: '10px', backgroundColor: '#ffa000' }}>{book.store}</div>
                        </div>

                        <div className="position-absolute d-flex flex-column gap-2 z-2" style={{ top: '15px', right: '12px' }}>
                          <button className="btn btn-sm btn-link text-secondary p-0 bg-transparent border-0 opacity-50 hover-opacity-100 transition-all">
                            <Heart size={20} />
                          </button>
                        </div>

                        <div className="p-4 mt-2 d-flex justify-content-center align-items-center text-decoration-none" style={{ height: '220px' }}>
                          <img 
                            src={book.image} 
                            alt={book.title} 
                            className="img-fluid h-100 object-fit-contain transition-transform duration-300" 
                          />
                        </div>

                        <div className="card-body d-flex flex-column px-3 pb-3 pt-0 text-start">
                          <h6 className="card-title fw-bold mb-2 text-dark" style={{ fontSize: '13.5px', lineHeight: '1.4', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {book.title}
                          </h6>
                          
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <div className="d-flex" style={{ color: '#ff9800' }}>
                              <Star size={13} fill="currentColor" strokeWidth={0} />
                              <Star size={13} fill="currentColor" strokeWidth={0} />
                              <Star size={13} fill="currentColor" strokeWidth={0} />
                              <Star size={13} fill="currentColor" strokeWidth={0} />
                              <Star size={13} fill="currentColor" strokeWidth={0} />
                            </div>
                            <span className="text-secondary opacity-75" style={{ fontSize: '10px' }}>4.9 (42)</span>
                          </div>

                          <div className="mt-auto pt-2">
                            <div className="text-primary fw-black mb-2" style={{ fontSize: '18px' }}>
                              {book.price.toLocaleString()} <span className="small fw-bold">so'm</span>
                            </div>
                            
                            <div className="rounded-3 border fw-bold text-center py-1 mb-3" style={{ fontSize: '11px', borderColor: '#ff9800', color: '#ff9800', backgroundColor: 'rgba(255, 152, 0, 0.05)' }}>
                              {installmentPrice} so'm x 3 oy
                            </div>

                            <div className="d-flex gap-2">
                              <button className="btn flex-grow-1 fw-bold text-white transition-all active-scale-95 border-0 shadow-sm" style={{ fontSize: '12px', padding: '10px 0', backgroundColor: '#005bff' }}>
                                Sotib olish
                              </button>
                              <button className="btn text-white d-flex align-items-center justify-content-center transition-all active-scale-95 border-0 shadow-sm" style={{ backgroundColor: '#00c3b0', width: '42px', padding: '0' }}>
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
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .hover-bg-light-primary:hover {
          background-color: rgba(0, 91, 255, 0.05);
          color: #005bff !important;
        }
        .translate-x-1 {
          transform: translateX(4px);
        }
        .hover-scale-101:hover {
          transform: scale(1.01) translateY(-4px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important;
        }
        .custom-slider {
          height: 6px;
          border-radius: 10px;
          background: #e9ecef;
          cursor: pointer;
        }
        .spin-animation {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
