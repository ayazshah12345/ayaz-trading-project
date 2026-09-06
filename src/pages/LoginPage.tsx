import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Crown,
  Sparkles
} from 'lucide-react';
import logoImg from '../assets/logo.jpg';
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

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
            if (error.message.includes('30 seconds') || error.status === 429) {
              setErrorMessage('Rate limit reached: Please wait 30 seconds before submitting another request.');
            } else {
              setErrorMessage(error.message);
            }
            setIsLoading(false);
            return;
          }

          const userId = data.user?.id || `user-${Date.now()}`;
          const userEmail = data.user?.email || cleanEmail;
          
          setSuccessMessage('Account registered! Opening your Terminal...');
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
            if (error.message.includes('Invalid login credentials')) {
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
        setErrorMessage('Database authentication service is initialising. Please refresh or verify your connection.');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setErrorMessage(err.message || 'An error occurred during authentication.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--bg-main)] theme-text-primary flex flex-col lg:grid lg:grid-cols-12 font-sans overflow-x-hidden">
      
      {/* ================= LEFT SIDE: Company Overview & Description ================= */}
      <div className="lg:col-span-7 bg-gradient-to-br from-[#090d16] via-[#111827] to-[#1e1b4b] p-6 sm:p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden text-white border-b lg:border-b-0 lg:border-r border-[var(--border-color)] min-h-[500px] lg:min-h-screen">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        {/* Top Logo & Founder Badge Header */}
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3.5">
              <img
                src={logoImg}
                alt="Trading Aura Logo"
                className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl border-2 border-amber-500/50 shadow-xl object-cover"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-sans flex items-center space-x-2">
                  <span>TRADING AURA</span>
                  <Sparkles size={18} className="text-amber-400 animate-pulse" />
                </h1>
                <p className="text-[11px] text-amber-400 font-extrabold tracking-wider uppercase font-mono-numeric">
                  Institutional Charting & Trade Terminal
                </p>
              </div>
            </div>

            {/* Founder Badge */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-black shadow-lg">
              <Crown size={14} className="text-amber-400 shrink-0" />
              <span className="tracking-wide">Founder: Syed Ayaz Shah</span>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tight text-white">
              View Live Charts, Analyze Markets & Save Trade Journal & Backtesting Records
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
              Trading Aura is a professional platform designed to view real-time charts, conduct deep market analysis, and securely save your daily trade journals and strategy backtesting records under your isolated trader account.
            </p>
          </div>
        </div>

        {/* Middle Platform Feature Cards */}
        <div className="relative z-10 my-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-700/60 space-y-2 backdrop-blur-md hover:border-amber-500/40 transition">
              <BarChart2 className="text-amber-400" size={22} />
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Live Charting</h3>
              <p className="text-[11px] text-slate-300 leading-snug">
                View full screen TradingView charts for Gold, Forex & Crypto assets.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-700/60 space-y-2 backdrop-blur-md hover:border-emerald-500/40 transition">
              <BookMarked className="text-emerald-400" size={22} />
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Trade Journal</h3>
              <p className="text-[11px] text-slate-300 leading-snug">
                Log entries, track P&L analytics, win rates, and risk multiples seamlessly.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-700/60 space-y-2 backdrop-blur-md hover:border-indigo-500/40 transition">
              <FlaskConical className="text-indigo-400" size={22} />
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Backtesting Suite</h3>
              <p className="text-[11px] text-slate-300 leading-snug">
                Test trading strategies, log historical trades, and analyze equity curves.
              </p>
            </div>
          </div>

          {/* Security Banner */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between font-mono-numeric backdrop-blur-md">
            <div className="flex items-center space-x-3.5">
              <ShieldCheck className="text-amber-400 shrink-0" size={24} />
              <div>
                <div className="text-[11px] font-black text-amber-400 uppercase tracking-wider">
                  Isolated Trader Account Vault
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-white">
                  Secure Encrypted Private Storage Active
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Founder Credit */}
        <div className="relative z-10 text-[11px] text-slate-400 font-medium flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-4">
          <span>© {new Date().getFullYear()} Trading Aura. All rights reserved. • Founded by Syed Ayaz Shah</span>
          <span className="text-amber-400 font-mono-numeric font-bold">v1.0.0 Terminal</span>
        </div>
      </div>

      {/* ================= RIGHT SIDE: Auth Form (Sign In / Sign Up) ================= */}
      <div className="lg:col-span-5 p-6 sm:p-10 lg:p-14 flex flex-col justify-between bg-[var(--bg-card)] min-h-[500px] lg:min-h-screen border-t lg:border-t-0 lg:border-l border-[var(--border-color)]">
        <div className="space-y-6 my-auto">
          
          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-xl">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition cursor-pointer ${
                mode === 'signin'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'theme-text-secondary hover:theme-text-primary'
              }`}
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition cursor-pointer ${
                mode === 'signup'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'theme-text-secondary hover:theme-text-primary'
              }`}
            >
              <UserPlus size={16} />
              <span>Create Account</span>
            </button>
          </div>

          {/* Header Text */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-black theme-text-primary tracking-tight">
              {mode === 'signin' ? 'Sign In to Terminal' : 'Create Trader Account'}
            </h2>
            <p className="text-xs theme-text-secondary mt-1.5 font-medium leading-relaxed">
              {mode === 'signin'
                ? 'Enter your credentials to access your private Trading Aura workspace.'
                : 'Register your account to access real-time charts and private trade records.'}
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-start space-x-2.5 leading-relaxed">
              <AlertCircle size={17} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-start space-x-2.5 leading-relaxed">
              <CheckCircle2 size={17} className="shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold theme-text-primary uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none theme-text-secondary">
                  <Mail size={17} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-xl pl-10 pr-3 py-3 theme-text-primary font-mono-numeric font-bold outline-none focus:border-amber-500 transition text-xs shadow-xs"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold theme-text-primary uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none theme-text-secondary">
                  <Lock size={17} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Create password (min 6 characters)' : 'Enter your password'}
                  className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-xl pl-10 pr-10 py-3 theme-text-primary font-mono-numeric font-bold outline-none focus:border-amber-500 transition text-xs shadow-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center theme-text-secondary hover:text-amber-500 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input (Sign Up Only) */}
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold theme-text-primary uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none theme-text-secondary">
                    <Lock size={17} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password to confirm"
                    className={`w-full bg-[var(--bg-subpanel)] border rounded-xl pl-10 pr-10 py-3 theme-text-primary font-mono-numeric font-bold outline-none transition text-xs shadow-xs ${
                      confirmPassword && confirmPassword !== password
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-[var(--border-color)] focus:border-amber-500'
                    }`}
                    required
                  />
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-[11px] font-bold text-rose-500 mt-1">
                    ⚠️ Passwords do not match
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-xs uppercase tracking-wider cursor-pointer mt-3"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In to Terminal' : 'Register Trader Account'}</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Toggle */}
        <div className="pt-5 border-t border-[var(--border-color)] text-center text-xs theme-text-secondary font-medium">
          {mode === 'signin' ? (
            <>
              Don't have a trader account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMessage(null); setSuccessMessage(null); }}
                className="font-extrabold text-amber-500 hover:underline cursor-pointer"
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
                className="font-extrabold text-amber-500 hover:underline cursor-pointer"
              >
                Sign In Here
              </button>
            </>
          )}
        </div>
      </div>

    </div>
  );
};
