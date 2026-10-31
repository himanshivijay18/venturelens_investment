import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { startupApi } from '../../api/client';
import StatCard from '../../components/StatCard';
import MeetingRequestsModal from './MeetingRequestsModal';
import { 
  Building, 
  Tag, 
  Layers, 
  Target, 
  DollarSign, 
  TrendingDown, 
  CalendarCheck, 
  FileText, 
  User, 
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StartupDashboard = () => {
  const { user, updateProfile } = useAuth();
  const [startup, setStartup] = useState(user?.profile || null);
  const [loading, setLoading] = useState(!user?.profile);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

  const fetchStartupData = async () => {
    if (!user?.userId) return;
    try {
      const res = await startupApi.getById(user.userId);
      setStartup(res.data);
      updateProfile(res.data);
    } catch (err) {
      console.error('Error fetching startup overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartupData();
  }, [user?.userId]);

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '\$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-400">Loading your founder workspace...</p>
      </div>
    );
  }

  const s = startup || user?.profile || {};

  return (
    <div className="space-y-8">
      
      {/* Top Banner & Quick Actions */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-900/30 border border-purple-500/30 backdrop-blur-xl shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Founder Due Diligence Workspace
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {s.companyName || 'My Startup'}
          </h1>
          <p className="text-sm text-slate-300">
            Founded by <span className="font-semibold text-white">{s.founderName || 'Founder'}</span> •{' '}
            <span className="text-purple-300">{s.category || 'General'}</span>
          </p>
        </div>

        {/* View Meeting Requests Button (As explicitly required by section 5) */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMeetingModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
          >
            <CalendarCheck className="w-4 h-4 text-purple-200" />
            <span>View Meeting Requests</span>
            {(s.meetingRequestsCount > 0) && (
              <span className="w-5 h-5 rounded-full bg-white text-purple-900 text-xs font-bold flex items-center justify-center">
                {s.meetingRequestsCount}
              </span>
            )}
          </button>

          <Link
            to="/dashboard/pitch-deck"
            className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-sm font-semibold transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-purple-400" />
            <span>Manage Pitch Deck</span>
          </Link>
        </div>
      </div>

      {/* 7 Core Dashboard Statistics Cards (Per Section 5 Spec) */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-4">
          Core Operating & Financial Metrics
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Company Name"
            value={s.companyName || 'N/A'}
            subtitle={`Founder: ${s.founderName || 'N/A'}`}
            icon={Building}
            color="purple"
          />

          <StatCard
            title="Business Category"
            value={s.category || 'General'}
            subtitle="Industry Vertical"
            icon={Tag}
            color="indigo"
          />

          <StatCard
            title="Funding Stage"
            value={s.fundingStage || 'Seed'}
            subtitle="Current Capital Round"
            icon={Layers}
            color="emerald"
          />

          <StatCard
            title="Target Funding Amount"
            value={formatCurrency(s.targetMoney)}
            subtitle="Round Target"
            icon={Target}
            color="amber"
          />

          <StatCard
            title="Yearly Revenue"
            value={formatCurrency(s.yearlyRevenue)}
            subtitle="ARR / Annual Run-Rate"
            icon={DollarSign}
            color="emerald"
          />

          <StatCard
            title="Monthly Expenses"
            value={formatCurrency(s.monthlyExpenses)}
            subtitle="Monthly Operational Burn"
            icon={TrendingDown}
            color="rose"
          />

          <StatCard
            title="Meeting Requests"
            value={s.meetingRequestsCount || 0}
            subtitle="Click 'View Meeting Requests'"
            icon={CalendarCheck}
            color="purple"
          />

          {/* Pitch Deck Status Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/20 to-purple-950/30 border border-purple-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                  Pitch Deck
                </span>
                <FileText className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="text-lg font-bold text-white">
                {s.hasPitchDeck ? 'Deck Uploaded' : 'No Deck Attached'}
              </h4>
              <p className="text-xs text-slate-400 mt-1 truncate">
                {s.pitchDeckFileName || 'PDF, PPT, or PPTX up to 50MB'}
              </p>
            </div>
            <Link
              to="/dashboard/pitch-deck"
              className="mt-4 text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>{s.hasPitchDeck ? 'Replace Pitch Deck' : 'Upload Pitch Deck'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* AI Readiness Section (Conforms strictly to Master Prompt Section 12) */}
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h4 className="text-base font-bold text-white">AI Due Diligence Readiness</h4>
          </div>
          <span className="text-[11px] font-semibold text-purple-400/80 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
            Future Scope Engine
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          VentureLens will soon introduce automated multi-variable risk intelligence and pitch deck neural analysis. In this release, automated scoring is withheld to ensure complete diligence data integrity.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">AI Score</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-800 text-purple-300 border border-purple-500/30">
              Not Assessed
            </span>
          </div>

          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Risk Level</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-800 text-amber-300 border border-amber-500/30">
              NOT ASSESSED
            </span>
          </div>
        </div>
      </div>

      {/* Elegant Meeting Requests Modal */}
      <MeetingRequestsModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        startupId={s.id}
        onRequestsUpdated={fetchStartupData}
      />

    </div>
  );
};

export default StartupDashboard;
