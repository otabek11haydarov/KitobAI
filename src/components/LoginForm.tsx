'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onSuccess: () => void;
}

export default function LoginForm({ onSwitchToSignup, onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const { signIn, resetPassword, isConfigured, isLoading } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) return;

    setError(null);
    setResetMessage(null);

    try {
      await signIn(email.trim(), password);
      onSuccess();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Kirishda xatolik yuz berdi.');
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError('Parolni tiklash uchun email kiriting.');
      return;
    }

    setError(null);
    setResetMessage(null);

    try {
      await resetPassword(email.trim());
      setResetMessage('Parolni tiklash havolasi emailingizga yuborildi.');
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'Parolni tiklashda xatolik yuz berdi.');
    }
  };

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 w-100 m-0">
      <div className="form-group mb-1">
        <label className="form-label small fw-bold text-secondary mb-1" htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@example.com"
          className="form-control bg-body-tertiary border border-light-subtle rounded-3 py-2 px-3 small shadow-sm transition-all focus-ring focus-ring-primary"
          autoComplete="email"
        />
      </div>

      <div className="form-group mb-2">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <label className="form-label small fw-bold text-secondary mb-0" htmlFor="login-password">Password</label>
          <button
            type="button"
            className="btn btn-link btn-sm text-primary p-0 text-decoration-none small text-opacity-75 hover-opacity-100 fw-bold transition-all"
            onClick={handleResetPassword}
          >
            Forgot password?
          </button>
        </div>
        <div className="position-relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="........"
            className="form-control bg-body-tertiary border border-light-subtle rounded-3 py-2 px-3 pe-5 small shadow-sm transition-all focus-ring focus-ring-primary"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="btn btn-sm text-secondary position-absolute top-50 end-0 translate-middle-y me-2 p-1 border-0"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {error && <p className="small text-danger m-0">{error}</p>}
      {resetMessage && <p className="small text-success m-0">{resetMessage}</p>}
      {!isConfigured && <p className="small text-secondary m-0">Firebase config bo‘lmaguncha login ishlamaydi.</p>}

      <button
        type="submit"
        disabled={!isFormValid || isLoading || !isConfigured}
        className="btn btn-primary w-100 rounded-3 py-2 mt-2 d-flex justify-content-center align-items-center gap-2 fw-bold shadow-sm transition-all hover-scale-101 active-scale-95 border-0 bg-gradient"
      >
        {isLoading ? <span className="spinner-border spinner-border-sm" aria-hidden="true"></span> : 'Login'}
      </button>

      <div className="text-center mt-3 small fw-medium text-secondary">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="btn btn-link btn-sm text-primary p-0 text-decoration-none fw-bold"
        >
          Sign Up
        </button>
      </div>
    </form>
  );
}
