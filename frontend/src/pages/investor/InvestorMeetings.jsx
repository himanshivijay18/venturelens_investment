import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { meetingApi } from '../../api/client';
import Badge from '../../components/Badge';
import { 
  CalendarCheck, 
  Clock, 
  Building, 
  User, 
  MessageSquare, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Hourglass,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

const InvestorMeetings = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMeetings = async (isManual = false) => {
    if (!user?.userId) return;
    if (isManual) setRefreshing(true);
    try {
      const res = await meetingApi.getForInvestor(user.userId);
      setMeetings(res.data || []);
    } catch (err) {
      console.error('Failed to load investor meetings:', err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [user?.userId]);

  return (
    <div className="space-y-8">
      
      {/* Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Meeting Requests & Diligence Calls
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track status updates for meetings submitted to startup founders across the platform.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchMeetings(true)}
          disabled={refreshing}
          className="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-semibold hover:bg-purple-600/30 transition-all flex items-center gap-2 self-start sm:self-center disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Status'}</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Loading meeting requests...</p>
        </div>
      ) : meetings.length === 0 ? (
        <div className="py-20 text-center p-8 rounded-3xl bg-[#120b2e]/40 border border-purple-500/10 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/10 text-purple-400 flex items-center justify-center mx-auto">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Meeting Requests Sent</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            When you discover an interesting startup in the platform catalog, submit a meeting proposal to initiate diligence discussions.
          </p>
          <div className="pt-2">
            <Link
              to="/investor/startups"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md transition-all"
            >
              <span>Explore Startups</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {meetings.map((m) => {
            let statusIcon = <Hourglass className="w-4 h-4 text-amber-400" />;
            let statusBanner = 'bg-amber-500/10 border-amber-500/20 text-amber-300';

            if (m.status === 'ACCEPTED') {
              statusIcon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
              statusBanner = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300';
            } else if (m.status === 'REJECTED') {
              statusIcon = <XCircle className="w-4 h-4 text-rose-400" />;
              statusBanner = 'bg-rose-500/10 border-rose-500/20 text-rose-300';
            }

            return (
              <div
                key={m.id}
                className="p-6 rounded-3xl bg-[#120b2e]/90 border border-purple-500/20 backdrop-blur-xl shadow-card space-y-4 hover:border-purple-400/40 transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white tracking-tight">
                        {m.startupCompanyName}
                      </h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                        {m.startupCategory}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-500" />
                        Founder: {m.startupFounderName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        Sent {new Date(m.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge>{m.status}</Badge>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                    <span>Your Proposal Message:</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap pl-5">
                    {m.message}
                  </p>
                </div>

                {/* Status Explanation Bar */}
                <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-medium ${statusBanner}`}>
                  {statusIcon}
                  <span>
                    {m.status === 'ACCEPTED' && 'The founder has accepted your meeting request! They will reach out via email for calendar coordination.'}
                    {m.status === 'PENDING' && 'Waiting for the startup founder to review your introduction and respond.'}
                    {m.status === 'REJECTED' && 'The founder declined this meeting request at this time.'}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default InvestorMeetings;
