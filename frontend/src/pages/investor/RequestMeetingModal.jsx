import React, { useState } from 'react';
import Modal from '../../components/Modal';
import { meetingApi } from '../../api/client';
import { Send, AlertCircle, CheckCircle2, Building, User } from 'lucide-react';

const RequestMeetingModal = ({ isOpen, onClose, startup, investorId, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!startup) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please provide a short message explaining the purpose of the meeting.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        startupId: startup.id,
        investorId: investorId,
        message: message.trim(),
      };
      await meetingApi.create(payload);
      setMessage('');
      if (onSuccess) onSuccess(startup.id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit meeting request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Due Diligence Meeting" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Startup Context Box */}
        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-400" />
              <h4 className="text-sm font-bold text-white">{startup.companyName}</h4>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Founder: {startup.founderName} • {startup.category}
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-purple-500/20 text-purple-300">
            {startup.fundingStage}
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Meeting Proposal Message *
          </label>
          <textarea
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Introduce your investment firm, highlight your focus in this vertical, and suggest a proposed agenda or timeline for discussion..."
            required
            className="w-full p-3 rounded-xl glass-input text-xs text-white placeholder-slate-500 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-400 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{loading ? 'Submitting...' : 'Send Request'}</span>
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default RequestMeetingModal;
