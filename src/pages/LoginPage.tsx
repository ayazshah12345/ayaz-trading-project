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
  RefreshCw,
  TrendingUp,
  Activity,
  Layers,
  Target,
  Brain
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import founderImg from '../assets/founder.png';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface LoginPageProps {
  onLogin?: (email: string, userId?: string) => void;
}

// Realistic candlestick stream dataset for infinite loop
const rawCandles = [
  { open: 70, close: 95, high: 105, low: 65, vol: 24 },
  { open: 95, close: 85, high: 102, low: 78, vol: 18 },
  { open: 85, close: 110, high: 118, low: 80, vol: 32 },
  { open: 110, close: 125, high: 132, low: 105, vol: 38 },
  { open: 125, close: 115, high: 130, low: 110, vol: 20 },
  { open: 115, close: 135, high: 142, low: 112, vol: 42 },
  { open: 135, close: 130, high: 140, low: 122, vol: 19 },
  { open: 130, close: 148, high: 154, low: 128, vol: 48 },
  { open: 148, close: 142, high: 152, low: 138, vol: 22 },
  { open: 142, close: 160, high: 168, low: 140, vol: 54 },
  { open: 160, close: 155, high: 164, low: 150, vol: 26 },
  { open: 155, close: 175, high: 182, low: 152, vol: 62 },
  { open: 175, close: 165, high: 178, low: 160, vol: 30 },
  { open: 165, close: 180, high: 188, low: 162, vol: 45 },
  { open: 180, close: 172, high: 184, low: 168, vol: 25 },
  { open: 172, close: 195, high: 202, low: 170, vol: 68 },
  { open: 195, close: 190, high: 200, low: 185, vol: 28 },
  { open: 190, close: 210, high: 218, low: 188, vol: 72 },
  { open: 210, close: 205, high: 214, low: 198, vol: 31 },
  { open: 205, close: 225, high: 232, low: 202, vol: 76 },
];

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
    setSuccessMessage('Terminal unlocked. Loading workspace...');
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
              setErrorMessage('Connection unreachable (Failed to fetch). If an ad blocker or shield is active, please pause it or continue below.');
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
              setErrorMessage('Connection unreachable (Failed to fetch). If an ad blocker or shield is active, please pause it or continue below.');
            } else if (error.message.includes('Invalid login credentials')) {
              setErrorMessage('Invalid credentials. Please verify your email and password, or switch to Create Account.');
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
        setErrorMessage('Authentication service is initialising. Please refresh or verify connection.');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      if (isNetworkFailure(err)) {
        setIsFetchError(true);
        setErrorMessage('Connection unreachable (Failed to fetch). If an ad blocker or shield is active, please pause it or continue below.');
      } else {
        setErrorMessage(err.message || 'An error occurred during authentication.');
      }
      setIsLoading(false);
    }
  };

  const tickerText = "BLACK FX THE TRADERS BACKTESTING AND JOURNAL PLATFORM";

  // Build looping sequence of candles for the animated SVG
  const renderCandleStream = () => {
    const candleWidth = 7;
    const gap = 16;
    const chartHeight = 150;
    const baseY = 120;

    // Duplicate dataset twice for seamless infinite scroll
    const stream = [...rawCandles, ...rawCandles];

    return (
      <svg
        className="w-full h-full overflow-visible"
        viewBox={`0 0 ${stream.length * gap} ${chartHeight}`}
      >
        <defs>
          <linearGradient id="bullGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="bearGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="goldLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Horizontal grid guide lines */}
        <line x1="0" y1="35" x2={stream.length * gap} y2="35" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
        <line x1="0" y1="75" x2={stream.length * gap} y2="75" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
        <line x1="0" y1="115" x2={stream.length * gap} y2="115" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />

        {/* Candlesticks & Volume bars */}
        {stream.map((c, i) => {
          const isBull = c.close >= c.open;
          const x = i * gap + 10;
          const top = baseY - Math.max(c.open, c.close) * 0.45;
          const bottom = baseY - Math.min(c.open, c.close) * 0.45;
          const bodyHeight = Math.max(3, bottom - top);
          const wickTop = baseY - c.high * 0.45;
          const wickBottom = baseY - c.low * 0.45;

          return (
            <g key={i}>
              {/* Wick */}
              <line
                x1={x}
                y1={wickTop}
                x2={x}
                y2={wickBottom}
                stroke={isBull ? '#10b981' : '#ef4444'}
                strokeWidth={1.2}
                opacity={0.85}
              />
              {/* Candle Body */}
              <rect
                x={x - candleWidth / 2}
                y={top}
                width={candleWidth}
                height={bodyHeight}
                rx={1.5}
                fill={isBull ? 'url(#bullGrad)' : 'url(#bearGrad)'}
              />
              {/* Volume Bar below */}
              <rect
                x={x - candleWidth / 2}
                y={chartHeight - c.vol * 0.45}
                width={candleWidth}
                height={c.vol * 0.45}
                rx={1}
                fill={isBull ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}
              />
            </g>
          );
        })}

        {/* Exponential Moving Average Golden Curve */}
        <path
          d={stream.reduce((acc, c, i) => {
            const x = i * gap + 10;
            const y = baseY - (c.open + c.close) / 2 * 0.45;
            return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
          }, '')}
          fill="none"
          stroke="url(#goldLineGrad)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="drop-shadow(0 0 4px rgba(245,158,11,0.5))"
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#07080c] text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-amber-500 selection:text-black">
      
      {/* ================= TOP CONTINUOUS MOVING TICKER ================= */}
      <div className="w-full bg-[#0b0d13] border-b border-amber-500/20 py-2.5 overflow-hidden whitespace-nowrap shadow-sm z-30 select-none">
        <div className="animate-marquee flex items-center space-x-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center space-x-8 shrink-0">
              <span className="flex items-center space-x-2 text-xs font-black tracking-widest text-amber-400">
                <Zap size={13} className="text-amber-400 fill-amber-400" />
                <span>{tickerText}</span>
              </span>
              <span className="text-slate-600 font-bold">•</span>
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                ALGORITHMIC BACKTESTING SUITE
              </span>
              <span className="text-slate-600 font-bold">•</span>
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                INSTITUTIONAL EXECUTION JOURNAL
              </span>
              <span className="text-slate-600 font-bold">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 relative">
        {/* Ambient Dark-Theme Glows */}
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-yellow-600/5 blur-[150px] pointer-events-none" />

        {/* ================= LEFT SECTION: BRAND, FOUNDER & LIVE CANDLESTICK GRAPH ================= */}
        <div className="lg:col-span-7 p-6 sm:p-12 lg:p-16 flex flex-col justify-between relative z-10">
          
          <div className="space-y-8 max-w-2xl">
            
            {/* Free-Floating Brand & Logo */}
            <div className="flex items-center space-x-5">
              <div className="relative group">
                <div className="absolute -inset-2 rounded-full bg-amber-500/25 blur-xl opacity-75 group-hover:opacity-100 transition duration-700" />
                <img
                  src={logoImg}
                  alt="Black FX Logo"
                  className="relative w-20 h-20 sm:w-24 sm:h-24 object-contain filter drop-shadow-[0_8px_24px_rgba(245,158,11,0.35)] transform group-hover:scale-105 transition duration-300"
                />
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-mono-numeric">
                  BLACK <span className="text-amber-400">FX</span>
                </h1>
                <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-300 uppercase mt-1">
                  The Traders Backtesting and Journal Platform
                </p>
              </div>
            </div>

            {/* ================= MOVING CANDLESTICK & FINANCIAL GRAPH ================= */}
            <div className="relative pt-2 pb-2">
              <div className="flex items-center justify-between text-[11px] font-mono-numeric text-slate-400 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="flex items-center space-x-1 font-bold text-white">
                    <Activity size={13} className="text-amber-400" />
                    <span>XAU/USD M15 QUANT STREAM</span>
                  </span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                    ▲ +1.48%
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 tracking-wider">
                  REAL-TIME ORDER FLOW SYNTHESIS
                </span>
              </div>

              {/* Looping Candlestick Chart Window */}
              <div className="w-full h-36 relative overflow-hidden rounded-xl bg-gradient-to-b from-[#0b0d14]/90 to-[#07080c] border border-slate-800/80 shadow-2xl">
                {/* Horizontal Live Laser Price Marker */}
                <div className="absolute top-[48px] inset-x-0 border-b border-amber-400/40 border-dashed z-20 pointer-events-none laser-glow" />
                <div className="absolute top-[40px] right-3 bg-amber-500 text-black text-[10px] font-mono-numeric font-black px-1.5 py-0.5 rounded shadow z-20 pointer-events-none">
                  2,684.50
                </div>

                {/* Looping Candlesticks Stream */}
                <div className="animate-chart-stream h-full flex items-center">
                  <div className="w-[640px] h-full shrink-0">
                    {renderCandleStream()}
                  </div>
                  <div className="w-[640px] h-full shrink-0">
                    {renderCandleStream()}
                  </div>
                </div>

                {/* Vignette edge shadows */}
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#07080c] to-transparent pointer-events-none z-10" />
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#07080c] to-transparent pointer-events-none z-10" />
              </div>
            </div>

            {/* Free-Floating Founder Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-amber-600 shadow-lg overflow-hidden">
                    <img
                      src={founderImg}
                      alt="Syed Ayaz Shah - Founder of Black FX"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-base sm:text-lg font-black text-white tracking-wide">
                      SYED AYAZ SHAH S
                    </span>
                    <span className="text-[11px] font-bold text-amber-400">
                      • Founder
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-400">
                    Architect &amp; Quantitative Strategist
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed italic max-w-xl pl-2 border-l-2 border-amber-500/50">
                "Engineered for dedicated traders who require complete clarity, statistical rigor, and institutional-level journaling. Black FX bridges the gap between historical simulation and real-world capital growth."
              </p>
            </div>

            {/* ================= COMPREHENSIVE TRADING PRINCIPLES ================= */}
            <div className="pt-2 space-y-3">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400/90 flex items-center space-x-1.5">
                <TrendingUp size={13} />
                <span>The Black FX Core Trading Disciplines</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-white">
                    <Target size={14} className="text-emerald-400" />
                    <span>Asymmetric R:R</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Never risk 1R to make less than 3R. Positive expectancy guarantees account longevity regardless of win rate.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-white">
                    <Layers size={14} className="text-amber-400" />
                    <span>Algorithmic Backtesting</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Stress-test trading setups across 300+ historical cycles before committing live capital to the market.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-white">
                    <Brain size={14} className="text-yellow-400" />
                    <span>Psychological Execution</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Log emotional biases, session discipline, and mistake patterns to eliminate revenge trading and FOMO.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Copyright */}
          <div className="pt-8 mt-6 flex items-center justify-between text-xs text-slate-500 font-medium border-t border-slate-800/40">
            <span>© {new Date().getFullYear()} Black FX • Founded by SYED AYAZ SHAH S</span>
            <span className="text-slate-600 font-mono-numeric">v1.0 Institutional</span>
          </div>
        </div>

        {/* ================= RIGHT SECTION: MINIMALIST LUXURY AUTH ================= */}
        <div className="lg:col-span-5 p-6 sm:p-12 lg:p-16 flex flex-col justify-center relative z-20">
          
          <div className="w-full max-w-md mx-auto space-y-6">
            
            {/* Minimal Mode Switcher */}
            <div className="flex border-b border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => { setMode('signin'); setErrorMessage(null); setSuccessMessage(null); }}
                className={`pb-2 mr-6 text-sm font-black uppercase tracking-wider transition-colors cursor-pointer relative ${
                  mode === 'signin'
                    ? 'text-amber-400 border-b-2 border-amber-400'
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
                    ? 'text-amber-400 border-b-2 border-amber-400'
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
                      onClick={() => handleLocalBypass(email)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider transition cursor-pointer"
                    >
                      Enter via Local Mode
                    </button>
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
                    className="w-full bg-[#0d0f17] border border-slate-800 rounded-xl pl-10 pr-3 py-3 text-white placeholder-slate-600 font-mono-numeric font-medium outline-none focus:border-amber-400 transition text-xs"
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
                    className="w-full bg-[#0d0f17] border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-white placeholder-slate-600 font-mono-numeric font-medium outline-none focus:border-amber-400 transition text-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-amber-400 cursor-pointer transition"
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
                      className={`w-full bg-[#0d0f17] border rounded-xl pl-10 pr-10 py-3 text-white placeholder-slate-600 font-mono-numeric font-medium outline-none transition text-xs ${
                        confirmPassword && confirmPassword !== password
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-slate-800 focus:border-amber-400'
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
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-xs uppercase tracking-wider cursor-pointer mt-4"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{mode === 'signin' ? 'Sign In to Terminal' : 'Register Trader Account'}</span>
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
                    className="font-bold text-amber-400 hover:underline cursor-pointer"
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
                    className="font-bold text-amber-400 hover:underline cursor-pointer"
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
