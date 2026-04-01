import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onSuccess: () => void;
}

export default function LoginForm({ onSwitchToSignup, onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 1500);
  };

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 w-100 m-0">
      <div className="form-group mb-1">
        <label className="form-label small fw-bold text-secondary mb-1">Email</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          className="form-control bg-body-tertiary border border-light-subtle rounded-3 py-2 px-3 small shadow-sm transition-all focus-ring focus-ring-primary"
        />
      </div>

      <div className="form-group mb-2">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <label className="form-label small fw-bold text-secondary mb-0">Password</label>
          <button type="button" className="btn btn-link btn-sm text-primary p-0 text-decoration-none small text-opacity-75 hover-opacity-100 fw-bold transition-all">
            Forgot password?
          </button>
        </div>
        <div className="position-relative">
          <input 
            type={showPassword ? "text" : "password"} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="form-control bg-body-tertiary border border-light-subtle rounded-3 py-2 px-3 pe-5 small shadow-sm transition-all focus-ring focus-ring-primary"
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="btn btn-sm text-secondary position-absolute top-50 end-0 translate-middle-y me-2 p-1 border-0"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={!isFormValid || isLoading}
        className="btn btn-primary w-100 rounded-3 py-2 mt-2 d-flex justify-content-center align-items-center gap-2 fw-bold shadow-sm transition-all hover-scale-101 active-scale-95 border-0 bg-gradient"
      >
        {isLoading ? <span className="spinner-border spinner-border-sm" aria-hidden="true"></span> : "Login"}
      </button>

      <div className="text-center mt-3 small fw-medium text-secondary">
        Don't have an account?{' '}
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
