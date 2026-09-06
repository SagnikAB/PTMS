import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, Key, Mail, AlertCircle, ArrowRight, ShieldCheck, Gauge, User, Sparkles } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both your email address and password');
      return;
    }

    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
    }
  };

  const handleQuickDemo = async (role) => {
    setError('');
    setLoading(true);
    const result = await demoLogin(role);
    setLoading(false);
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-80px)] px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-ivory-300 shadow-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-sienna-500 text-white flex items-center justify-center mx-auto shadow-md shadow-sienna-900/15">
            <Bus className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">
            PTTS Sign In
          </h2>
          <p className="text-xs text-stone-600">
            Access your commuter route search, driver run console, or admin portal.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-sienna-50 border border-sienna-200 text-sienna-900 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-sienna-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
              Work or Personal Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@ptms.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-ivory-300 bg-[#FAF8F5] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-sienna-500/20 focus:border-sienna-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-stone-700 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <Key className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-ivory-300 bg-[#FAF8F5] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-sienna-500/20 focus:border-sienna-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sienna-600 hover:bg-sienna-700 text-white font-semibold text-sm shadow-sm transition disabled:opacity-60"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Sign In Box */}
        <div className="pt-2 border-t border-ivory-200">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stormy-600 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-sienna-500" />
            <span>Instant Demo Sign-In (SRS Personas)</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('Passenger')}
              className="p-2 rounded-lg border border-ivory-300 hover:border-sienna-500 bg-ivory-50 hover:bg-white text-center transition flex flex-col items-center gap-1"
            >
              <User className="w-4 h-4 text-stormy-600" />
              <span className="text-[11px] font-bold text-stone-800 leading-tight">Commuter</span>
              <span className="text-[9px] text-stone-500 font-mono">Aarav</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('Driver')}
              className="p-2 rounded-lg border border-ivory-300 hover:border-sienna-500 bg-ivory-50 hover:bg-white text-center transition flex flex-col items-center gap-1"
            >
              <Gauge className="w-4 h-4 text-sage-600" />
              <span className="text-[11px] font-bold text-stone-800 leading-tight">Driver</span>
              <span className="text-[9px] text-stone-500 font-mono">Vikram</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('Admin')}
              className="p-2 rounded-lg border border-ivory-300 hover:border-sienna-500 bg-ivory-50 hover:bg-white text-center transition flex flex-col items-center gap-1"
            >
              <ShieldCheck className="w-4 h-4 text-sienna-600" />
              <span className="text-[11px] font-bold text-stone-800 leading-tight">Admin</span>
              <span className="text-[9px] text-stone-500 font-mono">Chief</span>
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center text-xs text-stone-600">
          New to the transit system?{' '}
          <Link to="/register" className="font-semibold text-sienna-600 hover:text-sienna-700 underline">
            Register an account
          </Link>
        </div>
      </div>
    </div>
  );
}
