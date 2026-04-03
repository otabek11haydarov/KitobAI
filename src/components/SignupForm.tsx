'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

export default function SignupForm({ onSwitchToLogin, onSuccess }: SignupFormProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp, isConfigured, isLoading } = useAuth();

  const isFormValid =
    username.trim() !== '' &&
    email.trim() !== '' &&
    password.trim() !== '' &&
    confirmPassword.trim() !== '' &&
    password === confirmPassword;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isFormValid) return;

    setError(null);

    try {
      await signUp(username.trim(), email.trim(), password);
      onSuccess();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Ro‘yxatdan o‘tishda xatolik yuz berdi.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 w-100 m-0">
      <div className="form-group mb-1">
        <label className="form-label small fw-bold text-secondary mb-1" htmlFor="signup-username">Username</label>
        <input
          id="signup-username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="johndoe"
          className="form-control bg-body-tertiary border border-light-subtle rounded-3 py-2 px-3 small shadow-sm transition-all focus-ring focus-ring-primary"
          autoComplete="nickname"
        />
      </div>

      <div className="form-group mb-1">
        <label className="form-label small fw-bold text-secondary mb-1" htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@example.com"
          className="form-control bg-body-tertiary border border-light-subtle rounded-3 py-2 px-3 small shadow-sm transition-all focus-ring focus-ring-primary"
          autoComplete="email"
        />
      </div>

      <div className="form-group mb-1">
        <label className="form-label small fw-bold text-secondary mb-1" htmlFor="signup-password">Password</label>
        <div className="position-relative">
          <input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="........"
            className="form-control bg-body-tertiary border border-light-subtle rounded-3 py-2 px-3 pe-5 small shadow-sm transition-all focus-ring focus-ring-primary"
            autoComplete="new-password"
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

      <div className="form-group mb-2">
        <label className="form-label small fw-bold text-secondary mb-1" htmlFor="signup-confirm-password">Confirm Password</label>
        <input
          id="signup-confirm-password"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="........"
          className={`form-control bg-body-tertiary rounded-3 py-2 px-3 small shadow-sm transition-all focus-ring focus-ring-primary ${
            password !== confirmPassword && confirmPassword !== ''
              ? 'is-invalid border-danger border'
              : 'border border-light-subtle'
          }`}
          autoComplete="new-password"
        />
      </div>

      {password !== confirmPassword && confirmPassword !== '' && (
        <p className="small text-danger m-0">Parollar mos emas.</p>
      )}
      {error && <p className="small text-danger m-0">{error}</p>}
      {!isConfigured && <p className="small text-secondary m-0">Firebase config bo‘lmaguncha yangi account yaratilmaydi.</p>}

      <button
        type="submit"
        disabled={!isFormValid || isLoading || !isConfigured}
        className="btn btn-primary w-100 rounded-3 py-2 mt-2 d-flex justify-content-center align-items-center gap-2 fw-bold shadow-sm transition-all hover-scale-101 active-scale-95 border-0 bg-gradient"
      >
        {isLoading ? <span className="spinner-border spinner-border-sm" aria-hidden="true"></span> : 'Create account'}
      </button>

      <div className="text-center mt-3 small fw-medium text-secondary">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="btn btn-link btn-sm text-primary p-0 text-decoration-none fw-bold"
        >
          Login
        </button>
      </div>
    </form>
  );
}
