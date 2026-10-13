import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import { api } from '../services/api';

interface LoginPageProps {
  initialIsRegister?: boolean;
  onLoginSuccess: (user: any) => void;
  onClose?: () => void;
  onExploreAsGuest?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialIsRegister = false,
  onLoginSuccess,
  onClose,
  onExploreAsGuest,
}) => {
  const [isRegister, setIsRegister] = useState(initialIsRegister);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('Undergraduate CS Student | Aspiring AI/ML Engineer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsRegister(initialIsRegister);
  }, [initialIsRegister]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          setError('Please provide your full name.');
          setLoading(false);
          return;
        }
        const res = await api.register(name, email, password, headline);
        localStorage.setItem('pathpilot_token', res.token);
        localStorage.setItem('pathpilot_user', JSON.stringify(res.user));
        onLoginSuccess(res.user);
      } else {
        const res = await api.login(email, password);
        localStorage.setItem('pathpilot_token', res.token);
        localStorage.setItem('pathpilot_user', JSON.stringify(res.user));
        onLoginSuccess(res.user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrefill = () => {
    setEmail('alex.morgan@university.edu');
    setPassword('demo123');
    setName('Alex Morgan');
    setIsRegister(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#18191E]/60 backdrop-blur-md flex flex-col justify-center items-center px-4 py-8 overflow-y-auto animate-fadeIn text-[#18191E]">
      <div className="w-full max-w-md relative z-10 space-y-4 my-auto">
        {/* Close Button if opened as modal */}
        {onClose && (
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white text-slate-500 hover:text-black hover:bg-slate-100 transition-colors shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Modal Card with Learnify Clean White Design */}
        <div className="bg-white rounded-3xl p-7 border border-[#E2E8F0] shadow-2xl space-y-5">
          {/* Brand Header */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[#FF5B37] text-white shadow-md shadow-[#FF5B37]/30 mb-1">
              <Compass className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#18191E]">
              Path<span className="text-[#FF5B37]">Pilot</span>
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {isRegister ? 'Create your personal career navigator account' : 'Sign in to access your skills and personalized roadmap'}
            </p>
          </div>

          {/* Form Tabs */}
          <div className="flex p-1 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                !isRegister ? 'bg-[#18191E] text-white shadow-xs' : 'text-slate-500 hover:text-black'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                isRegister ? 'bg-[#18191E] text-white shadow-xs' : 'text-slate-500 hover:text-black'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegister && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#18191E] placeholder-slate-400 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Current Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Junior CS Student"
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#18191E] placeholder-slate-400 focus:outline-none focus:border-slate-400"
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#18191E] placeholder-slate-400 focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#18191E] placeholder-slate-400 focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            {/* Submit Button in Learnify Coral */}
            <button
              type="submit"
              disabled={loading}
              className="btn-coral w-full py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Sample Profile helper */}
          <div className="pt-2 border-t border-[#F1F5F9] text-center space-y-1.5">
            <button
              type="button"
              onClick={handleQuickPrefill}
              className="text-xs text-slate-500 hover:text-[#FF5B37] font-semibold transition-colors"
            >
              Fill sample credentials (alex.morgan@university.edu)
            </button>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Local isolated persistence. Your data remains private.</span>
        </div>
      </div>
    </div>
  );
};
