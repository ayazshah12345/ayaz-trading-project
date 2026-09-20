import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  Download,
  Smartphone,
  Laptop,
  X,
  Share2,
  Crown,
  Award
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import founderImg from '../assets/founder.png';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { RoyalAmbiance } from '../components/RoyalAmbiance';

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

  // Default Install Option State
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsInstalled(true);
    }

    const handleBeforePrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      (window as any).deferredInstallPrompt = e;
    };

    const handleInstallable = (e: Event) => {
      const customE = e as CustomEvent<{ prompt: any }>;
      setInstallPrompt(customE.detail?.prompt || (window as any).deferredInstallPrompt);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      (window as any).deferredInstallPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforePrompt);
    window.addEventListener('pwa-installable', handleInstallable);
    window.addEventListener('appinstalled', handleAppInstalled);

    if ((window as any).deferredInstallPrompt) {
      setInstallPrompt((window as any).deferredInstallPrompt);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforePrompt);
      window.removeEventListener('pwa-installable', handleInstallable);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    // 1. Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      setSuccessMessage('Black FX is already installed on your device! You can open it directly from your apps.');
      return;
    }

    const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = typeof navigator !== 'undefined' && (/iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
    const isWindows = typeof navigator !== 'undefined' && /Windows/i.test(navigator.userAgent);

    // 2. Trigger native Android / Chrome / Edge PWA install prompt
    const promptToUse = installPrompt || (window as any).deferredInstallPrompt;
    if (promptToUse) {
      try {
        await promptToUse.prompt();
        const choiceResult = await promptToUse.userChoice;
        if (choiceResult?.outcome === 'accepted') {
          setIsInstalled(true);
          setSuccessMessage('Black FX installed successfully! The app is now added directly to your device.');
          return;
        } else {
          setErrorMessage('Installation was cancelled. You can click Install again anytime.');
          return;
        }
      } catch (e) {
        console.warn('Native prompt invocation error', e);
      }
    }

    // 3. Mobile Device Fallback (IMPORTANT: Never download script or code files on phones!)
    if (isMobile) {
      setShowInstallGuide(true);
      if (isIOS) {
        setSuccessMessage('To install Black FX on iPhone: Tap the Share button at the bottom of Safari, then tap "Add to Home Screen" ➕');
      } else {
        setSuccessMessage('To install Black FX: Tap the 3 dots menu (⋮) at the top-right of your Chrome browser, then select "Install app" or "Add to Home screen" to add it directly to your phone.');
      }
      return;
    }

    // 4. Windows PC Desktop ONLY (When native browser prompt was not captured)
    if (isWindows) {
      try {
        const currentOrigin = window.location.origin;
        const cmdContent = `@echo off
title Installing Black FX Desktop App...
echo ========================================================
echo         BLACK FX - AUTOMATIC WINDOWS INSTALLER
echo ========================================================
echo.
echo Installing Black FX to your Windows Desktop and Start Menu...
echo.

set "APP_URL=${currentOrigin}"

:: Detect Microsoft Edge or Google Chrome
set "BROWSER_EXE="
if exist "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe" (
    set "BROWSER_EXE=%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe"
) else if exist "%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe" (
    set "BROWSER_EXE=%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe"
) else if exist "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" (
    set "BROWSER_EXE=%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe"
) else if exist "%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe" (
    set "BROWSER_EXE=%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe"
) else if exist "%LocalAppData%\\Google\\Chrome\\Application\\chrome.exe" (
    set "BROWSER_EXE=%LocalAppData%\\Google\\Chrome\\Application\\chrome.exe"
)

if "%BROWSER_EXE%"=="" (
    echo Opening Black FX in your default browser...
    start "" "%APP_URL%"
    goto finish
)

:: Automatically Create Windows Desktop and Start Menu Shortcuts
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell; ^
   $desktop = [Environment]::GetFolderPath('Desktop'); ^
   $startMenu = [System.IO.Path]::Combine([Environment]::GetFolderPath('StartMenu'), 'Programs'); ^
   $s1 = $ws.CreateShortcut([System.IO.Path]::Combine($desktop, 'Black FX.lnk')); ^
   $s1.TargetPath = '%BROWSER_EXE%'; ^
   $s1.Arguments = '--app=%APP_URL%'; ^
   $s1.Description = 'Black FX - The Traders Backtesting and Journal Platform'; ^
   $s1.Save(); ^
   $s2 = $ws.CreateShortcut([System.IO.Path]::Combine($startMenu, 'Black FX.lnk')); ^
   $s2.TargetPath = '%BROWSER_EXE%'; ^
   $s2.Arguments = '--app=%APP_URL%'; ^
   $s2.Description = 'Black FX - The Traders Backtesting and Journal Platform'; ^
   $s2.Save();"

echo.
echo [SUCCESS] Black FX Desktop App installed successfully!
echo [SUCCESS] Shortcut created on your Windows Desktop and Start Menu.
echo.
echo Launching Black FX standalone app...
start "" "%BROWSER_EXE%" --app="%APP_URL%"

:finish
timeout /t 2 >nul
exit
`;
        const blob = new Blob([cmdContent], { type: 'text/plain' });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'Install-Black-FX.cmd';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);

        setSuccessMessage('Installer downloaded for Windows! Or click the Install icon (🖥️ ⬇️) in your browser address bar.');
      } catch (err) {
        console.error('Install error', err);
      }
    } else {
      setShowInstallGuide(true);
    }
  };

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
      
      {/* ================= ROYAL INSTITUTIONAL AMBIANCE (NO WATER, NO SHIP, NO STARS) ================= */}
      <RoyalAmbiance />

      {/* ================= TOP CONTINUOUS MOVING TICKER ================= */}
      <div className="w-full bg-[#070a17]/90 border-b border-cyan-500/15 py-2 overflow-hidden whitespace-nowrap shadow-sm z-30 select-none backdrop-blur-md">
        <div className="animate-marquee flex items-center space-x-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-6 shrink-0">
              <span className="flex items-center space-x-1.5 text-[11px] font-black tracking-widest text-cyan-400">
                <Zap size={12} className="text-cyan-400 fill-cyan-400" />
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

      {/* ================= SLEEK TOP NAVIGATION BAR (LIKE FUNDINGPIPS) ================= */}
      <header className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 py-3 sm:py-4 flex items-center justify-between relative z-30">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3.5">
          <div className="relative group">
            <div className="absolute -inset-1.5 rounded-full bg-cyan-400/30 blur-md opacity-80 group-hover:opacity-100 transition duration-500" />
            <img
              src={logoImg}
              alt="Black FX Logo"
              className="relative w-11 h-11 sm:w-12 sm:h-12 object-contain filter drop-shadow-[0_4px_16px_rgba(14,165,233,0.5)] transform group-hover:scale-105 transition duration-300"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-black tracking-tight text-white font-mono-numeric">
                BLACK <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">FX</span>
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider hidden sm:block">
              Journal • Backtest • Charts
            </p>
          </div>
        </div>

        {/* Center Nav Highlights (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold text-slate-300">
          <span className="flex items-center space-x-1.5 text-cyan-300">
            <BookOpen size={13} className="text-cyan-400" />
            <span>Daily Journal</span>
          </span>
          <span className="flex items-center space-x-1.5 hover:text-white transition">
            <FlaskConical size={13} className="text-blue-400" />
            <span>Backtesting Engine</span>
          </span>
          <span className="flex items-center space-x-1.5 hover:text-white transition">
            <LineChart size={13} className="text-emerald-400" />
            <span>Live Charts</span>
          </span>
          <span className="flex items-center space-x-1.5 hover:text-white transition">
            <Activity size={13} className="text-cyan-400" />
            <span>3+ Yrs Forex Edge</span>
          </span>
        </nav>

        {/* Right Action: Automatic 1-Click Install Button */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleInstallClick}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-black transition flex items-center space-x-2 shadow-[0_4px_20px_rgba(14,165,233,0.35)] cursor-pointer border border-cyan-300/40 transform hover:-translate-y-0.5"
            title="Install Black FX on Windows, Android, or iOS"
          >
            <Download size={13} className="text-white animate-bounce" />
            <span>{isInstalled ? 'App Installed ✓' : 'Install App'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowInstallGuide(true)}
            className="p-2 rounded-xl bg-[#0b1024] hover:bg-[#111833] text-slate-400 hover:text-cyan-300 border border-slate-800 transition cursor-pointer"
            title="Installation Guide"
          >
            <Laptop size={15} />
          </button>
        </div>
      </header>

      {/* ================= MAIN HERO SECTION (FULL OCCUPATION, BALANCED HORIZONTAL GRID) ================= */}
      <main className="flex-1 w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-12 py-3 sm:py-6 flex flex-col justify-center relative z-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* ================= LEFT HERO COLUMN: ROYAL FOUNDER EXECUTIVE CHAMBER ================= */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-4 xl:space-y-5">
            
            {/* Royal Obsidian Glass Card for Founder & Institutional Identity */}
            <div className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#080d20]/85 border border-cyan-400/30 shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-2xl space-y-5 relative overflow-hidden">
              
              {/* Top Royal Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400" />

              {/* Founder Header */}
              <div className="flex items-center space-x-4 pt-1">
                <div className="relative shrink-0 group">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-emerald-400 blur-sm opacity-80 group-hover:opacity-100 transition duration-500" />
                  <img
                    src={founderImg}
                    alt="Syed Ayaz Shah - Founder of Black FX"
                    className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border-2 border-[#060813] shadow-xl"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black text-white tracking-wide font-mono-numeric">
                      SYED AYAZ SHAH S
                    </span>
                  </div>
                  <div className="inline-flex items-center space-x-1.5 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/35 font-mono-numeric">
                    <span>Founder &amp; Quantitative Trader</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-400 pt-0.5">
                    Experienced Forex Trader with 3+ Years of Market Mastery
                  </p>
                </div>
              </div>

              {/* Verified Editorial Narrative */}
              <div className="pl-4 border-l-2 border-cyan-400/80 space-y-2 py-1 bg-gradient-to-r from-cyan-500/5 to-transparent rounded-r-xl">
                <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed italic">
                  "I am <strong className="text-white font-bold not-italic">Syed Ayaz Shah</strong>, an experienced Forex trader with over 3 years of hands-on market execution. Black FX was built from the ground up to empower traders with institutional clarity — created specifically to document daily trading journals, preserve comprehensive backtesting records, and analyze real-time live charts with disciplined precision."
                </p>
              </div>

            </div>

          </div>

          {/* ================= RIGHT HERO COLUMN: 3D CRYSTAL CANDLESTICKS & AUTH TERMINAL SIDE-BY-SIDE ================= */}
          <div className="lg:col-span-7 xl:col-span-7 relative flex flex-col lg:flex-row items-center justify-center lg:justify-end gap-6 xl:gap-8">
            
            {/* ================= FREE-STYLE 3D CRYSTAL CANDLESTICKS ================= */}
            <div className="relative w-full max-w-[300px] xl:max-w-[330px] h-[360px] xl:h-[400px] flex items-center justify-center overflow-visible pointer-events-none select-none shrink-0">
              
              {/* Giant Luminous Radial Atmosphere Glow behind candles */}
              <div className="absolute w-[340px] h-[340px] rounded-full bg-gradient-to-tr from-cyan-500/25 via-blue-600/20 to-transparent blur-[90px] pointer-events-none" />

              {/* Dynamic Curved Free-Style Uptrend Wave Line */}
              <svg
                className="absolute inset-0 w-full h-full overflow-visible z-10"
                viewBox="0 0 400 350"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Glowing Wave Stroke */}
                  <linearGradient id="freeStyleWave" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.4" />
                    <stop offset="40%" stopColor="#0284c7" stopOpacity="0.8" />
                    <stop offset="75%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>

                  {/* Soft Background Fill */}
                  <linearGradient id="freeStyleArea" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15" />
                    <stop offset="60%" stopColor="#1e40af" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#060813" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Background Wave Area Fill */}
                <path
                  d="M 0 300 C 70 290, 130 250, 190 200 C 250 150, 310 160, 370 90 C 385 70, 395 55, 400 45 L 400 350 L 0 350 Z"
                  fill="url(#freeStyleArea)"
                />

                {/* Radiant Neon Uptrend Trajectory Wave */}
                <path
                  d="M 0 300 C 70 290, 130 250, 190 200 C 250 150, 310 160, 370 90 C 385 70, 395 55, 400 45"
                  fill="none"
                  stroke="url(#freeStyleWave)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="drop-shadow(0 0 12px rgba(14,165,233,0.9))"
                />

                {/* Milestone Nodes */}
                <circle cx="190" cy="200" r="4.5" fill="#38bdf8" filter="drop-shadow(0 0 8px #38bdf8)" />
                <circle cx="370" cy="90" r="5.5" fill="#0ea5e9" filter="drop-shadow(0 0 10px #0ea5e9)" />
                <circle cx="400" cy="45" r="6" fill="#34d399" filter="drop-shadow(0 0 14px #34d399)" />
              </svg>

              {/* ================= 3D TRANSLUCENT GLASS CRYSTAL CANDLESTICKS ================= */}
              <div className="relative z-20 flex items-center justify-center gap-6 sm:gap-8 w-full">
                
                {/* CANDLESTICK 1 (Left / Intermediate, Levitating) */}
                <div className="animate-float-slow flex flex-col items-center">
                  
                  {/* Upper Transparent Glass Wick */}
                  <div
                    className="w-2.5 sm:w-3 h-16 sm:h-20 rounded-full"
                    style={{
                      background: 'linear-gradient(to right, rgba(255,255,255,0.4), rgba(186,230,253,0.85), rgba(255,255,255,0.3))',
                      boxShadow: '0 0 10px rgba(56,189,248,0.7), inset 1px 1px 2px rgba(255,255,255,0.9)',
                    }}
                  />

                  {/* 3D Glass Beveled Body */}
                  <div
                    className="w-20 sm:w-24 h-32 sm:h-40 rounded-[22px] relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(56,189,248,0.32) 0%, rgba(37,99,235,0.22) 50%, rgba(14,165,233,0.38) 100%)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1.5px solid rgba(224,242,254,0.6)',
                      boxShadow: 'inset 0 0 25px rgba(56,189,248,0.35), inset 2px 2px 4px rgba(255,255,255,0.85), inset -2px -2px 6px rgba(10,15,30,0.7), 0 15px 40px rgba(14,165,233,0.35)',
                    }}
                  >
                    {/* Interior Specular Reflection Streak */}
                    <div className="absolute top-0 bottom-0 left-1.5 w-2.5 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-80" />
                    
                    {/* Top Rim Specular Glare */}
                    <div className="absolute top-1 left-2 right-2 h-2 rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[0.5px]" />
                    
                    {/* Liquid Refractive Core */}
                    <div className="absolute inset-3 rounded-xl bg-gradient-to-tr from-blue-600/30 via-cyan-400/20 to-transparent opacity-60" />
                  </div>

                  {/* Lower Transparent Glass Wick */}
                  <div
                    className="w-2.5 sm:w-3 h-14 sm:h-16 rounded-full"
                    style={{
                      background: 'linear-gradient(to right, rgba(255,255,255,0.4), rgba(186,230,253,0.85), rgba(255,255,255,0.3))',
                      boxShadow: '0 0 10px rgba(56,189,248,0.7), inset 1px 1px 2px rgba(255,255,255,0.9)',
                    }}
                  />

                </div>

                {/* CANDLESTICK 2 (Right / Taller, Ascending Grandeur - Exactly like FundingPips) */}
                <div className="animate-float-reverse flex flex-col items-center -mt-8 sm:-mt-10">
                  
                  {/* Upper Transparent Glass Wick (Tall) */}
                  <div
                    className="w-3 sm:w-3.5 h-20 sm:h-24 rounded-full"
                    style={{
                      background: 'linear-gradient(to right, rgba(255,255,255,0.45), rgba(186,230,253,0.9), rgba(255,255,255,0.35))',
                      boxShadow: '0 0 14px rgba(56,189,248,0.85), inset 1px 1px 2px rgba(255,255,255,0.95)',
                    }}
                  />

                  {/* 3D Glass Beveled Body (Tall Master Candlestick) */}
                  <div
                    className="w-24 sm:w-28 h-44 sm:h-52 rounded-[26px] relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(56,189,248,0.40) 0%, rgba(30,64,175,0.28) 45%, rgba(14,165,233,0.42) 100%)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1.5px solid rgba(224,242,254,0.7)',
                      boxShadow: 'inset 0 0 35px rgba(56,189,248,0.45), inset 3px 3px 6px rgba(255,255,255,0.9), inset -3px -3px 8px rgba(10,15,30,0.8), 0 25px 60px rgba(14,165,233,0.45)',
                    }}
                  >
                    {/* Interior Specular Reflection Streak */}
                    <div className="absolute top-0 bottom-0 left-2 w-3.5 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-90" />
                    
                    {/* Top Rim Specular Glare */}
                    <div className="absolute top-1 left-2 right-2 h-3 rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent blur-[0.5px]" />
                    
                    {/* Liquid Refractive Core */}
                    <div className="absolute inset-4 rounded-xl bg-gradient-to-tr from-blue-600/40 via-cyan-400/30 to-emerald-400/20 opacity-70" />
                    
                    {/* Inner Institutional Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                      <span className="text-[9px] font-black tracking-widest text-cyan-200 font-mono-numeric uppercase">
                        ALPHA
                      </span>
                    </div>
                  </div>

                  {/* Lower Transparent Glass Wick */}
                  <div
                    className="w-3 sm:w-3.5 h-16 sm:h-20 rounded-full"
                    style={{
                      background: 'linear-gradient(to right, rgba(255,255,255,0.45), rgba(186,230,253,0.9), rgba(255,255,255,0.35))',
                      boxShadow: '0 0 14px rgba(56,189,248,0.85), inset 1px 1px 2px rgba(255,255,255,0.95)',
                    }}
                  />

                </div>

              </div>

              {/* Floating Aesthetic HUD Badges (Free-floating, no boxed container) */}
              <div className="absolute bottom-2 left-2 sm:left-4 flex items-center space-x-1.5 text-[10px] text-slate-200 font-mono-numeric bg-[#080d20]/85 px-2.5 py-1 rounded-full border border-cyan-500/30 backdrop-blur-md shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-bold text-cyan-300">Algorithmic Equilibrium</span>
                <span className="text-emerald-400 font-extrabold">+384.8% Alpha</span>
              </div>

            </div>

            {/* ================= FLOATING LUXURY GLASS AUTHENTICATION TERMINAL ================= */}
            <div className="w-full max-w-[380px] xl:max-w-[400px] relative z-30 pointer-events-auto shrink-0">
              
              <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#080d20]/90 border border-cyan-400/35 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl space-y-4 relative overflow-hidden">
                
                {/* Subtle crystal glow top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400" />
                

                {/* Minimal Tab Switcher */}
                <div className="flex border-b border-slate-800 pb-2">
                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setErrorMessage(null); setSuccessMessage(null); }}
                    className={`pb-2 mr-6 text-xs sm:text-sm font-black uppercase tracking-wider transition-colors cursor-pointer relative ${
                      mode === 'signin'
                        ? 'text-cyan-400 border-b-2 border-cyan-400'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Sign In to Terminal
                  </button>

                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setErrorMessage(null); setSuccessMessage(null); }}
                    className={`pb-2 text-xs sm:text-sm font-black uppercase tracking-wider transition-colors cursor-pointer relative ${
                      mode === 'signup'
                        ? 'text-cyan-400 border-b-2 border-cyan-400'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* Error Alert */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium space-y-2 leading-relaxed">
                    <div className="flex items-start space-x-2">
                      <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-400" />
                      <span>{errorMessage}</span>
                    </div>
                    {isFetchError && (
                      <div className="pt-2 border-t border-rose-500/20 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSubmit}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center space-x-1"
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
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-start space-x-2 leading-relaxed">
                    <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-400" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* Form Inputs */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  
                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Mail size={14} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="trader@blackfx.com"
                        className="w-full bg-[#070b18] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-600 font-mono-numeric font-medium outline-none focus:border-cyan-400 transition text-xs"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Lock size={14} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder={mode === 'signup' ? 'Minimum 6 characters' : 'Enter password'}
                        className="w-full bg-[#070b18] border border-slate-800 rounded-xl pl-9 pr-9 py-2 text-white placeholder-slate-600 font-mono-numeric font-medium outline-none focus:border-cyan-400 transition text-xs"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-cyan-400 cursor-pointer transition"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password (Sign Up Only) */}
                  {mode === 'signup' && (
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                          <Lock size={14} />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password to confirm"
                          className={`w-full bg-[#070b18] border rounded-xl pl-9 pr-9 py-2 text-white placeholder-slate-600 font-mono-numeric font-medium outline-none transition text-xs ${
                            confirmPassword && confirmPassword !== password
                              ? 'border-rose-500 focus:border-rose-500'
                              : 'border-slate-800 focus:border-cyan-400'
                          }`}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black rounded-xl shadow-[0_4px_20px_rgba(14,165,233,0.35)] transition-all flex items-center justify-center space-x-2 text-xs uppercase tracking-wider cursor-pointer mt-2"
                  >
                    {isLoading ? (
                      <span>Authenticating...</span>
                    ) : (
                      <>
                        <span>{mode === 'signin' ? 'Sign In to Terminal' : 'Create Trader Account'}</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer Switch & Automatic Windows Installation Bar */}
                <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-slate-400">
                    {mode === 'signin' ? "Need an account?" : "Already registered?"}
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'signin' ? 'signup' : 'signin');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="font-bold text-cyan-400 hover:underline cursor-pointer"
                  >
                    {mode === 'signin' ? 'Create Account' : 'Sign In'}
                  </button>
                </div>

                {/* Quick Windows Install Link */}
                <div className="pt-0.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center space-x-1.5">
                    <Laptop size={13} className="text-cyan-400" />
                    <span>Windows Desktop &amp; Mobile App</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className="text-cyan-300 hover:text-white font-bold underline cursor-pointer"
                  >
                    {isInstalled ? 'Installed ✓' : 'Install Automatically'}
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

      {/* ================= SOCIAL PROOF / METRICS STRIP (LIKE FUNDINGPIPS) ================= */}
      <footer className="w-full border-t border-cyan-500/20 bg-[#060919]/70 backdrop-blur-md py-4 sm:py-5 relative z-30">
        <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} className="text-cyan-400" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-white font-mono-numeric">
                  3+ Years
                </div>
                <div className="text-xs text-slate-400">
                  Forex Market Mastery
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center shrink-0">
                <FlaskConical size={20} className="text-blue-400" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-white font-mono-numeric">
                  100% Edge
                </div>
                <div className="text-xs text-slate-400">
                  Backtesting Precision
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <LineChart size={20} className="text-emerald-400" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-white font-mono-numeric">
                  Multi-Asset
                </div>
                <div className="text-xs text-slate-400">
                  Live Technical Charts
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <Laptop size={20} className="text-cyan-400" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-white font-mono-numeric">
                  1-Click
                </div>
                <div className="text-xs text-slate-400">
                  Windows &amp; Mobile Native
                </div>
              </div>
            </div>

          </div>

          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
            <span>© {new Date().getFullYear()} Black FX • Created &amp; Founded by SYED AYAZ SHAH S</span>
            <div className="flex items-center space-x-4">
              <span>Trade Journal</span>
              <span>•</span>
              <span>Backtesting Vault</span>
              <span>•</span>
              <span className="text-cyan-400 font-mono-numeric">v2.4 Institutional</span>
            </div>
          </div>

        </div>
      </footer>

      {/* ================= INSTALL GUIDE MODAL ================= */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-[#080b18] border border-cyan-500/30 p-6 shadow-2xl space-y-4 text-slate-200 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600" />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#060813] border border-cyan-400/40 flex items-center justify-center overflow-hidden">
                  <img src="/icon-192.png" alt="Black FX" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Install Black FX App
                  </h3>
                  <p className="text-[11px] text-slate-400">Windows PC, Android & iOS Guide</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInstallGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Trigger Button */}
            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer border border-cyan-300/40"
            >
              <Download size={14} />
              <span>Launch Automatic Windows / Mobile Installation</span>
            </button>

            <div className="space-y-3 text-xs">
              {/* Windows PC */}
              <div className="p-3.5 rounded-xl bg-[#0c1224] border border-cyan-500/40 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-cyan-300">
                  <div className="flex items-center space-x-2">
                    <Laptop size={15} />
                    <span className="text-sm">Windows PC (Automatic Installation)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-mono-numeric">Desktop App</span>
                </div>
                <div className="text-[11px] text-slate-300 leading-relaxed space-y-1 pt-1">
                  <p>
                    <strong>Automatic:</strong> Click <strong>"Launch Automatic Installation"</strong> above. If browser prompt appears, click <strong>"Install"</strong>. Otherwise, run <strong>Install-Black-FX.cmd</strong> to automatically create your Desktop &amp; Start Menu shortcut!
                  </p>
                  <p>
                    <strong>Browser Address Bar:</strong> Click the <strong>Install</strong> icon (<span className="text-cyan-300 font-bold">🖥️ ⬇️</span>) in the top-right of your browser address bar.
                  </p>
                </div>
              </div>

              {/* Android */}
              <div className="p-3.5 rounded-xl bg-[#0c1224] border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-blue-300">
                  <div className="flex items-center space-x-2">
                    <Smartphone size={15} />
                    <span className="text-sm">Android Phone / Tablet</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-mono-numeric">Full-Bleed Maskable</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Tap the Chrome menu (<strong>⋮</strong>) &rarr; Select <strong>"Install App"</strong> &rarr; Tap <strong>"Install"</strong>. The app installs with full-bleed obsidian background and big golden shield.
                </p>
              </div>

              {/* iOS Safari */}
              <div className="p-3.5 rounded-xl bg-[#0c1224] border border-slate-800/80 space-y-1.5">
                <div className="flex items-center space-x-2 font-bold text-purple-300">
                  <Smartphone size={15} />
                  <span className="text-sm">iPhone / iPad (Safari)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Tap the <strong>Share</strong> button (<Share2 size={11} className="inline mx-0.5" />) &rarr; Tap <strong>"Add to Home Screen"</strong> ➕ &rarr; Tap <strong>"Add"</strong>.
                </p>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowInstallGuide(false)}
                className="w-full py-2.5 bg-[#0c1224] hover:bg-[#111833] text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
