import React, { useState, useEffect, useRef } from 'react';
import {
  Maximize2,
  Minimize2,
  Star,
  Eye,
  EyeOff,
  Maximize
} from 'lucide-react';
import { TradingViewWidget } from './TradingViewWidget';
import type { MarketAsset, TradingTimeframe } from '../../types';

interface ChartContainerProps {
  markets: MarketAsset[];
  initialSymbol?: string;
  onSelectSymbol?: (symbol: string) => void;
  onToggleFavorite?: (symbol: string) => void;
  isDarkMode?: boolean;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  markets,
  initialSymbol = 'XAUUSD',
  onSelectSymbol,
  onToggleFavorite,
  isDarkMode = true,
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol);
  const [timeframe, setTimeframe] = useState<TradingTimeframe>('15m');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWatchlist, setShowWatchlist] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeMarket = markets.find(m => m.symbol === selectedSymbol) || markets[0];
  const timeframes: TradingTimeframe[] = ['1m', '5m', '15m', '30m', '1H', '4H', '1D', '1W'];

  const handleSymbolChange = (sym: string) => {
    setSelectedSymbol(sym);
    if (onSelectSymbol) onSelectSymbol(sym);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      if (containerRef.current && containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
    } else {
      setIsFullscreen(false);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const chartHeight = isFullscreen ? window.innerHeight - 50 : 500;

  return (
    <div
      ref={containerRef}
      className={`terminal-card flex flex-col overflow-hidden transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-[9999] rounded-none bg-[#0b0e14] w-screen h-screen m-0 p-0'
          : 'w-full'
      }`}
    >
      {/* Top Chart Toolbar */}
      <div className="flex items-center justify-between p-2.5 bg-[var(--bg-card)] border-b border-[var(--border-color)] flex-wrap gap-2 z-10 shadow-xs">
        {/* Left Symbol Selector & Asset Info */}
        <div className="flex items-center space-x-3">
          <select
            value={selectedSymbol}
            onChange={e => handleSymbolChange(e.target.value)}
            className="bg-[var(--bg-subpanel)] theme-text-primary font-extrabold font-mono-numeric text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-[var(--border-color)] focus:outline-none focus:border-amber-500 cursor-pointer shadow-xs"
          >
            {markets.map(m => (
              <option key={m.symbol} value={m.symbol} className="bg-[var(--bg-card)] theme-text-primary font-bold">
                {m.symbol} — {m.name}
              </option>
            ))}
          </select>

          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(activeMarket.symbol)}
              className={`p-1.5 rounded-lg border transition ${
                activeMarket.isFavorite
                  ? 'text-amber-500 bg-amber-500/10 border-amber-500/30'
                  : 'theme-text-secondary border-[var(--border-color)] hover:bg-[var(--bg-card-hover)]'
              }`}
              title="Favorite Symbol"
            >
              <Star size={16} fill={activeMarket.isFavorite ? 'currentColor' : 'none'} />
            </button>
          )}

          <div className="hidden sm:flex items-center space-x-2 font-mono-numeric text-xs">
            <span className="text-amber-500 font-black text-sm sm:text-base">${activeMarket.price}</span>
            <span
              className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                activeMarket.change24h >= 0 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
              }`}
            >
              {activeMarket.change24h >= 0 ? '+' : ''}{activeMarket.change24h}%
            </span>
          </div>
        </div>

        {/* Timeframe Bar */}
        <div className="flex items-center space-x-1 bg-[var(--bg-subpanel)] p-1 rounded-lg border border-[var(--border-color)] overflow-x-auto">
          {timeframes.map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-xs font-mono-numeric rounded-md font-extrabold transition ${
                timeframe === tf
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'theme-text-secondary hover:theme-text-primary hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Right Tools & Fullscreen Option */}
        <div className="flex items-center space-x-2">
          {!isFullscreen && (
            <button
              onClick={() => setShowWatchlist(!showWatchlist)}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg theme-text-secondary hover:theme-text-primary hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs font-extrabold transition"
              title="Toggle Watchlist Panel"
            >
              {showWatchlist ? <EyeOff size={15} /> : <Eye size={15} />}
              <span>Watchlist</span>
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold rounded-lg shadow-md transition cursor-pointer"
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen View'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span>{isFullscreen ? 'Exit Full Screen' : 'Full Screen View'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Workspace Grid */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden h-full">
        {/* TradingView Chart Container */}
        <div className="flex-1 p-1 bg-[var(--bg-subpanel)] h-full" style={{ height: isFullscreen ? 'calc(100vh - 45px)' : '500px' }}>
          <TradingViewWidget
            symbol={activeMarket.symbol}
            timeframe={timeframe}
            theme={isDarkMode ? 'dark' : 'light'}
            height={isFullscreen ? window.innerHeight - 45 : 500}
            showNativeSidebar={isFullscreen}
          />
        </div>

        {/* Right Panel: Market Details & Watchlist (In normal mode) */}
        {!isFullscreen && showWatchlist && (
          <div className="w-full lg:w-72 bg-[var(--bg-card)] border-t lg:border-t-0 lg:border-l border-[var(--border-color)] p-4 space-y-5 overflow-y-auto" style={{ maxHeight: '516px' }}>
            {/* Market Details */}
            <div>
              <h4 className="text-xs font-extrabold theme-text-primary uppercase tracking-wider mb-3 flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                <span>Market Details</span>
                <span className="text-[11px] text-amber-500 font-mono-numeric font-extrabold">{activeMarket.symbol}</span>
              </h4>
              <div className="space-y-2 text-xs font-mono-numeric">
                <div className="flex justify-between theme-text-secondary">
                  <span>Prev Close</span>
                  <span className="theme-text-primary font-bold">${activeMarket.prevClose}</span>
                </div>
                <div className="flex justify-between theme-text-secondary">
                  <span>24H High</span>
                  <span className="text-emerald-500 font-bold">${activeMarket.high24h}</span>
                </div>
                <div className="flex justify-between theme-text-secondary">
                  <span>24H Low</span>
                  <span className="text-rose-500 font-bold">${activeMarket.low24h}</span>
                </div>
                <div className="flex justify-between theme-text-secondary">
                  <span>24H Volume</span>
                  <span className="text-indigo-500 font-bold">{activeMarket.volume24h}</span>
                </div>
                <div className="flex justify-between theme-text-secondary">
                  <span>Category</span>
                  <span className="theme-text-primary font-bold">{activeMarket.category}</span>
                </div>
              </div>
            </div>

            {/* Quick Watchlist */}
            <div>
              <h4 className="text-xs font-extrabold theme-text-primary uppercase tracking-wider mb-3 flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                <span>Watchlist</span>
                <Eye size={14} className="theme-text-secondary" />
              </h4>
              <div className="space-y-1.5">
                {markets.slice(0, 7).map(m => (
                  <button
                    key={m.symbol}
                    onClick={() => handleSymbolChange(m.symbol)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs transition font-mono-numeric ${
                      m.symbol === activeMarket.symbol
                        ? 'bg-amber-500/10 border border-amber-500/40 theme-text-primary font-extrabold'
                        : 'bg-[var(--bg-subpanel)] border border-[var(--border-color)] hover:bg-[var(--bg-card-hover)] theme-text-secondary'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-amber-500">{m.symbol}</span>
                    </div>
                    <div className="text-right">
                      <div className="theme-text-primary font-bold">${m.price}</div>
                      <div className={m.change24h >= 0 ? 'text-emerald-500 text-[10px] font-bold' : 'text-rose-500 text-[10px] font-bold'}>
                        {m.change24h >= 0 ? '+' : ''}{m.change24h}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
