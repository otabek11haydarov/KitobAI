'use client'

import { useState } from 'react';
import { Search, Compass, BookOpen, Layers, BarChart, Plus, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookPlanner() {
  const [query, setQuery] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);
  const [plan, setPlan] = useState<any>(null);

  const handlePlan = () => {
    if (!query.trim()) return;
    setIsPlanning(true);
    setTimeout(() => {
      setPlan({
        title: query,
        reason: "Sizning qiziqishlaringiz va o'qigan kitoblaringiz asosida, bu asar sizga yangi falsafiy ufqlar ochadi.",
        classification: "Intellektual roman",
        themes: ["Erkinlik", "Zamon va makon", "Inson irodasi"],
        characters: ["Winston Smith", "Julia", "O'Brayen"],
        style: "Distopik va chuqur psixologik",
        roadmap: [
          { level: 'Boshlang‘ich', step: 'Muallifning hayoti va davri bilan tanishish' },
          { level: 'O‘rta', step: 'Matndagi simvollar va miflarni tahlil qilish' },
          { level: 'Murakkab', step: 'Zamonaviy jamiyat bilan qiyosiy tahlil' }
        ]
      });
      setIsPlanning(false);
    }, 2000);
  };

  return (
    <div className="container py-5 px-4 h-100 overflow-y-auto">
      <div className="text-center mb-5">
        <div className="d-inline-flex p-4 bg-primary-subtle rounded-5 mb-4 shadow-sm border border-primary-subtle animate-float">
          <Compass className="text-primary" size={48} />
        </div>
        <h2 className="display-4 fw-black tracking-tighter">Aqlli Rejalashtirish</h2>
        <p className="lead text-secondary mx-auto fw-medium italic" style={{ maxWidth: '600px' }}>
          Keyingi o'qimoqchi bo'lgan kitobingizni tanlang yoki shunchaki qiziqishlaringizni yozing.
        </p>
      </div>

      <div className="position-relative mb-5" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="position-absolute inset-0 bg-primary opacity-10 blur-[100px] rounded-pill pointer-events-none transition-opacity" />
        <div className="input-group p-3 bg-body border border-light-subtle rounded-5 shadow-lg position-relative z-index-1">
          <Search className="position-absolute top-50 start-0 translate-middle-y ms-4 text-secondary opacity-50" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kitob nomi, janr yoki qahramon turi..."
            className="form-control border-0 bg-transparent py-4 px-5 fs-5 shadow-none ps-5"
          />
          <button 
            onClick={handlePlan}
            disabled={isPlanning}
            className="btn btn-primary px-5 rounded-4 fw-black shadow-lg shadow-primary-50 d-flex align-items-center gap-2 hover-scale-105 active-scale-95 transition-all ms-2"
          >
            {isPlanning ? (
              <span className="d-flex gap-1 align-items-center">
                <span className="bg-white rounded-circle animate-bounce" style={{ width: '6px', height: '6px', animationDelay: '0ms' }} />
                <span className="bg-white rounded-circle animate-bounce" style={{ width: '6px', height: '6px', animationDelay: '150ms' }} />
                <span className="bg-white rounded-circle animate-bounce" style={{ width: '6px', height: '6px', animationDelay: '300ms' }} />
              </span>
            ) : (
              <>
                <span>REJA TUZISH</span>
                <Plus size={20} />
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {plan && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="row g-4"
          >
            {/* Header / Info */}
            <div className="col-12">
               <div className="card border-0 bg-primary rounded-5 p-5 text-white shadow-lg overflow-hidden position-relative">
                  <div className="position-absolute top-0 end-0 p-5 opacity-10">
                    <BookOpen size={200} />
                  </div>
                  <div className="position-relative z-index-1 d-flex flex-column flex-md-row align-items-center gap-5">
                     <div className="flex-shrink-0 bg-white-20 backdrop-blur-3xl rounded-4 border border-white-30 d-flex align-items-center justify-content-center fw-black display-4 text-center p-5 shadow-lg" style={{ width: '200px', height: '300px' }}>
                       {plan.title[0]}
                     </div>
                     <div className="flex-grow-1">
                       <span className="badge rounded-pill bg-white-20 text-white border border-white-30 px-3 py-2 text-uppercase fw-black tracking-widest mb-3" style={{ fontSize: '10px' }}>{plan.classification}</span>
                       <h3 className="display-4 fw-black tracking-tighter leading-tight mb-4">{plan.title}</h3>
                       <p className="lead fw-medium mb-0 opacity-80 pe-lg-5 italic">
                         "{plan.reason}"
                       </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Analysis Grid */}
            <div className="col-lg-5">
              <div className="d-flex flex-column gap-4">
                <AnalysisSection title="Asosiy Mavzular" items={plan.themes} icon={<Layers size={20} className="text-primary" />} />
                <AnalysisSection title="Bosh Qahramonlar" items={plan.characters} icon={<BarChart size={20} className="text-secondary" />} />
                <div className="card p-4 rounded-5 bg-body-tertiary border-light-subtle shadow-sm">
                   <div className="d-flex align-items-center gap-2 mb-3 text-secondary opacity-50 text-uppercase fw-black small tracking-widest" style={{ fontSize: '10px' }}>
                      <Search size={14} /> HIKOYALASH USLUBI
                   </div>
                   <p className="h4 fw-black m-0 tracking-tight">{plan.style}</p>
                </div>
              </div>
            </div>

            {/* Roadmap */}
            <div className="col-lg-7">
               <div className="card bg-body p-5 rounded-5 border-light-subtle shadow-lg h-100 position-relative">
                  <h3 className="h3 fw-black d-flex align-items-center gap-3 mb-5">
                    <Compass className="text-primary" size={28} />
                    Yo'l Xaritasi
                  </h3>
                  <div className="position-relative">
                    <div className="position-absolute start-0 top-0 bottom-0 ms-4 bg-primary-subtle border-start border-primary border-2 z-index-0" style={{ left: '16px' }} />
                    <div className="d-flex flex-column gap-5 position-relative z-index-1">
                      {plan.roadmap.map((item: any, idx: number) => (
                        <div key={idx} className="d-flex gap-4 group">
                          <div className={`flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle border-4 border-body shadow-lg z-index-1 transition-all ${
                            idx === 0 ? 'bg-primary text-white' : 'bg-body-secondary text-secondary group-hover-bg-primary-subtle group-hover-text-primary'
                          }`} style={{ width: '48px', height: '48px' }}>
                            <CheckCircle2 size={24} />
                          </div>
                          <div>
                            <p className="small fw-black text-uppercase text-primary tracking-widest mb-1" style={{ fontSize: '11px' }}>{item.level}</p>
                            <h4 className="fw-black h5 m-0 text-body">{item.step}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AnalysisSection({ title, items, icon }: { title: string; items: string[]; icon: any }) {
  return (
    <div className="card p-5 rounded-5 bg-body border-light-subtle shadow-sm">
      <div className="d-flex align-items-center gap-2 mb-4 text-secondary opacity-50 text-uppercase fw-black small tracking-widest" style={{ fontSize: '10px' }}>
         {icon} {title}
      </div>
      <div className="d-flex flex-wrap gap-2 mt-auto">
        {items.map((it) => (
          <span key={it} className="badge rounded-pill bg-body-tertiary text-body border border-light-subtle px-3 py-2 small fw-bold shadow-sm">
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
