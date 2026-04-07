'use client'

import { useState } from 'react';
import { useEffect } from 'react';

import SidebarNavigation from '../components/SidebarNavigation';
import ChatWorkspace from '../components/ChatWorkspace';
import BookPlanner from '../components/BookPlanner';
import FinishedBookAnalysis from '../components/FinishedBookAnalysis';
import AuthModal from '../components/AuthModal';
import ContactForm from '../components/ContactForm';
import { BookOpen, Users, ShoppingBag, Sparkles, Zap, ChevronRight, MessageSquare, ArrowLeft, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { booksData } from '../lib/data';

export default function Home() {
  const [isWorkspace, setIsWorkspace] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<'chats' | 'planner' | 'finished' | 'settings'>('chats');
  const [activeSegment, setActiveSegment] = useState('');
  const [workspaces, setWorkspaces] = useState([
    { id: 'ws-1', bookTitle: '1984' },
    { id: 'ws-2', bookTitle: 'Sapiens' },
    { id: 'ws-3', bookTitle: 'Alkimyogar' }
  ]);

  useEffect(() => {
    // Restore session if within 5 hours
    const expiry = localStorage.getItem('session_expiry');
    if (expiry && Date.now() < parseInt(expiry)) {
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem('session_expiry');
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthModalOpen(false);
    setIsLoggedIn(true);
    // 5 hours = 5 * 60 * 60 * 1000 milliseconds
    localStorage.setItem('session_expiry', (Date.now() + 5 * 60 * 60 * 1000).toString());
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowDropdown(false);
    localStorage.removeItem('session_expiry');
  };
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['ai', 'community', 'contact'];
      let current = '';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= (el.offsetTop - 120)) {
          current = section;
        }
      }
      setActiveSegment(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };


  if (isWorkspace) {
    return (
      <main className="d-flex vh-100 bg-dark text-body overflow-hidden" data-bs-theme="dark">
        <SidebarNavigation
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          workspaces={workspaces}
          onNewChat={() => { }}
        />

        <div className="flex-grow-1 d-flex flex-column position-relative h-100 bg-body-tertiary text-body">
          <button
            onClick={() => setIsWorkspace(false)}
            className="btn btn-light position-absolute top-0 start-0 m-4 z-index-master p-3 rounded-4 shadow-sm border"
            style={{ zIndex: 1050 }}
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex-grow-1 overflow-hidden h-100">
            <AnimatePresence mode="wait">
              {currentSection === 'chats' && (
                <motion.div
                  key="chats"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-100"
                >
                  <ChatWorkspace bookTitle={workspaces[0].bookTitle} />
                </motion.div>
              )}
              {currentSection === 'planner' && (
                <motion.div
                  key="planner"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-100 overflow-y-auto"
                >
                  <BookPlanner />
                </motion.div>
              )}
              {currentSection === 'finished' && (
                <motion.div
                  key="finished"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-100 overflow-y-auto"
                >
                  <FinishedBookAnalysis />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-vh-100 d-flex flex-column bg-body text-body" data-bs-theme="light">
      {/* Modern Full-Width Navigation */}
      <nav className="fixed-top w-100 bg-white border-bottom border-light-subtle shadow-sm transition-all" style={{ zIndex: 1040 }}>
        <div className="container-fluid px-4 px-lg-5 py-3 d-flex justify-content-between align-items-center mx-auto" style={{ maxWidth: '1400px' }}>

          {/* Left Side: Logo */}
          <div className="d-flex align-items-center gap-2 cursor-pointer transition-all hover-scale-101" onClick={() => window.scrollTo(0, 0)}>
            <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center">
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <span className="h4 fw-bold m-0 text-dark tracking-tight">Kitob<span className="text-primary">AI</span></span>
          </div>

          {/* Center: Desktop Navigation Links */}
          <div className="d-none d-md-flex align-items-center gap-4">
            <a href="#ai" onClick={(e) => handleSmoothScroll(e, 'ai')} className={`text-decoration-none fw-bold transition-all py-1 border-bottom border-2 ${activeSegment === 'ai' ? 'text-primary border-primary' : 'text-secondary border-transparent hover-text-primary'}`}>Sun'iy Intellekt</a>
            <a href="#community" onClick={(e) => handleSmoothScroll(e, 'community')} className={`text-decoration-none fw-bold transition-all py-1 border-bottom border-2 ${activeSegment === 'community' ? 'text-primary border-primary' : 'text-secondary border-transparent hover-text-primary'}`}>Hamjamiyat</a>
            <a href="/marketplace" className={`text-decoration-none text-secondary fw-bold transition-all py-1 border-bottom border-2 border-transparent hover-text-primary`}>Marketplace</a>
            <a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')} className={`text-decoration-none fw-bold transition-all py-1 border-bottom border-2 ${activeSegment === 'contact' ? 'text-primary border-primary' : 'text-secondary border-transparent hover-text-primary'}`}>Contact</a>
          </div>

          {/* Right Side: Profile / Mobile Toggle */}
          <div className="d-flex align-items-center gap-3">
            {isLoggedIn ? (
              <div className="position-relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="btn btn-light rounded-circle p-2 shadow-sm transition-all hover-scale-105 active-scale-95 d-flex align-items-center justify-content-center bg-white border border-light-subtle"
                  style={{ width: '44px', height: '44px' }}
                >
                  <User size={20} className="text-primary" />
                </button>
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="position-absolute end-0 mt-2 bg-white rounded-4 shadow-premium border border-light-subtle overflow-hidden"
                      style={{ width: '200px', zIndex: 1060 }}
                    >
                      <div className="p-3 border-bottom border-light-subtle bg-light">
                        <p className="fw-bold mb-0 text-truncate text-dark">Profil</p>
                        <p className="small text-secondary mb-0 text-truncate">user@kitobai.uz</p>
                      </div>
                      <div className="p-2 d-flex flex-column gap-1">
                        <button
                          onClick={() => { setShowDropdown(false); setIsWorkspace(true); }}
                          className="btn btn-sm btn-light bg-transparent border-0 text-start w-100 d-flex align-items-center gap-2 fw-medium px-3 py-2 text-dark hover-text-primary transition-all"
                        >
                          <Settings size={16} /> Dashboard
                        </button>
                        <button
                          onClick={handleLogout}
                          className="btn btn-sm btn-light bg-transparent border-0 text-start w-100 d-flex align-items-center gap-2 text-danger fw-medium px-3 py-2 hover-text-danger transition-all"
                        >
                          <LogOut size={16} /> Chiqish
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="btn btn-primary rounded-pill fw-bold px-4 py-2 shadow-sm transition-all hover-scale-105 active-scale-95 d-flex align-items-center gap-2"
              >
                <User size={18} />
                <span className="d-none d-md-inline small">Kirish</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="btn btn-light d-md-none p-2 rounded-3 border border-light-subtle d-flex align-items-center justify-content-center bg-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} className="text-dark" /> : <Menu size={24} className="text-dark" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="d-md-none bg-white border-top border-light-subtle overflow-hidden"
            >
              <div className="container-fluid px-4 py-3 d-flex flex-column gap-2">
                <a href="#ai" onClick={(e) => handleSmoothScroll(e, 'ai')} className={`text-decoration-none fw-bold px-3 py-2 rounded-3 transition-all ${activeSegment === 'ai' ? 'bg-primary bg-opacity-10 text-primary' : 'text-secondary bg-light'}`}>Sun'iy Intellekt</a>
                <a href="#community" onClick={(e) => handleSmoothScroll(e, 'community')} className={`text-decoration-none fw-bold px-3 py-2 rounded-3 transition-all ${activeSegment === 'community' ? 'bg-primary bg-opacity-10 text-primary' : 'text-secondary bg-light'}`}>Hamjamiyat</a>
                <a href="/marketplace" className={`text-decoration-none text-secondary fw-bold px-3 py-2 rounded-3 transition-all bg-light`}>Marketplace</a>
                <a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')} className={`text-decoration-none fw-bold px-3 py-2 rounded-3 transition-all ${activeSegment === 'contact' ? 'bg-primary bg-opacity-10 text-primary' : 'text-secondary bg-light'}`}>Contact</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="ai" className="position-relative d-flex align-items-center justify-content-center min-vh-100 pt-5 pb-5 mt-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold tracking-tight mb-3">
              Platforma <span className="text-primary">kitobxonlar</span> uchun
            </h1>
            <p className="lead text-secondary mx-auto mb-5" style={{ maxWidth: '600px' }}>
              Barcha ehtiyojlaringizni bir joyda jamlagan zamonaviy va qulay muhit.
            </p>
          </div>

          <div className="row g-4 justify-content-center mx-auto" style={{ maxWidth: '1000px' }}>
            <div className="col-md-6">
              <div
                className="card h-100 border-0 transition-all outline-none shadow-premium hover-scale-101 cursor-pointer d-flex flex-column align-items-center text-center"
                style={{
                  padding: '4rem 3rem',
                  borderRadius: '2rem',
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
                }}
                onClick={() => window.location.href = '/ai'}
              >
                <div className="mb-4 text-primary d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm" style={{ width: '80px', height: '80px' }}>
                  <Sparkles size={36} strokeWidth={2} />
                </div>
                <h3 className="h3 fw-bold mb-3 text-dark">AI Tools</h3>
                <p className="text-secondary mb-0 fw-medium fs-5" style={{ color: '#4b5563' }}>
                  Kitoblarni tahlil qilish uchun shaxsiy intellektual yordamchi
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div
                className="card h-100 border-0 transition-all outline-none shadow-premium hover-scale-101 cursor-pointer d-flex flex-column align-items-center text-center"
                style={{
                  padding: '4rem 3rem',
                  borderRadius: '2rem',
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                }}
                onClick={() => { window.location.href = '#community' }}
              >
                <div className="mb-4 text-success d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm" style={{ width: '80px', height: '80px' }}>
                  <Users size={36} strokeWidth={2} />
                </div>
                <h3 className="h3 fw-bold mb-3 text-dark">Readers Community</h3>
                <p className="text-secondary mb-0 fw-medium fs-5" style={{ color: '#4b5563' }}>
                  Boshqa o'quvchilar bilan muloqot va qiziqarli muhokamalar
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Seller Books Section (Community/Featured) */}
      <section className="py-5 bg-body-tertiary" id="community">
        <div className="container py-5">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2 className="h3 fw-bold mb-2">Best Seller Books</h2>
              <p className="text-secondary mb-0">Haftaning eng ko'p o'qilgan kitoblari</p>
            </div>
          </div>

          <div className="row g-4">
            {booksData.filter(b => b.isTopSeller).map((book) => (
              <div key={book.id} className="col-12 col-sm-6 col-lg-3 d-flex align-items-stretch">
                <div className="card w-100 border-0 overflow-hidden shadow-premium hover-scale-101 transition-all d-flex flex-column" style={{ borderRadius: '2rem' }}>
                  <div className="position-relative bg-light border-bottom border-light-subtle" style={{ height: '350px', width: '100%', flexShrink: 0 }}>
                    <img src={book.image} alt={book.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="p-4 bg-body d-flex flex-column flex-grow-1">
                    <h5 className="fw-bold mb-1 text-truncate text-dark">{book.title}</h5>
                    <p className="small text-secondary mb-2 text-truncate">{book.author}</p>
                    <div className="mb-2">
                      <span className="fw-black text-primary fs-5">{book.price}</span>
                    </div>
                    <p className="small text-secondary mb-4 flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{book.description}</p>

                    <div className="d-flex flex-column gap-2 mt-auto pt-3">
                      <button
                        className="btn btn-primary w-100 fw-bold py-2 shadow-sm rounded-3 transition-all"
                        onClick={() => window.location.href = `/book/${book.id}`}
                      >
                        View Details
                      </button>
                      <button className="btn btn-light w-100 fw-bold py-2 border border-light-subtle shadow-sm rounded-3 transition-all text-dark">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Contact Section */}
      <footer id="contact" className="py-5 border-top border-light-subtle bg-body">
        <div className="container py-4">
          <div className="mb-5 text-center">
            <h2 className="display-6 fw-bold mb-3">Biz bilan Bog'lanish</h2>
            <p className="text-secondary mb-5 mx-auto fw-medium fs-5" style={{ maxWidth: '600px' }}>
              Savollaringiz yoki hamkorlik takliflaringiz bormi? Quyidagi shakl orqali bizga xabar yuboring.
            </p>
          </div>
          
          <div className="mb-5">
            <ContactForm />
          </div>

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4 mt-5 pt-5 border-top border-light-subtle">
            <div className="d-flex align-items-center gap-3">
              <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3">
                <BookOpen size={24} />
              </div>
              <span className="h4 fw-bold m-0 text-dark">Kitob<span className="text-primary">AI</span></span>
            </div>

            <div className="d-flex gap-4 small fw-bold">
              <a href="#" className="text-secondary text-decoration-none transition-all hover-text-primary">Kompaniya haqida</a>
              <a href="/marketplace" className="text-secondary text-decoration-none transition-all hover-text-primary">Marketplace</a>
              <a href="#" className="text-secondary text-decoration-none transition-all hover-text-primary">Maxfiylik siyosati</a>
            </div>

            <div className="small text-secondary fw-medium">
              © 2026 KitobAI. Barcha huquqlar himoyalangan.
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </main>
  );
}
