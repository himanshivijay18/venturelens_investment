import React from 'react';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import { pitchDeckApi } from '../../api/client';
import { 
  Building, 
  User, 
  Mail, 
  Tag, 
  Layers, 
  DollarSign, 
  Target, 
  TrendingDown, 
  FileText, 
  Download, 
  Bookmark, 
  CalendarCheck,
  Sparkles,
  ShieldCheck,
  Check,
  Zap,
  ArrowRight
} from 'lucide-react';

const StartupDetailModal = ({
  isOpen,
  onClose,
  startup,
  isSaved,
  isRequested,
  onToggleSave,
  onRequestMeeting,
  onOpenAiDiligence,
}) => {
  if (!startup) return null;

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '\$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const matchScore = startup.aiMatchScore || 85;
  const tier = startup.aiRecommendationTier || 'RECOMMENDED';
  const isHigh = matchScore >= 90;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Startup Diligence Dossier" maxWidth="max-w-2xl">
      <div className="space-y-6">
        
        {/* Header Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-900/30 border border-purple-500/25">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                {startup.category}
              </span>
              <Badge>{startup.fundingStage}</Badge>
            </div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              {startup.companyName}
            </h3>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <span>Founder: <strong className="text-white">{startup.founderName}</strong></span>
              <span>•</span>
              <span className="text-slate-400">{startup.email}</span>
            </p>
          </div>

          {/* Action Buttons: Save & Request Meeting */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onToggleSave(startup.id)}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                isSaved
                  ? 'bg-purple-600/30 border-purple-400 text-purple-200'
                  : 'bg-white/5 border-white/10 hover:border-purple-500/30 text-slate-300'
              }`}
              title={isSaved ? 'Remove from Saved' : 'Save Startup'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-purple-400 text-purple-400' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              type="button"
              disabled={isRequested}
              onClick={() => onRequestMeeting(startup)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow ${
                isRequested
                  ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 cursor-default'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30'
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
                  <span>Request Meeting</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Financial Overview Grid (Per Section 6) */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3">
            Financial & Funding Overview
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Target Funding</span>
              <span className="text-lg font-bold text-white tracking-tight">
                {formatCurrency(startup.targetMoney)}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Yearly Revenue</span>
              <span className="text-lg font-bold text-emerald-400 tracking-tight">
                {formatCurrency(startup.yearlyRevenue)}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Monthly Expenses</span>
              <span className="text-lg font-bold text-rose-400 tracking-tight">
                {formatCurrency(startup.monthlyExpenses)}
              </span>
            </div>
          </div>
        </div>

        {/* Pitch Deck Section */}
        <div className="p-4 rounded-2xl bg-[#140d33] border border-purple-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Institutional Pitch Deck
              </h4>
            </div>
            {startup.hasPitchDeck && (
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Upload
              </span>
            )}
          </div>

          {startup.hasPitchDeck ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-black/30 border border-white/5">
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">
                  {startup.pitchDeckFileName || 'Confidential_Pitch_Deck.pdf'}
                </p>
                <p className="text-[10px] text-slate-400">
                  Ready for investor diligence review • Verified Vault Document
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {onOpenAiDiligence && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAiDiligence(startup);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>View Deck & AI Breakdown</span>
                  </button>
                )}

                <a
                  href={pitchDeckApi.getDownloadUrl(startup.id)}
                  download
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              The founder has not uploaded a public pitch deck yet. You may request one via a meeting proposal.
            </p>
          )}
        </div>

        {/* AI Diligence Badge Section */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-indigo-950/30 to-purple-900/30 border border-purple-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                AI Thesis & Diligence Fit
              </span>
            </div>
            <div className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 ${
              isHigh 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
            }`}>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{matchScore}% Match ({tier})</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {startup.aiThesisMatch || `${startup.companyName} showcases strong traction and capital alignment with institutional venture criteria.`}
          </p>

          {onOpenAiDiligence && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAiDiligence(startup);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Full AI Diligence Report (5 Pillars)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/5 transition-all"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </Modal>
  );
};

export default StartupDetailModal;
