'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';
import { memo, useMemo, useState } from 'react';

type BookCoverImageProps = {
  src: string;
  alt: string;
  title: string;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
};

function initials(title: string) {
  return title
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function BookCoverImageComponent({ src, alt, title, className, style, sizes }: BookCoverImageProps) {
  const [hasError, setHasError] = useState(false);
  const fallbackLabel = useMemo(() => initials(title) || 'BK', [title]);

  if (!src || hasError) {
    return (
      <div
        className={`position-relative overflow-hidden d-flex align-items-center justify-content-center text-white fw-bold ${className ?? ''}`}
        style={{
          background: 'linear-gradient(135deg, #1d4ed8 0%, #0f172a 100%)',
          ...style,
        }}
        aria-label={alt}
      >
        <span style={{ letterSpacing: '0.12em' }}>{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <div className={`position-relative overflow-hidden ${className ?? ''}`} style={style}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'}
        className="object-fit-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default memo(BookCoverImageComponent);
