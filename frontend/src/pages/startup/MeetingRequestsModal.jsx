import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import { meetingApi } from '../../api/client';
import { 
  CalendarCheck, 
  Check, 
  X, 
  Building, 
  User, 
  Mail, 
  Clock, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';

const MeetingRequestsModal = ({ isOpen, onClose, startupId, onRequestsUpdated }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchRequests = async () => {
    if (!startupId) return;
    setLoading(true);
    setError('');
    try {
      const res = await meetingApi.getForStartup(startupId);
      setRequests(res.data || []);
    } catch (err) {
      setError('Could not retrieve meeting requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRequests();
    }
  }, [isOpen, startupId]);

  const handleUpdateStatus = async (requestId, newStatus) => {
    setActionLoadingId(requestId);
    setError('');
    try {
      await meetingApi.updateStatus(requestId, newStatus);
      // Update local state
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
      );
      if (onRequestsUpdated) {
        onRequestsUpdated();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update meeting status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Investor Meeting Requests" maxWidth="max-w-xl">
      <div className="space-y-4">
        
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading meeting requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">No Meeting Requests Yet</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              When venture investors discover your startup and submit meeting proposals, they will appear here for review.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {requests.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#140d33] border border-purple-500/20 space-y-3 hover:border-purple-500/40 transition-all"
              >
                {/* Header: Investor Info + Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {item.investorName}
                      </span>
                      <Badge>{item.status}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-purple-300">
                        <Building className="w-3.5 h-3.5" />
                        {item.investorFirmName}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-3 rounded-lg bg-black/30 border border-white/5 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <p className="whitespace-pre-wrap">{item.message}</p>
                </div>

                {/* Actions: Accept or Reject Buttons */}
                {item.status === 'PENDING' && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                    <button
                      type="button"
                      disabled={actionLoadingId === item.id}
                      onClick={() => handleUpdateStatus(item.id, 'REJECTED')}
                      className="px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-1 transition-all disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      type="button"
                      disabled={actionLoadingId === item.id}
                      onClick={() => handleUpdateStatus(item.id, 'ACCEPTED')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md transition-all disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="pt-3 border-t border-white/5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/5 transition-all"
          >
            Close Modal
          </button>
        </div>

      </div>
    </Modal>
  );
};

export default MeetingRequestsModal;
