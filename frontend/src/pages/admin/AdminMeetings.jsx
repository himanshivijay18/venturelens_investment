import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/client';
import Badge from '../../components/Badge';
import { 
  CalendarCheck, 
  Clock, 
  Building, 
  User, 
  MessageSquare, 
  Search, 
  Filter,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

const AdminMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getMeetings();
      setMeetings(res.data || []);
    } catch (err) {
      console.error('Failed to load meeting monitoring:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const filteredMeetings = meetings.filter((m) => {
    const matchesStatus = statusFilter === 'ALL' || m.status?.toUpperCase() === statusFilter;
    const s = search.toLowerCase();
    const matchesSearch =
      !s ||
      m.startupCompanyName?.toLowerCase().includes(s) ||
      m.investorName?.toLowerCase().includes(s) ||
      m.investorFirmName?.toLowerCase().includes(s) ||
      m.message?.toLowerCase().includes(s);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Meeting Proposal Monitoring
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Global audit log of introductory meeting requests exchanged between investors and founders.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchMeetings}
          className="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-semibold hover:bg-purple-600/30 transition-all flex items-center gap-2 self-start sm:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#120b2e]/90 border border-purple-500/20 backdrop-blur-xl shadow-card grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative md:col-span-2">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by startup, investor, firm name, or message text..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-white bg-[#0d0824]"
          >
            <option value="ALL" className="bg-[#110a2d] text-white">All Statuses</option>
            <option value="PENDING" className="bg-[#110a2d] text-white">Pending</option>
            <option value="ACCEPTED" className="bg-[#110a2d] text-white">Accepted</option>
            <option value="REJECTED" className="bg-[#110a2d] text-white">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-3xl bg-[#120b2e]/90 border border-purple-500/20 backdrop-blur-xl shadow-card overflow-hidden">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400">Loading meeting proposals...</p>
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No meeting proposals found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f0826] text-purple-300 uppercase tracking-wider text-[11px] border-b border-purple-500/20">
                <tr>
                  <th className="py-3.5 px-6">Investor & Firm</th>
                  <th className="py-3.5 px-4">Target Startup</th>
                  <th className="py-3.5 px-6">Proposal Message</th>
                  <th className="py-3.5 px-4">Request Date</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10 text-slate-300">
                {filteredMeetings.map((m) => (
                  <tr key={m.id} className="hover:bg-purple-600/5 transition-colors">
                    
                    {/* Investor */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-white text-sm">{m.investorName}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{m.investorFirmName}</div>
                      <div className="text-slate-500 text-[10px]">{m.investorEmail}</div>
                    </td>

                    {/* Startup */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-white text-sm">{m.startupCompanyName}</div>
                      <div className="text-purple-300 text-xs mt-0.5">{m.startupCategory}</div>
                      <div className="text-slate-500 text-[10px]">Founder: {m.startupFounderName}</div>
                    </td>

                    {/* Proposal Message */}
                    <td className="py-4 px-6 max-w-md">
                      <p className="text-xs text-slate-200 line-clamp-2 bg-black/20 p-2 rounded-lg border border-white/5">
                        {m.message}
                      </p>
                    </td>

                    {/* Request Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <Badge>{m.status}</Badge>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminMeetings;
