import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Zap,
  TrendingUp,
  Activity,
  BookOpen,
  FlaskConical,
  LineChart,
  RefreshCw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import logoImg from '../assets/logo.png';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsFetchError(false);

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify your password entry.');
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
              setErrorMessage('Connection unreachable (Failed to fetch). Please check your internet or ad-blocker and retry.');
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

          setSuccessMessage('Account created successfully! Launching Black FX Terminal...');
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
              setErrorMessage('Connection unreachable (Failed to fetch). Please check your internet or firewall and retry.');
            } else if (error.message.includes('Invalid login credentials')) {
              setErrorMessage('Invalid credentials. Please verify your email and password, or create an account.');
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
        setErrorMessage('Authentication service initialising. Please refresh or verify network settings.');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      if (isNetworkFailure(err)) {
        setIsFetchError(true);
        setErrorMessage('Connection unreachable (Failed to fetch). Please check your network and retry.');
      } else {
        setErrorMessage(err.message || 'An unexpected error occurred during authentication.');
      }
      setIsLoading(false);
    }
  };

  const tickerItems = [
    { pair: 'EUR/USD', price: '1.08425', change: '+0.42%', up: true },
    { pair: 'GBP/USD', price: '1.29810', change: '+0.58%', up: true },
    { pair: 'XAU/USD', price: '$2,658.40', change: '+1.34%', up: true },
    { pair: 'BTC/USD', price: '$68,420.00', change: '+3.12%', up: true },
    { pair: 'US100', price: '19,850.40', change: '+0.85%', up: true },
    { pair: 'USD/JPY', price: '153.15', change: '-0.18%', up: false },
  ];

  return (
    <div className="min-h-screen w-full bg-[#060813] text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-cyan-500 selection:text-black relative">
      
      {/* ================= TOP CONTINUOUS MOVING TICKER ================= */}
      <div className="w-full bg-[#080b18] border-b border-blue-500/20 py-2.5 overflow-hidden whitespace-nowrap shadow-sm z-30 select-none">
        <div className="animate-marquee flex items-center space-x-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-6 shrink-0">
              <span className="flex items-center space-x-1.5 text-xs font-black tracking-widest text-cyan-400">
                <Zap size={13} className="text-cyan-400 fill-cyan-400" />
                <span>BLACK FX • INSTITUTIONAL BACKTESTING &amp; TRADING JOURNAL PLATFORM</span>
              </span>
              <span className="text-slate-700">•</span>
              {tickerItems.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-1.5 text-[11px] font-mono-numeric">
                  <span className="font-bold text-white">{item.pair}</span>
                  <span className="text-slate-300 font-medium">{item.price}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${item.up ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                    {item.change}
                  </span>
                </div>
              ))}
              <span className="text-slate-700">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 relative">
        
        {/* Soft Modern Gradient Glows (Cyan & Electric Blue) */}
        <div className="absolute top-10 left-10 w-[550px] h-[550px] rounded-full bg-blue-600/10 blur-[160px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none" />

        {/* ================= LEFT SECTION: INNOVATIVE 3D CRYSTAL VISUAL, UPTREND GRAPH & FOUNDER BIO ================= */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col justify-between relative z-10">
          
          <div className="space-y-8 max-w-2xl">
            
            {/* Free-Floating Brand & Standalone Logo */}
            <div className="flex items-center space-x-4 sm:space-x-5">
              <div className="relative group">
                <div className="absolute -inset-2 rounded-full bg-cyan-500/25 blur-xl opacity-75 group-hover:opacity-100 transition duration-700" />
                <img
                  src={logoImg}
                  alt="Black FX Logo"
                  className="relative w-16 h-16 sm:w-20 sm:h-20 object-contain filter drop-shadow-[0_8px_24px_rgba(14,165,233,0.4)] transform group-hover:scale-105 transition duration-300"
                />
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-mono-numeric">
                  BLACK <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">FX</span>
                </h1>
                <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-400 uppercase mt-1">
                  The Traders Backtesting and Journal Platform
                </p>
              </div>
            </div>

            {/* Hero Catchphrase (FundingPips-Inspired Modern Typographic Impact) */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                Turn your trading skills into{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
                  consistent alpha
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                The institutional-grade terminal engineered to journal daily executions, stress-test historical setups, and track live price analytics with statistical mastery.
              </p>
            </div>

            {/* ================= INNOVATIVE 3D CRYSTAL CANDLESTICKS & BACKGROUND-ADAPTING UPTREND GRAPH ================= */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#0c1224]/80 via-[#070a16]/60 to-[#060813] border border-blue-500/30 p-4 sm:p-6 shadow-2xl backdrop-blur-md">
              
              {/* Header HUD */}
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center space-x-2">
                  <span className="flex items-center space-x-1.5 font-bold text-cyan-300 text-xs tracking-wider uppercase">
                    <Activity size={14} className="text-cyan-400" />
                    <span>Algorithmic Equilibrium</span>
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    +384.8% ALPHA EXPANSION
                  </span>
                </div>
                <span className="text-[10px] font-mono-numeric text-slate-400">
                  REAL-TIME ADAPTIVE RUN
                </span>
              </div>

              {/* Integrated Visual: 3D Crystal Candlestick Sculpture + Luminous Uptrend Line Wave */}
              <div className="relative h-44 sm:h-52 w-full flex items-center justify-between">
                
                {/* SVG Background-Adapting Glowing Uptrend Curve */}
                <svg
                  className="absolute inset-0 w-full h-full overflow-visible"
                  viewBox="0 0 500 160"
                  preserveAspectRatio="none"
                >
                  <defs>
                    {/* Seamless Gradient fading into dark background */}
                    <linearGradient id="crystalUptrendBg" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.28" />
                      <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.10" />
                      <stop offset="100%" stopColor="#060813" stopOpacity="0.0" />
                    </linearGradient>

                    {/* Radiant Blue/Cyan/Emerald Uptrend Line */}
                    <linearGradient id="crystalUptrendStroke" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="50%" stopColor="#0ea5e9" />
                      <stop offset="85%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>

                  {/* Soft Background Grid */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(56,189,248,0.05)" strokeDasharray="4 4" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(56,189,248,0.05)" strokeDasharray="4 4" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(56,189,248,0.05)" strokeDasharray="4 4" />

                  {/* Area Fill fading to background */}
                  <path
                    d="M 0 145 C 70 140, 130 120, 190 100 C 260 78, 320 85, 380 48 C 430 20, 470 25, 500 10 L 500 160 L 0 160 Z"
                    fill="url(#crystalUptrendBg)"
                  />

                  {/* Primary Glowing Uptrend Line */}
                  <path
                    d="M 0 145 C 70 140, 130 120, 190 100 C 260 78, 320 85, 380 48 C 430 20, 470 25, 500 10"
                    fill="none"
                    stroke="url(#crystalUptrendStroke)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    filter="drop-shadow(0 0 10px rgba(14,165,233,0.8))"
                  />

                  {/* Glowing Trajectory Milestone Nodes */}
                  <circle cx="190" cy="100" r="4" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)" />
                  <circle cx="380" cy="48" r="4.5" fill="#0ea5e9" filter="drop-shadow(0 0 8px #0ea5e9)" />
                  <circle cx="498" cy="10" r="5" fill="#10b981" filter="drop-shadow(0 0 12px #10b981)" />
                </svg>

                {/* 3D Glass Crystal Candlesticks (Inspired by FundingPips) */}
                <div className="relative z-10 w-full flex items-center justify-end pr-4 sm:pr-8 gap-5 pointer-events-none">
                  
                  {/* Floating Glass Candlestick 1 */}
                  <div className="animate-float-slow flex flex-col items-center">
                    {/* Upper Wick */}
                    <div className="w-1.5 h-7 bg-gradient-to-t from-cyan-400 to-transparent rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                    {/* 3D Glass Beveled Body */}
                    <div className="w-14 h-24 rounded-xl relative overflow-hidden bg-gradient-to-br from-blue-400/40 via-cyan-500/20 to-blue-600/30 border border-cyan-300/60 shadow-[0_8px_32px_rgba(14,165,233,0.35)] backdrop-blur-md">
                      {/* Internal crystal specular highlight */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/40 opacity-70" />
                      <div className="absolute top-1 left-1.5 w-2 h-16 bg-white/40 rounded-full blur-[1px]" />
                    </div>
                    {/* Lower Wick */}
                    <div className="w-1.5 h-7 bg-gradient-to-b from-cyan-400 to-transparent rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                  </div>

                  {/* Floating Glass Candlestick 2 (Taller, Ascending) */}
                  <div className="animate-float-reverse flex flex-col items-center">
                    {/* Upper Wick */}
                    <div className="w-1.5 h-9 bg-gradient-to-t from-blue-400 to-transparent rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    {/* 3D Glass Beveled Body */}
                    <div className="w-16 h-32 rounded-xl relative overflow-hidden bg-gradient-to-br from-cyan-300/45 via-blue-500/30 to-indigo-600/40 border border-cyan-200/70 shadow-[0_12px_40px_rgba(59,130,246,0.45)] backdrop-blur-md">
                      {/* Internal crystal specular highlight */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/25 to-white/50 opacity-80" />
                      <div className="absolute top-2 left-2 w-2.5 h-22 bg-white/50 rounded-full blur-[1px]" />
                    </div>
                    {/* Lower Wick */}
                    <div className="w-1.5 h-9 bg-gradient-to-b from-blue-400 to-transparent rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  </div>

                </div>

                {/* Floating Aesthetic Data Badges */}
                <div className="absolute bottom-2 left-2 flex items-center space-x-2 text-[10px] text-slate-300 font-mono-numeric bg-slate-900/80 px-2.5 py-1 rounded-lg border border-blue-500/30 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Institutional Accumulation &amp; Expansion</span>
                </div>

              </div>
            </div>

            {/* ================= ABOUT THE FOUNDER & BLACK FX ================= */}
            <div className="space-y-4 pt-1">
              
              {/* Founder Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 via-cyan-400 to-emerald-400 shadow-xl overflow-hidden">
                    <img
                      src={founderImg}
                      alt="Syed Ayaz Shah - Founder of Black FX"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base sm:text-lg font-black text-white tracking-wide">
                      SYED AYAZ SHAH S
                    </span>
                    <span className="text-[11px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
                      Founder &amp; Quantitative Trader
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-400">
                    Experienced Forex Trader with 3+ Years of Market Mastery
                  </p>
                </div>
              </div>

              {/* Verified Grammatical Bio Quote */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-transparent border-l-4 border-cyan-400 text-xs sm:text-sm text-slate-200 leading-relaxed shadow-sm space-y-2">
                <p>
                  "I am <strong>Syed Ayaz Shah</strong>, an experienced Forex trader with over 3 years of hands-on market execution. Black FX was built from the ground up to empower traders with institutional clarity — created specifically to document daily trading journals, preserve comprehensive backtesting records, and analyze real-time live charts with disciplined precision."
                </p>
              </div>

              {/* Three Core Platform Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 pt-1">
                <div className="p-3 rounded-xl bg-[#090d1c]/80 border border-blue-500/20 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-white">
                    <BookOpen size={14} className="text-cyan-400" />
                    <span>Daily Trading Journal</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Log executions, emotional state, and risk-to-reward metrics to eliminate psychological errors.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#090d1c]/80 border border-blue-500/20 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-white">
                    <FlaskConical size={14} className="text-blue-400" />
                    <span>Rigorous Backtesting</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Stress-test strategies across historical data to validate edge before deploying live capital.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#090d1c]/80 border border-blue-500/20 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-white">
                    <LineChart size={14} className="text-emerald-400" />
                    <span>Live Market Charts</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Analyze multi-timeframe price action with fluid real-time charting and technical precision.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Footer Copyright */}
          <div className="pt-6 mt-6 flex items-center justify-between text-xs text-slate-500 font-medium border-t border-slate-800/60">
            <span>© {new Date().getFullYear()} Black FX • Founded by SYED AYAZ SHAH S</span>
            <span className="text-slate-600 font-mono-numeric">v2.1 Institutional</span>
          </div>
        </div>

        {/* ================= RIGHT SECTION: MINIMALIST LUXURY AUTH ================= */}
        <div className="lg:col-span-5 p-6 sm:p-10 lg:p-14 flex flex-col justify-center relative z-20">
          
          <div className="w-full max-w-md mx-auto space-y-6">
            
            {/* Minimal Mode Switcher */}
            <div className="flex border-b border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => { setMode('signin'); setErrorMessage(null); setSuccessMessage(null); }}
                className={`pb-2 mr-6 text-sm font-black uppercase tracking-wider transition-colors cursor-pointer relative ${
                  mode === 'signin'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMessage(null); setSuccessMessage(null); }}
                className={`pb-2 text-sm font-black uppercase tracking-wider transition-colors cursor-pointer relative ${
                  mode === 'signup'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Header Text */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {mode === 'signin' ? 'Sign In to Terminal' : 'Create Trader Account'}
              </h2>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                {mode === 'signin'
                  ? 'Enter your credentials to access your private Black FX workspace.'
                  : 'Register your account to access strategy backtesting and trade analytics.'}
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium space-y-2 leading-relaxed">
                <div className="flex items-start space-x-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
                {isFetchError && (
                  <div className="pt-2 border-t border-rose-500/20 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center space-x-1"
                    >
                      <RefreshCw size={12} />
                      <span>Retry</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Success Alert */}
            {successMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-start space-x-2 leading-relaxed">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Clean Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#0b0e1b] border border-slate-800 rounded-xl pl-10 pr-3 py-3 text-white placeholder-slate-600 font-mono-numeric font-medium outline-none focus:border-cyan-400 transition text-xs"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'Min 6 characters' : 'Enter password'}
                    className="w-full bg-[#0b0e1b] border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-white placeholder-slate-600 font-mono-numeric font-medium outline-none focus:border-cyan-400 transition text-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-cyan-400 cursor-pointer transition"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input (Sign Up Only) */}
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password to confirm"
                      className={`w-full bg-[#0b0e1b] border rounded-xl pl-10 pr-10 py-3 text-white placeholder-slate-600 font-mono-numeric font-medium outline-none transition text-xs ${
                        confirmPassword && confirmPassword !== password
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-slate-800 focus:border-cyan-400'
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

              {/* Submit Button (Radiant Blue-Cyan Gradient like FundingPips) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black rounded-xl shadow-[0_4px_20px_rgba(14,165,233,0.35)] transition-all flex items-center justify-center space-x-2 text-xs uppercase tracking-wider cursor-pointer mt-4"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{mode === 'signin' ? 'Sign In to Terminal' : 'Create Trader Account'}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Mode Switch Helper */}
            <div className="pt-2 text-center text-xs text-slate-400 font-medium">
              {mode === 'signin' ? (
                <>
                  Don't have a trader account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setErrorMessage(null); setSuccessMessage(null); }}
                    className="font-bold text-cyan-400 hover:underline cursor-pointer"
                  >
                    Create Account First
                  </button>
                </>
              ) : (
                <>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setErrorMessage(null); setSuccessMessage(null); }}
                    className="font-bold text-cyan-400 hover:underline cursor-pointer"
                  >
                    Sign In Here
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
