import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { startupApi } from '../../api/client';
import { 
  Building, 
  User, 
  Tag, 
  Layers, 
  DollarSign, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  TrendingDown,
  Target
} from 'lucide-react';

const CATEGORIES = [
  'FinTech',
  'Artificial Intelligence',
  'HealthTech',
  'CleanTech',
  'Enterprise SaaS',
  'Cybersecurity',
  'E-Commerce',
  'Robotics',
  'EdTech',
  'BioTech',
  'Technology'
];

const STAGES = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Growth'];

const StartupProfile = () => {
  const { user, updateProfile } = useAuth();
  
  const [founderName, setFounderName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [category, setCategory] = useState('FinTech');
  const [fundingStage, setFundingStage] = useState('Seed');
  const [targetMoney, setTargetMoney] = useState(0);
  const [yearlyRevenue, setYearlyRevenue] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.userId) return;
      try {
        const res = await startupApi.getById(user.userId);
        const data = res.data;
        setFounderName(data.founderName || '');
        setCompanyName(data.companyName || '');
        setCategory(data.category || 'FinTech');
        setFundingStage(data.fundingStage || 'Seed');
        setTargetMoney(data.targetMoney || 0);
        setYearlyRevenue(data.yearlyRevenue || 0);
        setMonthlyExpenses(data.monthlyExpenses || 0);
      } catch (err) {
        setErrorMsg('Failed to load startup profile.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user?.userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload = {
        founderName: founderName.trim(),
        companyName: companyName.trim(),
        category,
        fundingStage,
        targetMoney: parseFloat(targetMoney) || 0,
        yearlyRevenue: parseFloat(yearlyRevenue) || 0,
        monthlyExpenses: parseFloat(monthlyExpenses) || 0,
      };

      const res = await startupApi.update(user.userId, payload);
      updateProfile(res.data);
      setSuccessMsg('Profile updated successfully! Changes are active immediately.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Loading company details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Startup Profile Management
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Update your business information and key financial indicators to reflect in real-time across the platform.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-3 text-sm text-emerald-300 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-3 text-sm text-rose-300 animate-shake">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#120b2e]/90 border border-purple-500/20 backdrop-blur-xl shadow-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Founder Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Company Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Business Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white bg-[#0d0824]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#110a2d] text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Current Funding Stage *
              </label>
              <select
                value={fundingStage}
                onChange={(e) => setFundingStage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white bg-[#0d0824]"
              >
                {STAGES.map((stg) => (
                  <option key={stg} value={stg} className="bg-[#110a2d] text-white">
                    {stg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Financial Section */}
          <div className="pt-6 border-t border-purple-500/15 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Financial & Capital Requirement Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Target Funding (\$) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Target className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    value={targetMoney}
                    onChange={(e) => setTargetMoney(e.target.value)}
                    required
                    min="0"
                    step="1000"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Yearly Revenue (\$) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    value={yearlyRevenue}
                    onChange={(e) => setYearlyRevenue(e.target.value)}
                    required
                    min="0"
                    step="1000"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Monthly Expenses (\$) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(e.target.value)}
                    required
                    min="0"
                    step="500"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-purple-500/15 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default StartupProfile;
