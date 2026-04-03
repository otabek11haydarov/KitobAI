'use client';

import Link from 'next/link';
import { useDeferredValue, useMemo, useState } from 'react';
import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react';

import BookCard from '@/components/BookCard';
import BookCoverImage from '@/components/BookCoverImage';
import { bookCategories, BookSort, getFeaturedBooks, getNewArrivalBooks, searchBooks } from '@/lib/data';

const sortOptions: { value: BookSort; label: string }[] = [
  { value: 'popular', label: 'Most popular' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'title', label: 'A-Z' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
];

export default function BooksPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState<BookSort>('popular');
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(() => searchBooks(deferredQuery, category, sort), [category, deferredQuery, sort]);
  const featured = getFeaturedBooks(3);
  const newArrivals = getNewArrivalBooks(3);

  return (
    <main className="min-vh-100 bg-body-tertiary py-5">
      <div className="container py-5">
        <div className="card border-0 shadow-sm rounded-5 p-4 p-md-5 mb-4 overflow-hidden position-relative">
          <div className="position-absolute top-0 end-0 translate-middle-y opacity-10">
            <SlidersHorizontal size={220} />
          </div>
          <div className="position-relative">
            <div className="d-flex flex-wrap justify-content-between gap-3 align-items-start mb-4">
              <div>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2 mb-3">
                  Books
                </span>
                <h1 className="display-6 fw-bold text-dark mb-2">Premium book discovery</h1>
                <p className="text-secondary mb-0">
                  Real metadata, real covers, strong filtering, and better browsing for readers who know what they want and for readers who need inspiration.
                </p>
              </div>
              <Link href="/" className="btn btn-link fw-bold text-decoration-none px-0">
                Bosh sahifa
              </Link>
            </div>

            <div className="row g-3">
              <div className="col-lg-6">
                <div className="input-group bg-white rounded-pill border border-light-subtle shadow-sm px-2">
                  <span className="input-group-text bg-transparent border-0 text-secondary">
                    <Search size={18} />
                  </span>
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="form-control border-0 shadow-none rounded-pill"
                    placeholder="Kitob, muallif yoki mavzu qidiring..."
                  />
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <select value={category} onChange={(event) => setCategory(event.target.value)} className="form-select rounded-pill py-3 shadow-sm border-light-subtle">
                  <option value="All">All categories</option>
                  {bookCategories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-sm-6 col-lg-3">
                <select value={sort} onChange={(event) => setSort(event.target.value as BookSort)} className="form-select rounded-pill py-3 shadow-sm border-light-subtle">
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {!query && (
          <div className="row g-4 mb-4">
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm rounded-5 p-4 p-md-5 h-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h4 fw-bold text-dark mb-0">Featured now</h2>
                  <span className="small text-secondary">Editor picks</span>
                </div>
                <div className="row g-4">
                  {featured.map((book) => (
                    <div key={book.id} className="col-md-4 d-flex align-items-stretch">
                      <BookCard book={book} compact />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm rounded-5 p-4 p-md-5 h-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h4 fw-bold text-dark mb-0">New arrivals</h2>
                  <span className="small text-secondary">Fresh energy</span>
                </div>
                <div className="d-flex flex-column gap-3">
                  {newArrivals.map((book) => (
                    <Link key={book.id} href={`/book/${book.id}`} className="text-decoration-none rounded-4 border border-light-subtle bg-light p-3 d-flex align-items-center gap-3 hover-scale-101">
                      <div style={{ width: '56px', height: '76px', flexShrink: 0 }}>
                        <BookCoverImage src={book.image} alt={book.title} title={book.title} className="w-100 h-100 rounded-3 object-fit-cover" />
                      </div>
                      <div className="flex-grow-1">
                        <h3 className="h6 fw-bold text-dark mb-1">{book.title}</h3>
                        <p className="small text-secondary mb-1">{book.author}</p>
                        <span className="small text-primary fw-bold">{book.price}</span>
                      </div>
                      <ArrowRight size={16} className="text-secondary" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h4 fw-bold text-dark mb-0">Catalog</h2>
          <span className="small text-secondary">{results.length} results</span>
        </div>

        {results.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-5 p-5 text-center">
            <h3 className="h4 fw-bold text-dark mb-2">No books found</h3>
            <p className="text-secondary mb-4">Try a different keyword, category, or sort option.</p>
            <button
              type="button"
              className="btn btn-primary rounded-pill fw-bold px-4 align-self-center"
              onClick={() => {
                setQuery('');
                setCategory('All');
                setSort('popular');
              }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {results.map((book) => (
              <div key={book.id} className="col-12 col-md-6 col-xl-4 d-flex align-items-stretch">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
