import Link from 'next/link';
import { ArrowRight, BookOpen, MessageSquare, Search, Sparkles, Users } from 'lucide-react';

import BookCard from '@/components/BookCard';
import CommunityShowcase from '@/components/home/CommunityShowcase';
import HomeNavbar from '@/components/home/HomeNavbar';
import { getFeaturedBooks, getTopSellerBooks } from '@/lib/data';

import styles from './page.module.css';

export default function Home() {
  const featuredBooks = getFeaturedBooks(2);
  const topSellerBooks = getTopSellerBooks(4);

  return (
    <main className="min-vh-100 d-flex flex-column bg-body text-body" data-bs-theme="light">
      <HomeNavbar />

      <section className="position-relative d-flex align-items-center justify-content-center min-vh-100 pt-5 pb-5 mt-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold tracking-tight mb-3">
              Platforma <span className="text-primary">kitobxonlar</span> uchun
            </h1>
            <p className={`lead text-secondary mx-auto mb-4 ${styles.heroLead}`}>
              AI guidance, premium catalog discovery, and real community interaction in one place.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link href="/books" className="btn btn-light rounded-pill fw-bold px-4 py-3 border border-light-subtle d-inline-flex align-items-center gap-2">
                <Search size={16} />
                Book catalog
              </Link>
              <Link href="/ai" className="btn btn-primary rounded-pill fw-bold px-4 py-3 d-inline-flex align-items-center gap-2">
                <Sparkles size={16} />
                AI assistant
              </Link>
            </div>
          </div>

          <div className={`row g-4 justify-content-center mx-auto ${styles.heroGrid}`}>
            <div className="col-md-6">
              <Link
                href="/ai"
                className={`card h-100 border-0 transition-all outline-none shadow-premium hover-scale-101 cursor-pointer d-flex flex-column align-items-center text-center text-decoration-none ${styles.heroCard} ${styles.heroCardPrimary}`}
              >
                <div className={`mb-4 text-primary d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm ${styles.iconCircle}`}>
                  <Sparkles size={36} strokeWidth={2} />
                </div>
                <h2 className="h3 fw-bold mb-3 text-dark">AI Reading Companion</h2>
                <p className={`text-secondary mb-0 fw-medium fs-5 ${styles.mutedText}`}>
                  Summaries, discussion prompts, recommendations, and reading guidance.
                </p>
              </Link>
            </div>

            <div className="col-md-6">
              <a
                href="#community"
                className={`card h-100 border-0 transition-all outline-none shadow-premium hover-scale-101 cursor-pointer d-flex flex-column align-items-center text-center text-decoration-none ${styles.heroCard} ${styles.heroCardSecondary}`}
              >
                <div className={`mb-4 text-success d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm ${styles.iconCircle}`}>
                  <Users size={36} strokeWidth={2} />
                </div>
                <h2 className="h3 fw-bold mb-3 text-dark">Readers Community</h2>
                <p className={`text-secondary mb-0 fw-medium fs-5 ${styles.mutedText}`}>
                  Join communities, publish discussions, and engage with book-minded readers.
                </p>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-5 bg-white ${styles.deferredSection}`} id="ai">
        <div className="container py-5">
          <div className="row g-4 align-items-stretch">
            <div className="col-lg-5">
              <div className={`card border-0 shadow-sm h-100 p-4 p-md-5 ${styles.sectionCard}`}>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2 mb-3">
                  AI workflow
                </span>
                <h2 className="h3 fw-bold mb-3 text-dark">Kitob tahlili, suhbat, and recommendations in one flow</h2>
                <p className="text-secondary mb-4">
                  The AI workspace includes faster responses, persistent local chat history, book-specific prompt starters, and clear loading and error handling.
                </p>
                <div className="d-flex flex-column gap-3 small text-secondary">
                  <span className="d-inline-flex align-items-center gap-2"><Sparkles size={16} className="text-primary" /> Thoughtful summaries and explanations</span>
                  <span className="d-inline-flex align-items-center gap-2"><MessageSquare size={16} className="text-primary" /> Saved chats for quick return visits</span>
                  <span className="d-inline-flex align-items-center gap-2"><BookOpen size={16} className="text-primary" /> Direct AI handoff from book detail pages</span>
                </div>
                <div className="d-flex flex-wrap gap-3 mt-4">
                  <Link href="/ai" className="btn btn-primary rounded-pill fw-bold px-4">
                    Open AI workspace
                  </Link>
                  <Link href="/books" className="btn btn-light rounded-pill fw-bold px-4 border border-light-subtle">
                    Browse books
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className={`card border-0 shadow-sm h-100 p-4 p-md-5 bg-body-tertiary ${styles.sectionCard}`}>
                <div className="row g-4 h-100">
                  {featuredBooks.map((book) => (
                    <div key={book.id} className="col-md-6 d-flex align-items-stretch">
                      <BookCard book={book} compact />
                    </div>
                  ))}
                  <div className="col-12">
                    <div className="bg-primary text-white rounded-4 p-4 shadow-sm h-100 d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                      <div>
                        <h3 className="h5 fw-bold mb-2">Need a smarter starting point?</h3>
                        <p className="mb-0 opacity-75">
                          Pick a book from the catalog, then jump into the AI assistant with context-aware prompts.
                        </p>
                      </div>
                      <Link href="/books" className="btn btn-light rounded-pill fw-bold px-4 text-primary">
                        Browse books
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-5 bg-body-tertiary ${styles.deferredSection}`} id="community">
        <div className="container py-5">
          <div className="row g-4 align-items-start">
            <div className="col-lg-4">
              <div className={styles.stickyColumn}>
                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2 mb-3">
                  Community
                </span>
                <h2 className="h3 fw-bold mb-3">Community experience built for real readers</h2>
                <p className="text-secondary mb-4">
                  Create communities, join active spaces, share discussions, publish announcements, and moderate content with role-aware permissions.
                </p>
                <Link href="/communities" className="btn btn-dark rounded-pill fw-bold px-4">
                  Explore communities
                </Link>
              </div>
            </div>
            <div className="col-lg-8">
              <CommunityShowcase />
            </div>
          </div>
        </div>
      </section>

      <section className={`py-5 bg-body-tertiary ${styles.deferredSection}`} id="marketplace">
        <div className="container py-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-5">
            <div>
              <h2 className="h3 fw-bold mb-2">Discover books worth your time</h2>
              <p className="text-secondary mb-0">Real metadata, strong covers, richer detail pages, and curated discovery paths.</p>
            </div>
            <Link href="/books" className="btn btn-light rounded-pill fw-bold px-4 border border-light-subtle d-inline-flex align-items-center gap-2">
              Full catalog
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="row g-4">
            {topSellerBooks.map((book) => (
              <div key={book.id} className="col-12 col-sm-6 col-lg-3 d-flex align-items-stretch">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-5 bg-white ${styles.deferredSection}`} id="contact">
        <div className="container py-5">
          <div className="card border-0 shadow-sm rounded-5 p-4 p-md-5">
            <div className="row g-4 align-items-center">
              <div className="col-lg-8">
                <h2 className="h3 fw-bold text-dark mb-3">Contact KitobAI</h2>
                <p className="text-secondary mb-0">
                  For platform rollout, Firebase setup, AI integration, or community moderation support, contact us at support@kitobai.uz.
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <a href="mailto:support@kitobai.uz" className="btn btn-primary rounded-pill fw-bold px-4">
                  Send email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-4 border-top border-light-subtle mt-auto bg-body">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <BookOpen className="text-primary" size={20} />
              <span className="fw-bold">KitobAI</span>
            </div>

            <div className="d-flex gap-4 small fw-medium">
              <a href="#ai" className="text-secondary text-decoration-none transition-all hover-scale-101">AI</a>
              <a href="#community" className="text-secondary text-decoration-none transition-all hover-scale-101">Community</a>
              <Link href="/books" className="text-secondary text-decoration-none transition-all hover-scale-101">Books</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
