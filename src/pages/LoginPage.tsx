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
  Shield,
  RefreshCw,
  Sparkles
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

  return (
    <div className="min-h-screen w-full bg-[#07080c] text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-amber-500 selection:text-black">
      
      {/* ================= ULTRA-SLEEK MOVING TICKER ================= */}
      <div className="w-full bg-[#0c0e14] border-b border-amber-500/20 py-2.5 overflow-hidden whitespace-nowrap shadow-sm z-30 select-none">
        <div className="animate-marquee flex items-center space-x-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center space-x-8 shrink-0">
              <span className="flex items-center space-x-2 text-xs font-black tracking-widest text-amber-400">
                <Zap size={13} className="text-amber-400 fill-amber-400" />
                <span>{tickerText}</span>
              </span>
              <span className="text-slate-600 font-bold">•</span>
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                QUANTITATIVE STRATEGY LAB
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

      {/* Main Body */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 relative">
        {/* Ethereal background ambient light rays */}
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-yellow-600/5 blur-[150px] pointer-events-none" />

        {/* ================= LEFT SECTION: FREE-FLOWING FOUNDER & BRAND (NO BOXES) ================= */}
        <div className="lg:col-span-7 p-6 sm:p-12 lg:p-16 flex flex-col justify-between relative z-10">
          
          <div className="space-y-10 max-w-2xl">
            
            {/* Freely Floating Highlighted Shield Logo & Brand Title */}
            <div className="space-y-6">
              <div className="flex items-center space-x-5">
                
                {/* Highlighted Logo without any ugly box */}
                <div className="relative group">
                  {/* Subtle golden ambient glow */}
                  <div className="absolute -inset-2 rounded-full bg-amber-500/30 blur-xl opacity-75 group-hover:opacity-100 transition duration-700" />
                  
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
            </div>

            {/* FREE-FLOWING FOUNDER SECTION (NO BOX / NO CONTAINER) */}
            <div className="pt-2 space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {/* Founder Photo - Floating with minimal luxury gold accent ring */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-amber-600 shadow-xl overflow-hidden">
                    <img
                      src={founderImg}
                      alt="Syed Ayaz Shah - Founder of Black FX"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>

                {/* Founder Typography without any box */}
                <div className="space-y-1">
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

              {/* Founder Quote / Description - Floating cleanly */}
              <p className="text-sm text-slate-300 font-normal leading-relaxed italic max-w-xl pl-1 border-l-2 border-amber-500/40">
                "Engineered for dedicated traders who require complete clarity, statistical rigor, and institutional-level journaling. Black FX bridges the gap between historical simulation and real-world capital growth."
              </p>

              {/* Core Features - Clean Minimalist Floating Row */}
              <div className="pt-4 flex flex-wrap gap-y-2 gap-x-6 text-xs text-slate-400 font-medium">
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Rule-Based Backtesting</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>R-Multiple &amp; P&amp;L Metrics</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Isolated Personal Records</span>
                </span>
              </div>
            </div>

          </div>

          {/* Footer Copyright - Minimal & Clean */}
          <div className="pt-10 mt-8 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>© {new Date().getFullYear()} Black FX • Founded by SYED AYAZ SHAH S</span>
            <span className="text-slate-600 font-mono-numeric">v1.0</span>
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
