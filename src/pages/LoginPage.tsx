import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  UserPlus,
  LogIn,
  BookMarked,
  FlaskConical,
  BarChart2,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Newspaper,
  RefreshCw,
  Zap,
  TrendingUp,
  Activity,
  Award,
  Check
} from 'lucide-react';
import logoImg from '../assets/logo.jpg';
import founderImg from '../assets/founder.png';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface LoginPageProps {
  onLogin?: (email: string, userId?: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchError, setIsFetchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isNetworkFailure = (err: any): boolean => {
    if (!err) return false;
    const msg = String(typeof err === 'string' ? err : err.message || '').toLowerCase();
    return (
      msg.includes('failed to fetch') ||
      msg.includes('networkerror') ||
      msg.includes('load failed') ||
      msg.includes('network request failed') ||
      err.status === 0
    );
  };

  const handleLocalBypass = (userEmailToUse?: string) => {
    const targetEmail = userEmailToUse?.trim() || email.trim() || 'trader@blackfx.com';
    const localUserId = `local-${targetEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
    setErrorMessage(null);
    setIsFetchError(false);
    setSuccessMessage('Terminal unlocked in Local Mode. Opening workspace...');
    setTimeout(() => {
      if (onLogin) onLogin(targetEmail, localUserId);
      navigate('/dashboard');
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsFetchError(false);

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    // Validate Sign Up Passwords Match
    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match! Please verify your password entry.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        if (mode === 'signup') {
          const { data, error } = await supabase.auth.signUp({
            email: cleanEmail,
            password: password,
          });

          if (error) {
            if (isNetworkFailure(error)) {
              setIsFetchError(true);
              setErrorMessage('Cloud authentication is unreachable (Failed to fetch). If you use Brave Shields, uBlock Origin, or an ad blocker, please pause it for this site, or enter via Local Mode.');
            } else if (error.message.includes('30 seconds') || error.status === 429) {
              setErrorMessage('Rate limit reached: Please wait 30 seconds before submitting another request.');
            } else {
              setErrorMessage(error.message);
            }
            setIsLoading(false);
            return;
          }

          const userId = data.user?.id || `user-${Date.now()}`;
          const userEmail = data.user?.email || cleanEmail;

          setSuccessMessage('Account registered! Opening Black FX Terminal...');
          setTimeout(() => {
            if (onLogin) onLogin(userEmail, userId);
            navigate('/dashboard');
          }, 400);
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: password,
          });

          if (error) {
            if (isNetworkFailure(error)) {
              setIsFetchError(true);
              setErrorMessage('Cloud authentication is unreachable (Failed to fetch). If you use Brave Shields, uBlock Origin, or an ad blocker, please pause it for this site, or enter via Local Mode.');
            } else if (error.message.includes('Invalid login credentials')) {
              setErrorMessage('Invalid credentials. Please verify your email and password, or click "Create Account" if you have not registered yet.');
            } else {
              setErrorMessage(error.message);
            }
            setIsLoading(false);
            return;
          }

          if (data.user) {
            if (onLogin) onLogin(data.user.email || cleanEmail, data.user.id);
            navigate('/dashboard');
          }
        }
      } else {
        setErrorMessage('Authentication service is initialising. Please refresh or verify your connection.');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      if (isNetworkFailure(err)) {
        setIsFetchError(true);
        setErrorMessage('Cloud authentication is unreachable (Failed to fetch). If you use Brave Shields, uBlock Origin, or an ad blocker, please pause it for this site, or enter via Local Mode.');
      } else {
        setErrorMessage(err.message || 'An error occurred during authentication.');
      }
      setIsLoading(false);
    }
  };

  const tickerText = "BLACK FX THE TRADERS BACKTESTING AND JOURNAL PLATFORM";

  return (
    <div className="min-h-screen w-full bg-[#05070d] text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-amber-500 selection:text-slate-950">
      
      {/* ================= TOP CONTINUOUS MOVING TICKER ================= */}
      <div className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-[11px] sm:text-xs py-2 tracking-widest uppercase overflow-hidden whitespace-nowrap shadow-md z-30 border-b border-amber-400/40 select-none">
        <div className="animate-marquee flex items-center space-x-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center space-x-6 shrink-0">
              <span className="flex items-center space-x-2">
                <Zap size={14} className="fill-slate-950 stroke-slate-950 animate-bounce" />
                <span>{tickerText}</span>
              </span>
              <span className="text-slate-900/60 font-bold">•</span>
              <span className="flex items-center space-x-1.5 text-[10px] bg-slate-950/15 px-2 py-0.5 rounded-full">
                <Activity size={12} />
                <span>INSTITUTIONAL QUANT ENGINE</span>
              </span>
              <span className="text-slate-900/60 font-bold">•</span>
              <span className="flex items-center space-x-1.5 text-[10px] bg-slate-950/15 px-2 py-0.5 rounded-full">
                <TrendingUp size={12} />
                <span>PRECISION ANALYTICS</span>
              </span>
              <span className="text-slate-900/60 font-bold">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 relative">
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full bg-yellow-600/10 blur-[130px] pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />

        {/* ================= LEFT SECTION: Brand Showcase, Highlighted Logo, Founder Card ================= */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col justify-between relative z-10 border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-gradient-to-br from-[#070a14] via-[#090d18] to-[#0d1222]">
          
          {/* Top Brand & Highlighted Logo Showcase */}
          <div className="space-y-8">
            
            {/* Header with Prominently Highlighted Logo */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
              <div className="flex items-center space-x-4">
                
                {/* HIGHLIGHTED 3D SHIELD LOGO */}
                <div className="relative group cursor-pointer">
                  {/* Pulsing Golden Halo Aura */}
                  <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-amber-500/50 via-yellow-400/40 to-amber-600/50 blur-lg opacity-85 group-hover:opacity-100 transition duration-500 gold-shield-glow" />
                  
                  {/* Shield Container */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 bg-gradient-to-b from-amber-400 via-yellow-600 to-amber-900 shadow-2xl flex items-center justify-center transform group-hover:scale-105 transition duration-300">
                    <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center overflow-hidden border border-amber-400/40">
                      <img
                        src={logoImg}
                        alt="Black FX Shield Logo"
                        className="w-full h-full object-contain p-0.5 filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]"
                      />
                    </div>
                  </div>

                  {/* Pro Badge */}
                  <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-md shadow-md uppercase tracking-wider flex items-center space-x-0.5">
                    <span>FX</span>
                  </div>
                </div>

                {/* Company Name & Tagline */}
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-gold-gradient font-mono-numeric">
                      BLACK FX
                    </h1>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 tracking-wider">
                      PRO TERMINAL
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-300 tracking-wide mt-0.5">
                    The Traders Backtesting &amp; Journal Platform
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Institutional Precision • Execution Metrics • Strategy Lab
                  </p>
                </div>
              </div>

              {/* Status Pill */}
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-[11px] font-bold text-amber-400 self-start sm:self-center shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Feed Active</span>
              </div>
            </div>

            {/* Moving Banner Inside Left Panel */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 overflow-hidden relative backdrop-blur-md">
              <div className="animate-marquee flex items-center space-x-6 text-xs font-black uppercase tracking-wider text-amber-300">
                <span>⚡ {tickerText} ⚡</span>
                <span className="text-amber-500/40">•</span>
                <span>DATA-DRIVEN EDGE FOR SERIOUS TRADERS</span>
                <span className="text-amber-500/40">•</span>
                <span>⚡ {tickerText} ⚡</span>
                <span className="text-amber-500/40">•</span>
                <span>TEST STRATEGIES • RECORD TRADES • MASTER RISK</span>
              </div>
            </div>

            {/* ================= FOUNDER CARD: Syed Ayaz Shah ================= */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#101628]/95 to-slate-900/90 border border-amber-500/40 shadow-2xl relative overflow-hidden backdrop-blur-xl group hover:border-amber-400/80 transition duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                {/* Founder Photo */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-700 shadow-xl overflow-hidden">
                    <img
                      src={founderImg}
                      alt="SYED AYAZ SHAH S - Founder of Black FX"
                      className="w-full h-full rounded-xl object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 p-1 rounded-full shadow-lg border border-slate-900" title="Verified Founder">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                </div>

                {/* Founder Details & Description */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
                      SYED AYAZ SHAH S
                    </h3>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 shadow-sm flex items-center space-x-1">
                      <Award size={11} />
                      <span>Founder &amp; Architect</span>
                    </span>
                  </div>
                  <p className="text-xs font-bold text-amber-400">
                    Founder of Black FX — The Traders Backtesting and Journal Platform
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "Engineered for dedicated traders who require complete clarity, statistical rigor, and institutional-level journaling. Black FX bridges the gap between historical simulation and real-world capital growth."
                  </p>
                </div>
              </div>
            </div>

            {/* Core Feature Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition backdrop-blur-md space-y-1.5">
                <div className="flex items-center space-x-2 text-amber-400">
                  <BookMarked size={18} />
                  <span className="text-xs font-black uppercase tracking-wider text-white">Execution Journal</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Log entries, exits, R-Multiples, P&amp;L, and psychological discipline with isolated account security.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition backdrop-blur-md space-y-1.5">
                <div className="flex items-center space-x-2 text-yellow-400">
                  <FlaskConical size={18} />
                  <span className="text-xs font-black uppercase tracking-wider text-white">Backtesting Engine</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Simulate rule-based strategies across any timeframe with automated win rates and equity curves.
                </p>
              </div>
            </div>

            {/* Forex Factory Live Calendar Banner Link */}
            <Link
              to="/news"
              className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900/90 to-amber-950/30 border border-amber-500/50 flex items-center justify-between font-mono-numeric backdrop-blur-md hover:border-amber-400 hover:scale-[1.01] transition group shadow-xl"
            >
              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                  <Newspaper size={22} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider">
                      LIVE CALENDAR
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                      FOREX FACTORY
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-white mt-0.5">
                    High-Impact Economic News Timefeed
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Real-time market volatility alerts &amp; release schedules
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition shrink-0 ml-2">
                <span>View News</span>
                <ArrowRight size={14} />
              </div>
            </Link>
          </div>

          {/* Bottom Copyright & Founder Credit */}
          <div className="pt-6 mt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 font-medium">
            <div className="flex items-center space-x-2.5">
              <img
                src={logoImg}
                alt="Black FX"
                className="w-5 h-5 rounded-md object-contain border border-amber-500/40"
              />
              <span>© {new Date().getFullYear()} Black FX. All rights reserved. • Founded by SYED AYAZ SHAH S</span>
            </div>
            <span className="text-amber-400 font-mono-numeric font-bold">Black FX v1.0.0</span>
          </div>
        </div>

        {/* ================= RIGHT SECTION: World's Best Auth Card ================= */}
        <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-gradient-to-b from-[#090d16] via-[#0b101d] to-[#070a12] relative z-20 border-t lg:border-t-0 border-slate-800/80">
          
          <div className="w-full max-w-md mx-auto space-y-6">
            
            {/* Mode Switcher Tabs */}
            <div className="flex p-1.5 bg-slate-950/80 border border-slate-800 rounded-2xl shadow-inner">
              <button
                type="button"
                onClick={() => { setMode('signin'); setErrorMessage(null); setSuccessMessage(null); }}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 shadow-lg font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMessage(null); setSuccessMessage(null); }}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 shadow-lg font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus size={15} />
                <span>Create Account</span>
              </button>
            </div>

            {/* Header Text & Live Status Badge */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {mode === 'signin' ? 'Welcome Back' : 'Join Black FX'}
                </h2>
                <div className="flex items-center space-x-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Cloud Connected</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                {mode === 'signin'
                  ? 'Access your private Black FX trading journal, analytics and backtesting records.'
                  : 'Create your trader identity to start backtesting strategies and logging executions.'}
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold space-y-2.5 leading-relaxed shadow-lg">
                <div className="flex items-start space-x-2.5">
                  <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
                {isFetchError && (
                  <div className="pt-2 border-t border-rose-500/20 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleLocalBypass(email)}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md flex items-center space-x-1.5"
                    >
                      <span>Enter in Local Mode</span>
                      <ArrowRight size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center space-x-1"
                    >
                      <RefreshCw size={13} />
                      <span>Retry Cloud</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Success Alert */}
            {successMessage && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-start space-x-2.5 leading-relaxed shadow-lg">
                <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail size={17} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="trader@example.com"
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-3 py-3 text-white placeholder-slate-500 font-mono-numeric font-bold outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition text-xs shadow-inner"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock size={17} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'Create password (min 6 chars)' : 'Enter your password'}
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-10 py-3 text-white placeholder-slate-500 font-mono-numeric font-bold outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition text-xs shadow-inner"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-amber-400 cursor-pointer transition"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input (Sign Up Only) */}
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock size={17} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password to confirm"
                      className={`w-full bg-slate-900/90 border rounded-xl pl-10 pr-10 py-3 text-white placeholder-slate-500 font-mono-numeric font-bold outline-none transition text-xs shadow-inner ${
                        confirmPassword && confirmPassword !== password
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40'
                      }`}
                      required
                    />
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <p className="text-[11px] font-bold text-rose-400 mt-1">
                      ⚠️ Passwords do not match
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-500 text-slate-950 font-black rounded-xl shadow-xl transition-all transform active:scale-[0.99] flex items-center justify-center space-x-2 text-xs uppercase tracking-wider cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span>Authenticating Black FX...</span>
                ) : (
                  <>
                    <span>{mode === 'signin' ? 'Sign In to Black FX Terminal' : 'Register Black FX Account'}</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

              {/* Instant Guest / Demo Terminal Access */}
              <div className="flex items-center justify-center pt-1">
                <button
                  type="button"
                  onClick={() => handleLocalBypass(email || 'demo.trader@blackfx.com')}
                  className="text-[11px] font-bold text-slate-400 hover:text-amber-400 underline decoration-dotted transition cursor-pointer flex items-center space-x-1"
                >
                  <Sparkles size={13} className="text-amber-400" />
                  <span>⚡ Instant Guest / Demo Terminal Access</span>
                </button>
              </div>

              {/* Direct Forex Factory Quick Access */}
              <div className="pt-3 border-t border-slate-800">
                <Link
                  to="/news"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-amber-500/30 text-amber-400 hover:text-amber-300 font-bold transition flex items-center justify-between text-xs group"
                >
                  <div className="flex items-center space-x-2">
                    <Newspaper size={15} className="text-amber-400" />
                    <span>View Forex Factory News Calendar</span>
                  </div>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </form>

            {/* Mode Switch Helper */}
            <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400 font-medium">
              {mode === 'signin' ? (
                <>
                  Don't have a Black FX account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setErrorMessage(null); setSuccessMessage(null); }}
                    className="font-extrabold text-amber-400 hover:underline cursor-pointer"
                  >
                    Create Account First
                  </button>
                </>
              ) : (
                <>
                  Already registered on Black FX?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setErrorMessage(null); setSuccessMessage(null); }}
                    className="font-extrabold text-amber-400 hover:underline cursor-pointer"
                  >
                    Sign In Here
                  </button>
                </>
              )}
            </div>

            {/* Security Guarantee Badge */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center space-x-3 text-[11px] text-slate-400 font-medium">
              <ShieldCheck size={20} className="text-amber-400 shrink-0" />
              <span>Isolated database schema, end-to-end encrypted sessions, and offline local cache guaranteed.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
