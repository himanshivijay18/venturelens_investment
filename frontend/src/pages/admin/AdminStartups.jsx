import React, { useState, useEffect } from 'react';
import { adminApi, pitchDeckApi } from '../../api/client';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { 
  Building, 
  Search, 
  User, 
  FileText, 
  Download, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Power,
  Layers,
  DollarSign
} from 'lucide-react';

const AdminStartups = () => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Selected startup for detailed dossier modal
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Status toggle confirmation
  const [toggleTarget, setToggleTarget] = useState(null); // { id, name, newStatus }

  const fetchStartups = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getStartups({ search: search.trim() || undefined });
      setStartups(res.data || []);
    } catch (err) {
      console.error('Failed to load startups for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStartups();
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const handleToggleStatus = async () => {
    if (!toggleTarget) return;
    try {
      await adminApi.updateStartupStatus(toggleTarget.id, toggleTarget.newStatus);
      setStartups((prev) =>
        prev.map((s) => (s.id === toggleTarget.id ? { ...s, isActive: toggleTarget.newStatus } : s))
      );
      if (selectedStartup && selectedStartup.id === toggleTarget.id) {
        setSelectedStartup((prev) => ({ ...prev, isActive: toggleTarget.newStatus }));
      }
    } catch (err) {
      console.error('Failed to update startup status:', err);
    }
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
            Startup Account Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Audit registered startup businesses, inspect pitch decks, and control platform access permissions.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 self-start sm:self-center">
          {startups.length} Registered Companies
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
            placeholder="Search startups by company name or founder name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* Table / Cards Layout */}
      <div className="rounded-3xl bg-[#120b2e]/90 border border-purple-500/20 backdrop-blur-xl shadow-card overflow-hidden">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400">Loading startup roster...</p>
          </div>
        ) : startups.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No startups match the search query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f0826] text-purple-300 uppercase tracking-wider text-[11px] border-b border-purple-500/20">
                <tr>
                  <th className="py-3.5 px-6">Company & Founder</th>
                  <th className="py-3.5 px-4">Category & Stage</th>
                  <th className="py-3.5 px-4">Financials (Target / ARR)</th>
                  <th className="py-3.5 px-4">Pitch Deck</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10 text-slate-300">
                {startups.map((s) => (
                  <tr key={s.id} className="hover:bg-purple-600/5 transition-colors">
                    
                    {/* Company & Founder */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-white text-sm">{s.companyName}</div>
                      <div className="text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <User className="w-3 h-3 text-slate-500" />
                        <span>{s.founderName}</span>
                        <span>•</span>
                        <span className="text-slate-500">{s.email}</span>
                      </div>
                    </td>

                    {/* Category & Stage */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-purple-300">{s.category}</div>
                      <div className="mt-1">
                        <Badge>{s.fundingStage}</Badge>
                      </div>
                    </td>

                    {/* Financials */}
                    <td className="py-4 px-4">
                      <div className="text-white font-medium">Target: {formatCurrency(s.targetMoney)}</div>
                      <div className="text-emerald-400 text-[11px]">ARR: {formatCurrency(s.yearlyRevenue)}</div>
                    </td>

                    {/* Pitch Deck */}
                    <td className="py-4 px-4">
                      {s.hasPitchDeck ? (
                        <a
                          href={pitchDeckApi.getDownloadUrl(s.id)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 text-[11px] font-semibold hover:bg-purple-600/30 transition-all"
                        >
                          <Download className="w-3 h-3" />
                          <span>View Deck</span>
                        </a>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">No Upload</span>
                      )}
                    </td>

                    {/* Account Status Badge */}
                    <td className="py-4 px-4">
                      <Badge variant={s.isActive ? 'emerald' : 'rose'}>
                        {s.isActive ? 'Active' : 'Deactivated'}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStartup(s);
                            setIsDetailOpen(true);
                          }}
                          className="p-1.5 rounded-lg border border-white/10 hover:border-purple-500/40 text-slate-300 hover:text-white transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setToggleTarget({
                              id: s.id,
                              name: s.companyName,
                              newStatus: !s.isActive,
                            })
                          }
                          className={`p-1.5 rounded-lg border transition-all ${
                            s.isActive
                              ? 'border-rose-500/30 hover:bg-rose-500/20 text-rose-300'
                              : 'border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300'
                          }`}
                          title={s.isActive ? 'Deactivate Account' : 'Activate Account'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Activation/Deactivation */}
      <ConfirmDialog
        isOpen={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        onConfirm={handleToggleStatus}
        title={toggleTarget?.newStatus ? 'Activate Startup Account' : 'Deactivate Startup Account'}
        message={`Are you sure you want to ${
          toggleTarget?.newStatus ? 'activate' : 'deactivate'
        } "${toggleTarget?.name}"? ${
          toggleTarget?.newStatus
            ? 'The founder will regain access to the platform.'
            : 'The founder will be blocked from logging into the platform.'
        }`}
        confirmText={toggleTarget?.newStatus ? 'Activate Account' : 'Deactivate Account'}
        confirmColor={toggleTarget?.newStatus ? 'purple' : 'rose'}
      />

      {/* Startup Profile Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Startup Institutional Dossier"
        maxWidth="max-w-2xl"
      >
        {selectedStartup && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-500/20 flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  {selectedStartup.category}
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {selectedStartup.companyName}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Founder: <strong className="text-white">{selectedStartup.founderName}</strong> • {selectedStartup.email}
                </p>
              </div>
              <Badge variant={selectedStartup.isActive ? 'emerald' : 'rose'}>
                {selectedStartup.isActive ? 'Active Account' : 'Deactivated'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase">Funding Stage</span>
                <span className="text-xs font-bold text-white block mt-1">{selectedStartup.fundingStage}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase">Target Raise</span>
                <span className="text-xs font-bold text-white block mt-1">{formatCurrency(selectedStartup.targetMoney)}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase">Yearly Revenue</span>
                <span className="text-xs font-bold text-emerald-400 block mt-1">{formatCurrency(selectedStartup.yearlyRevenue)}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase">Monthly Burn</span>
                <span className="text-xs font-bold text-rose-400 block mt-1">{formatCurrency(selectedStartup.monthlyExpenses)}</span>
              </div>
            </div>

            {selectedStartup.hasPitchDeck && (
              <div className="p-4 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">{selectedStartup.pitchDeckFileName}</p>
                  <p className="text-[10px] text-slate-400">Pitch Deck Attached</p>
                </div>
                <a
                  href={pitchDeckApi.getDownloadUrl(selectedStartup.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1 shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Deck</span>
                </a>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/5"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default AdminStartups;
