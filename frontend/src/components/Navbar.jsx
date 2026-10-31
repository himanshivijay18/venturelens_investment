import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  Layers, 
  LogIn, 
  UserPlus, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  Briefcase, 
  TrendingUp,
  Sparkles
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'STARTUP') return '/dashboard';
    if (user.role === 'INVESTOR') return '/investor';
    if (user.role === 'ADMIN') return '/admin';
    return '/';
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-purple-500/15 bg-[#080415]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:shadow-purple-500/50 transition-all duration-300">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
                Venture<span className="text-purple-400">Lens</span>
              </span>
              <span className="block text-[10px] tracking-widest uppercase font-semibold text-purple-400/80 -mt-1">
                Due Diligence Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-purple-300 transition-colors">
              Home
            </Link>
            <a href="/#how-it-works" className="text-sm font-medium text-slate-300 hover:text-purple-300 transition-colors">
              How It Works
            </a>
            <a href="/#features" className="text-sm font-medium text-slate-300 hover:text-purple-300 transition-colors">
              Platform Features
            </a>
            <Link to="/investor/startups" className="text-sm font-medium text-slate-300 hover:text-purple-300 transition-colors flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-400" />
              Explore Startups
            </Link>
            {user?.role === 'INVESTOR' && (
              <Link to="/investor/recommendations" className="text-sm font-semibold text-purple-300 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                AI Recommendations
              </Link>
            )}
          </div>

          {/* User Auth Buttons / Profile */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(getDashboardPath())}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-200 hover:bg-purple-600/30 text-sm font-semibold transition-all shadow-sm"
                >
                  {user.role === 'ADMIN' && <ShieldCheck className="w-4 h-4 text-amber-400" />}
                  {user.role === 'INVESTOR' && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                  {user.role === 'STARTUP' && <Briefcase className="w-4 h-4 text-purple-400" />}
                  <span>{user.name || user.email}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-300">
                    {user.role}
                  </span>
                </button>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-xl border border-white/10 hover:border-rose-500/30 bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-300 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/25 transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-purple-500/20 bg-[#0d0822] px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-purple-600/10 hover:text-purple-300"
          >
            Home
          </Link>
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-purple-600/10 hover:text-purple-300"
          >
            How It Works
          </a>
          <a
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-purple-600/10 hover:text-purple-300"
          >
            Features
          </a>
          <Link
            to="/investor/startups"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-purple-300 hover:bg-purple-600/10"
          >
            Explore Startups
          </Link>
          {user?.role === 'INVESTOR' && (
            <Link
              to="/investor/recommendations"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-semibold text-purple-200 bg-purple-500/15"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Recommendations</span>
            </Link>
          )}

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    navigate(getDashboardPath());
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold bg-purple-600/20 text-purple-300"
                >
                  Go to {user.role} Dashboard
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-lg border border-white/10 text-sm font-medium text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-lg bg-purple-600 text-sm font-semibold text-white shadow"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
