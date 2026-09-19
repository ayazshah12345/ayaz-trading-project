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
  Layers,
  Target,
  Brain,
  Sparkles,
  RefreshCw,
  Cpu,
  Flame,
  ShieldCheck
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import founderImg from '../assets/founder.png';
import aiTradingTerminalImg from '../assets/ai_trading_terminal.jpg';
import aiBullUptrendImg from '../assets/ai_bull_uptrend.jpg';
import tradingDeskImg from '../assets/trading_desk.jpg';
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

  // Active AI Trading Image Gallery Switcher
  const [activeImageTab, setActiveImageTab] = useState<'bull' | 'terminal' | 'desk'>('bull');

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
              setErrorMessage('Connection unreachable (Failed to fetch). Please check your internet or firewall and retry.');
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
              setErrorMessage('Connection unreachable (Failed to fetch). Please check your connection and retry.');
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
        setErrorMessage('Authentication service is configuring. Please refresh or verify connection.');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      if (isNetworkFailure(err)) {
        setIsFetchError(true);
        setErrorMessage('Connection unreachable (Failed to fetch). Please check your network and retry.');
      } else {
        setErrorMessage(err.message || 'An error occurred during authentication.');
      }
      setIsLoading(false);
    }
  };

  const tickerItems = [
    { pair: 'EUR/USD', price: '1.08425', change: '+0.42%', up: true },
    { pair: 'GBP/USD', price: '1.29810', change: '+0.58%', up: true },
    { pair: 'XAU/USD (Gold)', price: '$2,658.40', change: '+1.34%', up: true },
    { pair: 'BTC/USD', price: '$68,420.00', change: '+3.12%', up: true },
    { pair: 'US100', price: '19,850.40', change: '+0.85%', up: true },
    { pair: 'USD/JPY', price: '153.15', change: '-0.18%', up: false },
  ];

  return (
    <div className="min-h-screen w-full bg-[#07080c] text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-amber-500 selection:text-black">
      
      {/* ================= TOP CONTINUOUS MOVING TICKER ================= */}
      <div className="w-full bg-[#090b11] border-b border-amber-500/20 py-2 overflow-hidden whitespace-nowrap shadow-sm z-30 select-none">
        <div className="animate-marquee flex items-center space-x-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-6 shrink-0">
              <span className="flex items-center space-x-1.5 text-xs font-black tracking-widest text-amber-400">
                <Zap size={13} className="text-amber-400 fill-amber-400" />
                <span>BLACK FX THE TRADERS BACKTESTING AND JOURNAL PLATFORM</span>
              </span>
              <span className="text-slate-700">•</span>
              {tickerItems.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-1.5 text-[11px] font-mono-numeric">
                  <span className="font-bold text-white">{item.pair}</span>
                  <span className="text-slate-300 font-medium">{item.price}</span>
                  <span className={`text-[10px] font-bold px-1 rounded ${item.up ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
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
        {/* Ambient Dark-Theme Glows */}
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none" />

        {/* ================= LEFT SECTION: BRAND, CREATIVE UPTREND GRAPH & AI TRADING IMAGES ================= */}
        <div className="lg:col-span-7 p-5 sm:p-10 lg:p-12 flex flex-col justify-between relative z-10">
          
          <div className="space-y-6 max-w-2xl">
            
            {/* Free-Floating Brand & Company Logo */}
            <div className="flex items-center space-x-4 sm:space-x-5">
              <div className="relative group">
                <div className="absolute -inset-2 rounded-full bg-amber-500/25 blur-xl opacity-75 group-hover:opacity-100 transition duration-700" />
                <img
                  src={logoImg}
                  alt="Black FX Logo"
                  className="relative w-20 h-20 sm:w-22 sm:h-22 object-contain filter drop-shadow-[0_8px_24px_rgba(245,158,11,0.4)] transform group-hover:scale-105 transition duration-300"
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

            {/* ================= PURE CREATIVE UPTREND LINE GRAPH (ADAPTS TO BACKGROUND) ================= */}
            <div className="relative pt-1">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="flex items-center space-x-1.5 font-black text-amber-400 text-xs tracking-wide uppercase">
                    <TrendingUp size={14} className="text-emerald-400" />
                    <span>Algorithmic Uptrend Alpha Trajectory</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    +384.8% NET ALPHA
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono-numeric">
                  PERPETUAL MOMENTUM
                </span>
              </div>

              {/* Seamless, Free-Flowing Uptrend Line Graph that Adapts to the Dark Background */}
              <div className="w-full h-36 sm:h-40 relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#0b0e17]/60 via-[#07080c]/80 to-[#07080c] border border-slate-800/60 shadow-2xl backdrop-blur-xs">
                
                {/* SVG Pure Uptrend Line Graph */}
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 600 160"
                  preserveAspectRatio="none"
                >
                  <defs>
                    {/* Seamless Gradient Fill that fades into the exact background color */}
                    <linearGradient id="uptrendBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                      <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#07080c" stopOpacity="0.0" />
                    </linearGradient>

                    {/* Glowing Stroke Gradient for the Uptrend Line */}
                    <linearGradient id="uptrendLineGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#059669" />
                      <stop offset="40%" stopColor="#10b981" />
                      <stop offset="75%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>

                    <linearGradient id="secondaryWaveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1e293b" />
                      <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>

                  {/* Subtle Background Guide Lines */}
                  <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
                  <line x1="0" y1="80" x2="600" y2="80" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
                  <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />

                  {/* Secondary Harmonic Wave */}
                  <path
                    d="M 0 145 C 60 140, 110 135, 170 120 C 230 105, 290 115, 350 90 C 410 65, 470 75, 530 45 L 600 28"
                    fill="none"
                    stroke="url(#secondaryWaveGrad)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    opacity="0.6"
                  />

                  {/* Translucent Uptrend Filled Area (Fades to bottom #07080c background) */}
                  <path
                    d="M 0 140 C 50 135, 100 125, 150 112 C 200 100, 240 108, 290 85 C 340 62, 390 74, 440 48 C 490 22, 540 30, 600 12 L 600 160 L 0 160 Z"
                    fill="url(#uptrendBgGrad)"
                  />

                  {/* Primary Majestic Glowing Uptrend Line */}
                  <path
                    d="M 0 140 C 50 135, 100 125, 150 112 C 200 100, 240 108, 290 85 C 340 62, 390 74, 440 48 C 490 22, 540 30, 600 12"
                    fill="none"
                    stroke="url(#uptrendLineGrad)"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    filter="drop-shadow(0 0 10px rgba(16,185,129,0.75))"
                  />

                  {/* Glowing Milestone Dots along the Uptrend Line */}
                  <circle cx="150" cy="112" r="3.5" fill="#10b981" filter="drop-shadow(0 0 6px #10b981)" />
                  <circle cx="290" cy="85" r="4" fill="#10b981" filter="drop-shadow(0 0 6px #10b981)" />
                  <circle cx="440" cy="48" r="4.5" fill="#f59e0b" filter="drop-shadow(0 0 7px #f59e0b)" />
                  <circle cx="598" cy="12" r="5" fill="#fbbf24" filter="drop-shadow(0 0 10px #fbbf24)" />
                </svg>

                {/* Floating Aesthetic Badges inside the Chart */}
                <div className="absolute top-3 right-4 flex items-center space-x-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-500/30 text-[10px] font-mono-numeric">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-white font-bold">ALL-TIME HIGH RUN</span>
                  <span className="text-amber-400 font-extrabold">+384.8%</span>
                </div>

                <div className="absolute bottom-3 left-4 flex items-center space-x-3 text-[10px] text-slate-400 font-mono-numeric">
                  <span className="flex items-center text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
                    Accumulation Phase
                  </span>
                  <span>→</span>
                  <span className="text-amber-300 font-bold">Institutional Markup</span>
                  <span>→</span>
                  <span className="text-yellow-400 font-extrabold">Exponential Expansion</span>
                </div>
              </div>
            </div>

            {/* ================= AI TRADING IMAGE SHOWCASE GALLERY ================= */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-white font-bold">
                  <Sparkles size={14} className="text-amber-400" />
                  <span>AI-Generated Institutional Trading Visuals</span>
                </div>

                {/* Switcher Pills */}
                <div className="flex items-center space-x-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setActiveImageTab('bull')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                      activeImageTab === 'bull'
                        ? 'bg-amber-500 text-black shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Cyber Bull
                  </button>
                  <button
                    onClick={() => setActiveImageTab('terminal')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                      activeImageTab === 'terminal'
                        ? 'bg-amber-500 text-black shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    AI Command Desk
                  </button>
                  <button
                    onClick={() => setActiveImageTab('desk')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                      activeImageTab === 'desk'
                        ? 'bg-amber-500 text-black shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Trading Station
                  </button>
                </div>
              </div>

              {/* Display Active AI Trading Image with Cinematic Overlay */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 group shadow-2xl h-44 sm:h-48 bg-[#090b12]">
                <img
                  src={
                    activeImageTab === 'bull'
                      ? aiBullUptrendImg
                      : activeImageTab === 'terminal'
                      ? aiTradingTerminalImg
                      : tradingDeskImg
                  }
                  alt="AI Trading Visual"
                  className="w-full h-full object-cover object-center filter brightness-95 contrast-105 group-hover:scale-102 transition duration-700"
                />
                
                {/* Vignette Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#07080c]/60 via-transparent to-transparent pointer-events-none" />

                {/* Description Pill */}
                <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-black/80 border border-amber-500/40 text-amber-400 backdrop-blur-md">
                      {activeImageTab === 'bull'
                        ? 'AI Bull Momentum Engine'
                        : activeImageTab === 'terminal'
                        ? 'Holographic Quant Core'
                        : 'Multi-Screen Order Tape'}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-200 hidden sm:inline drop-shadow-md">
                      {activeImageTab === 'bull'
                        ? 'Algorithmic uptrend trajectories & liquidity sweeps'
                        : activeImageTab === 'terminal'
                        ? 'Neural networks decoding institutional liquidity flow'
                        : 'Institutional execution & precision backtesting suite'}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono-numeric text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                    BLACK FX AI
                  </span>
                </div>
              </div>
            </div>

            {/* Free-Floating Founder Section */}
            <div className="space-y-2.5 pt-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-amber-600 shadow-lg overflow-hidden">
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
            <div className="pt-1 space-y-2">
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
          <div className="pt-6 mt-6 flex items-center justify-between text-xs text-slate-500 font-medium border-t border-slate-800/40">
            <span>© {new Date().getFullYear()} Black FX • Founded by SYED AYAZ SHAH S</span>
            <span className="text-slate-600 font-mono-numeric">v2.0 Institutional</span>
          </div>
        </div>

        {/* ================= RIGHT SECTION: MINIMALIST LUXURY AUTH ================= */}
        <div className="lg:col-span-5 p-5 sm:p-10 lg:p-12 flex flex-col justify-center relative z-20">
          
          <div className="w-full max-w-md mx-auto space-y-5">
            
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
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-xs uppercase tracking-wider cursor-pointer mt-3"
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
