import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, User, Mail, Key, Phone, ShieldCheck, Gauge, AlertCircle, ArrowRight } from 'lucide-react';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Passenger',
    phone: '',
    licenseNo: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.role === 'Driver' && !formData.licenseNo.trim()) {
      setError('Driving license number is required for Driver accounts');
      return;
    }

    setLoading(true);
    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.role,
      formData.phone,
      formData.licenseNo
    );
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
            Create PTTS Account
          </h2>
          <p className="text-xs text-stone-600">
            Join the Public Transport Tracking System network.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-sienna-50 border border-sienna-200 text-sienna-900 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-sienna-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="name"
                required
                placeholder="Aarav Mehta"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-ivory-300 bg-[#FAF8F5] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-sienna-500/20 focus:border-sienna-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                placeholder="aarav@ptms.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-ivory-300 bg-[#FAF8F5] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-sienna-500/20 focus:border-sienna-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-ivory-300 bg-[#FAF8F5] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-sienna-500/20 focus:border-sienna-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-ivory-300 bg-[#FAF8F5] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-sienna-500/20 focus:border-sienna-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider">
              Account Role (SRS 2.3 & Table 1)
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg border border-ivory-300 bg-[#FAF8F5] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-sienna-500/20 focus:border-sienna-500"
            >
              <option value="Passenger">Commuter / Passenger (Limited Access)</option>
              <option value="Driver">Driver / Conductor (Medium Access - Start/End Trips)</option>
              <option value="Admin">Administrator (High Access - Fleet Management)</option>
            </select>
          </div>

          {formData.role === 'Driver' && (
            <div className="p-3 bg-ivory-100 rounded-xl space-y-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider">
                  Heavy Vehicle Driving License
                </label>
                <input
                  type="text"
                  name="licenseNo"
                  required
                  placeholder="DL-908234-TR"
                  value={formData.licenseNo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-ivory-300 bg-white text-stone-900 text-sm font-mono uppercase"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider">
                  Mobile Contact Number
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-ivory-300 bg-white text-stone-900 text-sm"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sienna-600 hover:bg-sienna-700 text-white font-semibold text-sm shadow-sm transition disabled:opacity-60"
          >
            <span>{loading ? 'Registering Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-stone-600 border-t border-ivory-200 pt-4">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-sienna-600 hover:text-sienna-700 underline">
            Sign in to existing account
          </Link>
        </div>
      </div>
    </div>
  );
}
