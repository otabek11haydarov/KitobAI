'use client';

import Link from 'next/link';
import { BookOpen, Sparkles, Users } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';

function initials(name?: string | null) {
  if (!name) return 'KA';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function AccountPage() {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="min-vh-100 d-flex align-items-center justify-content-center bg-body-tertiary">
        <div className="spinner-border text-primary" aria-hidden="true"></div>
      </main>
    );
  }

  if (!user || !profile) {
    return (
      <main className="min-vh-100 d-flex align-items-center justify-content-center bg-body-tertiary">
        <div className="card border-0 shadow-sm rounded-5 p-4 p-md-5 text-center" style={{ maxWidth: '520px' }}>
          <h1 className="h3 fw-bold text-dark mb-3">Dashboard protected</h1>
          <p className="text-secondary mb-4">Bu sahifa faqat tizimga kirgan foydalanuvchilar uchun ochiladi.</p>
          <Link href="/" className="btn btn-primary rounded-pill fw-bold px-4">Bosh sahifaga qaytish</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-vh-100 bg-body-tertiary py-5">
      <div className="container py-5">
        <div className="d-flex flex-column flex-lg-row gap-4">
          <div className="card border-0 shadow-sm rounded-5 p-4 p-md-5" style={{ maxWidth: '420px' }}>
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '72px', height: '72px', fontSize: '24px' }}>
                {initials(profile.displayName)}
              </div>
              <div>
                <h1 className="h3 fw-bold text-dark mb-1">{profile.displayName}</h1>
                <p className="text-secondary mb-1">{profile.email}</p>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">{profile.role}</span>
              </div>
            </div>
            <p className="text-secondary mb-0">
              Profil Firebase Auth va Firestore bilan sinxron ishlaydi. Display name, email va role foydalanuvchi hujjatida saqlanadi.
            </p>
          </div>

          <div className="flex-grow-1 d-flex flex-column gap-4">
            <div className="card border-0 shadow-sm rounded-5 p-4 p-md-5">
              <h2 className="h4 fw-bold text-dark mb-4">Tezkor amallar</h2>
              <div className="row g-3">
                <div className="col-md-4">
                  <Link href="/ai" className="card h-100 border border-light-subtle rounded-4 p-4 text-decoration-none shadow-sm hover-scale-101">
                    <Sparkles className="text-primary mb-3" />
                    <h3 className="h5 fw-bold text-dark">AI bo‘limi</h3>
                    <p className="text-secondary mb-0">Yangi chat yoki mavjud tahlillarni davom ettiring.</p>
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link href="/communities" className="card h-100 border border-light-subtle rounded-4 p-4 text-decoration-none shadow-sm hover-scale-101">
                    <Users className="text-primary mb-3" />
                    <h3 className="h5 fw-bold text-dark">Communities</h3>
                    <p className="text-secondary mb-0">Hamjamiyat yarating, qo‘shiling va postlar yozing.</p>
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link href="/" className="card h-100 border border-light-subtle rounded-4 p-4 text-decoration-none shadow-sm hover-scale-101">
                    <BookOpen className="text-primary mb-3" />
                    <h3 className="h5 fw-bold text-dark">Marketplace</h3>
                    <p className="text-secondary mb-0">Kitob kartalari va tafsilot sahifalariga qayting.</p>
                  </Link>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-5 p-4 p-md-5">
              <h2 className="h4 fw-bold text-dark mb-3">Account holati</h2>
              <div className="row g-3 small">
                <div className="col-md-4">
                  <div className="rounded-4 bg-light p-4 h-100">
                    <p className="text-secondary mb-1">Session</p>
                    <p className="fw-bold text-dark mb-0">Persistent auth yoqilgan</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="rounded-4 bg-light p-4 h-100">
                    <p className="text-secondary mb-1">User document</p>
                    <p className="fw-bold text-dark mb-0">users/{profile.id} bilan sync</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="rounded-4 bg-light p-4 h-100">
                    <p className="text-secondary mb-1">Role model</p>
                    <p className="fw-bold text-dark mb-0">Global role + community role</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
