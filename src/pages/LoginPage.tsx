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
  Share2
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
      setSuccessMessage('Black FX is already installed and running as a standalone Windows app! You can find it in your Start Menu.');
      return;
    }

    // 2. Trigger native Windows / Chrome / Edge PWA install prompt
    const promptToUse = installPrompt || (window as any).deferredInstallPrompt;
    if (promptToUse) {
      try {
        await promptToUse.prompt();
        const choiceResult = await promptToUse.userChoice;
        if (choiceResult?.outcome === 'accepted') {
          setIsInstalled(true);
          setSuccessMessage('Black FX installed successfully! Check your Windows Desktop and Start Menu.');
          return;
        } else {
          setErrorMessage('Installation was cancelled. You can click Install again anytime.');
          return;
        }
      } catch (e) {
        console.warn('Native prompt invocation error', e);
      }
    }

    // 3. Automated 1-Click Windows App Installer (.cmd)
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

      setSuccessMessage('Installer downloaded! Click "Install-Black-FX.cmd" to automatically install Black FX onto your Windows Desktop & Start Menu, or click the Install icon (🖥️ ⬇️) in your browser address bar.');
    } catch (err) {
      console.error('Install error', err);
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
      
      {/* ================= BACKGROUND GLOWS & AMBIENT AURAS (FREE-STYLE, ENTIRE PAGE) ================= */}
      <div className="absolute top-0 right-1/4 w-[750px] h-[750px] rounded-full bg-gradient-to-br from-blue-600/20 via-cyan-500/15 to-transparent blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-1/3 left-[-100px] w-[600px] h-[600px] rounded-full bg-blue-700/10 blur-[180px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none z-0" />

      {/* ================= FLOATING CELESTIAL SKY (UPPER ATMOSPHERE & NEBULA HORIZON) ================= */}
      <div className="absolute inset-x-0 top-0 h-[680px] overflow-hidden pointer-events-none z-0 select-none">
        {/* Soft Drifting Nebula Mists */}
        <div className="absolute -top-24 left-1/4 w-[700px] h-[450px] rounded-full bg-gradient-to-b from-blue-600/18 via-cyan-400/12 to-transparent blur-[120px] animate-sky-slow" />
        <div className="absolute top-10 right-10 w-[600px] h-[400px] rounded-full bg-gradient-to-bl from-cyan-500/15 via-indigo-600/10 to-transparent blur-[110px] animate-sky-reverse" />
        <div className="absolute -top-10 left-[-50px] w-[500px] h-[350px] rounded-full bg-blue-500/12 blur-[100px] animate-sky-slow" />
        
        {/* Aurora Shimmer Veil across upper sky */}
        <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-cyan-500/8 via-blue-600/5 to-transparent blur-3xl animate-sky-shimmer" />

        {/* Twinkling Celestial Stars */}
        <div className="absolute inset-0">
          <div className="absolute top-16 left-[12%] w-1.5 h-1.5 rounded-full bg-cyan-200 animate-star-twinkle shadow-[0_0_8px_#38bdf8]" style={{ animationDelay: '0.2s' }} />
          <div className="absolute top-28 left-[28%] w-1 h-1 rounded-full bg-sky-100 animate-star-twinkle shadow-[0_0_6px_#0ea5e9]" style={{ animationDelay: '1.4s' }} />
          <div className="absolute top-12 left-[45%] w-1.5 h-1.5 rounded-full bg-white animate-star-twinkle shadow-[0_0_10px_#ffffff]" style={{ animationDelay: '0.8s' }} />
          <div className="absolute top-36 left-[62%] w-1 h-1 rounded-full bg-cyan-300 animate-star-twinkle shadow-[0_0_6px_#38bdf8]" style={{ animationDelay: '2.1s' }} />
          <div className="absolute top-20 left-[78%] w-1.5 h-1.5 rounded-full bg-sky-200 animate-star-twinkle shadow-[0_0_8px_#38bdf8]" style={{ animationDelay: '1.1s' }} />
          <div className="absolute top-44 left-[88%] w-1 h-1 rounded-full bg-cyan-100 animate-star-twinkle shadow-[0_0_6px_#0ea5e9]" style={{ animationDelay: '2.8s' }} />
          <div className="absolute top-60 left-[18%] w-1 h-1 rounded-full bg-blue-200 animate-star-twinkle shadow-[0_0_6px_#60a5fa]" style={{ animationDelay: '3.2s' }} />
          <div className="absolute top-52 left-[54%] w-1.5 h-1.5 rounded-full bg-emerald-200 animate-star-twinkle shadow-[0_0_8px_#34d399]" style={{ animationDelay: '1.9s' }} />
        </div>
      </div>

      {/* ================= LIVELY LIQUID MOVING WATER (BOTTOM / HORIZON) ================= */}
      <div className="absolute inset-x-0 bottom-0 h-[380px] sm:h-[460px] overflow-hidden pointer-events-none z-0 select-none">
        
        {/* Soft Liquid Atmospheric Caustic Aura */}
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-blue-950/40 via-cyan-950/20 to-transparent blur-2xl" />

        {/* Liquid Wave Layer 1 (Deep Rolling Ocean Swell - Slower) */}
        <svg
          className="absolute bottom-0 w-[200%] h-[240px] sm:h-[280px] opacity-45 animate-liquid-2"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="liquidDeepWave" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#1e3a8a" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#060813" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <path
            fill="url(#liquidDeepWave)"
            d="M0,192L60,181.3C120,171,240,149,360,160C480,171,600,213,720,208C840,203,960,149,1080,144C1200,139,1320,181,1380,202.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>

        {/* Liquid Wave Layer 2 (Lively Cyan Liquid Swell - Medium) */}
        <svg
          className="absolute bottom-0 w-[200%] h-[200px] sm:h-[240px] opacity-60 animate-liquid-1"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="liquidCyanWave" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
              <stop offset="40%" stopColor="#0ea5e9" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#060813" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <path
            fill="url(#liquidCyanWave)"
            d="M0,96L48,112C96,128,192,160,288,181.3C384,203,480,213,576,192C672,171,768,117,864,117.3C960,117,1056,171,1152,186.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>

        {/* Liquid Wave Layer 3 (Glowing Specular Liquid Surface Crest - Lively & Fast) */}
        <svg
          className="absolute bottom-0 w-[200%] h-[160px] sm:h-[190px] opacity-85 animate-liquid-3"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="liquidSurfaceCrest" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.75" />
              <stop offset="25%" stopColor="#0ea5e9" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#060813" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="crestGleam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="35%" stopColor="#bae6fd" />
              <stop offset="70%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
          <path
            fill="url(#liquidSurfaceCrest)"
            stroke="url(#crestGleam)"
            strokeWidth="2.5"
            filter="drop-shadow(0 0 12px rgba(56,189,248,0.85))"
            d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,181.3C672,192,768,160,864,138.7C960,117,1056,107,1152,122.7C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>

        {/* Floating Bioluminescent Water Droplets */}
        <div className="absolute inset-0">
          <div className="absolute bottom-24 left-[15%] w-2 h-2 rounded-full bg-cyan-300 animate-float-slow shadow-[0_0_10px_#38bdf8]" />
          <div className="absolute bottom-36 left-[35%] w-1.5 h-1.5 rounded-full bg-sky-200 animate-float-reverse shadow-[0_0_8px_#0ea5e9]" />
          <div className="absolute bottom-16 left-[58%] w-2.5 h-2.5 rounded-full bg-cyan-400 animate-float-slow shadow-[0_0_12px_#38bdf8]" />
          <div className="absolute bottom-28 left-[75%] w-2 h-2 rounded-full bg-emerald-300 animate-float-reverse shadow-[0_0_10px_#34d399]" />
          <div className="absolute bottom-40 left-[88%] w-1.5 h-1.5 rounded-full bg-sky-300 animate-float-slow shadow-[0_0_8px_#38bdf8]" />
        </div>

      </div>

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
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-5 flex items-center justify-between relative z-30">
        
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
              <span className="hidden sm:inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono-numeric">
                PRO PLATFORM
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

      {/* ================= MAIN HERO SECTION (FREE-STYLE, OPEN COMPOSITION) ================= */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-10 pt-4 pb-12 flex flex-col justify-center relative z-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* ================= LEFT HERO COLUMN: BOLD HEADLINE & FOUNDER EDITORIAL ================= */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-950/70 to-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles size={13} className="text-cyan-400" />
              <span>Institutional Quantitative Execution</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* Grand Typography (Institutional High-Impact Headline) */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
                Master your edge with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 drop-shadow-[0_0_35px_rgba(56,189,248,0.4)]">
                  institutional precision
                </span>
              </h1>
              
              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
                The institutional-grade platform engineered to journal daily executions, stress-test historical setups, and track live price analytics with statistical mastery.
              </p>
            </div>

            {/* Quick Action Pill Row */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#090e21]/80 border border-blue-500/20 text-xs font-semibold text-slate-200">
                <BookOpen size={14} className="text-cyan-400 shrink-0" />
                <span>Daily Trade Log</span>
              </div>
              <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#090e21]/80 border border-blue-500/20 text-xs font-semibold text-slate-200">
                <FlaskConical size={14} className="text-blue-400 shrink-0" />
                <span>Historical Backtesting</span>
              </div>
              <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#090e21]/80 border border-blue-500/20 text-xs font-semibold text-slate-200">
                <LineChart size={14} className="text-emerald-400 shrink-0" />
                <span>TradingView Charts</span>
              </div>
            </div>

            {/* ================= FOUNDER CREDENTIAL EDITORIAL (FREE-FLOWING, NO BOXES) ================= */}
            <div className="pt-3 space-y-4">
              
              <div className="flex items-center space-x-4">
                <div className="relative shrink-0 group">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-emerald-400 blur-sm opacity-80 group-hover:opacity-100 transition duration-500" />
                  <img
                    src={founderImg}
                    alt="Syed Ayaz Shah - Founder of Black FX"
                    className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border-2 border-[#060813] shadow-xl"
                  />
                </div>

                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-black text-white tracking-wide">
                      SYED AYAZ SHAH S
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/35 font-mono-numeric">
                      Founder &amp; Quantitative Trader
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-400">
                    Experienced Forex Trader with 3+ Years of Market Mastery
                  </p>
                </div>
              </div>

              {/* Verified Editorial Narrative */}
              <div className="pl-4 border-l-2 border-cyan-400/80 space-y-1.5 py-1">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "I am <strong className="text-white font-bold not-italic">Syed Ayaz Shah</strong>, an experienced Forex trader with over 3 years of hands-on market execution. Black FX was built from the ground up to empower traders with institutional clarity — created specifically to document daily trading journals, preserve comprehensive backtesting records, and analyze real-time live charts with disciplined precision."
                </p>
              </div>

            </div>

          </div>

          {/* ================= RIGHT HERO COLUMN: FREE-STYLE 3D CRYSTAL CANDLESTICKS & FLOATING AUTH ================= */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            
            {/* ================= FREE-STYLE 3D CRYSTAL CANDLESTICK SCULPTURE (NO BOX CONTAINER) ================= */}
            <div className="relative w-full h-[460px] sm:h-[520px] flex items-center justify-center overflow-visible pointer-events-none select-none">
              
              {/* Giant Luminous Radial Atmosphere Glow behind candles */}
              <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-cyan-500/25 via-blue-600/20 to-transparent blur-[120px] pointer-events-none" />

              {/* Dynamic Curved Free-Style Uptrend Wave Line */}
              <svg
                className="absolute inset-0 w-full h-full overflow-visible z-10"
                viewBox="0 0 500 400"
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
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.18" />
                    <stop offset="60%" stopColor="#1e40af" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#060813" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Background Wave Area Fill */}
                <path
                  d="M 0 350 C 90 340, 160 300, 240 240 C 310 180, 390 190, 460 110 C 480 85, 495 70, 500 60 L 500 400 L 0 400 Z"
                  fill="url(#freeStyleArea)"
                />

                {/* Radiant Neon Uptrend Trajectory Wave */}
                <path
                  d="M 0 350 C 90 340, 160 300, 240 240 C 310 180, 390 190, 460 110 C 480 85, 495 70, 500 60"
                  fill="none"
                  stroke="url(#freeStyleWave)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter="drop-shadow(0 0 14px rgba(14,165,233,0.9))"
                />

                {/* Milestone Nodes */}
                <circle cx="240" cy="240" r="5" fill="#38bdf8" filter="drop-shadow(0 0 8px #38bdf8)" />
                <circle cx="460" cy="110" r="6" fill="#0ea5e9" filter="drop-shadow(0 0 10px #0ea5e9)" />
                <circle cx="500" cy="60" r="7" fill="#34d399" filter="drop-shadow(0 0 14px #34d399)" />
              </svg>

              {/* ================= 3D TRANSLUCENT GLASS CRYSTAL CANDLESTICKS ================= */}
              <div className="relative z-20 flex items-center justify-center gap-8 sm:gap-12 w-full max-w-md">
                
                {/* CANDLESTICK 1 (Left / Intermediate, Levitating) */}
                <div className="animate-float-slow flex flex-col items-center">
                  
                  {/* Upper Transparent Glass Wick */}
                  <div
                    className="w-3 sm:w-3.5 h-20 sm:h-24 rounded-full"
                    style={{
                      background: 'linear-gradient(to right, rgba(255,255,255,0.4), rgba(186,230,253,0.85), rgba(255,255,255,0.3))',
                      boxShadow: '0 0 12px rgba(56,189,248,0.7), inset 1px 1px 2px rgba(255,255,255,0.9)',
                    }}
                  />

                  {/* 3D Glass Beveled Body */}
                  <div
                    className="w-24 sm:w-28 h-40 sm:h-48 rounded-[26px] relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(56,189,248,0.32) 0%, rgba(37,99,235,0.22) 50%, rgba(14,165,233,0.38) 100%)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1.5px solid rgba(224,242,254,0.6)',
                      boxShadow: 'inset 0 0 30px rgba(56,189,248,0.35), inset 2.5px 2.5px 5px rgba(255,255,255,0.85), inset -3px -3px 8px rgba(10,15,30,0.7), 0 20px 50px rgba(14,165,233,0.35)',
                    }}
                  >
                    {/* Interior Specular Reflection Streak */}
                    <div className="absolute top-0 bottom-0 left-2 w-3 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-80" />
                    
                    {/* Top Rim Specular Glare */}
                    <div className="absolute top-1 left-2 right-2 h-2.5 rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[0.5px]" />
                    
                    {/* Liquid Refractive Core */}
                    <div className="absolute inset-4 rounded-xl bg-gradient-to-tr from-blue-600/30 via-cyan-400/20 to-transparent opacity-60" />
                  </div>

                  {/* Lower Transparent Glass Wick */}
                  <div
                    className="w-3 sm:w-3.5 h-16 sm:h-20 rounded-full"
                    style={{
                      background: 'linear-gradient(to right, rgba(255,255,255,0.4), rgba(186,230,253,0.85), rgba(255,255,255,0.3))',
                      boxShadow: '0 0 12px rgba(56,189,248,0.7), inset 1px 1px 2px rgba(255,255,255,0.9)',
                    }}
                  />

                </div>

                {/* CANDLESTICK 2 (Right / Taller, Ascending Grandeur - Exactly like FundingPips) */}
                <div className="animate-float-reverse flex flex-col items-center -mt-10 sm:-mt-14">
                  
                  {/* Upper Transparent Glass Wick (Tall) */}
                  <div
                    className="w-3.5 sm:w-4 h-24 sm:h-32 rounded-full"
                    style={{
                      background: 'linear-gradient(to right, rgba(255,255,255,0.45), rgba(186,230,253,0.9), rgba(255,255,255,0.35))',
                      boxShadow: '0 0 16px rgba(56,189,248,0.85), inset 1px 1px 2px rgba(255,255,255,0.95)',
                    }}
                  />

                  {/* 3D Glass Beveled Body (Taller, Majestic) */}
                  <div
                    className="w-28 sm:w-36 h-52 sm:h-64 rounded-[32px] relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(56,189,248,0.4) 0%, rgba(37,99,235,0.3) 45%, rgba(14,165,233,0.45) 100%)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1.8px solid rgba(224,242,254,0.75)',
                      boxShadow: 'inset 0 0 45px rgba(56,189,248,0.45), inset 3px 3px 6px rgba(255,255,255,0.9), inset -4px -4px 10px rgba(10,15,30,0.8), 0 25px 65px rgba(14,165,233,0.45)',
                    }}
                  >
                    {/* Interior Specular Reflection Streak */}
                    <div className="absolute top-0 bottom-0 left-3 w-4 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-85" />
                    
                    {/* Top Rim Specular Glare */}
                    <div className="absolute top-1.5 left-3 right-3 h-3 rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent blur-[0.5px]" />
                    
                    {/* Radiant Blue Center Refraction */}
                    <div className="absolute inset-5 rounded-2xl bg-gradient-to-tr from-blue-700/40 via-cyan-400/25 to-transparent opacity-70" />
                  </div>

                  {/* Lower Transparent Glass Wick */}
                  <div
                    className="w-3.5 sm:w-4 h-20 sm:h-28 rounded-full"
                    style={{
                      background: 'linear-gradient(to right, rgba(255,255,255,0.45), rgba(186,230,253,0.9), rgba(255,255,255,0.35))',
                      boxShadow: '0 0 16px rgba(56,189,248,0.85), inset 1px 1px 2px rgba(255,255,255,0.95)',
                    }}
                  />

                </div>

              </div>

              {/* Floating Aesthetic HUD Badges (Free-floating, no boxed container) */}
              <div className="absolute bottom-4 left-6 sm:left-12 flex items-center space-x-2 text-[11px] text-slate-200 font-mono-numeric bg-[#080d20]/80 px-3 py-1.5 rounded-full border border-cyan-500/30 backdrop-blur-md shadow-lg">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-bold text-cyan-300">Algorithmic Equilibrium</span>
                <span className="text-emerald-400 font-extrabold">+384.8% Alpha</span>
              </div>

            </div>

            {/* ================= FLOATING LUXURY GLASS AUTHENTICATION TERMINAL ================= */}
            <div className="w-full max-w-md mt-6 relative z-30 pointer-events-auto">
              
              <div className="p-6 sm:p-7 rounded-3xl bg-[#090e21]/80 border border-cyan-500/30 shadow-[0_16px_48px_rgba(0,0,0,0.7)] backdrop-blur-2xl space-y-5 relative overflow-hidden">
                
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
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  
                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Mail size={15} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="trader@blackfx.com"
                        className="w-full bg-[#070b18] border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-white placeholder-slate-600 font-mono-numeric font-medium outline-none focus:border-cyan-400 transition text-xs"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock size={15} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder={mode === 'signup' ? 'Minimum 6 characters' : 'Enter password'}
                        className="w-full bg-[#070b18] border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-white placeholder-slate-600 font-mono-numeric font-medium outline-none focus:border-cyan-400 transition text-xs"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-cyan-400 cursor-pointer transition"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password (Sign Up Only) */}
                  {mode === 'signup' && (
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <Lock size={15} />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password to confirm"
                          className={`w-full bg-[#070b18] border rounded-xl pl-10 pr-10 py-2.5 text-white placeholder-slate-600 font-mono-numeric font-medium outline-none transition text-xs ${
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
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black rounded-xl shadow-[0_4px_20px_rgba(14,165,233,0.35)] transition-all flex items-center justify-center space-x-2 text-xs uppercase tracking-wider cursor-pointer mt-3"
                  >
                    {isLoading ? (
                      <span>Authenticating...</span>
                    ) : (
                      <>
                        <span>{mode === 'signin' ? 'Sign In to Terminal' : 'Create Trader Account'}</span>
                        <ArrowRight size={15} />
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
                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
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
      <footer className="w-full border-t border-cyan-500/15 bg-[#070a18]/90 backdrop-blur-md py-6 relative z-30">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
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
