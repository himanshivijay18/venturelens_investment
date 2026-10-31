import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  UserPlus, 
  Briefcase, 
  TrendingUp, 
  AlertCircle, 
  ArrowRight,
  User,
  Mail,
  Lock,
  Building,
  Tag,
  DollarSign
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

const SignupPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role')?.toUpperCase() === 'INVESTOR' ? 'INVESTOR' : 'STARTUP';
  
  const [role, setRole] = useState(initialRole);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Common Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Startup Specific Fields
  const [founderName, setFounderName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [category, setCategory] = useState('FinTech');
  const [fundingStage, setFundingStage] = useState('Seed');
  const [targetMoney, setTargetMoney] = useState('1000000');
  const [yearlyRevenue, setYearlyRevenue] = useState('250000');
  const [monthlyExpenses, setMonthlyExpenses] = useState('35000');

  // Investor Specific Fields
  const [investorName, setInvestorName] = useState('');
  const [firmName, setFirmName] = useState('');
  const [interestedCategory, setInterestedCategory] = useState('FinTech');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      if (role === 'STARTUP') {
        const payload = {
          founderName: founderName.trim(),
          email: email.trim(),
          password,
          companyName: companyName.trim(),
          category,
          fundingStage,
          targetMoney: parseFloat(targetMoney) || 0,
          yearlyRevenue: parseFloat(yearlyRevenue) || 0,
          monthlyExpenses: parseFloat(monthlyExpenses) || 0,
        };
        await register('STARTUP', payload);
        navigate('/dashboard');
      } else {
        const payload = {
          investorName: investorName.trim(),
          email: email.trim(),
          password,
          firmName: firmName.trim(),
          interestedCategory,
        };
        await register('INVESTOR', payload);
        navigate('/investor');
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(serverMsg || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-600/30 text-white mb-2">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create Your Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Join VentureLens to connect with vetted founders and institutional investors
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#110a2d] border border-purple-500/20">
          <button
            type="button"
            onClick={() => { setRole('STARTUP'); setError(''); }}
            className={`py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              role === 'STARTUP'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Startup Founder</span>
          </button>

          <button
            type="button"
            onClick={() => { setRole('INVESTOR'); setError(''); }}
            className={`py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              role === 'INVESTOR'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Venture Investor</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#120b2e]/90 border border-purple-500/20 backdrop-blur-xl shadow-card space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-2.5 text-xs text-rose-300 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Startup Specific Fields */}
            {role === 'STARTUP' ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Founder Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={founderName}
                        onChange={(e) => setFounderName(e.target.value)}
                        placeholder="Elena Rostova"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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
                        placeholder="NexusPay Global"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Business Category *
                    </label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white bg-[#0d0824]"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c} className="bg-[#110a2d] text-white">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Funding Stage *
                    </label>
                    <select
                      value={fundingStage}
                      onChange={(e) => setFundingStage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white bg-[#0d0824]"
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s} className="bg-[#110a2d] text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Financial overview inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Target Funding (\$)
                    </label>
                    <input
                      type="number"
                      value={targetMoney}
                      onChange={(e) => setTargetMoney(e.target.value)}
                      placeholder="1000000"
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Yearly Revenue (\$)
                    </label>
                    <input
                      type="number"
                      value={yearlyRevenue}
                      onChange={(e) => setYearlyRevenue(e.target.value)}
                      placeholder="250000"
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Monthly Expenses (\$)
                    </label>
                    <input
                      type="number"
                      value={monthlyExpenses}
                      onChange={(e) => setMonthlyExpenses(e.target.value)}
                      placeholder="35000"
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                    />
                  </div>
                </div>
              </>
            ) : (
              /* Investor Specific Fields */
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Investor Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={investorName}
                        onChange={(e) => setInvestorName(e.target.value)}
                        placeholder="Victoria Thorne"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Investment Firm Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Building className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={firmName}
                        onChange={(e) => setFirmName(e.target.value)}
                        placeholder="Apex Horizon Capital"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Interested Business Category *
                  </label>
                  <select
                    value={interestedCategory}
                    onChange={(e) => setInterestedCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white bg-[#0d0824]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#110a2d] text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Work Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@company.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Register as {role === 'STARTUP' ? 'Startup Founder' : 'Venture Investor'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-white/5">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignupPage;
