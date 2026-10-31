import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  FileText,
  Compass,
  Bookmark,
  CalendarCheck,
  Shield,
  Users,
  Building,
  BarChart3,
  LogOut,
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const startupLinks = [
    { to: '/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/profile', label: 'Company Profile', icon: User },
    { to: '/dashboard/pitch-deck', label: 'Pitch Deck Vault', icon: FileText },
  ];

  const investorLinks = [
    { to: '/investor', label: 'Investor Overview', icon: LayoutDashboard, end: true },
    { to: '/investor/recommendations', label: 'AI Recommendations', icon: Sparkles, badge: 'AI' },
    { to: '/investor/startups', label: 'Startup Discovery', icon: Compass },
    { to: '/investor/saved', label: 'Bookmarked Startups', icon: Bookmark },
    { to: '/investor/meetings', label: 'Meeting Requests', icon: CalendarCheck },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Overview', icon: Shield, end: true },
    { to: '/admin/startups', label: 'Manage Startups', icon: Building },
    { to: '/admin/investors', label: 'Manage Investors', icon: Users },
    { to: '/admin/meetings', label: 'Meeting Monitoring', icon: CalendarCheck },
    { to: '/admin/analytics', label: 'Platform Analytics', icon: BarChart3 },
  ];

  let links = [];
  let roleTitle = 'Platform User';
  let badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/30';

  if (user.role === 'STARTUP') {
    links = startupLinks;
    roleTitle = 'Startup Founder';
    badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
  } else if (user.role === 'INVESTOR') {
    links = investorLinks;
    roleTitle = 'Venture Investor';
    badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  } else if (user.role === 'ADMIN') {
    links = adminLinks;
    roleTitle = 'Platform Admin';
    badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  }

  return (
    <aside className="w-full md:w-64 bg-[#0d0824]/90 backdrop-blur-xl border-r border-purple-500/15 flex flex-col justify-between shrink-0 md:min-h-[calc(100vh-5rem)]">
      <div className="p-4 space-y-6">
        
        {/* User Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/30 via-indigo-950/20 to-purple-950/40 border border-purple-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/20 transition-all"></div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md">
              {(user.name || user.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-white truncate">{user.name || 'User'}</h4>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeColor}`}>
              {roleTitle}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-purple-300/80">
              <Sparkles className="w-3 h-3 text-purple-400" />
              Verified
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-purple-300/60 mb-2">
            Navigation Menu
          </p>
          <nav className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/20 text-white border border-purple-500/40 shadow-glow'
                        : 'text-slate-400 hover:text-purple-200 hover:bg-white/5 border border-transparent'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-purple-400" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge ? (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse">
                      {link.badge}
                    </span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-purple-500/10 space-y-2">
        <button
          onClick={logout}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Sign Out</span>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
