'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Zap } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';

import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const { isConfigured } = useAuth();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 9999 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="position-absolute top-0 start-0 w-100 h-100 bg-black bg-opacity-75"
            style={{ cursor: 'pointer', backdropFilter: 'blur(8px)' }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="position-relative bg-body rounded-4 shadow-lg overflow-hidden border border-light-subtle d-flex flex-column"
            style={{ width: '100%', maxWidth: '440px', margin: '1rem', zIndex: 10000 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="position-absolute top-0 end-0 m-3 btn btn-sm btn-light bg-body-tertiary rounded-circle p-2 d-flex align-items-center justify-content-center border-0 text-secondary transition-all hover-scale-110"
              style={{ zIndex: 10, width: '32px', height: '32px' }}
              aria-label="Close auth modal"
            >
              <X size={18} />
            </button>

            <div className="p-4 p-md-5 d-flex flex-column">
              <div className="text-center mb-4 mt-2">
                <div className="mx-auto mb-3 bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                  <Zap size={24} className="text-primary" />
                </div>
                <h3 className="fw-black mb-2 tracking-tight">
                  {mode === 'login' ? 'Welcome back' : 'Create an account'}
                </h3>
                <p className="text-secondary small fw-medium mb-0">
                  {mode === 'login'
                    ? 'Enter your details to sign in to your dashboard.'
                    : 'Start your literature journey with KitobAI today.'}
                </p>
                {!isConfigured && (
                  <p className="small text-danger mb-0 mt-3">
                    Firebase sozlanmaguncha auth funksiyalari ishlamaydi. `NEXT_PUBLIC_FIREBASE_*` qiymatlarini kiriting.
                  </p>
                )}
              </div>

              <div className="d-flex bg-body-tertiary p-1 rounded-3 mb-4 mx-auto w-100 shadow-sm border border-light-subtle" style={{ maxWidth: '300px' }}>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`flex-grow-1 btn btn-sm rounded-2 fw-bold transition-all py-1 ${
                    mode === 'login'
                      ? 'bg-body text-body shadow-sm border border-light-subtle pointer-events-none'
                      : 'text-secondary border border-transparent hover-opacity-75'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`flex-grow-1 btn btn-sm rounded-2 fw-bold transition-all py-1 ${
                    mode === 'signup'
                      ? 'bg-body text-body shadow-sm border border-light-subtle pointer-events-none'
                      : 'text-secondary border border-transparent hover-opacity-75'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <div className="w-100">
                <AnimatePresence mode="wait" initial={false}>
                  {mode === 'login' ? (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <LoginForm onSwitchToSignup={() => setMode('signup')} onSuccess={onSuccess} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="signup"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SignupForm onSwitchToLogin={() => setMode('login')} onSuccess={onSuccess} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
