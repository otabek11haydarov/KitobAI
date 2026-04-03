import { notFound } from 'next/navigation';

import { getBookById } from '@/lib/data';

import BookDetailClient from './BookDetailClient';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const book = getBookById(resolvedParams.id);

  if (!book) {
    notFound();
  }

  return <BookDetailClient initialBook={book} />;
}
