import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, MapPin, Compass, ShieldCheck, Gauge, LogOut, User as UserIcon, Check, ChevronDown, Bell, Ticket, Building2, Train } from 'lucide-react';

export default function Navbar() {
  const { user, logout, demoLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleRoleSwitch = async (role) => {
    setRoleMenuOpen(false);
    await demoLogin(role);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#283845] text-white border-b border-[#304352] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#FFA649] text-[#283845] flex items-center justify-center shadow-md shadow-black/20 transition-transform group-hover:scale-105 font-bold">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl tracking-tight text-white group-hover:text-[#FFA649] transition-colors">
                  Bharat Transit
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#FFA649] text-[#283845] shadow-xs">
                  Pan-India Live
                </span>
              </div>
              <p className="text-[11px] text-amber-100/70 hidden sm:block font-serif italic">
                Indian Railways • State Roadways • Metro Transit
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/search"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/search') || isActive('/')
                  ? 'bg-[#FFA649] text-[#283845] font-semibold shadow-xs'
                  : 'text-slate-200 hover:text-[#FFA649] hover:bg-white/10'
              }`}
            >
              <Compass className={`w-4 h-4 ${isActive('/search') || isActive('/') ? 'text-[#283845]' : 'text-[#FFA649]'}`} />
              Route Search & ETAs
            </Link>

            <Link
              to="/map"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/map')
                  ? 'bg-[#FFA649] text-[#283845] font-semibold shadow-xs'
                  : 'text-slate-200 hover:text-[#FFA649] hover:bg-white/10'
              }`}
            >
              <MapPin className={`w-4 h-4 ${isActive('/map') ? 'text-[#283845]' : 'text-[#FFA649]'}`} />
              Pan-India Fleet Map
            </Link>

            <Link
              to="/pnr"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/pnr')
                  ? 'bg-[#FFA649] text-[#283845] font-semibold shadow-xs'
                  : 'text-slate-200 hover:text-[#FFA649] hover:bg-white/10'
              }`}
            >
              <Ticket className={`w-4 h-4 ${isActive('/pnr') ? 'text-[#283845]' : 'text-[#FFA649]'}`} />
              PNR & Station Boards
            </Link>

            {/* Driver Portal (SRS 4.5) */}
            {user && (user.role === 'Driver' || user.role === 'Admin') && (
              <Link
                to="/driver"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/driver')
                    ? 'bg-[#FFA649] text-[#283845] font-semibold shadow-xs'
                    : 'text-slate-200 hover:text-[#FFA649] hover:bg-white/10'
                }`}
              >
                <Gauge className={`w-4 h-4 ${isActive('/driver') ? 'text-[#283845]' : 'text-[#FFA649]'}`} />
                Crew Portal
              </Link>
            )}

            {/* Admin Management (SRS 4.6) */}
            {user && user.role === 'Admin' && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/admin')
                    ? 'bg-[#FFA649] text-[#283845] font-semibold shadow-xs'
                    : 'text-slate-200 hover:text-[#FFA649] hover:bg-white/10'
                }`}
              >
                <ShieldCheck className={`w-4 h-4 ${isActive('/admin') ? 'text-[#283845]' : 'text-[#FFA649]'}`} />
                Admin Console
              </Link>
            )}
          </nav>

          {/* Right Action: Demo Role Switcher & User Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Role Switcher Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg border border-slate-600 bg-[#1f2c37] hover:bg-[#18222b] text-white transition shadow-2xs"
                title="Switch demo persona to test SRS roles"
              >
                <span className="w-2 h-2 rounded-full bg-[#FFA649] animate-pulse"></span>
                <span className="font-medium hidden sm:inline text-slate-300">Role:</span>
                <span className="font-semibold text-white">
                  {user ? user.role : 'Guest'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#FFA649]" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-[#c1d2df] shadow-xl py-1.5 z-50 text-sm text-stone-800">
                  <div className="px-3 py-1.5 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-[#283845]">
                    Switch Persona (SRS Roles)
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('Passenger')}
                    className="w-full text-left px-3 py-2 hover:bg-amber-50 flex items-center justify-between text-stone-800"
                  >
                    <div>
                      <div className="font-medium">Commuter (Passenger)</div>
                      <div className="text-xs text-stone-500">Aarav Mehta</div>
                    </div>
                    {user?.role === 'Passenger' && <Check className="w-4 h-4 text-[#FFA649]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('Driver')}
                    className="w-full text-left px-3 py-2 hover:bg-amber-50 flex items-center justify-between text-stone-800"
                  >
                    <div>
                      <div className="font-medium">Driver / Conductor</div>
                      <div className="text-xs text-stone-500">Vikram Singh</div>
                    </div>
                    {user?.role === 'Driver' && <Check className="w-4 h-4 text-[#FFA649]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('Admin')}
                    className="w-full text-left px-3 py-2 hover:bg-amber-50 flex items-center justify-between text-stone-800"
                  >
                    <div>
                      <div className="font-medium">Administrator</div>
                      <div className="text-xs text-stone-500">Chief Admin</div>
                    </div>
                    {user?.role === 'Admin' && <Check className="w-4 h-4 text-[#FFA649]" />}
                  </button>
                </div>
              )}
            </div>

            {/* Auth Actions */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-semibold text-white leading-tight">
                    {user.name || user.email}
                  </span>
                  <span className="text-[10px] text-amber-200/80">
                    {user.email}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="p-2 text-slate-300 hover:text-[#FFA649] hover:bg-white/10 rounded-lg transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 text-xs font-semibold text-[#283845] bg-[#FFA649] hover:bg-[#f08b26] rounded-lg shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-[#304352] bg-[#1f2c37] text-xs font-medium text-slate-300">
        <Link to="/search" className={`px-2 py-1 rounded ${isActive('/search') ? 'text-[#FFA649] font-bold' : ''}`}>
          Search
        </Link>
        <Link to="/map" className={`px-2 py-1 rounded ${isActive('/map') ? 'text-[#FFA649] font-bold' : ''}`}>
          Fleet Map
        </Link>
        <Link to="/pnr" className={`px-2 py-1 rounded ${isActive('/pnr') ? 'text-[#FFA649] font-bold' : ''}`}>
          PNR & Boards
        </Link>
        {user && (user.role === 'Driver' || user.role === 'Admin') && (
          <Link to="/driver" className={`px-2 py-1 rounded ${isActive('/driver') ? 'text-[#FFA649] font-bold' : ''}`}>
            Crew
          </Link>
        )}
        {user && user.role === 'Admin' && (
          <Link to="/admin" className={`px-2 py-1 rounded ${isActive('/admin') ? 'text-[#FFA649] font-bold' : ''}`}>
            Admin
          </Link>
        )}
      </div>
    </header>
  );
}
