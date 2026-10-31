import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Briefcase, 
  FileText, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  BarChart2,
  Lock,
  Layers,
  Search
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="space-y-24 py-10">
      
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-10 pb-16 text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/20 to-pink-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Pill Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold mb-8 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Next-Generation Startup Due Diligence & Investment Intelligence</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight sm:leading-none">
          Where <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-300 bg-clip-text text-transparent">Vision</span> Meets <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Investment</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-8 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          Discover promising startups, connect with visionary investors, and turn innovative ideas into investment opportunities.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/investor/startups"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-purple-200 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5 text-purple-400" />
            <span>Explore Startups</span>
          </Link>
        </div>

        {/* Live Platform Metrics Ticker */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-card">
          <div className="text-center p-3">
            <h4 className="text-2xl sm:text-3xl font-extrabold text-white">\$24.5M+</h4>
            <p className="text-xs text-purple-300/80 font-medium mt-1">Capital Sought</p>
          </div>
          <div className="text-center p-3 border-l border-white/5">
            <h4 className="text-2xl sm:text-3xl font-extrabold text-white">100%</h4>
            <p className="text-xs text-purple-300/80 font-medium mt-1">Verified Founders</p>
          </div>
          <div className="text-center p-3 border-l border-white/5">
            <h4 className="text-2xl sm:text-3xl font-extrabold text-white">&lt; 48 Hrs</h4>
            <p className="text-xs text-purple-300/80 font-medium mt-1">Meeting Response Rate</p>
          </div>
          <div className="text-center p-3 border-l border-white/5">
            <h4 className="text-2xl sm:text-3xl font-extrabold text-white">50 MB</h4>
            <p className="text-xs text-purple-300/80 font-medium mt-1">Pitch Deck Vault</p>
          </div>
        </div>
      </section>

      {/* How VentureLens Works Section */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">Workflow Architecture</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">How VentureLens Works</h3>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            A frictionless due diligence and capital connection workflow built for high-growth tech ecosystems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#170e38] to-[#100929] border border-purple-500/20 relative group hover:border-purple-400/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-lg mb-4 border border-purple-500/30">
              01
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Startup Registration</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Founders register, publish business categories, funding stages, and maintain financial metrics with monthly expense tracking.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#170e38] to-[#100929] border border-purple-500/20 relative group hover:border-purple-400/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-lg mb-4 border border-indigo-500/30">
              02
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Pitch Deck Vault</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload institutional-grade pitch decks in PDF, PPT, or PPTX format up to 50 MB with version replacement and secure streaming.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#170e38] to-[#100929] border border-purple-500/20 relative group hover:border-purple-400/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-600/20 text-teal-400 flex items-center justify-center font-bold text-lg mb-4 border border-teal-500/30">
              03
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Investor Discovery</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Venture capitalists filter companies by industry, funding requirements, revenue traction, and bookmark promising candidates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#170e38] to-[#100929] border border-purple-500/20 relative group hover:border-purple-400/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold text-lg mb-4 border border-amber-500/30">
              04
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Meeting Coordination</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Investors submit direct meeting requests. Founders accept or reject proposals via a dedicated modal with live status synchronization.
            </p>
          </div>

        </div>
      </section>

      {/* Platform Features Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">Platform Capabilities</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Institutional SaaS Intelligence</h3>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            Everything both founders and venture partners require for seamless due diligence and transaction discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-purple-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Pitch Deck Management</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Supports PDF and PowerPoint uploads up to 50MB with instant preview, secure direct downloads, and seamless deck replacement.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-purple-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <BarChart2 className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Financial Overview</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Target funding, annual revenues, monthly burn, and valuation stage displayed clearly without misleading simulated figures.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-purple-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Meeting Request Engine</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Integrated meeting scheduler allowing venture partners to send proposals with founder approval controls and status updates.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-purple-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Role-Based Security</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Three-tier role separation (Founders, Investors, Admins) ensuring strict data isolation and ownership enforcement across all endpoints.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-purple-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Investor Watchlist</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Personalized bookmarked startups list with persistent MySQL storage, enabling investors to track prospects over time.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-purple-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">AI Intelligence Ready</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Architected for future AI pitch deck scanning and risk scoring, adhering to strict assessment integrity guidelines.
            </p>
          </div>

        </div>
      </section>

      {/* Role Split Sections: For Founders & For Investors */}
      <section id="founder-section" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* For Founders */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-purple-950/40 via-purple-900/10 to-indigo-950/30 border border-purple-500/30 shadow-card space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
              <Briefcase className="w-3.5 h-3.5" />
              <span>For Startup Founders</span>
            </div>
            <h3 className="text-3xl font-extrabold text-white">Present Your Company to Leading Capital Allocators</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Manage your company information, upload confidential pitch decks, track investor meeting proposals, and accept term discussions directly from your dedicated founder dashboard.
            </p>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Live profile management with instant dashboard updates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Secure pitch deck storage up to 50MB</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Dedicated modal for reviewing and responding to meeting requests</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                to="/signup?role=startup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-md transition-all"
              >
                <span>Register Your Startup</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* For Investors */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900/20 to-purple-950/30 border border-indigo-500/30 shadow-card space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>For Venture Investors</span>
            </div>
            <h3 className="text-3xl font-extrabold text-white">Discover & Evaluate Pre-Vetted Opportunities</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Search high-traction companies across industry verticals, analyze revenue metrics, inspect confidential pitch decks, bookmark candidates, and initiate meeting inquiries.
            </p>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span>Dynamic filtering by category and funding stage</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span>One-click bookmarking to personal saved startup vault</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span>Direct meeting request dispatch with live founder status tracking</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                to="/signup?role=investor"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all"
              >
                <span>Join as an Investor</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-12 sm:p-16 rounded-3xl bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-purple-900/60 border border-purple-500/30 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-3xl mx-auto space-y-6">
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready to Accelerate Your Investment Intelligence?
            </h3>
            <p className="text-purple-200 text-base sm:text-lg">
              Join founders and venture firms worldwide leveraging VentureLens for institutional due diligence and high-conviction deal flow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-bold text-purple-900 bg-white hover:bg-purple-50 shadow-lg transition-all"
              >
                Sign In to Platform
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
