import { getBookById } from '../../../lib/data';
import BookDetailClient from './BookDetailClient';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const book = getBookById(resolvedParams.id);

  if (!book) {
    return (
      <main className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-body-tertiary text-body" data-bs-theme="light">
        <h2 className="display-6 fw-bold mb-3">Kitob topilmadi</h2>
        <a href="/" className="btn btn-primary fw-bold px-4 py-2 rounded-3 shadow-sm hover-scale-105 transition-all">
          Bosh sahifaga qaytish
        </a>
      </main>
    );
  }

  return <BookDetailClient initialBook={book} />;
}
