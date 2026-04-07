'use client';

import { useState } from 'react';
import { Send, Mail, MessageCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactForm() {
  const [method, setMethod] = useState<'tg' | 'email'>('tg');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !fullName) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const finalMsg = `Ism: ${fullName}\n\nXabar:\n${message}`;
      const encodedMsg = encodeURIComponent(finalMsg);
      if (method === 'tg') {
        window.open(`https://t.me/iotabek11?text=${encodedMsg}`, '_blank');
      } else {
        window.open(`mailto:nlidernomerr1@gmail.com?subject=KitobAI Aloqa (${fullName})&body=${encodedMsg}`, '_blank');
      }
      
      setIsSubmitting(false);
      setIsSent(true);
      setMessage('');
      setFullName('');
      
      // Reset success state after 3 seconds
      setTimeout(() => setIsSent(false), 3000);
    }, 1000);
  };

  return (
    <div className="w-100 py-4 px-3 px-md-5 rounded-5 shadow-premium bg-white border border-light-subtle overflow-hidden position-relative">
      {/* Background Decorative element */}
      <div className="position-absolute top-0 end-0 p-5 mt-5 me-5 opacity-5 pointer-events-none d-none d-lg-block">
        <Send size={120} className="text-primary" />
      </div>

      <div className="row g-5 align-items-center position-relative">
        <div className="col-lg-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="display-6 fw-bold mb-3 text-dark">Biz bilan <span className="text-primary">bog'laning</span></h2>
            <p className="text-secondary mb-4 fs-5 fw-medium">
              Savollaringiz yoki takliflaringiz bormi? Bizga xabar qoldiring, tez orada javob beramiz.
            </p>
            
            <div className="d-flex flex-column gap-3 mb-4">
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-circle">
                  <MessageCircle size={20} />
                </div>
                <span className="fw-bold">@iotabek11</span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 bg-info bg-opacity-10 text-info rounded-circle">
                  <Mail size={20} />
                </div>
                <span className="fw-bold">nlidernomerr1@gmail.com</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="col-lg-7">
          <AnimatePresence mode="wait">
            {!isSent ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleSubmit}
                className="bg-light p-4 rounded-4 border border-light-subtle shadow-sm"
              >
                <div className="mb-4">
                  <label className="form-label small fw-bold text-secondary mb-3">ALOQA TURINI TANLANG</label>
                  <div className="d-flex gap-3">
                    <button
                      type="button"
                      onClick={() => setMethod('tg')}
                      className={`btn flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-3 rounded-3 transition-all fw-bold ${
                        method === 'tg' 
                          ? 'btn-primary shadow-sm scale-102' 
                          : 'btn-white border-light-subtle text-secondary'
                      }`}
                    >
                      <MessageCircle size={18} /> Telegram
                    </button>
                    <button
                      type="button"
                      onClick={() => setMethod('email')}
                      className={`btn flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-3 rounded-3 transition-all fw-bold ${
                        method === 'email' 
                          ? 'btn-primary shadow-sm scale-102' 
                          : 'btn-white border-light-subtle text-secondary'
                      }`}
                    >
                      <Mail size={18} /> Email
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-secondary mb-2">ISM VA FAMILYANGIZ</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="form-control border-light-subtle rounded-3 p-3 shadow-none focus-border-primary"
                    placeholder="Ismingizni kiriting..."
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-secondary mb-2">XABARINGIZ</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-control border-light-subtle rounded-3 p-3 shadow-none focus-border-primary"
                    placeholder="Xabaringizni shu yerga yozing..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-100 py-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm transition-all hover-scale-101 active-scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner-border spinner-border-sm" role="status"></div>
                      Yuborilmoqda...
                    </>
                  ) : (
                    <>
                      Yuborish <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-success bg-opacity-10 p-5 rounded-4 border border-success border-opacity-25 text-center shadow-sm"
              >
                <div className="text-success mb-3 d-flex justify-content-center">
                  <CheckCircle2 size={64} strokeWidth={2.5} />
                </div>
                <h3 className="fw-bold text-success mb-2">Muvaffaqiyatli!</h3>
                <p className="text-secondary mb-0">Xabaringiz {method === 'tg' ? 'Telegram' : 'Email'} orqali yuborildi.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
