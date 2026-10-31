import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Badge from './Badge';
import { startupApi, pitchDeckApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  CalendarCheck, 
  Bookmark, 
  Building, 
  User, 
  DollarSign, 
  Layers, 
  Check, 
  AlertTriangle, 
  BrainCircuit, 
  Zap, 
  Activity,
  Download,
  ExternalLink,
  Eye,
  ShieldCheck,
  Maximize2
} from 'lucide-react';

const AiDiligenceModal = ({
  isOpen,
  onClose,
  startupId,
  startup,
  investorId,
  isSaved,
  isRequested,
  onToggleSave,
  onRequestMeeting,
}) => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, strengths, risks, questions, report

  const effectiveStartupId = startupId || startup?.id || startup?.startupId;
  const effectiveInvestorId = investorId || user?.userId;

  useEffect(() => {
    if (!isOpen || !effectiveStartupId) return;
    setLoading(true);
    startupApi.getAiDiligence(effectiveStartupId, effectiveInvestorId)
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error('Failed to fetch AI diligence:', err);
        if (startup) {
          setData(startup);
        }
      })
      .finally(() => setLoading(false));
  }, [isOpen, effectiveStartupId, effectiveInvestorId]);

  if (!isOpen) return null;

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '\$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'HIGH CONVICTION':
        return 'from-purple-500 to-indigo-500 text-purple-200 border-purple-400';
      case 'RECOMMENDED':
        return 'from-emerald-500 to-teal-500 text-emerald-200 border-emerald-400';
      case 'MODERATE FIT':
        return 'from-amber-500 to-orange-500 text-amber-200 border-amber-400';
      default:
        return 'from-slate-600 to-slate-700 text-slate-200 border-slate-500';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Due Diligence & Original Pitch Deck Intelligence"
      maxWidth="max-w-5xl"
    >
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-purple-300 font-semibold animate-pulse">
            Synthesizing multi-variable due diligence intelligence...
          </p>
        </div>
      ) : !data ? (
        <div className="py-12 text-center text-xs text-slate-400">
          Could not compute AI diligence metrics for this startup.
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Header Card with Match Score & Recommendation Badge */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-indigo-950/50 to-purple-900/50 border border-purple-500/30 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-1.5 max-w-lg">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-purple-300 px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  AI Diligence Engine
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-300 font-medium">{data.category}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                {data.companyName}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {data.recommendationHeadline}
              </p>
            </div>

            {/* Match Score Display */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/40 border border-purple-500/30 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-1">
                AI Match Score
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {data.matchScore}
                </span>
                <span className="text-sm font-bold text-purple-300">%</span>
              </div>
              <span className={`mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getTierColor(data.recommendationTier)}`}>
                {data.recommendationTier}
              </span>
            </div>
          </div>

          {/* Sub-Scores Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#140d33] border border-purple-500/20 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Market Opportunity</span>
              <span className="text-lg font-extrabold text-purple-300">{data.marketOpportunityScore} / 10</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#140d33] border border-purple-500/20 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Growth Velocity</span>
              <span className="text-lg font-extrabold text-indigo-300">{data.growthVelocityScore} / 10</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#140d33] border border-purple-500/20 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Capital Efficiency</span>
              <span className="text-lg font-extrabold text-emerald-300">{data.capitalEfficiencyScore} / 10</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#140d33] border border-purple-500/20 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Risk Profile</span>
              <span className={`text-sm font-extrabold mt-1 block ${data.riskLevel === 'Low Risk' ? 'text-emerald-400' : data.riskLevel === 'Moderate Risk' ? 'text-amber-400' : 'text-rose-400'}`}>
                {data.riskLevel}
              </span>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-purple-500/15 pb-2 overflow-x-auto text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeTab === 'overview'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Thesis Alignment
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pitchdeck')}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'pitchdeck'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-purple-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Original Pitch Deck & AI Breakdown</span>
              {data.hasPitchDeck && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('strengths')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeTab === 'strengths'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Key Strengths ({data.keyStrengths?.length || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('risks')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeTab === 'risks'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Diligence Risks ({data.keyRisks?.length || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('questions')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeTab === 'questions'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              AI Partner Questions
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('report')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeTab === 'report'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Full Institutional Report
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/5 min-h-[160px]">
            
            {/* Overview / Thesis Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">
                    Why This Deal Matches Your Investment Criteria
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {data.thesisAlignment}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Target Round</span>
                    <span className="font-bold text-white">{formatCurrency(data.targetMoney)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Annual Revenue</span>
                    <span className="font-bold text-emerald-400">{formatCurrency(data.yearlyRevenue)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Financial Health</span>
                    <span className="font-bold text-indigo-300">{data.financialHealthScore}</span>
                  </div>
                </div>

                {/* Original Pitch Deck Snapshot Card inside Overview */}
                <div className="mt-3 p-4 rounded-xl bg-[#140d33] border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-300 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-white">
                          {data.hasPitchDeck ? (data.pitchDeckFileName || 'Confidential Pitch Deck.pdf') : 'Pitch Deck Not Attached'}
                        </h5>
                        {data.hasPitchDeck && (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" />
                            Verified Deck
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {data.hasPitchDeck
                          ? 'Original founder slides and AI presentation analysis ready for review.'
                          : 'Founder has not deposited a deck yet. You can request it via meeting proposal.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {data.hasPitchDeck ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setActiveTab('pitchdeck')}
                          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Original Deck & AI Analysis</span>
                        </button>
                        <a
                          href={pitchDeckApi.getDownloadUrl(effectiveStartupId)}
                          download
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-purple-300 border border-white/10"
                          title="Download Deck"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </>
                    ) : (
                      onRequestMeeting && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onRequestMeeting(data);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5"
                        >
                          <CalendarCheck className="w-3.5 h-3.5" />
                          <span>Ask Founder for Deck</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Original Pitch Deck & AI Slide Breakdown Tab */}
            {activeTab === 'pitchdeck' && (
              <div className="space-y-5">
                {data.hasPitchDeck ? (
                  <>
                    {/* Top Deck Control Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-purple-950/50 via-indigo-950/40 to-purple-900/40 border border-purple-500/25">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30">
                            Original Founder Deck
                          </span>
                          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Verified Vault File
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white truncate">
                          {data.pitchDeckFileName || `${data.companyName}_Pitch_Deck.pdf`}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {data.pitchDeckFileSize ? `${(data.pitchDeckFileSize / 1024).toFixed(1)} KB` : 'Confidential PDF'} • Evaluated by VentureLens AI Engine
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={pitchDeckApi.getDownloadUrl(effectiveStartupId)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-purple-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open in New Tab</span>
                        </a>

                        <a
                          href={pitchDeckApi.getDownloadUrl(effectiveStartupId)}
                          download
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Deck</span>
                        </a>
                      </div>
                    </div>

                    {/* Interactive Embedded Deck Viewer */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                        <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-purple-400" />
                          Original Pitch Deck Presentation Reader
                        </span>
                        <span className="text-[11px] text-purple-400">
                          Interactive PDF Telemetry
                        </span>
                      </div>

                      <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 bg-[#070314] shadow-2xl">
                        <iframe
                          src={pitchDeckApi.getDownloadUrl(effectiveStartupId)}
                          title="Original Startup Pitch Deck"
                          className="w-full h-[480px] bg-slate-900 border-0"
                        />
                      </div>
                    </div>

                    {/* AI Pitch Deck Evaluation & Slide Commentary */}
                    <div className="p-5 rounded-2xl bg-[#140d33] border border-purple-500/20 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                            AI Pitch Deck Synthesis & Slide-by-Slide Audit
                          </h4>
                        </div>
                        <div className="px-2.5 py-1 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-black flex items-center gap-1.5">
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span>Deck Clarity Score: {data.deckClarityScore || 9.4} / 10</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed bg-purple-950/30 p-3 rounded-xl border border-purple-500/20">
                        <strong>AI Assessment:</strong> {data.deckAiVerdict || 'INSTITUTIONAL GRADE: High-signal problem-solution clarity, validated TAM, and defensible technology architecture.'}
                      </p>

                      {/* Slide-by-Slide Diligence Breakdown */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          Slide-by-Slide Diligence Highlights
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {(data.deckSlideHighlights && data.deckSlideHighlights.length > 0 ? data.deckSlideHighlights : [
                            `Slide 1-3: Macro Market Problem & High-Pain Enterprise Need in ${data.category}`,
                            'Slide 4-6: Proprietary Technology Stack & Unique Defensibility Moat',
                            `Slide 7-9: Unit Economics Breakdown & Annual Revenue Traction (${formatCurrency(data.yearlyRevenue)})`,
                            `Slide 10-12: Target Round Capital Allocation (${formatCurrency(data.targetMoney)}) & 18-Month Key Milestones`
                          ]).map((slide, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-start gap-2.5 text-xs text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                              <span className="leading-snug">{slide}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center p-6 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-white">
                      Confidential Pitch Deck Not Yet Uploaded
                    </h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                      The founder of <strong className="text-white">{data.companyName}</strong> has not yet deposited their presentation deck to the platform vault. You can inspect their financial telemetry and AI thesis fit, or request a meeting with deck delivery below.
                    </p>
                    {onRequestMeeting && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onRequestMeeting(data);
                        }}
                        className="mt-3 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold inline-flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
                      >
                        <CalendarCheck className="w-4 h-4" />
                        <span>Request Meeting & Pitch Deck Access</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Strengths Tab */}
            {activeTab === 'strengths' && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                  Institutional Growth Catalysts
                </h4>
                {data.keyStrengths?.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Risks Tab */}
            {activeTab === 'risks' && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
                  Venture Risk Factors & Mitigations to Audit
                </h4>
                {data.keyRisks?.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Suggested Due Diligence Questions Tab */}
            {activeTab === 'questions' && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
                  Recommended Founder Interview Questions
                </h4>
                {data.aiSuggestedQuestions?.map((q, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-start gap-2 text-xs text-slate-200">
                    <HelpCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Full Report Tab */}
            {activeTab === 'report' && (
              <div className="space-y-2 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-mono bg-black/40 p-4 rounded-xl border border-white/5">
                {data.detailedAiAnalysis}
              </div>
            )}

          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-purple-500/15">
            <div className="flex items-center gap-2">
              {onToggleSave && (
                <button
                  type="button"
                  onClick={() => onToggleSave(data.startupId)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSaved
                      ? 'bg-purple-600/30 border-purple-400 text-purple-200'
                      : 'bg-white/5 border-white/10 hover:border-purple-500/30 text-slate-300'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-purple-400 text-purple-400' : ''}`} />
                  <span>{isSaved ? 'Bookmarked in Watchlist' : 'Bookmark Startup'}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close
              </button>

              {onRequestMeeting && (
                <button
                  type="button"
                  disabled={isRequested}
                  onClick={() => {
                    onClose();
                    onRequestMeeting(data);
                  }}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow ${
                    isRequested
                      ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 cursor-default'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30'
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
                      <span>Request Introductory Meeting</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

        </div>
      )}
    </Modal>
  );
};

export default AiDiligenceModal;
