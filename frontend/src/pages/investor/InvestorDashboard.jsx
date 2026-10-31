import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { investorApi, startupApi, savedStartupApi, meetingApi } from '../../api/client';
import StatCard from '../../components/StatCard';
import AiDiligenceModal from '../../components/AiDiligenceModal';
import { 
  Building, 
  Bookmark, 
  CalendarCheck, 
  CheckCircle2, 
  Compass, 
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Search,
  Zap,
  Target,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const InvestorDashboard = () => {
  const { user, updateProfile } = useAuth();
  
  const [profile, setProfile] = useState(user?.profile || null);
  const [totalStartupsCount, setTotalStartupsCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [meetingsSentCount, setMeetingsSentCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Diligence Modal state
  const [selectedDiligenceStartup, setSelectedDiligenceStartup] = useState(null);
  const [isDiligenceOpen, setIsDiligenceOpen] = useState(false);

  const fetchDashboardData = async () => {
    if (!user?.userId) return;
    try {
      // 1. Fetch Investor Profile
      const invRes = await investorApi.getById(user.userId);
      setProfile(invRes.data);
      updateProfile(invRes.data);

      // 2. Fetch Total Startups Available
      const startupsRes = await startupApi.getAll();
      setTotalStartupsCount(startupsRes.data?.length || 0);

      // 3. Fetch Saved Startups Count
      const savedRes = await savedStartupApi.getSaved(user.userId);
      setSavedCount(savedRes.data?.length || 0);

      // 4. Fetch Sent Meeting Requests
      const meetingsRes = await meetingApi.getForInvestor(user.userId);
      const allMeetings = meetingsRes.data || [];
      setMeetingsSentCount(allMeetings.length);
      setAcceptedCount(allMeetings.filter((m) => m.status === 'ACCEPTED').length);

      // 5. Fetch Top AI Recommendations
      try {
        const recoRes = await investorApi.getRecommendations(user.userId);
        setRecommendations(recoRes.data || []);
      } catch (recoErr) {
        console.warn('AI Recommendations not yet loaded:', recoErr);
      }

    } catch (err) {
      console.error('Failed to load investor overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.userId]);

  const handleOpenDiligence = (startup) => {
    setSelectedDiligenceStartup(startup);
    setIsDiligenceOpen(true);
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Loading investment intelligence dashboard...</p>
      </div>
    );
  }

  const p = profile || user?.profile || {};

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-900/30 border border-purple-500/30 backdrop-blur-xl shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Venture Intelligence Terminal
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome, {p.investorName || user?.name || 'Investor'}
          </h1>
          <p className="text-sm text-slate-300">
            Representing <span className="font-semibold text-white">{p.firmName || 'Investment Firm'}</span> • Focus:{' '}
            <span className="text-purple-300">{p.interestedCategory || 'Venture Capital'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/investor/startups"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Discover Startups</span>
          </Link>
        </div>
      </div>

      {/* 4 Core Investor Overview Cards (Section 6) */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-4">
          Deal Flow & Portfolio Indicators
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Startups Available"
            value={totalStartupsCount}
            subtitle="Active Diligence Profiles"
            icon={Building}
            color="purple"
          />

          <StatCard
            title="Saved Startups"
            value={savedCount}
            subtitle="Bookmarked in Watchlist"
            icon={Bookmark}
            color="indigo"
          />

          <StatCard
            title="Meeting Requests Sent"
            value={meetingsSentCount}
            subtitle="Direct Founder Inquiries"
            icon={CalendarCheck}
            color="amber"
          />

          <StatCard
            title="Accepted Meeting Requests"
            value={acceptedCount}
            subtitle="Milestone Calls Confirmed"
            icon={CheckCircle2}
            color="emerald"
          />
        </div>
      </div>

      {/* AI Recommendation Spotlight Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#180e38] via-[#12082b] to-[#0a0518] border border-purple-500/30 shadow-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
              <span>AI Investment Intelligence</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Top High-Conviction Matches For You
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Ranked dynamically by thesis alignment with your focus on <span className="text-purple-300 font-bold">{p.interestedCategory || 'all tech sectors'}</span>, capital efficiency, and burn multiples.
            </p>
          </div>

          <Link
            to="/investor/recommendations"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 text-xs font-bold transition-all self-start sm:self-auto shrink-0 group"
          >
            <span>View Full Recommendations ({recommendations.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {recommendations.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            Calculating portfolio matches based on your investment category...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
            {recommendations.slice(0, 3).map((startup) => {
              const score = startup.aiMatchScore || 85;
              const isHigh = score >= 90;
              return (
                <div
                  key={startup.id}
                  className="rounded-2xl p-5 bg-[#0f0926]/90 border border-purple-500/20 hover:border-purple-400/50 backdrop-blur-xl transition-all flex flex-col justify-between group hover:shadow-glow"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="overflow-hidden">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
                          {startup.category} • {startup.fundingStage}
                        </span>
                        <h4 className="text-base font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                          {startup.companyName}
                        </h4>
                      </div>

                      <div className={`px-2.5 py-1 rounded-xl flex items-center gap-1.5 font-black text-xs shrink-0 ${
                        isHigh
                          ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                          : 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border border-purple-500/40'
                      }`}>
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>{score}% Match</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {startup.aiThesisMatch || `${startup.companyName} demonstrates strong trajectory with competitive unit economics.`}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Target Raise</span>
                        <span className="font-bold text-white">
                          ${Number(startup.targetMoney || 0).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Annual Revenue</span>
                        <span className="font-bold text-emerald-400">
                          ${Number(startup.yearlyRevenue || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenDiligence(startup)}
                      className="flex-1 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>Inspect AI Diligence</span>
                    </button>
                    <Link
                      to="/investor/startups"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs transition-all"
                      title="Explore in Discovery"
                    >
                      <Compass className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation Quick Access Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Link
          to="/investor/startups"
          className="p-6 rounded-2xl bg-[#120b2e]/90 border border-purple-500/20 hover:border-purple-400/50 backdrop-blur-xl transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
              Startup Discovery
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore companies across FinTech, AI, HealthTech, and SaaS with pitch deck downloads and instant meeting requests.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-purple-400">
            <span>Explore Discovery</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/investor/saved"
          className="p-6 rounded-2xl bg-[#120b2e]/90 border border-purple-500/20 hover:border-purple-400/50 backdrop-blur-xl transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4">
              <Bookmark className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
              Saved Watchlist
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manage your curated list of promising candidates. Monitor target raises and request founder introductory calls.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-indigo-400">
            <span>View Saved ({savedCount})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/investor/meetings"
          className="p-6 rounded-2xl bg-[#120b2e]/90 border border-purple-500/20 hover:border-purple-400/50 backdrop-blur-xl transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-600/20 text-teal-400 flex items-center justify-center mb-4">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
              Meeting Status Tracker
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track pending, accepted, and archived meeting proposals sent to founders with live status synchronization.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-teal-400">
            <span>Track Meetings ({meetingsSentCount})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

      </div>

      {/* AI Diligence Dossier Modal */}
      <AiDiligenceModal
        isOpen={isDiligenceOpen}
        onClose={() => setIsDiligenceOpen(false)}
        startup={selectedDiligenceStartup}
      />

    </div>
  );
};

export default InvestorDashboard;
