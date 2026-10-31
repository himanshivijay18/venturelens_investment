import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { startupApi, savedStartupApi, meetingApi, pitchDeckApi } from '../../api/client';
import Badge from '../../components/Badge';
import StartupDetailModal from './StartupDetailModal';
import RequestMeetingModal from './RequestMeetingModal';
import AiDiligenceModal from '../../components/AiDiligenceModal';
import { 
  Search, 
  Filter, 
  Bookmark, 
  FileText, 
  Download, 
  CalendarCheck, 
  Check, 
  Building, 
  User, 
  Layers, 
  DollarSign, 
  Target, 
  TrendingDown, 
  Info, 
  Sparkles, 
  ExternalLink,
  Zap,
  ArrowUpDown
} from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'FinTech',
  'Artificial Intelligence',
  'HealthTech',
  'CleanTech',
  'Enterprise SaaS',
  'Cybersecurity',
  'E-Commerce',
  'Robotics',
  'EdTech',
  'Technology'
];

const STAGES = ['All Stages', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Growth'];

const StartupDiscovery = () => {
  const { user, isInvestor } = useAuth();

  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStage, setSelectedStage] = useState('All Stages');
  const [sortBy, setSortBy] = useState('ai_match');

  // Saved startups cache (set of startup IDs)
  const [savedSet, setSavedSet] = useState(new Set());
  // Requested meeting startups cache (set of startup IDs)
  const [requestedSet, setRequestedSet] = useState(new Set());

  // Modals state
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [meetingTargetStartup, setMeetingTargetStartup] = useState(null);
  const [isAiDiligenceOpen, setIsAiDiligenceOpen] = useState(false);
  const [selectedAiStartup, setSelectedAiStartup] = useState(null);

  const fetchDiscoveryData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== 'All Categories') params.category = selectedCategory;
      if (selectedStage !== 'All Stages') params.fundingStage = selectedStage;
      if (user?.userId && isInvestor) params.investorId = user.userId;

      const res = await startupApi.getAll(params);
      let list = res.data || [];

      // Sort
      if (sortBy === 'ai_match') {
        list.sort((a, b) => (b.aiMatchScore || 80) - (a.aiMatchScore || 80));
      } else if (sortBy === 'target_desc') {
        list.sort((a, b) => (b.targetMoney || 0) - (a.targetMoney || 0));
      } else if (sortBy === 'revenue_desc') {
        list.sort((a, b) => (b.yearlyRevenue || 0) - (a.yearlyRevenue || 0));
      } else if (sortBy === 'name_asc') {
        list.sort((a, b) => (a.companyName || '').localeCompare(b.companyName || ''));
      }

      setStartups(list);

      // If signed in as an investor, fetch their saved startups & meeting requests
      if (user?.userId && isInvestor) {
        try {
          const savedRes = await savedStartupApi.getSaved(user.userId);
          const ids = new Set((savedRes.data || []).map((s) => s.id));
          setSavedSet(ids);

          const meetingsRes = await meetingApi.getForInvestor(user.userId);
          const reqIds = new Set(
            (meetingsRes.data || [])
              .filter((m) => m.status === 'PENDING' || m.status === 'ACCEPTED')
              .map((m) => m.startupId)
          );
          setRequestedSet(reqIds);
        } catch (err) {
          console.error('Failed to load investor preferences:', err);
        }
      }
    } catch (err) {
      console.error('Failed to load startups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchDiscoveryData();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [search, selectedCategory, selectedStage, sortBy]);

  const handleOpenAiDiligence = (startup) => {
    setSelectedAiStartup(startup);
    setIsAiDiligenceOpen(true);
  };

  const handleToggleSave = async (startupId) => {
    if (!user || !isInvestor) {
      alert('Please log in as an investor to bookmark startups.');
      return;
    }

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
      console.error('Failed to update bookmark status:', err);
    }
  };

  const handleOpenMeetingModal = (startup) => {
    if (!user || !isInvestor) {
      alert('Please log in as an investor to submit meeting requests.');
      return;
    }
    setMeetingTargetStartup(startup);
    setIsMeetingModalOpen(true);
  };

  const handleMeetingSuccess = (startupId) => {
    setRequestedSet((prev) => new Set(prev).add(startupId));
  };

  const handleOpenDetail = (startup) => {
    setSelectedStartup(startup);
    setIsDetailOpen(true);
  };

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '\$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Startup Discovery & Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Search vetted startups, review financial metrics, inspect pitch decks, and request introductory meetings.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 self-start md:self-center">
          {startups.length} Startups Available
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#120b2e]/90 border border-purple-500/20 backdrop-blur-xl shadow-card grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Search Input */}
        <div className="relative md:col-span-2">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company name or founder..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-white bg-[#0d0824]"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[#110a2d] text-white">
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Stage Filter */}
        <div>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-white bg-[#0d0824]"
          >
            {STAGES.map((s) => (
              <option key={s} value={s} className="bg-[#110a2d] text-white">
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Filter */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-purple-300 font-semibold bg-[#0d0824] border-purple-500/30"
          >
            <option value="ai_match" className="bg-[#110a2d] text-white">
              ⚡ Sort: AI Match Score
            </option>
            <option value="target_desc" className="bg-[#110a2d] text-white">
              Target: High to Low
            </option>
            <option value="revenue_desc" className="bg-[#110a2d] text-white">
              Revenue: High to Low
            </option>
            <option value="name_asc" className="bg-[#110a2d] text-white">
              Company Name (A-Z)
            </option>
          </select>
        </div>
      </div>

      {/* Startup Cards Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Discovering matching startups...</p>
        </div>
      ) : startups.length === 0 ? (
        <div className="py-20 text-center p-8 rounded-3xl bg-[#120b2e]/40 border border-purple-500/10 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/10 text-purple-400 flex items-center justify-center mx-auto">
            <Building className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Matching Startups Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, selecting another category, or resetting funding stage filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedCategory('All Categories');
              setSelectedStage('All Stages');
            }}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600/20 text-purple-300 hover:bg-purple-600/30"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map((s) => {
            const isSaved = savedSet.has(s.id);
            const isRequested = requestedSet.has(s.id);

            return (
              <div
                key={s.id}
                className="p-6 rounded-3xl bg-[#120b2e]/90 border border-purple-500/20 hover:border-purple-400/50 backdrop-blur-xl shadow-card flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group"
              >
                <div>
                  {/* Top Bar: Category, Stage, Bookmark Button */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                        {s.category}
                      </span>
                      <span className="text-slate-600">•</span>
                      <Badge>{s.fundingStage}</Badge>
                      {s.aiMatchScore && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 border ${
                          s.aiMatchScore >= 90
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        }`}>
                          <Zap className="w-2.5 h-2.5 text-amber-400" />
                          <span>{s.aiMatchScore}% Match</span>
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleSave(s.id)}
                      className={`p-2 rounded-xl border transition-all ${
                        isSaved
                          ? 'bg-purple-600/20 border-purple-400 text-purple-300'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-purple-500/30'
                      }`}
                      title={isSaved ? 'Remove from Saved' : 'Save Startup'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-purple-400 text-purple-400' : ''}`} />
                    </button>
                  </div>

                  {/* Company Name & Founder */}
                  <div className="mb-5">
                    <h3 
                      onClick={() => handleOpenDetail(s)}
                      className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors cursor-pointer truncate"
                    >
                      {s.companyName}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>{s.founderName}</span>
                    </p>
                  </div>

                  {/* Financial Metrics Strip (Per Section 6) */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/30 border border-white/5 mb-5 text-center">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-500 block">Target</span>
                      <span className="text-xs font-bold text-white block mt-0.5">
                        {formatCurrency(s.targetMoney)}
                      </span>
                    </div>

                    <div className="border-l border-white/5">
                      <span className="text-[10px] uppercase font-semibold text-slate-500 block">Revenue</span>
                      <span className="text-xs font-bold text-emerald-400 block mt-0.5">
                        {formatCurrency(s.yearlyRevenue)}
                      </span>
                    </div>

                    <div className="border-l border-white/5">
                      <span className="text-[10px] uppercase font-semibold text-slate-500 block">Expenses</span>
                      <span className="text-xs font-bold text-rose-400 block mt-0.5">
                        {formatCurrency(s.monthlyExpenses)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row Actions */}
                <div className="space-y-3 pt-4 border-t border-purple-500/10">
                  <div className="flex items-center justify-between text-xs gap-2">
                    {s.hasPitchDeck ? (
                      <a
                        href={pitchDeckApi.getDownloadUrl(s.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-300 hover:text-purple-200 font-semibold flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Pitch Deck</span>
                      </a>
                    ) : (
                      <span className="text-slate-500 italic text-[11px]">No Deck Attached</span>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenAiDiligence(s)}
                        className="text-purple-300 hover:text-white font-medium flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/30 border border-purple-500/30 transition-all"
                        title="Open AI Due Diligence Dossier"
                      >
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span>AI Diligence</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenDetail(s)}
                        className="text-slate-400 hover:text-white font-medium flex items-center gap-0.5 text-xs px-1.5 py-1"
                      >
                        <span>Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Request Meeting Button */}
                  <button
                    type="button"
                    disabled={isRequested}
                    onClick={() => handleOpenMeetingModal(s)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow ${
                      isRequested
                        ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 cursor-default'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/25'
                    }`}
                  >
                    {isRequested ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Meeting Requested</span>
                      </>
                    ) : (
                      <>
                        <CalendarCheck className="w-3.5 h-3.5" />
                        <span>Request Meeting</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Startup Details Modal */}
      <StartupDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        startup={selectedStartup}
        isSaved={selectedStartup ? savedSet.has(selectedStartup.id) : false}
        isRequested={selectedStartup ? requestedSet.has(selectedStartup.id) : false}
        onToggleSave={handleToggleSave}
        onRequestMeeting={handleOpenMeetingModal}
        onOpenAiDiligence={handleOpenAiDiligence}
      />

      {/* AI Diligence Dossier Modal */}
      <AiDiligenceModal
        isOpen={isAiDiligenceOpen}
        onClose={() => setIsAiDiligenceOpen(false)}
        startup={selectedAiStartup}
      />

      {/* Request Meeting Modal */}
      <RequestMeetingModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        startup={meetingTargetStartup}
        investorId={user?.userId}
        onSuccess={handleMeetingSuccess}
      />

    </div>
  );
};

export default StartupDiscovery;
