'use client'

import { useState } from 'react';
import AIChat from '../components/AIChat';
import CommunityPanel from '../components/CommunityPanel';
import Marketplace from '../components/Marketplace';
import SidebarNavigation from '../components/SidebarNavigation';
import ChatWorkspace from '../components/ChatWorkspace';
import BookPlanner from '../components/BookPlanner';
import FinishedBookAnalysis from '../components/FinishedBookAnalysis';
import AuthModal from '../components/AuthModal';
import { BookOpen, Users, ShoppingBag, Sparkles, Zap, ChevronRight, MessageSquare, ArrowLeft, User, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [isWorkspace, setIsWorkspace] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentSection, setCurrentSection] = useState<'chats' | 'planner' | 'finished' | 'settings'>('chats');
  const [workspaces, setWorkspaces] = useState([
    { id: 'ws-1', bookTitle: '1984' },
    { id: 'ws-2', bookTitle: 'Sapiens' },
    { id: 'ws-3', bookTitle: 'Alkimyogar' }
  ]);

  if (isWorkspace) {
    return (
      <main className="d-flex vh-100 bg-dark text-body overflow-hidden" data-bs-theme="dark">
        <SidebarNavigation 
          currentSection={currentSection} 
          setCurrentSection={setCurrentSection} 
          workspaces={workspaces}
          onNewChat={() => {}}
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
    <main className="min-vh-100 bg-body text-body" data-bs-theme="light">
      {/* Premium Navigation */}
      <nav className="navbar navbar-expand-lg fixed-top p-0 glass border-bottom">
        <div className="container py-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <div className="p-2 bg-primary rounded-3 d-flex align-items-center justify-content-center shadow-lg animate-float">
              <BookOpen className="text-white" size={24} />
            </div>
            <span className="h4 fw-black m-0 tracking-tighter">Kitob<span className="text-primary font-italic italic">AI</span></span>
          </div>
          
          <div className="d-none d-md-flex align-items-center gap-4 text-uppercase small fw-bold tracking-widest">
            <a href="#ai" className="nav-link text-body hover-text-primary">Sun'iy Intellekt</a>
            <a href="#community" className="nav-link text-body hover-text-primary">Hamjamiyat</a>
            <a href="#marketplace" className="nav-link text-body hover-text-primary">Marketpleys</a>
          </div>

          {isLoggedIn ? (
            <div className="position-relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="btn btn-dark rounded-circle p-2 shadow-lg hover-scale-105 active-scale-95 transition-all d-flex align-items-center justify-content-center"
                style={{ width: '48px', height: '48px' }}
              >
                <User size={24} />
              </button>
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="position-absolute end-0 mt-2 bg-body rounded-4 shadow-sm border border-light-subtle overflow-hidden"
                    style={{ width: '200px', zIndex: 1060 }}
                  >
                    <div className="p-3 border-bottom border-light-subtle bg-body-tertiary">
                      <p className="fw-bold mb-0 text-truncate text-body">Profil</p>
                      <p className="small text-secondary mb-0 text-truncate">user@kitobai.uz</p>
                    </div>
                    <div className="p-2 d-flex flex-column gap-1">
                      <button 
                        onClick={() => { setShowDropdown(false); setIsWorkspace(true); }}
                        className="btn btn-sm btn-light bg-transparent border-0 text-start w-100 d-flex align-items-center gap-2 fw-medium px-3 py-2 text-body hover-text-primary"
                      >
                        <Settings size={16} /> Dashboard
                      </button>
                      <button 
                        onClick={() => { setIsLoggedIn(false); setShowDropdown(false); }}
                        className="btn btn-sm btn-light bg-transparent border-0 text-start w-100 d-flex align-items-center gap-2 text-danger fw-medium px-3 py-2 hover-text-danger"
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
              className="btn btn-dark rounded-pill fw-bold px-3 px-md-4 py-2 py-md-3 shadow-lg hover-scale-105 active-scale-95 transition-all d-flex align-items-center gap-2 text-uppercase tracking-wider"
            >
              <User size={20} />
              <span className="d-none d-md-inline small">Login</span>
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="position-relative pt-10 pb-5 overflow-hidden text-center" style={{ marginTop: '5rem' }}>
        <div className="position-absolute top-0 start-50 translate-middle-x w-100 h-100 bg-gradient-to-b from-primary-subtle via-transparent to-transparent opacity-25 pointer-events-none" />
        <div className="container position-relative z-index-1 py-5">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 text-uppercase fw-black tracking-widest mb-4"
          >
            <Sparkles size={16} fill="currentColor" className="me-2" />
            Adabiyot kelajagi shu yerda
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="display-1 fw-black tracking-tighter leading-tight mb-4"
          >
            Kitoblarni <span className="text-primary">tushunish</span> va <span className="text-decoration-underline text-decoration-primary opacity-25 text-underline-offset-lg">tahlil</span> uchun yangi tizim
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lead text-secondary mx-auto fw-medium mb-5"
            style={{ maxWidth: '700px' }}
          >
            NotebookLM-style smart workspace created for book lovers. Analyze, discuss, plan, and explore deeper.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="d-flex flex-wrap justify-content-center gap-3 mt-4"
          >
            <button 
              onClick={() => isLoggedIn ? setIsWorkspace(true) : setIsAuthModalOpen(true)}
              className="btn btn-primary d-flex align-items-center gap-3 px-5 py-4 rounded-5 fw-black display-6 shadow-lg shadow-primary-50 transition-all hover-scale-105 active-scale-95"
            >
              {isLoggedIn ? "WORKSPACE'GA KIRISH" : "DASHBOARDGA OTISH"} <ChevronRight size={32} />
            </button>
          </motion.div>
        </div>
      </header>

      {/* AI Preview Section */}
      <section id="ai" className="py-5 overflow-hidden">
        <div className="container py-5">
           <div className="row g-5 align-items-center">
              <div className="col-lg-6">
                <div className="d-flex align-items-center gap-3 mb-4">
                   <div className="p-3 bg-primary-subtle rounded-4">
                      <Sparkles className="text-primary" size={40} />
                   </div>
                   <h2 className="display-5 fw-black tracking-tight mb-0">NotebookLM Tizimi</h2>
                </div>
                <p className="lead text-secondary mb-5">
                  Bu shunchaki chat emas. Bu sizning shaxsiy adabiyot kutubxonangiz va bilimlar bazangiz. Har bir kitob uchun alohida intellektual ish joyi.
                </p>

                <div className="row g-4 overflow-hidden">
                   <div className="col-md-6">
                      <FeatureCard 
                        icon={<Zap className="text-primary" size={24} />} 
                        title="Taqsimlangan Chatlar" 
                        desc="Har bir kitob uchun alohida muloqot va tarix." 
                      />
                   </div>
                   <div className="col-md-6">
                      <FeatureCard 
                        icon={<BookOpen className="text-secondary" size={24} />} 
                        title="Aqlli Rejalashtiruvchi" 
                        desc="Qiziqishlaringiz asosida yo'l xaritalari." 
                      />
                   </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div 
                  className="position-relative cursor-pointer transition-all hover-scale-101 group" 
                  onClick={() => isLoggedIn ? setIsWorkspace(true) : setIsAuthModalOpen(true)}
                  style={{ minHeight: '600px' }}
                >
                   <AIChat />
                   <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark-50 rounded-5 opacity-0 group-hover-opacity-100 transition-all glass d-flex align-items-center justify-content-center z-index-1">
                      <p className="btn btn-white fw-black rounded-4 px-5 py-3 shadow-lg">WORKSPACE'GA KIRISH</p>
                   </div>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* Combined Middle Section */}
      <section className="py-5 bg-body-tertiary">
        <div className="container py-5">
          <div className="row g-5">
            <div id="community" className="col-lg-4">
              <div className="mb-4">
                <h2 className="h3 fw-black d-flex align-items-center gap-2 mb-2">
                  <Users className="text-secondary" size={28} />
                  Hamjamiyat
                </h2>
                <p className="text-secondary small fw-bold">Boshqa kitobxonlar hozir nima o'qishmoqda?</p>
              </div>
              <CommunityPanel />
            </div>

            <div id="marketplace" className="col-lg-8">
              <Marketplace />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 border-top bg-body">
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="p-2 bg-dark rounded-3 d-flex align-items-center justify-content-center animate-float">
                  <BookOpen className="text-white" size={24} />
                </div>
                <span className="h4 fw-black m-0 tracking-tighter">Kitob<span className="text-primary font-italic italic">AI</span></span>
              </div>
              <p className="text-secondary small fw-bold mb-4 pe-lg-5">
                O'zbekistondagi kitobxonlar uchun eng zamonaviy texnologiyalarni birlashtirgan platforma.
              </p>
              <div className="d-flex gap-2">
                 <button className="btn btn-outline-secondary rounded-4 p-2 shadow-sm"><MessageSquare size={20} /></button>
              </div>
            </div>
            
            <div className="col-lg-4 col-sm-6">
              <h4 className="small text-uppercase fw-black text-secondary tracking-widest mb-4">Bo'limlar</h4>
              <ul className="list-unstyled d-flex flex-column gap-3 small fw-bold">
                <li><a href="#" className="nav-link p-0 text-body hover-text-primary transition-all">Biz haqimizda</a></li>
                <li><a href="#" className="nav-link p-0 text-body hover-text-primary transition-all">Hamkorlik</a></li>
                <li><a href="#" className="nav-link p-0 text-body hover-text-primary transition-all">Yordam</a></li>
              </ul>
            </div>

            <div className="col-lg-4 col-sm-6">
              <h4 className="small text-uppercase fw-black text-secondary tracking-widest mb-4">Newsletter</h4>
              <div className="p-4 rounded-5 bg-primary-subtle border border-primary-subtle">
                <p className="small fw-black text-primary mb-2 text-uppercase tracking-widest">Yangilik</p>
                <p className="fw-bold mb-4">Har haftalik adabiy sharhlarga obuna bo'ling.</p>
                <div className="d-flex gap-2">
                  <input type="email" placeholder="Email..." className="form-control rounded-4 py-2 px-3 border-light-subtle shadow-sm small focus-ring-0" />
                  <button className="btn btn-primary rounded-4 px-3 py-2 fw-black small text-uppercase">OK</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => {
          setIsAuthModalOpen(false);
          setIsLoggedIn(true);
        }}
      />
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string, desc: string }) {
  return (
    <div className="card h-100 p-4 p-md-5 rounded-5 border-light-subtle shadow-sm transition-all hover-scale-105 group">
      <div className="p-3 bg-body-tertiary rounded-4 d-inline-block mb-4 transition-transform group-hover-scale-110">
        {icon}
      </div>
      <h4 className="h5 fw-black mb-2">{title}</h4>
      <p className="small text-secondary fw-medium mb-0">{desc}</p>
    </div>
  );
}
