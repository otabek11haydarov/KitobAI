import Link from 'next/link';
import { memo } from 'react';
import { ArrowRight, BookOpen, Star } from 'lucide-react';

import { Book } from '@/lib/data';

import BookCoverImage from './BookCoverImage';

type BookCardProps = {
  book: Book;
  compact?: boolean;
};

function BookCardComponent({ book, compact = false }: BookCardProps) {
  return (
    <div className="card w-100 border-0 overflow-hidden shadow-premium hover-scale-101 transition-all d-flex flex-column" style={{ borderRadius: compact ? '1.5rem' : '2rem' }}>
      <div className="position-relative bg-light border-bottom border-light-subtle" style={{ height: compact ? '240px' : '320px', width: '100%', flexShrink: 0 }}>
        <BookCoverImage src={book.image} alt={book.title} title={book.title} className="w-100 h-100" />
        <div className="position-absolute top-0 start-0 p-3 d-flex gap-2 flex-wrap">
          {book.isFeatured ? <span className="badge bg-dark text-white rounded-pill px-3 py-2">Featured</span> : null}
          {book.isTopSeller ? <span className="badge bg-primary text-white rounded-pill px-3 py-2">Top seller</span> : null}
        </div>
      </div>

      <div className="p-4 bg-body d-flex flex-column flex-grow-1">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
          <div>
            <h3 className="h5 fw-bold mb-1 text-dark">{book.title}</h3>
            <p className="small text-secondary mb-0">{book.author}</p>
          </div>
          <div className="d-flex align-items-center gap-1 text-warning small fw-bold">
            <Star size={14} fill="currentColor" />
            {book.rating.toFixed(1)}
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-3">
          {book.categories.slice(0, 2).map((category) => (
            <span key={category} className="badge bg-light text-secondary border border-light-subtle rounded-pill px-3 py-2">
              {category}
            </span>
          ))}
        </div>

        <p
          className="small text-secondary mb-4 flex-grow-1"
          style={{ display: '-webkit-box', WebkitLineClamp: compact ? 2 : 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {book.description}
        </p>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div>
            <p className="fw-black text-primary fs-5 mb-0">{book.price}</p>
            <p className="small text-secondary mb-0">{book.year} · {book.publisher}</p>
          </div>
          <Link href={`/book/${book.id}`} className="btn btn-primary rounded-pill fw-bold px-3 d-inline-flex align-items-center gap-2">
            <BookOpen size={16} />
            <span className="d-none d-sm-inline">Ko'rish</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default memo(BookCardComponent);
