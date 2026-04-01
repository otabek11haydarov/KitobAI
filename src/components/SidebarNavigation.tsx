'use client'

import { 
  MessageSquare, 
  Lightbulb, 
  BookCheck, 
  Settings, 
  Plus, 
  BookOpen
} from 'lucide-react';

type Section = 'chats' | 'planner' | 'finished' | 'settings';

export default function SidebarNavigation({ 
  currentSection, 
  setCurrentSection,
  workspaces,
  onNewChat 
}: { 
  currentSection: Section;
  setCurrentSection: (s: Section) => void;
  workspaces: any[];
  onNewChat: () => void;
}) {
  return (
    <div className="d-flex flex-column h-100 border-end border-light-subtle bg-body overflow-hidden" style={{ width: '300px' }}>
      <div className="p-4">
        <div className="d-flex align-items-center gap-3 mb-5">
          <div className="p-2 bg-primary rounded-3 flex-shrink-0 animate-float shadow-lg shadow-primary-50">
            <BookOpen className="text-white" size={24} />
          </div>
          <span className="h4 fw-black m-0 tracking-tight">Kitob<span className="text-primary font-italic italic">AI</span></span>
        </div>

        <div className="d-flex flex-column gap-2 mb-4">
          <NavItem 
            icon={<MessageSquare size={18} />} 
            label="Chatlar" 
            active={currentSection === 'chats'} 
            onClick={() => setCurrentSection('chats')}
          />
          <NavItem 
            icon={<Lightbulb size={18} />} 
            label="Rejalashtirish" 
            active={currentSection === 'planner'} 
            onClick={() => setCurrentSection('planner')}
          />
          <NavItem 
            icon={<BookCheck size={18} />} 
            label="Tugatilgan" 
            active={currentSection === 'finished'} 
            onClick={() => setCurrentSection('finished')}
          />
        </div>
      </div>

      <div className="flex-grow-1 overflow-y-auto px-4 py-2 scrollbar-hide">
        {currentSection === 'chats' && (
          <div>
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom border-light-subtle pb-2">
              <span className="text-uppercase text-secondary fw-black small tracking-widest">Ish joylari</span>
              <button 
                onClick={onNewChat}
                className="btn btn-sm btn-link text-primary p-0"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <div className="d-flex flex-column gap-1">
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  className="btn btn-light-subtle text-start text-nowrap w-100 p-3 rounded-4 border-0 hover-bg-light transition-all"
                >
                  <p className="fw-bold m-0 small">{ws.bookTitle}</p>
                  <p className="text-secondary m-0" style={{ fontSize: '10px' }}>So'nggi tahlil...</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-top border-light-subtle">
        <NavItem 
          icon={<Settings size={18} />} 
          label="Sozlamalar" 
          active={currentSection === 'settings'} 
          onClick={() => setCurrentSection('settings')}
        />
        <div className="mt-4 p-3 rounded-4 bg-body-tertiary border d-flex align-items-center gap-3">
          <div className="flex-shrink-0 bg-primary-subtle border rounded-pill d-flex align-items-center justify-content-center fw-black text-primary" style={{ width: '40px', height: '40px', fontSize: '12px' }}>
            AZ
          </div>
          <div className="overflow-hidden">
            <p className="fw-bold m-0 small">Azizbek</p>
            <p className="text-secondary m-0" style={{ fontSize: '10px' }}>Professional Reader</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: any; label: string; active: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`btn w-100 d-flex align-items-center gap-3 px-4 py-3 border-0 transition-all fw-bold small text-start rounded-4 ${
        active 
          ? 'btn-primary text-white shadow-lg' 
          : 'text-secondary bg-transparent hover:bg-light'
      }`}
    >
      {icon}
      <span>{label}</span>
      {active && (
        <span className="ms-auto bg-white rounded-circle opacity-50" style={{ width: '4px', height: '4px' }} />
      )}
    </button>
  );
}
