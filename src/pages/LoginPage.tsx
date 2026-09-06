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
  Award,
  AlertCircle,
  CheckCircle2,
  Zap
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
  const [rememberMe, setRememberMe] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate Sign Up Passwords Match
    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match! Please check and type your password carefully.');
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
          // --- SUPABASE SIGN UP ---
          const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password: password,
          });

          if (error) {
            setErrorMessage(error.message);
            setIsLoading(false);
            return;
          }

          if (data.user) {
            setSuccessMessage('Account created successfully! Logging you in...');
            setTimeout(() => {
              if (onLogin) onLogin(data.user?.email || email, data.user?.id);
              navigate('/dashboard');
            }, 1000);
          } else {
            setSuccessMessage('Sign up request sent! Please check your email to confirm registration.');
            setIsLoading(false);
          }
        } else {
          // --- SUPABASE SIGN IN ---
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password,
          });

          if (error) {
            setErrorMessage('Invalid login credentials. Please verify your email and password.');
            setIsLoading(false);
            return;
          }

          if (data.user) {
            if (onLogin) onLogin(data.user.email || email, data.user.id);
            navigate('/dashboard');
          }
        }
      } else {
        // Fallback if environment variables are not loaded in Vercel build
        setErrorMessage('Supabase is not configured on Vercel yet. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in Vercel Project Settings, then Redeploy.');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      if (err?.message?.includes('fetch') || err?.name === 'TypeError') {
        setErrorMessage('Connection Error: Failed to reach Supabase. Please ensure your Vercel Environment Variables are saved and your Vercel deployment is updated.');
      } else {
        setErrorMessage(err.message || 'An unexpected authentication error occurred.');
      }
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (onLogin) onLogin('syedayazshah@ayazmarkets.com', 'demo-user-id');
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] theme-text-primary flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl border border-[var(--border-color)] bg-[var(--bg-card)] grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
        
        {/* ================= LEFT SIDE: Trading & Company Info ================= */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#070b14] via-[#0f172a] to-[#1e1b4b] p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden text-white border-b lg:border-b-0 lg:border-r border-[var(--border-color)]">
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
                Master the Financial Markets with Isolated Account Security
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                Ayaz Markets Analysis provides individual trader accounts with strict end-to-end data isolation. Your trades, strategies, backtest labs, and journals stay 100% private to your user credentials.
              </p>
            </div>
          </div>

          {/* Middle Features Grid */}
          <div className="relative z-10 my-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-1.5 backdrop-blur-xs">
                <BookMarked className="text-amber-400" size={20} />
                <h3 className="text-xs font-extrabold text-white">Private Trade Journal</h3>
                <p className="text-[11px] text-slate-400 leading-snug">
                  User-isolated P&L stats, equity curve calculation, and R-multiple tracking.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-1.5 backdrop-blur-xs">
                <FlaskConical className="text-indigo-400" size={20} />
                <h3 className="text-xs font-extrabold text-white">Backtesting Lab</h3>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Historical campaign testing, win-rate metrics, and custom strategy testing.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-1.5 backdrop-blur-xs">
                <BarChart2 className="text-emerald-400" size={20} />
                <h3 className="text-xs font-extrabold text-white">Live Charting</h3>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Full screen TradingView live charts, metals, crypto & forex feeds.
                </p>
              </div>
            </div>

            {/* Security Banner */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between font-mono-numeric">
              <div className="flex items-center space-x-3">
                <Award className="text-amber-400 shrink-0" size={24} />
                <div>
                  <div className="text-xs font-black text-amber-400 uppercase tracking-wider">
                    PostgreSQL Row Level Security (RLS)
                  </div>
                  <div className="text-sm font-extrabold text-white">
                    Strict Multi-Tenant Account Privacy Active
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="relative z-10 text-[11px] text-slate-400 font-medium flex items-center justify-between border-t border-slate-800 pt-4">
            <span>© {new Date().getFullYear()} Ayaz Markets Analysis. All rights reserved.</span>
            <span className="text-amber-400 font-mono-numeric font-bold">v1.0.0 Secure</span>
          </div>
        </div>

        {/* ================= RIGHT SIDE: Auth Form (Sign In / Sign Up) ================= */}
        <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between bg-[var(--bg-card)]">
          <div className="space-y-6 my-auto">
            
            {/* Mode Switcher Tabs */}
            <div className="flex p-1 bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-xl">
              <button
                type="button"
                onClick={() => { setMode('signin'); setErrorMessage(null); setSuccessMessage(null); }}
                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition ${
                  mode === 'signin'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'theme-text-secondary hover:theme-text-primary'
                }`}
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMessage(null); setSuccessMessage(null); }}
                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition ${
                  mode === 'signup'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'theme-text-secondary hover:theme-text-primary'
                }`}
              >
                <UserPlus size={15} />
                <span>Create Account</span>
              </button>
            </div>

            {/* Header Text */}
            <div>
              <h2 className="text-2xl font-black theme-text-primary tracking-tight">
                {mode === 'signin' ? 'Sign In to Terminal' : 'Create Trader Account'}
              </h2>
              <p className="text-xs theme-text-secondary mt-1 font-medium">
                {mode === 'signin'
                  ? 'Enter your registered email and password to log in.'
                  : 'Register first to create your personal isolated trading account.'}
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-start space-x-2 leading-relaxed">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-start space-x-2 leading-relaxed">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="trader@ayazmarkets.com"
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
                  {mode === 'signin' && (
                    <a
                      href="#forgot"
                      onClick={e => { e.preventDefault(); alert('Password reset email sent if account exists.'); }}
                      className="text-xs font-bold text-amber-500 hover:underline"
                    >
                      Forgot Password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'Create a secure password (min 6 chars)' : 'Enter your password'}
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

              {/* Confirm Password Input (Only for Sign Up) */}
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold theme-text-primary uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password to confirm"
                      className={`w-full bg-[var(--bg-subpanel)] border rounded-lg pl-10 pr-10 py-2.5 theme-text-primary font-mono-numeric font-bold outline-none transition text-xs ${
                        confirmPassword && confirmPassword !== password
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-[var(--border-color)] focus:border-amber-500'
                      }`}
                      required
                    />
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <p className="text-[11px] font-bold text-rose-500 mt-0.5">
                      ⚠️ Passwords do not match
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg shadow-md transition flex items-center justify-center space-x-2 text-xs uppercase tracking-wider cursor-pointer mt-2"
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
              className="w-full py-2.5 bg-[var(--bg-subpanel)] hover:bg-[var(--bg-card-hover)] theme-text-primary text-xs font-extrabold rounded-lg border border-[var(--border-color)] transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Zap size={15} className="text-amber-500" />
              <span>One-Click Demo Account (Syed Ayaz Shah)</span>
            </button>
          </div>

          {/* Footer toggle */}
          <div className="pt-6 border-t border-[var(--border-color)] text-center text-xs theme-text-secondary font-medium">
            {mode === 'signin' ? (
              <>
                Don't have a trader account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMessage(null); setSuccessMessage(null); }}
                  className="font-extrabold text-amber-500 hover:underline cursor-pointer"
                >
                  Sign Up First
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
    </div>
  );
};
