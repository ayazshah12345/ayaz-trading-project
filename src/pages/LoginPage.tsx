import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart2,
  BookMarked,
  FlaskConical,
  Award
} from 'lucide-react';
import logoImg from '../assets/logo.jpg';

interface LoginPageProps {
  onLogin?: (email: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('syedayazshah@ayazmarkets.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      if (onLogin) onLogin(email);
      navigate('/dashboard');
    }, 600);
  };

  const handleDemoSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (onLogin) onLogin('syedayazshah@ayazmarkets.com');
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] theme-text-primary flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl border border-[var(--border-color)] bg-[var(--bg-card)] grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
        
        {/* ================= LEFT SIDE: Trading & Company Info ================= */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#070b14] via-[#0f172a] to-[#1e1b4b] p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden text-white border-b lg:border-b-0 lg:border-r border-[var(--border-color)]">
          {/* Subtle Royal Glow Accents */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          {/* Top Logo & Header */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center space-x-3">
              <img
                src={logoImg}
                alt="Ayaz Markets Logo"
                className="w-12 h-12 rounded-xl border border-amber-500/40 shadow-lg object-cover"
              />
              <div>
                <h1 className="text-xl font-black tracking-tight text-white uppercase font-sans">
                  Ayaz Markets Analysis
                </h1>
                <p className="text-xs text-amber-400 font-extrabold tracking-wider uppercase font-mono-numeric">
                  Institutional FX & Crypto Trading Terminal
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-white">
                Master the Financial Markets with Precision & Discipline
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                Ayaz Markets Analysis provides professional traders with institutional-grade Trade Journaling, Backtesting Strategy Lab, Live TradingView Charting, and Real-Time Risk Analytics.
              </p>
            </div>
          </div>

          {/* Middle Features Grid */}
          <div className="relative z-10 my-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-1.5 backdrop-blur-xs">
                <BookMarked className="text-amber-400" size={20} />
                <h3 className="text-xs font-extrabold text-white">Trade Journaling</h3>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Auto-calculated account equity, P&L stats, and risk-reward tracking.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-1.5 backdrop-blur-xs">
                <FlaskConical className="text-indigo-400" size={20} />
                <h3 className="text-xs font-extrabold text-white">Backtesting Lab</h3>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Historical campaign testing, win-rate metrics, and strategy validation.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-1.5 backdrop-blur-xs">
                <BarChart2 className="text-emerald-400" size={20} />
                <h3 className="text-xs font-extrabold text-white">Live Chart Workspace</h3>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Full screen TradingView live charts, metals, crypto & forex feeds.
                </p>
              </div>
            </div>

            {/* Performance KPI Highlight */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between font-mono-numeric">
              <div className="flex items-center space-x-3">
                <Award className="text-amber-400 shrink-0" size={24} />
                <div>
                  <div className="text-xs font-black text-amber-400 uppercase tracking-wider">
                    Terminal Performance
                  </div>
                  <div className="text-sm font-extrabold text-white">
                    +$264.50 USD (+529.0%) Capital Growth
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-black text-xs border border-emerald-500/30">
                66.7% Win Rate
              </span>
            </div>
          </div>

          {/* Bottom Company Copyright */}
          <div className="relative z-10 text-[11px] text-slate-400 font-medium flex items-center justify-between border-t border-slate-800 pt-4">
            <span>© {new Date().getFullYear()} Ayaz Markets Analysis. All rights reserved.</span>
            <span className="text-amber-400 font-mono-numeric font-bold">v1.0.0 Terminal</span>
          </div>
        </div>

        {/* ================= RIGHT SIDE: Email & Password Form ================= */}
        <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between bg-[var(--bg-card)]">
          <div className="space-y-6 my-auto">
            {/* Form Title */}
            <div>
              <h2 className="text-2xl font-black theme-text-primary tracking-tight">
                Sign In to Terminal
              </h2>
              <p className="text-xs theme-text-secondary mt-1 font-medium">
                Enter your email and password to access your trading workspace.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold theme-text-primary uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-lg pl-10 pr-3 py-2.5 theme-text-primary font-mono-numeric font-bold outline-none focus:border-amber-500 transition text-xs"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold theme-text-primary uppercase tracking-wider">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={e => { e.preventDefault(); alert('Password reset link sent to ' + email); }}
                    className="text-xs font-bold text-amber-500 hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-lg pl-10 pr-10 py-2.5 theme-text-primary font-mono-numeric font-bold outline-none focus:border-amber-500 transition text-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-amber-500"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold theme-text-secondary">Remember this session</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg shadow-md transition flex items-center justify-center space-x-2 text-xs uppercase tracking-wider cursor-pointer"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Terminal</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border-color)]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[var(--bg-card)] px-2 theme-text-secondary font-bold text-[10px]">
                  Or Instant Demo Access
                </span>
              </div>
            </div>

            {/* One-Click Demo Sign In */}
            <button
              onClick={handleDemoSignIn}
              disabled={isLoading}
              className="w-full py-2.5 bg-[var(--bg-subpanel)] hover:bg-[var(--bg-card-hover)] theme-text-primary text-xs font-extrabold rounded-lg border border-[var(--border-color)] transition flex items-center justify-center space-x-2"
            >
              <Zap size={15} className="text-amber-500" />
              <span>One-Click Demo Sign In (Syed Ayaz Shah)</span>
            </button>
          </div>

          {/* Footer Create Account Link */}
          <div className="pt-6 border-t border-[var(--border-color)] text-center text-xs theme-text-secondary font-medium">
            Don't have a trader account?{' '}
            <a
              href="#register"
              onClick={e => { e.preventDefault(); alert('Please contact Ayaz Markets Administrator to issue account credentials.'); }}
              className="font-extrabold text-amber-500 hover:underline"
            >
              Contact Admin
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
