import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BetGuruLogo } from './BetGuruLogo';
import { Crown, X, Mail, Lock, User, Phone, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  initialMode?: 'login' | 'register';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ initialMode = 'login', onClose }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim()) {
          setErrorMsg('Please enter your Email address or Mobile Number.');
          setLoading(false);
          return;
        }
        if (!password) {
          setErrorMsg('Please enter your Password.');
          setLoading(false);
          return;
        }
        const res = await login(email, password);
        if (!res.success) {
          setErrorMsg(res.error || 'Login failed. Please check your credentials.');
        } else {
          onClose();
        }
      } else {
        if (!name.trim()) {
          setErrorMsg('Please enter your Full Name.');
          setLoading(false);
          return;
        }
        if (!email.trim() && !phone.trim()) {
          setErrorMsg('Please enter either an Email Address or Mobile Number.');
          setLoading(false);
          return;
        }
        if (!password || password.length < 4) {
          setErrorMsg('Password must be at least 4 characters long.');
          setLoading(false);
          return;
        }

        const res = await register(name, email, phone, password);
        if (!res.success) {
          setErrorMsg(res.error || 'Registration failed. Please try again.');
        } else {
          onClose();
        }
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'user' | 'admin') => {
    setLoading(true);
    setErrorMsg('');
    if (role === 'user') {
      setEmail('user@betguru.com');
      setPassword('123456');
      const res = await login('user@betguru.com', '123456');
      if (res.success) onClose();
      else setErrorMsg(res.error || 'Demo login failed');
    } else {
      setEmail('admin@betguru.com');
      setPassword('admin123');
      const res = await login('admin@betguru.com', 'admin123');
      if (res.success) onClose();
      else setErrorMsg(res.error || 'Demo admin login failed');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-zinc-900 border border-amber-500/40 p-6 sm:p-8 shadow-2xl text-zinc-100">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-amber-400 hover:bg-zinc-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Logo Banner */}
        <div className="flex flex-col items-center justify-center text-center mb-6">
          <BetGuruLogo size="lg" />
          <h2 className="text-xl font-serif font-bold text-zinc-100 mt-3">
            {mode === 'login' ? 'Welcome Back' : 'Create Free Account'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {mode === 'login' ? 'Access your BETGURU wallet & tickets' : 'Get $100 Welcome Bonus upon registration'}
          </p>
        </div>

        {/* Demo Login Quick Buttons */}
        <div className="mb-6 p-3 rounded-2xl bg-zinc-950 border border-amber-500/20 text-center space-y-2">
          <p className="text-[10px] text-zinc-400 font-mono uppercase font-semibold">⚡ One-Click Demo Sign-In</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('user')}
              className="py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all"
            >
              Demo User
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center justify-center gap-1 transition-all"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Super Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase font-mono mb-1">
                Full Name <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrorMsg('');
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-zinc-100 text-xs outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase font-mono mb-1">
              {mode === 'login' ? 'Email or Mobile Number' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder={mode === 'login' ? 'user@betguru.com or 01712345678' : 'user@betguru.com'}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-zinc-100 text-xs outline-none"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase font-mono mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="tel"
                  placeholder="01712345678 or +91 9876543210"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErrorMsg('');
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-zinc-100 text-xs outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase font-mono mb-1">
              Password <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-zinc-100 text-xs outline-none"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 font-mono">
              ⚠️ {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In To Account' : 'Register & Claim $100'}
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="mt-6 text-center text-xs text-zinc-400 border-t border-zinc-800 pt-4">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                }}
                className="text-amber-400 font-bold hover:underline ml-1"
              >
                Register Now
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                }}
                className="text-amber-400 font-bold hover:underline ml-1"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
