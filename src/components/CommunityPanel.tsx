'use client';

import Link from 'next/link';
import { MessageSquare, Users } from 'lucide-react';

import { useCommunities } from '@/hooks/useCommunities';

export default function CommunityPanel() {
  const { communities, isLoading, error } = useCommunities('');
  const featured = communities.slice(0, 3);

  return (
    <div className="card p-4 p-md-5 border-light-subtle rounded-5 shadow-sm h-100 bg-white">
      <div className="d-flex flex-column gap-4 h-100">
        <div className="d-flex align-items-center justify-content-between gap-3">
          <div>
            <h3 className="fw-bold mb-1 text-dark">Hamjamiyatlar</h3>
            <p className="text-secondary mb-0">Jonli Firestore maʼlumotlari bilan ishlaydi.</p>
          </div>
          <Link href="/communities" className="btn btn-outline-primary rounded-pill fw-bold px-3">
            Barchasi
          </Link>
        </div>

        {isLoading && (
          <div className="py-5 text-center text-secondary">
            <div className="spinner-border spinner-border-sm text-primary" aria-hidden="true"></div>
            <p className="mb-0 mt-3">Hamjamiyatlar yuklanmoqda...</p>
          </div>
        )}

        {!isLoading && error && <p className="text-danger mb-0">{error}</p>}

        {!isLoading && !error && featured.length === 0 && (
          <div className="rounded-4 border border-light-subtle bg-light p-4 text-center">
            <p className="fw-bold text-dark mb-1">Hali hamjamiyatlar yo‘q</p>
            <p className="text-secondary mb-0">Birinchi hamjamiyatni yaratib muhokamani boshlang.</p>
          </div>
        )}

        <div className="d-flex flex-column gap-3">
          {featured.map((community) => (
            <Link
              key={community.id}
              href={`/communities/${community.slug}`}
              className="card p-4 rounded-4 border-light-subtle shadow-sm transition-all hover-scale-101 text-decoration-none"
            >
              <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                <div>
                  <h4 className="h5 fw-bold text-dark mb-1">{community.name}</h4>
                  <p className="small text-secondary mb-0">{community.description}</p>
                </div>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">
                  /{community.slug}
                </span>
              </div>
              <div className="d-flex flex-wrap gap-3 small text-secondary">
                <span className="d-inline-flex align-items-center gap-2">
                  <Users size={14} />
                  {community.memberCount} aʼzo
                </span>
                <span className="d-inline-flex align-items-center gap-2">
                  <MessageSquare size={14} />
                  {community.postCount} post
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
