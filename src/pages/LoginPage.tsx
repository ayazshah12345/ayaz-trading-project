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
  RefreshCw,
  TrendingUp,
  Activity,
  Layers,
  Target,
  Brain,
  BarChart3,
  LineChart,
  ChevronRight
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import founderImg from '../assets/founder.png';
import tradingDeskImg from '../assets/trading_desk.jpg';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface LoginPageProps {
  onLogin?: (email: string, userId?: string) => void;
}

type Timeframe = '1M' | '5M' | '15M' | '1H' | 'D1';
type ChartMode = 'candles' | 'orderflow' | 'equity';
type StrategyKey = 'silver_bullet' | 'london_sweep' | 'macro_trend';

interface CandleData {
  open: number;
  close: number;
  high: number;
  low: number;
  vol: number;
}

// Base seed candles for different timeframes
const timeframeData: Record<Timeframe, CandleData[]> = {
  '1M': [
    { open: 120, close: 124, high: 127, low: 118, vol: 65 },
    { open: 124, close: 122, high: 126, low: 120, vol: 40 },
    { open: 122, close: 128, high: 131, low: 121, vol: 72 },
    { open: 128, close: 135, high: 138, low: 127, vol: 88 },
    { open: 135, close: 131, high: 137, low: 129, vol: 50 },
    { open: 131, close: 142, high: 146, low: 130, vol: 95 },
    { open: 142, close: 138, high: 144, low: 136, vol: 45 },
    { open: 138, close: 148, high: 152, low: 137, vol: 80 },
    { open: 148, close: 143, high: 150, low: 141, vol: 55 },
    { open: 143, close: 155, high: 160, low: 142, vol: 110 },
    { open: 155, close: 151, high: 157, low: 149, vol: 60 },
    { open: 151, close: 162, high: 166, low: 150, vol: 125 },
  ],
  '5M': [
    { open: 105, close: 118, high: 124, low: 102, vol: 140 },
    { open: 118, close: 112, high: 120, low: 108, vol: 90 },
    { open: 112, close: 130, high: 136, low: 110, vol: 180 },
    { open: 130, close: 145, high: 152, low: 128, vol: 210 },
    { open: 145, close: 138, high: 148, low: 134, vol: 120 },
    { open: 138, close: 158, high: 164, low: 136, vol: 250 },
    { open: 158, close: 152, high: 162, low: 148, vol: 130 },
    { open: 152, close: 168, high: 174, low: 150, vol: 280 },
    { open: 168, close: 162, high: 170, low: 158, vol: 160 },
    { open: 162, close: 180, high: 186, low: 160, vol: 320 },
    { open: 180, close: 174, high: 184, low: 170, vol: 170 },
    { open: 174, close: 192, high: 198, low: 172, vol: 350 },
  ],
  '15M': [
    { open: 65, close: 78, high: 86, low: 60, vol: 230 },
    { open: 78, close: 72, high: 84, low: 68, vol: 150 },
    { open: 72, close: 90, high: 98, low: 70, vol: 310 },
    { open: 90, close: 105, high: 112, low: 88, vol: 380 },
    { open: 105, close: 98, high: 110, low: 94, vol: 210 },
    { open: 98, close: 118, high: 124, low: 95, vol: 420 },
    { open: 118, close: 112, high: 122, low: 108, vol: 220 },
    { open: 112, close: 128, high: 135, low: 110, vol: 460 },
    { open: 128, close: 120, high: 132, low: 116, vol: 240 },
    { open: 120, close: 138, high: 146, low: 118, vol: 510 },
    { open: 138, close: 132, high: 142, low: 128, vol: 260 },
    { open: 132, close: 152, high: 160, low: 130, vol: 580 },
  ],
  '1H': [
    { open: 50, close: 72, high: 80, low: 45, vol: 650 },
    { open: 72, close: 66, high: 78, low: 60, vol: 420 },
    { open: 66, close: 92, high: 102, low: 64, vol: 780 },
    { open: 92, close: 116, high: 125, low: 90, vol: 920 },
    { open: 116, close: 108, high: 122, low: 104, vol: 540 },
    { open: 108, close: 134, high: 142, low: 105, vol: 1100 },
    { open: 134, close: 126, high: 138, low: 120, vol: 600 },
    { open: 126, close: 148, high: 156, low: 124, vol: 1250 },
    { open: 148, close: 139, high: 152, low: 135, vol: 680 },
    { open: 139, close: 165, high: 175, low: 136, vol: 1400 },
    { open: 165, close: 156, high: 170, low: 152, vol: 720 },
    { open: 156, close: 188, high: 198, low: 154, vol: 1650 },
  ],
  'D1': [
    { open: 40, close: 85, high: 95, low: 35, vol: 2400 },
    { open: 85, close: 76, high: 92, low: 70, vol: 1800 },
    { open: 76, close: 120, high: 132, low: 72, vol: 3200 },
    { open: 120, close: 155, high: 168, low: 115, vol: 4100 },
    { open: 155, close: 142, high: 162, low: 138, vol: 2600 },
    { open: 142, close: 180, high: 195, low: 140, vol: 4800 },
    { open: 180, close: 168, high: 188, low: 160, vol: 2900 },
    { open: 168, close: 205, high: 218, low: 165, vol: 5500 },
    { open: 205, close: 192, high: 210, low: 185, vol: 3300 },
    { open: 192, close: 230, high: 245, low: 190, vol: 6200 },
    { open: 230, close: 218, high: 238, low: 210, vol: 3700 },
    { open: 218, close: 258, high: 272, low: 215, vol: 7400 },
  ],
};

// Strategy Presets for Algorithmic Backtest Simulator
const strategies: Record<StrategyKey, {
  name: string;
  winRate: string;
  profitFactor: string;
  sharpe: string;
  maxDrawdown: string;
  trades: string;
  cumulativeReturn: string;
  curve: { x: number; y: number }[];
}> = {
  silver_bullet: {
    name: 'ICT Silver Bullet Scalper',
    winRate: '74.2%',
    profitFactor: '3.12',
    sharpe: '2.84',
    maxDrawdown: '4.2%',
    trades: '428 trades',
    cumulativeReturn: '+384.5%',
    curve: [
      { x: 0, y: 55 }, { x: 20, y: 51 }, { x: 40, y: 47 }, { x: 60, y: 42 },
      { x: 80, y: 44 }, { x: 100, y: 35 }, { x: 120, y: 30 }, { x: 140, y: 32 },
      { x: 160, y: 22 }, { x: 180, y: 16 }, { x: 200, y: 19 }, { x: 220, y: 10 },
      { x: 240, y: 5 }
    ]
  },
  london_sweep: {
    name: 'London Liquidity Sweep Engine',
    winRate: '68.5%',
    profitFactor: '2.65',
    sharpe: '2.40',
    maxDrawdown: '5.8%',
    trades: '356 trades',
    cumulativeReturn: '+295.2%',
    curve: [
      { x: 0, y: 55 }, { x: 20, y: 53 }, { x: 40, y: 49 }, { x: 60, y: 46 },
      { x: 80, y: 39 }, { x: 100, y: 42 }, { x: 120, y: 34 }, { x: 140, y: 27 },
      { x: 160, y: 29 }, { x: 180, y: 20 }, { x: 200, y: 15 }, { x: 220, y: 12 },
      { x: 240, y: 8 }
    ]
  },
  macro_trend: {
    name: 'Macro FVG Trend Follower',
    winRate: '63.0%',
    profitFactor: '3.48',
    sharpe: '2.92',
    maxDrawdown: '6.5%',
    trades: '284 trades',
    cumulativeReturn: '+442.8%',
    curve: [
      { x: 0, y: 55 }, { x: 20, y: 54 }, { x: 40, y: 52 }, { x: 60, y: 41 },
      { x: 80, y: 43 }, { x: 100, y: 32 }, { x: 120, y: 28 }, { x: 140, y: 24 },
      { x: 160, y: 20 }, { x: 180, y: 14 }, { x: 200, y: 16 }, { x: 220, y: 8 },
      { x: 240, y: 4 }
    ]
  }
};

// Simulated Depth of Market Ladder
const domLevels = [
  { price: '2,658.20', type: 'ask', vol: 142, depth: 88 },
  { price: '2,657.50', type: 'ask', vol: 98, depth: 64 },
  { price: '2,656.80', type: 'ask', vol: 64, depth: 42 },
  { price: '2,655.90', type: 'ask', vol: 35, depth: 22 },
  { price: '2,655.10', type: 'spread', vol: 0, depth: 0 },
  { price: '2,654.80', type: 'bid', vol: 48, depth: 32 },
  { price: '2,654.10', type: 'bid', vol: 85, depth: 58 },
  { price: '2,653.40', type: 'bid', vol: 120, depth: 78 },
  { price: '2,652.70', type: 'bid', vol: 165, depth: 95 },
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

  // Interactive Graph Controls
  const [activeChartMode, setActiveChartMode] = useState<ChartMode>('candles');
  const [timeframe, setTimeframe] = useState<Timeframe>('15M');
  const [showEma, setShowEma] = useState(true);
  const [showFvg, setShowFvg] = useState(true);
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);
  const [activeStrategy, setActiveStrategy] = useState<StrategyKey>('silver_bullet');

  // Live price tick simulation
  const [livePrice, setLivePrice] = useState(2654.80);
  const [priceChange, setPriceChange] = useState(0.85);
  const [isTickUp, setIsTickUp] = useState(true);

  // Periodic subtle live tick update
  useEffect(() => {
    const timer = setInterval(() => {
      const delta = (Math.random() - 0.45) * 0.4;
      setLivePrice(prev => {
        const next = Math.round((prev + delta) * 100) / 100;
        setIsTickUp(next >= prev);
        return next;
      });
      setPriceChange(prev => Math.round((prev + (Math.random() - 0.48) * 0.05) * 100) / 100);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

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

  const handleGuestFastTrack = () => {
    const guestEmail = 'guest.trader@blackfx.com';
    const guestId = 'guest-terminal-pro';
    setErrorMessage(null);
    setIsFetchError(false);
    setSuccessMessage('⚡ Unlocking Black FX Institutional Terminal as Guest...');
    setTimeout(() => {
      if (onLogin) onLogin(guestEmail, guestId);
      navigate('/dashboard');
    }, 400);
  };

  const handleAutofillDemo = () => {
    setEmail('trader@blackfx.com');
    setPassword('TradingPro2026!');
    setErrorMessage(null);
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
              setErrorMessage('Connection unreachable (Failed to fetch). Switch to Guest Mode or try again.');
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
              setErrorMessage('Connection unreachable (Failed to fetch). Switch to Guest Mode or try again.');
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
        // Fallback local authentication
        handleGuestFastTrack();
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      if (isNetworkFailure(err)) {
        setIsFetchError(true);
        setErrorMessage('Connection unreachable (Failed to fetch). Switch to Guest Mode or try again.');
      } else {
        setErrorMessage(err.message || 'An error occurred during authentication.');
      }
      setIsLoading(false);
    }
  };

  const tickerItems = [
    { pair: 'EUR/USD', price: '1.08425', change: '+0.34%', up: true },
    { pair: 'GBP/USD', price: '1.29810', change: '+0.52%', up: true },
    { pair: 'XAU/USD', price: `$${livePrice.toFixed(2)}`, change: `+${priceChange}%`, up: isTickUp },
    { pair: 'BTC/USD', price: '68,420.00', change: '+2.85%', up: true },
    { pair: 'US100', price: '19,850.40', change: '+0.78%', up: true },
    { pair: 'USD/JPY', price: '153.15', change: '-0.24%', up: false },
  ];

  // Render Interactive Candlestick Chart with Timeframes & Indicator Overlays
  const renderInteractiveCandleChart = () => {
    const candles = timeframeData[timeframe];
    const chartHeight = 140;
    const chartWidth = 460;
    const count = candles.length;
    const gap = chartWidth / count;
    const candleWidth = 8;
    const baseY = 125;
    const scale = 0.42;

    return (
      <div className="relative w-full h-[175px] bg-[#0a0c13] rounded-xl border border-slate-800/80 p-2 overflow-hidden shadow-inner select-none">
        
        {/* Top Mini HUD / Crosshair Info Bar */}
        <div className="flex items-center justify-between text-[10px] font-mono-numeric px-2 py-1 bg-slate-900/60 rounded-md border border-slate-800/60 mb-1">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-amber-400">XAU/USD (Gold)</span>
            <span className={`font-bold flex items-center ${isTickUp ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${livePrice.toFixed(2)}
              <span className="text-[9px] ml-1">{isTickUp ? '▲' : '▼'}</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{timeframe} Timeframe</span>
          </div>

          {hoveredCandle ? (
            <div className="hidden sm:flex items-center space-x-2 text-slate-300">
              <span>O: <strong className="text-white">{hoveredCandle.open}</strong></span>
              <span>H: <strong className="text-emerald-400">{hoveredCandle.high}</strong></span>
              <span>L: <strong className="text-rose-400">{hoveredCandle.low}</strong></span>
              <span>C: <strong className="text-amber-400">{hoveredCandle.close}</strong></span>
              <span>Vol: <strong className="text-slate-300">{hoveredCandle.vol}k</strong></span>
            </div>
          ) : (
            <span className="text-slate-500 text-[9px] flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1" />
              Institutional Order Tape Active
            </span>
          )}
        </div>

        {/* SVG Canvas */}
        <svg
          className="w-full h-[130px] overflow-visible"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="bullGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id="bearGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id="fvgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(245,158,11,0.15)" />
              <stop offset="100%" stopColor="rgba(245,158,11,0.03)" />
            </linearGradient>
          </defs>

          {/* Guide Grids */}
          <line x1="0" y1="35" x2={chartWidth} y2="35" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
          <line x1="0" y1="70" x2={chartWidth} y2="70" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
          <line x1="0" y1="105" x2={chartWidth} y2="105" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />

          {/* Institutional Fair Value Gap (FVG) Zone Overlay */}
          {showFvg && (
            <g>
              <rect
                x={gap * 3}
                y={baseY - 145 * scale}
                width={gap * 4}
                height={28}
                rx={4}
                fill="url(#fvgGrad)"
                stroke="rgba(245,158,11,0.35)"
                strokeDasharray="4 2"
              />
              <text
                x={gap * 3 + 8}
                y={baseY - 145 * scale + 16}
                fill="#fbbf24"
                fontSize="8"
                fontFamily="monospace"
                fontWeight="bold"
                opacity={0.8}
              >
                ICT BULLISH FVG (+DISPLACEMENT)
              </text>
            </g>
          )}

          {/* Candlesticks & Dynamic Volume Bars */}
          {candles.map((c, i) => {
            const isBull = c.close >= c.open;
            const x = i * gap + gap / 2;
            const top = baseY - Math.max(c.open, c.close) * scale;
            const bottom = baseY - Math.min(c.open, c.close) * scale;
            const bodyHeight = Math.max(3, bottom - top);
            const wickTop = baseY - c.high * scale;
            const wickBottom = baseY - c.low * scale;
            const volHeight = Math.min(28, (c.vol / 7000) * 28);

            return (
              <g
                key={i}
                className="cursor-crosshair transition-opacity hover:opacity-100"
                onMouseEnter={() => setHoveredCandle(c)}
                onMouseLeave={() => setHoveredCandle(null)}
              >
                {/* Wick */}
                <line
                  x1={x}
                  y1={wickTop}
                  x2={x}
                  y2={wickBottom}
                  stroke={isBull ? '#10b981' : '#ef4444'}
                  strokeWidth={1.4}
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
                  y={chartHeight - volHeight - 2}
                  width={candleWidth}
                  height={volHeight}
                  rx={1}
                  fill={isBull ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)'}
                />
              </g>
            );
          })}

          {/* Exponential Moving Average (EMA Ribbon) */}
          {showEma && (
            <path
              d={candles.reduce((acc, c, i) => {
                const x = i * gap + gap / 2;
                const y = baseY - ((c.open + c.close) / 2) * scale;
                return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
              }, '')}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeLinecap="round"
              filter="drop-shadow(0 0 6px rgba(245,158,11,0.7))"
            />
          )}
        </svg>

        {/* Real-time Order Flow Badge on Top Right */}
        <div className="absolute top-8 right-3 flex items-center space-x-1.5 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded border border-amber-500/30 text-[9px] text-amber-300 font-mono-numeric">
          <Activity size={10} className="text-amber-400 animate-pulse" />
          <span>Equilibrium Engine 1.0</span>
        </div>
      </div>
    );
  };

  // Render Depth of Market / Order Flow Heatmap
  const renderOrderFlowDOM = () => {
    return (
      <div className="w-full h-[175px] bg-[#0a0c13] rounded-xl border border-slate-800/80 p-2.5 flex flex-col justify-between shadow-inner select-none font-mono-numeric">
        <div className="flex items-center justify-between text-[10px] pb-1.5 border-b border-slate-800/70">
          <div className="flex items-center space-x-1.5 text-slate-300 font-bold">
            <BarChart3 size={13} className="text-amber-400" />
            <span>DEPTH OF MARKET (L2 BOOK)</span>
          </div>
          <span className="text-emerald-400 font-bold text-[9px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            SPREAD: 0.2 PIPS
          </span>
        </div>

        {/* DOM Rows */}
        <div className="space-y-1 py-1">
          {domLevels.slice(1, 8).map((lvl, idx) => {
            if (lvl.type === 'spread') {
              return (
                <div key={idx} className="flex items-center justify-between text-[9px] text-amber-400 bg-amber-500/10 py-0.5 px-2 rounded border border-amber-500/30 font-bold">
                  <span>SPREAD ZONE</span>
                  <span>MID: 2,655.00</span>
                  <span>TICKS: 12ms</span>
                </div>
              );
            }

            const isBid = lvl.type === 'bid';
            return (
              <div key={idx} className="relative flex items-center justify-between text-[10px] px-2 py-0.5 rounded overflow-hidden">
                {/* Background Depth Bar */}
                <div
                  className={`absolute inset-y-0 ${isBid ? 'right-0 bg-emerald-500/15' : 'left-0 bg-rose-500/15'} rounded transition-all duration-300`}
                  style={{ width: `${lvl.depth}%` }}
                />
                <span className={`relative z-10 font-bold ${isBid ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {lvl.price}
                </span>
                <span className="relative z-10 text-slate-400 text-[9px]">
                  {lvl.vol} Lots {isBid ? '(Buy Wall)' : '(Sell Wall)'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Execution Tape Snippet */}
        <div className="pt-1 border-t border-slate-800/70 flex items-center justify-between text-[9px] text-slate-400">
          <span className="flex items-center space-x-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Tape: 85 Lots Swept @ 2,654.80</span>
          </span>
          <span className="text-slate-500 font-medium">NY Session High Liquidity</span>
        </div>
      </div>
    );
  };

  // Render Algorithmic Strategy Equity Simulator
  const renderEquitySimulator = () => {
    const strat = strategies[activeStrategy];
    const points = strat.curve.map(p => `${p.x},${p.y}`).join(' ');

    return (
      <div className="w-full h-[175px] bg-[#0a0c13] rounded-xl border border-slate-800/80 p-2.5 flex flex-col justify-between shadow-inner select-none">
        
        {/* Strategy Selector Pills */}
        <div className="flex items-center justify-between border-b border-slate-800/70 pb-1.5">
          <div className="flex items-center space-x-1">
            {(['silver_bullet', 'london_sweep', 'macro_trend'] as StrategyKey[]).map(key => (
              <button
                key={key}
                onClick={() => setActiveStrategy(key)}
                className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wide transition cursor-pointer ${
                  activeStrategy === key
                    ? 'bg-amber-500 text-black shadow-xs'
                    : 'bg-slate-800/70 text-slate-400 hover:text-white'
                }`}
              >
                {key === 'silver_bullet' ? 'Silver Bullet' : key === 'london_sweep' ? 'London Sweep' : 'Macro FVG'}
              </button>
            ))}
          </div>

          <span className="text-[10px] font-mono-numeric font-bold text-emerald-400">
            {strat.cumulativeReturn} Return
          </span>
        </div>

        {/* Metrics Grid & SVG Curve */}
        <div className="grid grid-cols-12 gap-2 items-center py-1">
          {/* SVG Curve */}
          <div className="col-span-8 h-20 relative">
            <svg className="w-full h-full" viewBox="0 0 240 60" preserveAspectRatio="none">
              <defs>
                <linearGradient id="curveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polygon
                points={`0,60 ${points} 240,60`}
                fill="url(#curveGrad)"
              />
              <polyline
                points={points}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Stats Column */}
          <div className="col-span-4 space-y-1 font-mono-numeric text-[9px]">
            <div className="flex justify-between text-slate-400">
              <span>Win Rate:</span>
              <strong className="text-emerald-400">{strat.winRate}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Profit Factor:</span>
              <strong className="text-amber-400">{strat.profitFactor}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Max DD:</span>
              <strong className="text-slate-300">{strat.maxDrawdown}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Sharpe:</span>
              <strong className="text-white">{strat.sharpe}</strong>
            </div>
          </div>
        </div>

        {/* Strategy summary tagline */}
        <div className="pt-1 border-t border-slate-800/70 text-[9px] text-slate-400 flex items-center justify-between font-mono-numeric">
          <span>{strat.name} ({strat.trades})</span>
          <span className="text-amber-400 font-bold">1:3.2 Avg R:R</span>
        </div>
      </div>
    );
  };

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
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-yellow-600/5 blur-[150px] pointer-events-none" />

        {/* ================= LEFT SECTION: BRAND, FOUNDER & TRADING CHARTS / BARS ================= */}
        <div className="lg:col-span-7 p-5 sm:p-10 lg:p-12 flex flex-col justify-between relative z-10">
          
          <div className="space-y-6 max-w-2xl">
            
            {/* Free-Floating Brand & Logo */}
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

            {/* ================= INNOVATIVE MULTI-MODE TRADING GRAPHS TERMINAL ================= */}
            <div className="space-y-2 pt-1">
              
              {/* Header with Mode Switcher & Timeframe Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                {/* Mode Selector Tabs */}
                <div className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setActiveChartMode('candles')}
                    className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                      activeChartMode === 'candles'
                        ? 'bg-amber-500 text-black shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Activity size={12} />
                    <span>Live Candles</span>
                  </button>

                  <button
                    onClick={() => setActiveChartMode('orderflow')}
                    className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                      activeChartMode === 'orderflow'
                        ? 'bg-amber-500 text-black shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <BarChart3 size={12} />
                    <span>L2 Order Flow</span>
                  </button>

                  <button
                    onClick={() => setActiveChartMode('equity')}
                    className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                      activeChartMode === 'equity'
                        ? 'bg-amber-500 text-black shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LineChart size={12} />
                    <span>Quant Equity</span>
                  </button>
                </div>

                {/* Sub-controls when in Candlestick Mode */}
                {activeChartMode === 'candles' && (
                  <div className="flex items-center space-x-1.5">
                    {/* Timeframe selector */}
                    <div className="flex items-center space-x-0.5 bg-slate-900/80 p-0.5 rounded border border-slate-800 text-[10px] font-mono-numeric">
                      {(['1M', '5M', '15M', '1H', 'D1'] as Timeframe[]).map(tf => (
                        <button
                          key={tf}
                          onClick={() => setTimeframe(tf)}
                          className={`px-1.5 py-0.5 rounded font-bold transition cursor-pointer ${
                            timeframe === tf
                              ? 'bg-amber-400 text-black'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>

                    {/* Indicator toggles */}
                    <button
                      onClick={() => setShowEma(!showEma)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                        showEma
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                      title="Toggle EMA Ribbon"
                    >
                      EMA
                    </button>
                    <button
                      onClick={() => setShowFvg(!showFvg)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                        showFvg
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                      title="Toggle Fair Value Gaps"
                    >
                      FVG
                    </button>
                  </div>
                )}
              </div>

              {/* Dynamic Interactive Graph Container */}
              {activeChartMode === 'candles' && renderInteractiveCandleChart()}
              {activeChartMode === 'orderflow' && renderOrderFlowDOM()}
              {activeChartMode === 'equity' && renderEquitySimulator()}
            </div>

            {/* Trading Picture Showcase: Cinematic Institutional Trading Station */}
            <div className="relative overflow-hidden rounded-xl border border-slate-800/60 group shadow-xl">
              <img
                src={tradingDeskImg}
                alt="Institutional Trading Station"
                className="w-full h-24 sm:h-28 object-cover object-center filter brightness-90 contrast-105 group-hover:scale-102 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#07080c] via-transparent to-[#07080c]/90 pointer-events-none" />
              <div className="absolute bottom-2 left-3 z-10 flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/80 border border-amber-500/40 text-amber-400 backdrop-blur-xs">
                  Institutional Desk
                </span>
                <span className="text-[10px] font-medium text-slate-300">
                  Precision Multi-Screen Analytics &amp; Order Tape
                </span>
              </div>
            </div>

            {/* Free-Floating Founder Section */}
            <div className="space-y-2.5 pt-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-amber-600 shadow-lg overflow-hidden">
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
                      onClick={handleGuestFastTrack}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider transition cursor-pointer"
                    >
                      Enter as Guest
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

            {/* Fast-Track Guest / Pro Demo Preview Button */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleGuestFastTrack}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-slate-900 via-[#121622] to-slate-900 border border-amber-500/30 hover:border-amber-400 text-amber-300 hover:text-amber-200 transition flex items-center justify-between text-xs font-bold cursor-pointer group shadow-sm"
              >
                <span className="flex items-center space-x-2">
                  <Zap size={14} className="text-amber-400 fill-amber-400" />
                  <span>Explore Terminal as Guest Trader</span>
                </span>
                <span className="text-[10px] uppercase font-black text-amber-400 group-hover:translate-x-0.5 transition flex items-center">
                  Instant Access <ChevronRight size={12} className="ml-0.5" />
                </span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span>Quick demo credentials:</span>
                <button
                  type="button"
                  onClick={handleAutofillDemo}
                  className="text-amber-400/80 hover:text-amber-400 hover:underline cursor-pointer font-medium"
                >
                  Autofill Demo Info
                </button>
              </div>
            </div>

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


