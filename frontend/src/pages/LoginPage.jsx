import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  LogIn, 
  Briefcase, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  Lock,
  Mail
} from 'lucide-react';

const LoginPage = () => {
  const [role, setRole] = useState('STARTUP'); // STARTUP, INVESTOR, ADMIN
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleQuickFill = (targetRole) => {
    setRole(targetRole);
    setError('');
    if (targetRole === 'STARTUP') {
      setEmail('aman@startup.com');
      setPassword('123456');
    } else if (targetRole === 'INVESTOR') {
      setEmail('rahul@gmail.com');
      setPassword('123456');
    } else if (targetRole === 'ADMIN') {
      setEmail('admin@venturelens.com');
      setPassword('Admin@12345');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email address and password');
      return;
    }

    setLoading(true);
    try {
      const user = await login(role, { email: email.trim(), password });
      
      // Role-based redirect
      if (user.role === 'STARTUP') {
        navigate('/dashboard');
      } else if (user.role === 'INVESTOR') {
        navigate('/investor');
      } else if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(serverMsg || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-600/30 text-white mb-2">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sign In to VentureLens
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Access your due diligence workspace and investment intelligence
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-[#110a2d] border border-purple-500/20">
          <button
            type="button"
            onClick={() => { setRole('STARTUP'); setError(''); }}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              role === 'STARTUP'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Founder</span>
          </button>

          <button
            type="button"
            onClick={() => { setRole('INVESTOR'); setError(''); }}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              role === 'INVESTOR'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Investor</span>
          </button>

          <button
            type="button"
            onClick={() => { setRole('ADMIN'); setError(''); }}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              role === 'ADMIN'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Quick Demo Login Credentials Bar */}
        <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-purple-300">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Demo 1-Click Credentials
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickFill('STARTUP')}
              className="flex-1 py-1 px-2 rounded-lg bg-white/5 hover:bg-purple-600/20 text-[11px] text-slate-300 hover:text-purple-300 border border-white/5 transition-all text-center truncate"
            >
              Demo Founder
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('INVESTOR')}
              className="flex-1 py-1 px-2 rounded-lg bg-white/5 hover:bg-purple-600/20 text-[11px] text-slate-300 hover:text-purple-300 border border-white/5 transition-all text-center truncate"
            >
              Demo Investor
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('ADMIN')}
              className="flex-1 py-1 px-2 rounded-lg bg-white/5 hover:bg-purple-600/20 text-[11px] text-slate-300 hover:text-purple-300 border border-white/5 transition-all text-center truncate"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#120b2e]/90 border border-purple-500/20 backdrop-blur-xl shadow-card space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-2.5 text-xs text-rose-300 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'ADMIN' ? 'admin@venturelens.com' : 'you@example.com'}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In as {role === 'STARTUP' ? 'Founder' : role === 'INVESTOR' ? 'Investor' : 'Admin'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {role !== 'ADMIN' && (
            <div className="text-center pt-2 border-t border-white/5">
              <p className="text-xs text-slate-400">
                Don't have an account yet?{' '}
                <Link to={`/signup?role=${role.toLowerCase()}`} className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4">
                  Create an account
                </Link>
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
