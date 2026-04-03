'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useDeferredValue, useMemo, useState } from 'react';
import { Grid3X3, List, Plus, Search, Users } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { useCommunities } from '@/hooks/useCommunities';
import { createCommunity } from '@/services/community-service';
import { uploadFile } from '@/services/storage-service';

type ViewMode = 'grid' | 'list';

export default function CommunitiesPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const { communities, isLoading, error } = useCommunities(deferredSearchTerm);

  const communityCountLabel = useMemo(() => `${communities.length} ta hamjamiyat`, [communities.length]);

  const handleCreateCommunity = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!profile) {
      setFormError('Hamjamiyat yaratish uchun tizimga kiring.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const baseSlug = slug.trim() || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const nextAvatarUrl = avatarFile ? await uploadFile(`communities/${baseSlug || Date.now()}-avatar`, avatarFile) : avatarUrl;
      const nextCoverUrl = coverFile ? await uploadFile(`communities/${baseSlug || Date.now()}-cover`, coverFile) : coverUrl;

      const community = await createCommunity(
        {
          name,
          slug,
          description,
          avatarUrl: nextAvatarUrl,
          coverUrl: nextCoverUrl,
        },
        profile,
      );

      setName('');
      setSlug('');
      setDescription('');
      setAvatarUrl('');
      setCoverUrl('');
      setAvatarFile(null);
      setCoverFile(null);
      setShowCreateForm(false);
      router.push(`/communities/${community.slug}`);
    } catch (submitError) {
      setFormError(submitError instanceof Error ? submitError.message : 'Hamjamiyat yaratishda xatolik yuz berdi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-vh-100 bg-body-tertiary py-5">
      <div className="container py-5">
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-4 mb-5">
          <div>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2 mb-3">
              Communities
            </span>
            <h1 className="display-6 fw-bold text-dark mb-2">Kitobxonlar hamjamiyatlari</h1>
            <p className="text-secondary mb-0">
              Browse, search, join, va o&apos;zingizning hamjamiyatingizni yarating. Barcha ma&apos;lumotlar Firestore orqali boshqariladi.
            </p>
          </div>
          <div className="d-flex flex-column flex-sm-row gap-3 align-items-stretch">
            <div className="input-group bg-white rounded-pill border border-light-subtle shadow-sm px-2">
              <span className="input-group-text border-0 bg-transparent text-secondary">
                <Search size={18} />
              </span>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="form-control border-0 rounded-pill shadow-none"
                placeholder="Community qidiring..."
              />
            </div>
            <div className="btn-group bg-white rounded-pill border border-light-subtle shadow-sm p-1">
              <button type="button" className={`btn rounded-pill ${viewMode === 'grid' ? 'btn-primary' : 'btn-light'}`} onClick={() => setViewMode('grid')} aria-label="Grid view">
                <Grid3X3 size={16} />
              </button>
              <button type="button" className={`btn rounded-pill ${viewMode === 'list' ? 'btn-primary' : 'btn-light'}`} onClick={() => setViewMode('list')} aria-label="List view">
                <List size={16} />
              </button>
            </div>
            <button type="button" className="btn btn-dark rounded-pill fw-bold px-4" onClick={() => setShowCreateForm((current) => !current)}>
              <Plus size={16} className="me-2" />
              Create
            </button>
          </div>
        </div>

        {showCreateForm ? (
          <div className="card border-0 shadow-sm rounded-5 p-4 p-md-5 mb-4">
            <form onSubmit={handleCreateCommunity} className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold text-dark" htmlFor="community-name">Community name</label>
                <input id="community-name" value={name} onChange={(event) => setName(event.target.value)} className="form-control rounded-4 py-3" required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold text-dark" htmlFor="community-slug">Slug</label>
                <input id="community-slug" value={slug} onChange={(event) => setSlug(event.target.value)} className="form-control rounded-4 py-3" placeholder="auto-generated if empty" />
              </div>
              <div className="col-12">
                <label className="form-label fw-bold text-dark" htmlFor="community-description">Description</label>
                <textarea id="community-description" value={description} onChange={(event) => setDescription(event.target.value)} className="form-control rounded-4 py-3" rows={4} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold text-dark" htmlFor="community-avatar-url">Avatar URL</label>
                <input id="community-avatar-url" value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} className="form-control rounded-4 py-3" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold text-dark" htmlFor="community-cover-url">Cover URL</label>
                <input id="community-cover-url" value={coverUrl} onChange={(event) => setCoverUrl(event.target.value)} className="form-control rounded-4 py-3" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold text-dark" htmlFor="community-avatar-file">Avatar file</label>
                <input id="community-avatar-file" type="file" accept="image/*" onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)} className="form-control rounded-4 py-3" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold text-dark" htmlFor="community-cover-file">Cover file</label>
                <input id="community-cover-file" type="file" accept="image/*" onChange={(event) => setCoverFile(event.target.files?.[0] ?? null)} className="form-control rounded-4 py-3" />
              </div>
              {formError ? <div className="col-12"><p className="text-danger mb-0">{formError}</p></div> : null}
              {!profile ? <div className="col-12"><p className="text-secondary mb-0">Hamjamiyat yaratish uchun avval tizimga kiring.</p></div> : null}
              <div className="col-12 d-flex flex-wrap gap-3">
                <button type="submit" className="btn btn-primary rounded-pill fw-bold px-4" disabled={isSubmitting || !profile}>
                  {isSubmitting ? 'Yaratilmoqda...' : 'Hamjamiyat yaratish'}
                </button>
                <button type="button" className="btn btn-light rounded-pill fw-bold px-4 border border-light-subtle" onClick={() => setShowCreateForm(false)}>
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        ) : null}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <p className="text-secondary mb-0">{communityCountLabel}</p>
          <Link href="/" className="btn btn-link text-decoration-none fw-bold">Bosh sahifa</Link>
        </div>

        {isLoading ? (
          <div className="row g-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="col-12 col-md-6 col-xl-4">
                <div className="card border-0 shadow-sm rounded-5 p-4">
                  <div className="placeholder-glow d-flex flex-column gap-3">
                    <span className="placeholder rounded-4 col-12" style={{ height: '180px' }}></span>
                    <span className="placeholder rounded-4 col-6" style={{ height: '20px' }}></span>
                    <span className="placeholder rounded-4 col-8" style={{ height: '16px' }}></span>
                    <span className="placeholder rounded-4 col-12" style={{ height: '52px' }}></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {!isLoading && error ? <p className="text-danger">{error}</p> : null}

        {!isLoading && !error && communities.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-5 p-5 text-center">
            <Users size={48} className="text-primary mx-auto mb-3" />
            <h2 className="h4 fw-bold text-dark mb-2">Community topilmadi</h2>
            <p className="text-secondary mb-0">Qidiruvni o&apos;zgartiring yoki yangi hamjamiyat yarating.</p>
          </div>
        ) : null}

        {!isLoading && !error ? (
          <div className={viewMode === 'grid' ? 'row g-4' : 'd-flex flex-column gap-3'}>
            {communities.map((community) => (
              <div key={community.id} className={viewMode === 'grid' ? 'col-12 col-md-6 col-xl-4 d-flex align-items-stretch' : ''}>
                <Link
                  href={`/communities/${community.slug}`}
                  className={`card border-0 shadow-sm rounded-5 p-4 text-decoration-none ${viewMode === 'grid' ? 'w-100' : ''}`}
                >
                  {community.coverUrl ? (
                    <div className="rounded-4 overflow-hidden mb-4" style={{ height: viewMode === 'grid' ? '180px' : '220px' }}>
                      <img src={community.coverUrl} alt={community.name} className="w-100 h-100 object-fit-cover" loading="lazy" decoding="async" />
                    </div>
                  ) : null}
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '56px', height: '56px' }}>
                      {community.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="h4 fw-bold text-dark mb-1">{community.name}</h2>
                      <p className="small text-secondary mb-0">/{community.slug}</p>
                    </div>
                  </div>
                  <p className="text-secondary mb-4">{community.description}</p>
                  <div className="d-flex flex-wrap gap-3 small text-secondary mt-auto">
                    <span>{community.memberCount} a&apos;zo</span>
                    <span>{community.postCount} post</span>
                    <span>{community.announcementCount} announcement</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
