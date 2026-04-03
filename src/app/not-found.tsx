import Link from 'next/link';
import { Compass, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-vh-100 d-flex align-items-center justify-content-center bg-body-tertiary px-3">
      <div className="card border-0 shadow-sm rounded-5 p-4 p-md-5 text-center" style={{ maxWidth: '620px' }}>
        <div className="d-flex justify-content-center gap-3 mb-4">
          <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
            <Compass size={28} />
          </div>
          <div className="bg-light text-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
            <Search size={28} />
          </div>
        </div>
        <h1 className="display-6 fw-bold text-dark mb-3">Bu sahifa topilmadi</h1>
        <p className="text-secondary mb-4">
          Ehtimol havola eskirgan, sahifa ko‘chirilgan yoki URL noto‘g‘ri kiritilgan. Catalog, AI, yoki community sahifalaridan davom eting.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link href="/" className="btn btn-primary rounded-pill fw-bold px-4">Bosh sahifa</Link>
          <Link href="/books" className="btn btn-light rounded-pill fw-bold px-4 border border-light-subtle">Books</Link>
          <Link href="/ai" className="btn btn-light rounded-pill fw-bold px-4 border border-light-subtle">AI</Link>
        </div>
      </div>
    </main>
  );
}
