'use client'

import { useState } from 'react';
import { BookMarked, BrainCircuit, Quote, Scale, MessageSquare, ArrowRightLeft, Info, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FinishedBookAnalysis() {
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = (bookName: string) => {
    setSelectedBook(bookName);
    setTimeout(() => {
      setAnalysis({
        title: bookName,
        meaning: "Bu asar - inson irodasi va uning atrofdagi muhitga bo'lgan munosabatining eng cho'qqisidir. U bizni haqiqatning nisbiyligi ustida o'ylashga majbur qiladi.",
        perspectives: ["Eksistensializm", "Ijtimoiy determinizm", "Inson erkinligi muammosi"],
        hiddenMessages: ["Kichik qurbonliklar katta g'alabalarga olib keladi", "Insonning eng katta dushmani - o'zining qo'rquvlaridir"],
        comparisons: ["Jorj Oruellning '1984' asari", "Aldous Huxleyning 'Yangi dunyo' si"],
        insight: "Asar bizga shuni ko'rsatadiki, hatto eng qorong'u zulmatda ham inson o'zida saqlab qolgan kichik bir uchqun (vijdon, sevgi) butun dunyoni o'zgartira oladigan darajada kuchga ega."
      });
    }, 1500);
  };

  return (
    <div className="container py-5 px-4 h-100 overflow-y-auto">
      <div className="row g-5 align-items-center justify-content-between mb-5 bg-dark rounded-5 p-5 text-white shadow-lg overflow-hidden position-relative">
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-to-tr from-primary-subtle via-transparent to-transparent opacity-20 pointer-events-none" />
        <div className="col-lg-6 position-relative z-index-1 text-center text-md-start">
          <h2 className="display-4 fw-black tracking-tighter leading-tight mb-4">O'qilgan kitoblar tahlili</h2>
          <p className="lead text-secondary fw-medium italic mb-5">
            Tugallangan asarlarni shunchaki yopib qo'ymang. Ularning chuqur qatlamlarini biz bilan kashf eting.
          </p>
          <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3">
             {['1984', 'Sapiens', 'Alkimyogar'].map((b) => (
                <button 
                  key={b}
                  onClick={() => handleAnalyze(b)}
                  className={`btn rounded-4 fw-bold px-4 py-3 border shadow-sm transition-all ${
                    selectedBook === b ? 'btn-primary border-primary text-white' : 'btn-outline-secondary text-secondary hover-border-secondary'
                  }`}
                >
                  {b}
                </button>
             ))}
          </div>
        </div>
        
        <div className="col-lg-4 d-none d-lg-flex justify-content-center">
           <div className="bg-dark-subtle rounded-5 border border-dark-subtle p-5 shadow-lg position-relative rotate-3 transition-transform hover-rotate-0" style={{ width: '100%', maxWidth: '280px', height: '380px' }}>
              <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center">
                 <BookMarked className="text-primary mb-4" size={64} />
                 <p className="h5 fw-black text-secondary">Tahlil qilish uchun kitob tanlang</p>
              </div>
              <div className="position-absolute top-0 end-0 m-2 translate-middle-x bg-success rounded-circle border-4 border-dark shadow-lg d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                <CheckCircle className="text-white" size={24} />
              </div>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {analysis && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="row g-4"
          >
            {/* Philosophical Meaning & Insight */}
            <div className="col-lg-8">
               <div className="card h-100 p-5 rounded-5 bg-body border-light-subtle shadow-lg overflow-hidden position-relative group">
                  <div className="p-3 bg-primary-subtle rounded-4 d-inline-block mb-4 shadow-sm border border-primary-subtle animate-float">
                     <BrainCircuit className="text-primary" size={40} />
                  </div>
                  <h3 className="h2 fw-black tracking-tighter mb-4">Falsafiy ma'no</h3>
                  <blockquote className="blockquote fs-4 fw-bold text-body italic mb-5 leading-relaxed pe-lg-5">
                    "{analysis.meaning}"
                  </blockquote>
                  
                  <div className="card p-5 bg-body-tertiary border-light-subtle rounded-5 shadow-sm position-relative overflow-hidden group-hover-scale-101 transition-all">
                    <div className="position-absolute top-0 end-0 p-5 opacity-5 rotate-12 transition-transform duration-500 group-hover-rotate-0">
                       <Quote size={200} />
                    </div>
                    <div className="position-relative z-index-1">
                       <h4 className="small fw-black text-uppercase text-secondary tracking-widest mb-4" style={{ fontSize: '10px' }}>KRITIK TAHLIL</h4>
                       <p className="small fw-medium leading-relaxed italic m-0 pe-5 text-body">{analysis.insight}</p>
                    </div>
                  </div>
               </div>
            </div>

            {/* Perspectives Sidebar */}
            <div className="col-lg-4">
              <div className="card h-100 p-5 rounded-5 bg-body border-light-subtle shadow-lg">
                <div className="mb-5">
                  <h3 className="h4 fw-black d-flex align-items-center gap-3 mb-2">
                    <MessageSquare className="text-primary" size={24} />
                    Perspektivalar
                  </h3>
                  <p className="small text-secondary fw-medium italic mb-0">Har xil nuqtai nazardan qarash.</p>
                </div>

                <div className="d-flex flex-column gap-3">
                  {analysis.perspectives.map((p: string, idx: number) => (
                    <div key={idx} className="card p-4 rounded-4 bg-body-tertiary border-light-subtle shadow-sm transition-all hover-bg-primary-subtle cursor-pointer group">
                       <div className="d-flex align-items-center gap-3">
                          <span className="flex-shrink-0 bg-body rounded-pill border d-flex align-items-center justify-content-center fw-black small text-secondary group-hover-text-primary" style={{ width: '32px', height: '32px', fontSize: '10px' }}>{idx + 1}</span>
                          <p className="fw-bold m-0 small text-body">{p}</p>
                       </div>
                    </div>
                  ))}
                </div>

                <button className="btn btn-dark w-100 rounded-4 py-4 fw-black mt-auto shadow-lg d-flex align-items-center justify-content-center gap-3 text-uppercase small tracking-widest">
                  <Info size={18} /> BARCHA TALQINLAR
                </button>
              </div>
            </div>

            {/* Footer Row Analysis */}
            <div className="col-md-6">
               <AnalysisCard title="Yashirin xabarlar" items={analysis.hiddenMessages} icon={<Quote className="text-primary" size={16} />} />
            </div>
            <div className="col-md-6">
               <AnalysisCard title="Qiyosiy tahlil" items={analysis.comparisons} icon={<ArrowRightLeft className="text-secondary" size={16} />} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AnalysisCard({ title, items, icon }: { title: string; items: string[]; icon: any }) {
  return (
    <div className="card h-100 p-5 rounded-5 bg-body border-light-subtle shadow-lg">
      <h4 className="small fw-black text-uppercase text-secondary tracking-widest mb-5 d-flex align-items-center gap-3" style={{ fontSize: '10px' }}>
        {icon} {title}
      </h4>
      <div className="d-flex flex-column gap-4">
         {items.map((it) => (
           <div key={it} className="d-flex gap-3 align-items-start">
              <div className="flex-shrink-0 bg-primary rounded-circle mt-2 shadow-sm" style={{ width: '6px', height: '6px' }} />
              <p className="fw-black h6 m-0 leading-tight text-body">{it}</p>
           </div>
         ))}
      </div>
    </div>
  );
}
