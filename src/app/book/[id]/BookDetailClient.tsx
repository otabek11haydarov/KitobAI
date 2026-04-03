'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  BookOpen,
  ChevronLeft,
  CreditCard,
  Globe,
  LayoutGrid,
  MessageSquareQuote,
  Send,
  ShoppingCart,
  Sparkles,
  Star,
  Tags,
} from 'lucide-react';

import BookCard from '../../../components/BookCard';
import BookCoverImage from '../../../components/BookCoverImage';
import { Book, getBookPromptSuggestions, getRelatedBooks } from '../../../lib/data';
// import styles from './BookDetailClient.module.css';

export default function BookDetailClient({ initialBook }: { initialBook: Book }) {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState(initialBook.languageOptions[0] || '');
  const [selectedType, setSelectedType] = useState(initialBook.bookTypes[0] || '');
  const [activeImage, setActiveImage] = useState(initialBook.image);
  const relatedBooks = useMemo<Book[]>(() => getRelatedBooks(initialBook.id, 3), [initialBook.id]);
  const promptSuggestions = useMemo<string[]>(() => getBookPromptSuggestions(initialBook), [initialBook]);
  type BookComment = { id: string | number; user: string; date: string; text: string };
  type AlternativeSeller = { id: string | number; linkId: string | number; img: string; store: string; price: string };

  return (
    <main className="min-vh-100 d-flex flex-column bg-body-tertiary text-body" data-bs-theme="light">
      <nav className="fixed-top w-100 bg-white border-bottom border-light-subtle shadow-sm z-3">
        <div className={`container-fluid px-4 py-3 d-flex align-items-center justify-content-between mx-auto ${styles.navContainer}`}>
          <button type="button" onClick={() => router.back()} className="btn btn-light d-flex align-items-center gap-2 border-0 bg-transparent text-secondary hover-text-primary px-0 transition-all">
            <ChevronLeft size={20} />
            <span className="fw-bold">Orqaga qaytish</span>
          </button>
          <Link href={`/ai?book=${initialBook.id}`} className="btn btn-primary rounded-pill fw-bold px-4 d-flex align-items-center gap-2">
            <Sparkles size={16} />
            AI bilan ochish
          </Link>
        </div>
      </nav>

      <section className="container py-5 mt-5">
        <div className="bg-white rounded-5 shadow-sm p-4 p-md-5 mt-4">
          <div className="row g-5">
            <div className="col-lg-5">
              <div className={`position-relative bg-light rounded-5 overflow-hidden mb-3 border border-light-subtle ${styles.mainCover}`}>
                <BookCoverImage src={activeImage} alt={initialBook.title} title={initialBook.title} className="w-100 h-100 object-fit-cover transition-all" />
              </div>
              <div className="d-flex gap-2 overflow-auto">
                {[initialBook.image, ...initialBook.thumbnails].map((thumb, idx) => (
                  <button
                    key={`${thumb}-${idx}`}
                    type="button"
                    className={`rounded-4 overflow-hidden border bg-transparent ${activeImage === thumb ? 'border-primary border-2' : 'border-light-subtle'} hover-scale-105 transition-all ${styles.thumbnailButton}`}
                    onClick={() => setActiveImage(thumb)}
                    aria-label={`Preview ${idx + 1}`}
                  >
                    <BookCoverImage src={thumb} alt={`${initialBook.title} preview ${idx + 1}`} title={initialBook.title} className="w-100 h-100 object-fit-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="col-lg-7 d-flex flex-column">
              <div className="mb-4">
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {initialBook.isTopSeller && <span className="badge bg-success-subtle text-success fs-6 fw-bold px-3 py-2 rounded-pill">Top Seller</span>}
                  {initialBook.isFeatured && <span className="badge bg-primary-subtle text-primary fs-6 fw-bold px-3 py-2 rounded-pill">Featured</span>}
                  {initialBook.categories.map((category: string) => (
                    <span key={category} className="badge bg-light text-secondary border border-light-subtle px-3 py-2 rounded-pill">
                      {category}
                    </span>
                  ))}
                </div>

                <h1 className="display-5 fw-bold text-dark mb-2 tracking-tight">{initialBook.title}</h1>
                <p className="fs-4 text-secondary mb-3">{initialBook.author}</p>

                <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                  <div className="d-flex align-items-center gap-2 text-warning">
                    <Star fill="currentColor" size={18} />
                    <span className="fw-bold text-dark">{initialBook.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-secondary small">{initialBook.reviewsCount} reviews</span>
                  <span className="text-secondary small">{initialBook.pageCount} pages</span>
                  <span className="text-secondary small">{initialBook.year}</span>
                  <span className="text-secondary small">{initialBook.publisher}</span>
                </div>

                <p className="fs-5 text-secondary">{initialBook.description}</p>
              </div>

              <div className="mb-4 p-4 bg-light rounded-5 border border-light-subtle">
                <div className="d-flex align-items-end gap-3 mb-1">
                  <h2 className="fs-1 fw-black text-primary mb-0">{initialBook.price}</h2>
                  {initialBook.originalPrice && (
                    <span className="text-decoration-line-through text-secondary fw-medium fs-5">{initialBook.originalPrice}</span>
                  )}
                </div>
                {initialBook.discount && <span className="badge bg-danger text-white mt-2 rounded-pill px-3 py-2">{initialBook.discount}</span>}
              </div>

              <div className="row g-4 mb-4">
                <div className="col-sm-6">
                  <p className="fw-bold mb-2 text-dark d-flex align-items-center gap-2">
                    <Globe size={18} className="text-secondary" /> Til
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    {initialBook.languageOptions.map((language: string) => (
                      <button
                        key={language}
                        type="button"
                        className={`btn fw-bold py-2 rounded-3 text-capitalize ${selectedLanguage === language ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setSelectedLanguage(language)}
                      >
                        {language}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-sm-6">
                  <p className="fw-bold mb-2 text-dark d-flex align-items-center gap-2">
                    <LayoutGrid size={18} className="text-secondary" /> Format
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    {initialBook.bookTypes.map((type: string) => (
                      <button
                        key={type}
                        type="button"
                        className={`btn fw-bold py-2 rounded-3 text-capitalize ${selectedType === type ? 'btn-dark' : 'btn-outline-secondary'}`}
                        onClick={() => setSelectedType(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <div className="rounded-4 border border-light-subtle bg-body-tertiary p-3 h-100">
                    <p className="small text-secondary mb-1">ISBN</p>
                    <p className="fw-bold text-dark mb-0">{initialBook.isbn13}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="rounded-4 border border-light-subtle bg-body-tertiary p-3 h-100">
                    <p className="small text-secondary mb-1">Publisher</p>
                    <p className="fw-bold text-dark mb-0">{initialBook.publisher}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="rounded-4 border border-light-subtle bg-body-tertiary p-3 h-100">
                    <p className="small text-secondary mb-1">Availability</p>
                    <p className={`fw-bold mb-0 ${initialBook.stock > 0 ? 'text-success' : 'text-danger'}`}>
                      {initialBook.stock > 0 ? `${initialBook.stock} in stock` : 'Out of stock'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-3 mt-auto">
                <button type="button" className="btn btn-light fw-bold py-3 px-4 border border-light-subtle shadow-sm rounded-4 text-dark d-flex align-items-center justify-content-center gap-2 fs-5 flex-grow-1" disabled={initialBook.stock === 0}>
                  <ShoppingCart size={22} /> Savatga qo‘shish
                </button>
                <button type="button" className="btn btn-primary fw-bold py-3 px-4 shadow-sm rounded-4 d-flex align-items-center justify-content-center gap-2 fs-5 flex-grow-1" disabled={initialBook.stock === 0}>
                  <CreditCard size={22} /> Hozir xarid qilish
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-5">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="bg-white rounded-5 shadow-sm p-4 p-md-5 h-100">
              <h2 className="h4 fw-bold mb-4 d-flex align-items-center gap-2">
                <BookOpen className="text-primary" /> About this book
              </h2>
              <p className="text-secondary fs-5 mb-4">{initialBook.longDescription}</p>

              <div className="rounded-4 bg-light border border-light-subtle p-4 mb-4">
                <div className="d-flex align-items-start gap-3">
                  <MessageSquareQuote className="text-primary flex-shrink-0" size={24} />
                  <div>
                    <p className="small text-secondary text-uppercase fw-bold mb-2">Memorable line</p>
                    <p className="mb-0 fs-5 text-dark fw-medium">{initialBook.quote}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="h5 fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <Tags size={18} className="text-primary" /> Topics and tags
                </h3>
                <div className="d-flex flex-wrap gap-2">
                  {initialBook.tags.map((tag: string) => (
                    <span key={tag} className="badge bg-body-tertiary text-body border border-light-subtle rounded-pill px-3 py-2">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-4 border border-light-subtle p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="h5 fw-bold text-dark mb-0">AI helper prompts</h3>
                  <Link href={`/ai?book=${initialBook.id}`} className="small fw-bold text-decoration-none">Open AI</Link>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {promptSuggestions.map((prompt: string) => (
                    <Link
                      key={prompt}
                      href={`/ai?book=${initialBook.id}`}
                      className="btn btn-sm btn-light rounded-pill border border-light-subtle text-secondary"
                    >
                      <Send size={14} className="me-2" />
                      {prompt}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="bg-white rounded-5 shadow-sm p-4 p-md-5 h-100">
              <h2 className="h5 fw-bold mb-4">Reader notes</h2>
              <div className="d-flex flex-column gap-3 mb-4">
                {initialBook.comments.map((comment: BookComment) => (
                  <div key={comment.id} className="rounded-4 bg-light border border-light-subtle p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold text-dark">{comment.user}</span>
                      <span className="small text-secondary">{comment.date}</span>
                    </div>
                    <p className="mb-0 text-secondary">{comment.text}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-4 bg-primary bg-opacity-10 border border-primary-subtle p-4 mb-4">
                <h3 className="h6 fw-bold text-dark mb-2">Discuss with real readers</h3>
                <p className="small text-secondary mb-3">Community post yoki AI discussion ochib, shu kitob bo‘yicha chuqurroq gaplashing.</p>
                <div className="d-flex flex-wrap gap-2">
                  <Link href="/communities" className="btn btn-primary rounded-pill fw-bold px-3">Community</Link>
                  <Link href={`/ai?book=${initialBook.id}`} className="btn btn-light rounded-pill fw-bold px-3 border border-light-subtle">AI chat</Link>
                </div>
              </div>

              <div>
                <h3 className="h5 fw-bold mb-3">Other stores</h3>
                <div className="d-flex flex-column gap-3">
                  {initialBook.alternativeSellers.length > 0 ? (
                    initialBook.alternativeSellers.map((item: AlternativeSeller) => (
                      <Link key={item.id} href={`/book/${item.linkId}`} className="d-flex align-items-center gap-3 p-2 bg-light rounded-4 border border-light-subtle text-decoration-none hover-scale-101">
                        <div className={`rounded-3 overflow-hidden ${styles.sellerImage}`}>
                          <BookCoverImage src={item.img} alt={initialBook.title} title={initialBook.title} className="w-100 h-100 object-fit-cover" />
                        </div>
                        <div className="flex-grow-1">
                          <span className="badge bg-secondary mb-1">{item.store}</span>
                          <h4 className="h6 fw-bold mb-0 text-dark">{initialBook.title}</h4>
                        </div>
                        <div className="pe-2 text-end">
                          <span className="fw-black text-primary d-block">{item.price}</span>
                          <span className="small text-secondary d-inline-flex align-items-center gap-1">
                            Open <ArrowUpRight size={14} />
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-secondary small mb-0">Ushbu kitob hozircha faqat bizning katalogda mavjud.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedBooks.length > 0 && (
        <section className="container pb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 fw-bold text-dark mb-0">Related books</h2>
            <Link href="/books" className="small fw-bold text-decoration-none">Full catalog</Link>
          </div>
          <div className="row g-4">
            {relatedBooks.map((book: Book) => (
              <div key={book.id} className="col-12 col-md-6 col-xl-4 d-flex align-items-stretch">
                <BookCard book={book} compact />
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="py-4 border-top border-light-subtle bg-white mt-auto">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <BookOpen className="text-primary" size={20} />
              <span className="fw-bold">KitobAI</span>
            </div>

            <div className="d-flex gap-4 small fw-medium">
              <Link href="/books" className="text-secondary text-decoration-none transition-all hover-scale-101">Books</Link>
              <Link href="/ai" className="text-secondary text-decoration-none transition-all hover-scale-101">AI</Link>
              <Link href="/communities" className="text-secondary text-decoration-none transition-all hover-scale-101">Community</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
