'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import { BookOpen, LogOut, Menu, Settings, User, Users, X } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';

import styles from '@/app/page.module.css';

const AuthModal = dynamic(() => import('@/components/AuthModal'), {
  ssr: false,
});

function initials(name?: string | null) {
  if (!name) return 'KA';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

const navLinks = [
  { href: '#ai', label: 'AI' },
  { href: '#community', label: 'Community' },
  { href: '#marketplace', label: 'Books' },
  { href: '#contact', label: 'Contact' },
];

export default function HomeNavbar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const displayName = profile?.displayName || user?.displayName || 'Profile';
  const email = profile?.email || user?.email || 'user@kitobai.uz';

  const handleSignOut = async () => {
    await signOut();
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed-top w-100 bg-white border-bottom border-light-subtle shadow-sm ${styles.nav}`}>
        <div className={`container-fluid px-4 px-lg-5 py-3 d-flex justify-content-between align-items-center mx-auto ${styles.navInner}`}>
          <button
            type="button"
            className="d-flex align-items-center gap-2 border-0 bg-transparent p-0 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Go to top"
          >
            <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center">
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <span className="h4 fw-bold m-0 text-dark tracking-tight">
              Kitob<span className="text-primary">AI</span>
            </span>
          </button>

          <div className="d-none d-md-flex align-items-center gap-4">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-decoration-none text-secondary fw-medium hover-text-primary transition-all">
                {link.label}
              </a>
            ))}
          </div>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <div className="position-relative">
                <button
                  type="button"
                  title="Profile menu"
                  aria-label="Profile menu"
                  onClick={() => setShowDropdown((current) => !current)}
                  className="btn btn-light rounded-circle p-2 shadow-sm transition-all hover-scale-105 active-scale-95 d-flex align-items-center justify-content-center bg-white border border-light-subtle"
                  style={{ width: '44px', height: '44px' }}
                >
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt={displayName} className="w-100 h-100 rounded-circle object-fit-cover" loading="lazy" decoding="async" />
                  ) : (
                    <span className="fw-bold text-primary small">{initials(displayName)}</span>
                  )}
                </button>
                {showDropdown ? (
                  <div
                    className="position-absolute end-0 mt-2 bg-white rounded-4 shadow-premium border border-light-subtle overflow-hidden"
                    style={{ width: '220px', zIndex: 1060 }}
                  >
                    <div className="p-3 border-bottom border-light-subtle bg-light">
                      <p className="fw-bold mb-0 text-truncate text-dark">{displayName}</p>
                      <p className="small text-secondary mb-2 text-truncate">{email}</p>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">
                        {profile?.role ?? 'user'}
                      </span>
                    </div>
                    <div className="p-2 d-flex flex-column gap-1">
                      <Link
                        href="/account"
                        className="btn btn-sm btn-light bg-transparent border-0 text-start w-100 d-flex align-items-center gap-2 fw-medium px-3 py-2 text-dark hover-text-primary transition-all"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Settings size={16} /> Dashboard
                      </Link>
                      <Link
                        href="/books"
                        className="btn btn-sm btn-light bg-transparent border-0 text-start w-100 d-flex align-items-center gap-2 fw-medium px-3 py-2 text-dark hover-text-primary transition-all"
                        onClick={() => setShowDropdown(false)}
                      >
                        <BookOpen size={16} /> Books
                      </Link>
                      <Link
                        href="/communities"
                        className="btn btn-sm btn-light bg-transparent border-0 text-start w-100 d-flex align-items-center gap-2 fw-medium px-3 py-2 text-dark hover-text-primary transition-all"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Users size={16} /> Communities
                      </Link>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="btn btn-sm btn-light bg-transparent border-0 text-start w-100 d-flex align-items-center gap-2 text-danger fw-medium px-3 py-2 hover-text-danger transition-all"
                      >
                        <LogOut size={16} /> Sign out
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="btn btn-primary rounded-pill fw-bold px-4 py-2 shadow-sm transition-all hover-scale-105 active-scale-95 d-flex align-items-center gap-2"
              >
                <User size={18} />
                <span className="d-none d-md-inline small">Sign in</span>
              </button>
            )}

            <button
              type="button"
              title="Open menu"
              aria-label="Open menu"
              className="btn btn-light d-md-none p-2 rounded-3 border border-light-subtle d-flex align-items-center justify-content-center bg-white"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
            >
              {isMobileMenuOpen ? <X size={24} className="text-dark" /> : <Menu size={24} className="text-dark" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen ? (
          <div className="d-md-none bg-white border-top border-light-subtle overflow-hidden">
            <div className="container-fluid px-4 py-3 d-flex flex-column gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-decoration-none text-secondary fw-medium px-3 py-2 rounded-3 transition-all ${styles.mobileMenuLink}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </nav>

      {isAuthModalOpen ? (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => {
            setIsAuthModalOpen(false);
            setShowDropdown(false);
          }}
        />
      ) : null}
    </>
  );
}
