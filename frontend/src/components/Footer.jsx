import React from 'react';
import { Compass, ShieldCheck, Heart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-purple-500/15 bg-[#060310] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Venture<span className="text-purple-400">Lens</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Startup Due Diligence & Investment Intelligence Platform connecting visionary founders with vetted venture capital investors worldwide.
            </p>
            <div className="flex items-center gap-2 text-xs text-purple-300/80">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Enterprise-Grade Due Diligence Security</span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-3">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/investor/startups" className="hover:text-purple-300 transition-colors">Explore Startups</Link></li>
              <li><a href="/#how-it-works" className="hover:text-purple-300 transition-colors">How VentureLens Works</a></li>
              <li><a href="/#features" className="hover:text-purple-300 transition-colors">Pitch Deck Vault</a></li>
              <li><a href="/#founder-section" className="hover:text-purple-300 transition-colors">Founder Direct Meetings</a></li>
            </ul>
          </div>

          {/* User Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-3">Portals</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/login" className="hover:text-purple-300 transition-colors">Founder Sign In</Link></li>
              <li><Link to="/login" className="hover:text-purple-300 transition-colors">Investor Sign In</Link></li>
              <li><Link to="/login" className="hover:text-purple-300 transition-colors">Admin Gateway</Link></li>
              <li><Link to="/signup" className="hover:text-purple-300 transition-colors">Create Platform Account</Link></li>
            </ul>
          </div>

          {/* Compliance & Intelligence */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-3">Intelligence & Security</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Compliant data isolation, encrypted pitch deck storage, and verified startup diligence credentials.
            </p>
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-300">
              <span className="font-semibold text-white">Future Scope:</span> AI-driven investment analysis & financial risk assessment engine (currently in sandbox).
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} VentureLens Intelligence Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Whitepaper</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
