import Link from 'next/link';
import { Megaphone, MessageSquare, ShieldCheck, Users } from 'lucide-react';

const highlights = [
  {
    title: 'Join focused reader circles',
    description: 'Find communities around genres, study goals, and reading styles without extra clutter.',
    icon: Users,
    accent: 'primary',
  },
  {
    title: 'Announcements and discussions',
    description: 'Pinned updates, discussion posts, and comment threads stay organized for better reading conversations.',
    icon: Megaphone,
    accent: 'success',
  },
  {
    title: 'Role-aware moderation',
    description: 'Owners and admins can manage content and keep community spaces useful for real members.',
    icon: ShieldCheck,
    accent: 'warning',
  },
];

export default function CommunityShowcase() {
  return (
    <div className="card p-4 p-md-5 border-light-subtle rounded-5 shadow-sm h-100 bg-white">
      <div className="d-flex flex-column gap-4 h-100">
        <div className="d-flex align-items-center justify-content-between gap-3">
          <div>
            <h3 className="fw-bold mb-1 text-dark">Community highlights</h3>
            <p className="text-secondary mb-0">Fast preview on the homepage, full live experience on the community route.</p>
          </div>
          <Link href="/communities" className="btn btn-outline-primary rounded-pill fw-bold px-3">
            Browse all
          </Link>
        </div>

        <div className="d-flex flex-column gap-3">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="card p-4 rounded-4 border-light-subtle shadow-sm transition-all hover-scale-101">
                <div className="d-flex align-items-start gap-3">
                  <div className={`bg-${item.accent} bg-opacity-10 text-${item.accent} rounded-circle d-flex align-items-center justify-content-center flex-shrink-0`} style={{ width: '48px', height: '48px' }}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-grow-1">
                    <h4 className="h5 fw-bold text-dark mb-1">{item.title}</h4>
                    <p className="small text-secondary mb-0">{item.description}</p>
                  </div>
                  <MessageSquare size={18} className="text-secondary flex-shrink-0 mt-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
