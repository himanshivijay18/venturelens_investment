import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/client';
import Badge from '../../components/Badge';
import ConfirmDialog from '../../components/ConfirmDialog';
import { 
  Users, 
  Search, 
  Building, 
  Mail, 
  Power, 
  Bookmark, 
  CalendarCheck, 
  Tag,
  CheckCircle2,
  Clock
} from 'lucide-react';

const AdminInvestors = () => {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Status toggle confirmation
  const [toggleTarget, setToggleTarget] = useState(null); // { id, name, newStatus }

  const fetchInvestors = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getInvestors({ search: search.trim() || undefined });
      setInvestors(res.data || []);
    } catch (err) {
      console.error('Failed to load investors for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInvestors();
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const handleToggleStatus = async () => {
    if (!toggleTarget) return;
    try {
      await adminApi.updateInvestorStatus(toggleTarget.id, toggleTarget.newStatus);
      setInvestors((prev) =>
        prev.map((i) => (i.id === toggleTarget.id ? { ...i, isActive: toggleTarget.newStatus } : i))
      );
    } catch (err) {
      console.error('Failed to update investor status:', err);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Investor Firm Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Audit registered venture partners, analyze deal flow volume, and manage firm access credentials.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 self-start sm:self-center">
          {investors.length} Registered Investors
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-[#120b2e]/90 border border-purple-500/20 backdrop-blur-xl shadow-card">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search investors by name, firm name, or category..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-3xl bg-[#120b2e]/90 border border-purple-500/20 backdrop-blur-xl shadow-card overflow-hidden">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400">Loading investor list...</p>
          </div>
        ) : investors.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No investors match the specified criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f0826] text-purple-300 uppercase tracking-wider text-[11px] border-b border-purple-500/20">
                <tr>
                  <th className="py-3.5 px-6">Investor & Firm</th>
                  <th className="py-3.5 px-4">Focus Category</th>
                  <th className="py-3.5 px-4">Activity (Saved / Sent / Accepted)</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10 text-slate-300">
                {investors.map((i) => (
                  <tr key={i.id} className="hover:bg-purple-600/5 transition-colors">
                    
                    {/* Investor & Firm */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-white text-sm">{i.investorName}</div>
                      <div className="text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Building className="w-3 h-3 text-purple-400" />
                        <span className="text-purple-300 font-semibold">{i.firmName}</span>
                        <span>•</span>
                        <span className="text-slate-500">{i.email}</span>
                      </div>
                    </td>

                    {/* Focus Category */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-white">{i.interestedCategory}</div>
                    </td>

                    {/* Activity Counters */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-slate-300" title="Saved Startups">
                          <Bookmark className="w-3.5 h-3.5 text-purple-400" />
                          <span>{i.savedStartupsCount || 0}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-amber-300" title="Meeting Requests Sent">
                          <CalendarCheck className="w-3.5 h-3.5" />
                          <span>{i.meetingRequestsSentCount || 0}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-emerald-300" title="Accepted Meetings">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{i.acceptedMeetingsCount || 0}</span>
                        </span>
                      </div>
                    </td>

                    {/* Account Status */}
                    <td className="py-4 px-4">
                      <Badge variant={i.isActive ? 'emerald' : 'rose'}>
                        {i.isActive ? 'Active' : 'Deactivated'}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setToggleTarget({
                            id: i.id,
                            name: `${i.investorName} (${i.firmName})`,
                            newStatus: !i.isActive,
                          })
                        }
                        className={`p-1.5 rounded-lg border transition-all ${
                          i.isActive
                            ? 'border-rose-500/30 hover:bg-rose-500/20 text-rose-300'
                            : 'border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300'
                        }`}
                        title={i.isActive ? 'Deactivate Account' : 'Activate Account'}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        onConfirm={handleToggleStatus}
        title={toggleTarget?.newStatus ? 'Activate Investor Account' : 'Deactivate Investor Account'}
        message={`Are you sure you want to ${
          toggleTarget?.newStatus ? 'activate' : 'deactivate'
        } "${toggleTarget?.name}"? ${
          toggleTarget?.newStatus
            ? 'The investor will be able to log in and access startup intelligence.'
            : 'The investor will be blocked from logging into the platform.'
        }`}
        confirmText={toggleTarget?.newStatus ? 'Activate Account' : 'Deactivate Account'}
        confirmColor={toggleTarget?.newStatus ? 'purple' : 'rose'}
      />

    </div>
  );
};

export default AdminInvestors;
