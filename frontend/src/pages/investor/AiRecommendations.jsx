import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { investorApi, savedStartupApi, meetingApi, pitchDeckApi } from '../../api/client';
import Badge from '../../components/Badge';
import AiDiligenceModal from '../../components/AiDiligenceModal';
import RequestMeetingModal from './RequestMeetingModal';
import { 
  Sparkles, 
  TrendingUp, 
  Bookmark, 
  CalendarCheck, 
  FileText, 
  Check, 
  ArrowRight, 
  Building, 
  User, 
  BrainCircuit, 
  Layers, 
  DollarSign, 
  Target, 
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AiRecommendations = () => {
  const { user } = useAuth();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterTier, setFilterTier] = useState('ALL'); // ALL, HIGH CONVICTION, RECOMMENDED, MODERATE FIT

  // Saved & Requested Sets
  const [savedSet, setSavedSet] = useState(new Set());
  const [requestedSet, setRequestedSet] = useState(new Set());

  // Modals state
  const [diligenceStartupId, setDiligenceStartupId] = useState(null);
  const [meetingTargetStartup, setMeetingTargetStartup] = useState(null);

  const fetchRecommendations = async (isManual = false) => {
    if (!user?.userId) return;
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await investorApi.getRecommendations(user.userId);
      setRecommendations(res.data || []);

      const savedRes = await savedStartupApi.getSaved(user.userId);
      setSavedSet(new Set((savedRes.data || []).map((s) => s.id)));

      const meetingsRes = await meetingApi.getForInvestor(user.userId);
      setRequestedSet(
        new Set(
          (meetingsRes.data || [])
            .filter((m) => m.status === 'PENDING' || m.status === 'ACCEPTED')
            .map((m) => m.startupId)
        )
      );
    } catch (err) {
      console.error('Failed to load AI recommendations:', err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [user?.userId]);

  const handleToggleSave = async (startupId) => {
    const isCurrentlySaved = savedSet.has(startupId);
    try {
      if (isCurrentlySaved) {
        await savedStartupApi.remove(user.userId, startupId);
        setSavedSet((prev) => {
          const next = new Set(prev);
          next.delete(startupId);
          return next;
        });
      } else {
        await savedStartupApi.save(user.userId, startupId);
        setSavedSet((prev) => new Set(prev).add(startupId));
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const handleMeetingSuccess = (startupId) => {
    setRequestedSet((prev) => new Set(prev).add(startupId));
  };

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '\$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredRecs = recommendations.filter((r) => {
    if (filterTier === 'ALL') return true;
    return r.recommendationTier === filterTier;
  });

  const topMatch = recommendations.length > 0 ? recommendations[0] : null;

  return (
    <div className="space-y-8">
      
      {/* Top Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Algorithmic Deal Matchmaker
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            AI-Powered Startup Recommendations
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Personalized deal flow scored in real time against your firm's sector focus, revenue benchmarks, and burn multiples.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchRecommendations(true)}
          disabled={refreshing}
          className="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-semibold hover:bg-purple-600/30 transition-all flex items-center gap-2 self-start md:self-center disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Recalculating...' : 'Recalculate Matches'}</span>
        </button>
      </div>

      {/* Top Match Spotlight Banner */}
      {!loading && topMatch && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900/50 via-indigo-900/40 to-violet-950/60 border border-purple-500/40 shadow-glow relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-extrabold">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>TOP AI MATCH: {topMatch.matchScore}% CONVICTION</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {topMatch.companyName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {topMatch.recommendationHeadline}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-purple-300">
                <span>Vertical: <strong className="text-white">{topMatch.category}</strong></span>
                <span>•</span>
                <span>Stage: <strong className="text-white">{topMatch.fundingStage}</strong></span>
                <span>•</span>
                <span>Revenue: <strong className="text-emerald-400">{formatCurrency(topMatch.yearlyRevenue)}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setDiligenceStartupId(topMatch.startupId)}
                className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
              >
                <BrainCircuit className="w-4 h-4" />
                <span>Inspect AI Diligence</span>
              </button>

              <button
                type="button"
                disabled={requestedSet.has(topMatch.startupId)}
                onClick={() => setMeetingTargetStartup({ id: topMatch.startupId, companyName: topMatch.companyName, category: topMatch.category, founderName: topMatch.founderName, fundingStage: topMatch.fundingStage })}
                className={`px-5 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                  requestedSet.has(topMatch.startupId)
                    ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-300'
                    : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
                }`}
              >
                {requestedSet.has(topMatch.startupId) ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Meeting Requested</span>
                  </>
                ) : (
                  <>
                    <CalendarCheck className="w-4 h-4" />
                    <span>Request Meeting</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conviction Tier Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setFilterTier('ALL')}
          className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
            filterTier === 'ALL'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-[#120b2e]/90 text-slate-400 hover:text-white border border-purple-500/20'
          }`}
        >
          All Recommendations ({recommendations.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterTier('HIGH CONVICTION')}
          className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
            filterTier === 'HIGH CONVICTION'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-[#120b2e]/90 text-slate-400 hover:text-white border border-purple-500/20'
          }`}
        >
          ⚡ High Conviction (90%+)
        </button>

        <button
          type="button"
          onClick={() => setFilterTier('RECOMMENDED')}
          className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
            filterTier === 'RECOMMENDED'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-[#120b2e]/90 text-slate-400 hover:text-white border border-purple-500/20'
          }`}
        >
          Recommended (80-89%)
        </button>

        <button
          type="button"
          onClick={() => setFilterTier('MODERATE FIT')}
          className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
            filterTier === 'MODERATE FIT'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-[#120b2e]/90 text-slate-400 hover:text-white border border-purple-500/20'
          }`}
        >
          Moderate Fit (70-79%)
        </button>
      </div>

      {/* Recommendations Cards Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Synthesizing personalized AI matches...</p>
        </div>
      ) : filteredRecs.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-400 p-8 rounded-3xl bg-[#120b2e]/40 border border-purple-500/10">
          No recommendations match this conviction filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecs.map((r) => {
            const isSaved = savedSet.has(r.startupId);
            const isRequested = requestedSet.has(r.startupId);

            return (
              <div
                key={r.startupId}
                className="p-6 rounded-3xl bg-[#120b2e]/90 border border-purple-500/20 hover:border-purple-400/50 backdrop-blur-xl shadow-card flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
              >
                <div>
                  {/* Top Bar: Match Score & Bookmark */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>{r.matchScore}% Match</span>
                      </span>
                      <Badge>{r.fundingStage}</Badge>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleSave(r.startupId)}
                      className={`p-2 rounded-xl border transition-all ${
                        isSaved
                          ? 'bg-purple-600/20 border-purple-400 text-purple-300'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                      title={isSaved ? 'Remove Bookmark' : 'Bookmark Startup'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-purple-400 text-purple-400' : ''}`} />
                    </button>
                  </div>

                  {/* Company Name & Founder */}
                  <div className="mb-3">
                    <h3 
                      onClick={() => setDiligenceStartupId(r.startupId)}
                      className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors cursor-pointer truncate"
                    >
                      {r.companyName}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <User className="w-3 h-3 text-slate-500" />
                      <span>{r.founderName}</span>
                      <span>•</span>
                      <span className="text-purple-300 font-semibold">{r.category}</span>
                    </p>
                  </div>

                  {/* Recommendation Headline Box */}
                  <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-slate-300 leading-relaxed mb-4">
                    <span className="font-semibold text-white block mb-0.5 text-[11px] uppercase tracking-wider text-purple-400">
                      AI Thesis Verdict
                    </span>
                    <p className="line-clamp-2 text-slate-300">
                      {r.recommendationHeadline}
                    </p>
                  </div>

                  {/* Metrics Strip */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/30 border border-white/5 mb-4 text-center">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Target</span>
                      <span className="text-xs font-bold text-white block mt-0.5">
                        {formatCurrency(r.targetMoney)}
                      </span>
                    </div>
                    <div className="border-l border-white/5">
                      <span className="text-[10px] text-slate-500 uppercase block">Revenue</span>
                      <span className="text-xs font-bold text-emerald-400 block mt-0.5">
                        {formatCurrency(r.yearlyRevenue)}
                      </span>
                    </div>
                    <div className="border-l border-white/5">
                      <span className="text-[10px] text-slate-500 uppercase block">Efficiency</span>
                      <span className="text-xs font-bold text-indigo-300 block mt-0.5">
                        {r.capitalEfficiencyScore}/10
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-3 border-t border-purple-500/10">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDiligenceStartupId(r.startupId)}
                      className="w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-bold border border-purple-500/30 transition-all flex items-center justify-center gap-1.5"
                    >
                      <BrainCircuit className="w-3.5 h-3.5" />
                      <span>AI Diligence</span>
                    </button>

                    <button
                      type="button"
                      disabled={isRequested}
                      onClick={() => setMeetingTargetStartup({ id: r.startupId, companyName: r.companyName, category: r.category, founderName: r.founderName, fundingStage: r.fundingStage })}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow ${
                        isRequested
                          ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 cursor-default'
                          : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/25'
                      }`}
                    >
                      {isRequested ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Requested</span>
                        </>
                      ) : (
                        <>
                          <CalendarCheck className="w-3.5 h-3.5" />
                          <span>Meeting</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* AI Diligence Modal */}
      <AiDiligenceModal
        isOpen={!!diligenceStartupId}
        onClose={() => setDiligenceStartupId(null)}
        startupId={diligenceStartupId}
        investorId={user?.userId}
        isSaved={diligenceStartupId ? savedSet.has(diligenceStartupId) : false}
        isRequested={diligenceStartupId ? requestedSet.has(diligenceStartupId) : false}
        onToggleSave={handleToggleSave}
        onRequestMeeting={(item) => setMeetingTargetStartup({ id: item.startupId, companyName: item.companyName, category: item.category, founderName: item.founderName, fundingStage: item.fundingStage })}
      />

      {/* Request Meeting Modal */}
      <RequestMeetingModal
        isOpen={!!meetingTargetStartup}
        onClose={() => setMeetingTargetStartup(null)}
        startup={meetingTargetStartup}
        investorId={user?.userId}
        onSuccess={handleMeetingSuccess}
      />

    </div>
  );
};

export default AiRecommendations;
