import React from 'react';
import type { TradeRecord } from '../../types';
import { Layers, CheckCircle2, XCircle, Activity, Zap } from 'lucide-react';

interface GapAnalyzerAnalyticsProps {
  trades: TradeRecord[];
}

export const GapAnalyzerAnalytics: React.FC<GapAnalyzerAnalyticsProps> = ({ trades }) => {
  // Filter trades that have gap annotations or gap strategy
  const gapTrades = trades.filter(
    t =>
      (t.gapType && t.gapType !== 'None') ||
      t.strategy.toLowerCase().includes('gap') ||
      t.strategy.toLowerCase().includes('fvg') ||
      (t.tradeReason && (t.tradeReason.toLowerCase().includes('gap') || t.tradeReason.toLowerCase().includes('fvg')))
  );

  const totalGapTrades = gapTrades.length;
  const fvgTrades = trades.filter(t => t.gapType === 'Fair Value Gap' || t.strategy.toLowerCase().includes('fvg'));
  const weekendGapTrades = trades.filter(t => t.gapType === 'Weekend Open Gap');
  const liquidityVoidTrades = trades.filter(t => t.gapType === 'Liquidity Void');

  const filledTrades = gapTrades.filter(t => t.gapFilled !== false);
  const gapFillRate = totalGapTrades ? ((filledTrades.length / totalGapTrades) * 100).toFixed(1) : '0.0';

  const gapWins = gapTrades.filter(t => t.result === 'WIN').length;
  const gapWinRate = totalGapTrades ? ((gapWins / totalGapTrades) * 100).toFixed(1) : '0.0';
  const gapNetPnl = gapTrades.reduce((acc, t) => acc + t.pnl, 0);

  const avgGapSize = totalGapTrades
    ? (gapTrades.reduce((acc, t) => acc + (t.gapSize || 12), 0) / totalGapTrades).toFixed(1)
    : '0.0';

  return (
    <div className="terminal-card p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
        <div>
          <h3 className="text-sm font-extrabold theme-text-primary uppercase tracking-wider flex items-center space-x-2">
            <Zap className="text-amber-500" size={18} />
            <span>Trade Journal Gap Analyzer Analytics</span>
          </h3>
          <p className="text-xs theme-text-secondary mt-0.5">
            Strictly analyzing Fair Value Gaps (FVG), Weekend Open Gaps & Liquidity Voids from your logged trade journal.
          </p>
        </div>

        <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-full font-mono-numeric font-extrabold text-xs">
          {totalGapTrades} Gap Trades Analyzed
        </span>
      </div>

      {/* KPI Metrics Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-numeric">
        <div className="p-3.5 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-1">
          <span className="text-[10px] theme-text-secondary uppercase font-bold">Gap Win Rate</span>
          <div className="text-lg font-extrabold text-amber-500">{gapWinRate}%</div>
        </div>

        <div className="p-3.5 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-1">
          <span className="text-[10px] theme-text-secondary uppercase font-bold">Gap Fill Success Rate</span>
          <div className="text-lg font-extrabold text-emerald-500">{gapFillRate}%</div>
        </div>

        <div className="p-3.5 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-1">
          <span className="text-[10px] theme-text-secondary uppercase font-bold">Avg Gap Distance</span>
          <div className="text-lg font-extrabold theme-text-primary">{avgGapSize} pts</div>
        </div>

        <div className="p-3.5 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-1">
          <span className="text-[10px] theme-text-secondary uppercase font-bold">Gap Realized P&L</span>
          <div className={`text-lg font-extrabold ${gapNetPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {gapNetPnl >= 0 ? '+' : ''}${gapNetPnl.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Gap Type Breakdown Bar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-2 font-mono-numeric">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="theme-text-primary">Fair Value Gaps (FVG)</span>
            <span className="text-purple-400">{fvgTrades.length} Trades</span>
          </div>
          <div className="w-full bg-[var(--bg-card)] rounded-full h-2 overflow-hidden border border-[var(--border-color)]">
            <div
              className="bg-purple-500 h-full rounded-full transition-all"
              style={{ width: `${trades.length ? (fvgTrades.length / trades.length) * 100 : 0}%` }}
            />
          </div>
          <div className="text-[11px] theme-text-secondary flex justify-between">
            <span>Win Rate: {fvgTrades.length ? ((fvgTrades.filter(t => t.result === 'WIN').length / fvgTrades.length) * 100).toFixed(0) : 0}%</span>
            <span>P&L: ${fvgTrades.reduce((a, b) => a + b.pnl, 0).toFixed(2)}</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-2 font-mono-numeric">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="theme-text-primary">Weekend Open Gaps</span>
            <span className="text-indigo-400">{weekendGapTrades.length} Trades</span>
          </div>
          <div className="w-full bg-[var(--bg-card)] rounded-full h-2 overflow-hidden border border-[var(--border-color)]">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all"
              style={{ width: `${trades.length ? (weekendGapTrades.length / trades.length) * 100 : 0}%` }}
            />
          </div>
          <div className="text-[11px] theme-text-secondary flex justify-between">
            <span>Win Rate: {weekendGapTrades.length ? ((weekendGapTrades.filter(t => t.result === 'WIN').length / weekendGapTrades.length) * 100).toFixed(0) : 0}%</span>
            <span>P&L: ${weekendGapTrades.reduce((a, b) => a + b.pnl, 0).toFixed(2)}</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-2 font-mono-numeric">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="theme-text-primary">Liquidity Voids</span>
            <span className="text-amber-400">{liquidityVoidTrades.length} Trades</span>
          </div>
          <div className="w-full bg-[var(--bg-card)] rounded-full h-2 overflow-hidden border border-[var(--border-color)]">
            <div
              className="bg-amber-500 h-full rounded-full transition-all"
              style={{ width: `${trades.length ? (liquidityVoidTrades.length / trades.length) * 100 : 0}%` }}
            />
          </div>
          <div className="text-[11px] theme-text-secondary flex justify-between">
            <span>Win Rate: {liquidityVoidTrades.length ? ((liquidityVoidTrades.filter(t => t.result === 'WIN').length / liquidityVoidTrades.length) * 100).toFixed(0) : 0}%</span>
            <span>P&L: ${liquidityVoidTrades.reduce((a, b) => a + b.pnl, 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
