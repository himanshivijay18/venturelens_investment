import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/client';
import StatCard from '../../components/StatCard';
import { 
  Building, 
  Users, 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  FileText, 
  BarChart3, 
  DollarSign, 
  ArrowRight,
  Shield,
  Layers,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await adminApi.getDashboard();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Loading administrator control center...</p>
      </div>
    );
  }

  const s = stats || {};

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-900/30 border border-purple-500/30 backdrop-blur-xl shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Platform Command Center
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Administrator Intelligence Overview
          </h1>
          <p className="text-sm text-slate-300">
            Monitor ecosystem participants, audit diligence pitch decks, and review live meeting activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/analytics"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Interactive Analytics</span>
          </Link>
        </div>
      </div>

      {/* 6 Core Overview Cards (Per Section 7 Master Prompt Spec) */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-4">
          Core Ecosystem Indicators
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Registered Startups"
            value={s.totalStartups || 0}
            subtitle={`${s.activeStartups || 0} Active Accounts`}
            icon={Building}
            color="purple"
          />

          <StatCard
            title="Total Registered Investors"
            value={s.totalInvestors || 0}
            subtitle={`${s.activeInvestors || 0} Active Firms`}
            icon={Users}
            color="indigo"
          />

          <StatCard
            title="Total Meeting Requests"
            value={s.totalMeetings || 0}
            subtitle="Platform Proposals Submitted"
            icon={CalendarCheck}
            color="emerald"
          />

          <StatCard
            title="Pending Meeting Requests"
            value={s.pendingMeetings || 0}
            subtitle="Awaiting Founder Decisions"
            icon={Clock}
            color="amber"
          />

          <StatCard
            title="Accepted Meeting Requests"
            value={s.acceptedMeetings || 0}
            subtitle="Milestone Calls Scheduled"
            icon={CheckCircle2}
            color="emerald"
          />

          <StatCard
            title="Total Uploaded Pitch Decks"
            value={s.totalPitchDecks || 0}
            subtitle="Secured in Diligence Vault"
            icon={FileText}
            color="rose"
          />
        </div>
      </div>

      {/* Capital Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-[#120b2e]/90 border border-purple-500/20 backdrop-blur-xl shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              Total Target Capital Pipeline
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {formatCurrency(s.totalTargetFunding)}
            </h3>
            <p className="text-xs text-purple-300 mt-1">
              Aggregated across all registered startup profiles
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-300 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#120b2e]/90 border border-purple-500/20 backdrop-blur-xl shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              Total Platform Annual Revenue
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
              {formatCurrency(s.totalYearlyRevenue)}
            </h3>
            <p className="text-xs text-emerald-300/80 mt-1">
              Combined reported revenue across portfolios
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-300 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Navigation Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Link
          to="/admin/startups"
          className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between group"
        >
          <div>
            <Building className="w-5 h-5 text-purple-400 mb-2" />
            <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
              Startup Roster
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Search profiles, view decks, and manage account status.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-purple-400 gap-1">
            <span>Manage Startups</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/admin/investors"
          className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between group"
        >
          <div>
            <Users className="w-5 h-5 text-indigo-400 mb-2" />
            <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
              Investor Firms
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Review firm credentials and audit activity.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-indigo-400 gap-1">
            <span>Manage Investors</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/admin/meetings"
          className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between group"
        >
          <div>
            <CalendarCheck className="w-5 h-5 text-teal-400 mb-2" />
            <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
              Meeting Monitor
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Inspect messages, status updates, and dates.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-teal-400 gap-1">
            <span>Monitor Proposals</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/admin/analytics"
          className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between group"
        >
          <div>
            <BarChart3 className="w-5 h-5 text-amber-400 mb-2" />
            <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
              Recharts Analytics
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Visual category breakdowns & timeline trends.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-amber-400 gap-1">
            <span>View Charts</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

      </div>

    </div>
  );
};

export default AdminDashboard;
