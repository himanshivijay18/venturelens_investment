import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { savedStartupApi, meetingApi, pitchDeckApi } from '../../api/client';
import Badge from '../../components/Badge';
import ConfirmDialog from '../../components/ConfirmDialog';
import StartupDetailModal from './StartupDetailModal';
import RequestMeetingModal from './RequestMeetingModal';
import AiDiligenceModal from '../../components/AiDiligenceModal';
import { 
  Bookmark, 
  Trash2, 
  CalendarCheck, 
  FileText, 
  Building, 
  User, 
  ExternalLink, 
  Check, 
  ArrowRight, 
  Search,
  Sparkles,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SavedStartups = () => {
  const { user } = useAuth();

  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestedSet, setRequestedSet] = useState(new Set());

  // Confirm delete dialog state
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState('');

  // Modals
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [meetingTargetStartup, setMeetingTargetStartup] = useState(null);
  const [isAiDiligenceOpen, setIsAiDiligenceOpen] = useState(false);
  const [selectedAiStartup, setSelectedAiStartup] = useState(null);

  const fetchSavedStartups = async () => {
    if (!user?.userId) return;
    setLoading(true);
    try {
      const res = await savedStartupApi.getSaved(user.userId);
      setSavedList(res.data || []);

      const meetingsRes = await meetingApi.getForInvestor(user.userId);
      const reqIds = new Set(
        (meetingsRes.data || [])
          .filter((m) => m.status === 'PENDING' || m.status === 'ACCEPTED')
          .map((m) => m.startupId)
      );
      setRequestedSet(reqIds);
    } catch (err) {
      console.error('Failed to load saved startups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedStartups();
  }, [user?.userId]);

  const handleRemoveConfirm = async () => {
    if (!confirmDeleteId || !user?.userId) return;
    try {
      await savedStartupApi.remove(user.userId, confirmDeleteId);
      setSavedList((prev) => prev.filter((s) => s.id !== confirmDeleteId));
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
    }
  };

  const handleOpenDetail = (startup) => {
    setSelectedStartup(startup);
    setIsDetailOpen(true);
  };

  const handleOpenAiDiligence = (startup) => {
    setSelectedAiStartup(startup);
    setIsAiDiligenceOpen(true);
  };

  const handleOpenMeetingModal = (startup) => {
    setMeetingTargetStartup(startup);
    setIsMeetingModalOpen(true);
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

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Bookmarked Startups
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Your private diligence watchlist. Keep track of companies and initiate partner meetings.
          </p>
        </div>
        <Link
          to="/investor/startups"
          className="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-semibold hover:bg-purple-600/30 transition-all flex items-center gap-1.5 self-start sm:self-center"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Discover More Startups</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Loading saved candidates...</p>
        </div>
      ) : savedList.length === 0 ? (
        <div className="py-20 text-center p-8 rounded-3xl bg-[#120b2e]/40 border border-purple-500/10 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/10 text-purple-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Startups Bookmarked Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse active startup profiles in Discovery and click the bookmark button to organize your deal flow here.
          </p>
          <div className="pt-2">
            <Link
              to="/investor/startups"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md transition-all"
            >
              <span>Explore Startup Discovery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedList.map((s) => {
            const isRequested = requestedSet.has(s.id);

            return (
              <div
                key={s.id}
                className="p-6 rounded-3xl bg-[#120b2e]/90 border border-purple-500/20 hover:border-purple-400/50 backdrop-blur-xl shadow-card flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                        {s.category}
                      </span>
                      <Badge>{s.fundingStage}</Badge>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setConfirmDeleteId(s.id);
                        setConfirmDeleteName(s.companyName);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3
                    onClick={() => handleOpenDetail(s)}
                    className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors cursor-pointer truncate mb-1"
                  >
                    {s.companyName}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-4">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{s.founderName}</span>
                  </p>

                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/30 border border-white/5 mb-4 text-center">
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

                <div className="space-y-3 pt-3 border-t border-purple-500/10">
                  <div className="flex items-center justify-between text-xs">
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
                      <span className="text-slate-500 italic text-[11px]">No Pitch Deck</span>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenAiDiligence(s)}
                        className="text-purple-300 hover:text-white font-medium flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/30 border border-purple-500/30 transition-all"
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

                  <button
                    type="button"
                    disabled={isRequested}
                    onClick={() => handleOpenMeetingModal(s)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow ${
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

      {/* Confirmation Dialog before removing saved startup */}
      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleRemoveConfirm}
        title="Remove Saved Startup"
        message={`Are you sure you want to remove "${confirmDeleteName}" from your bookmarked watch list?`}
        confirmText="Remove Bookmark"
      />

      {/* Startup Details Modal */}
      <StartupDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        startup={selectedStartup}
        isSaved={true}
        isRequested={selectedStartup ? requestedSet.has(selectedStartup.id) : false}
        onToggleSave={async (id) => {
          setConfirmDeleteId(id);
          setConfirmDeleteName(selectedStartup?.companyName || '');
          setIsDetailOpen(false);
        }}
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

export default SavedStartups;
