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
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur border-b border-[#E4D6C5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-sienna-500 text-ivory-50 flex items-center justify-center shadow-md shadow-sienna-900/15 transition-transform group-hover:scale-105">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl tracking-tight text-[#231E1C]">
                  Bharat Transit
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold px-2 py-0.5 rounded-full bg-sienna-100 text-sienna-800 border border-sienna-200">
                  Pan-India Live
                </span>
              </div>
              <p className="text-[11px] text-stormy-600 hidden sm:block">
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
                  ? 'bg-ivory-200/80 text-sienna-900 font-semibold'
                  : 'text-stormy-700 hover:text-[#231E1C] hover:bg-ivory-100'
              }`}
            >
              <Compass className="w-4 h-4 text-sienna-500" />
              Route Search & ETAs
            </Link>

            <Link
              to="/map"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/map')
                  ? 'bg-ivory-200/80 text-sienna-900 font-semibold'
                  : 'text-stormy-700 hover:text-[#231E1C] hover:bg-ivory-100'
              }`}
            >
              <MapPin className="w-4 h-4 text-sage-600" />
              Pan-India Fleet Map
            </Link>

            <Link
              to="/pnr"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/pnr')
                  ? 'bg-ivory-200/80 text-sienna-900 font-semibold'
                  : 'text-stormy-700 hover:text-[#231E1C] hover:bg-ivory-100'
              }`}
            >
              <Ticket className="w-4 h-4 text-sienna-600" />
              PNR & Station Boards
            </Link>

            {/* Driver Portal (SRS 4.5) */}
            {user && (user.role === 'Driver' || user.role === 'Admin') && (
              <Link
                to="/driver"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/driver')
                    ? 'bg-ivory-200/80 text-sienna-900 font-semibold'
                    : 'text-stormy-700 hover:text-[#231E1C] hover:bg-ivory-100'
                }`}
              >
                <Gauge className="w-4 h-4 text-stormy-600" />
                Crew Portal
              </Link>
            )}

            {/* Admin Management (SRS 4.6) */}
            {user && user.role === 'Admin' && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/admin')
                    ? 'bg-ivory-200/80 text-sienna-900 font-semibold'
                    : 'text-stormy-700 hover:text-[#231E1C] hover:bg-ivory-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-sienna-600" />
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
                className="flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg border border-ivory-300 bg-white hover:bg-ivory-50 text-stone-700 transition shadow-2xs"
                title="Switch demo persona to test SRS roles"
              >
                <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse"></span>
                <span className="font-medium hidden sm:inline text-stone-500">Role:</span>
                <span className="font-semibold text-stone-900">
                  {user ? user.role : 'Guest'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stormy-500" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#FAF8F5] rounded-xl border border-ivory-300 shadow-lg py-1.5 z-50 text-sm">
                  <div className="px-3 py-1.5 border-b border-ivory-200 text-[11px] font-bold uppercase tracking-wider text-stormy-600">
                    Switch Persona (SRS Roles)
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('Passenger')}
                    className="w-full text-left px-3 py-2 hover:bg-ivory-100 flex items-center justify-between text-stone-800"
                  >
                    <div>
                      <div className="font-medium">Commuter (Passenger)</div>
                      <div className="text-xs text-stone-500">Aarav Mehta</div>
                    </div>
                    {user?.role === 'Passenger' && <Check className="w-4 h-4 text-sage-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('Driver')}
                    className="w-full text-left px-3 py-2 hover:bg-ivory-100 flex items-center justify-between text-stone-800"
                  >
                    <div>
                      <div className="font-medium">Driver / Conductor</div>
                      <div className="text-xs text-stone-500">Vikram Singh</div>
                    </div>
                    {user?.role === 'Driver' && <Check className="w-4 h-4 text-sage-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('Admin')}
                    className="w-full text-left px-3 py-2 hover:bg-ivory-100 flex items-center justify-between text-stone-800"
                  >
                    <div>
                      <div className="font-medium">Administrator</div>
                      <div className="text-xs text-stone-500">Chief Admin</div>
                    </div>
                    {user?.role === 'Admin' && <Check className="w-4 h-4 text-sage-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* Auth Actions */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-semibold text-stone-900 leading-tight">
                    {user.name || user.email}
                  </span>
                  <span className="text-[10px] text-stone-500">
                    {user.email}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="p-2 text-stormy-600 hover:text-sienna-600 hover:bg-ivory-100 rounded-lg transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-sienna-500 hover:bg-sienna-600 rounded-lg shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-ivory-200 bg-ivory-50/50 text-xs font-medium text-stone-700">
        <Link to="/search" className={`px-2 py-1 rounded ${isActive('/search') ? 'text-sienna-700 font-bold' : ''}`}>
          Search
        </Link>
        <Link to="/map" className={`px-2 py-1 rounded ${isActive('/map') ? 'text-sienna-700 font-bold' : ''}`}>
          Fleet Map
        </Link>
        <Link to="/pnr" className={`px-2 py-1 rounded ${isActive('/pnr') ? 'text-sienna-700 font-bold' : ''}`}>
          PNR & Boards
        </Link>
        {user && (user.role === 'Driver' || user.role === 'Admin') && (
          <Link to="/driver" className={`px-2 py-1 rounded ${isActive('/driver') ? 'text-sienna-700 font-bold' : ''}`}>
            Crew
          </Link>
        )}
        {user && user.role === 'Admin' && (
          <Link to="/admin" className={`px-2 py-1 rounded ${isActive('/admin') ? 'text-sienna-700 font-bold' : ''}`}>
            Admin
          </Link>
        )}
      </div>
    </header>
  );
}
