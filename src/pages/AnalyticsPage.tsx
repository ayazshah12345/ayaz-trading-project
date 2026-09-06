import React from 'react';
import { SessionBreakdown } from '../components/analytics/SessionBreakdown';
import { AssetBreakdown } from '../components/analytics/AssetBreakdown';
import { GapAnalyzerAnalytics } from '../components/analytics/GapAnalyzerAnalytics';
import { WinLossChart } from '../components/charts/WinLossChart';
import { useTradingWorkspace } from '../hooks/useTradingWorkspace';
import { LineChart, DollarSign } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/formatters';

import type { TradeRecord } from '../types';

interface AnalyticsPageProps {
  workspace: ReturnType<typeof useTradingWorkspace>;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ workspace }) => {
  const trades: TradeRecord[] = workspace.trades || [];

  // Compute overall performance statistics strictly from Trade Journal entries
  const totalTrades = trades.length;
  const winningTrades = trades.filter((t: TradeRecord) => t.result === 'WIN').length;
  const losingTrades = trades.filter((t: TradeRecord) => t.result === 'LOSS').length;
  const breakevenTrades = trades.filter((t: TradeRecord) => t.result === 'BREAKEVEN').length;
  const winRate = totalTrades ? (winningTrades / totalTrades) * 100 : 0;

  const netPnl = trades.reduce((acc: number, t: TradeRecord) => acc + t.pnl, 0);
  const totalR = trades.reduce((acc: number, t: TradeRecord) => acc + t.rMultiple, 0);
  const avgR = totalTrades ? totalR / totalTrades : 0;

  const grossProfit = trades.filter((t: TradeRecord) => t.pnl > 0).reduce((acc: number, t: TradeRecord) => acc + t.pnl, 0);
  const grossLoss = Math.abs(trades.filter((t: TradeRecord) => t.pnl < 0).reduce((acc: number, t: TradeRecord) => acc + t.pnl, 0));
  const profitFactor = grossLoss > 0 ? Number((grossProfit / grossLoss).toFixed(2)) : grossProfit > 0 ? 9.99 : 0;

  const winAmounts = trades.filter((t: TradeRecord) => t.pnl > 0).map((t: TradeRecord) => t.pnl);
  const lossAmounts = trades.filter((t: TradeRecord) => t.pnl < 0).map((t: TradeRecord) => Math.abs(t.pnl));
  const avgWin = winAmounts.length ? winAmounts.reduce((a: number, b: number) => a + b, 0) / winAmounts.length : 0;
  const avgLoss = lossAmounts.length ? lossAmounts.reduce((a: number, b: number) => a + b, 0) / lossAmounts.length : 0;

  // Compute Strategy breakdown dynamically from trade records
  const strategyMap: Record<string, { trades: number; wins: number; totalPnl: number; totalR: number; grossWin: number; grossLoss: number }> = {};
  trades.forEach((t: TradeRecord) => {
    const strat = t.strategy || 'Custom';
    if (!strategyMap[strat]) {
      strategyMap[strat] = { trades: 0, wins: 0, totalPnl: 0, totalR: 0, grossWin: 0, grossLoss: 0 };
    }
    strategyMap[strat].trades += 1;
    strategyMap[strat].totalPnl += t.pnl;
    strategyMap[strat].totalR += t.rMultiple;
    if (t.result === 'WIN') strategyMap[strat].wins += 1;
    if (t.pnl > 0) strategyMap[strat].grossWin += t.pnl;
    if (t.pnl < 0) strategyMap[strat].grossLoss += Math.abs(t.pnl);
  });

  const strategyBreakdown = Object.keys(strategyMap).map(strat => {
    const item = strategyMap[strat];
    const sWinRate = item.trades ? Number(((item.wins / item.trades) * 100).toFixed(1)) : 0;
    const sAvgR = item.trades ? Number((item.totalR / item.trades).toFixed(2)) : 0;
    const sPf = item.grossLoss > 0 ? Number((item.grossWin / item.grossLoss).toFixed(2)) : item.grossWin > 0 ? 9.99 : 0;
    return {
      name: strat,
      trades: item.trades,
      winRate: sWinRate,
      avgR: sAvgR,
      profitFactor: sPf,
      totalR: Number(item.totalR.toFixed(2)),
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[var(--border-color)] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold theme-text-primary flex items-center space-x-2">
            <LineChart className="text-amber-500" />
            <span>Trade Journal Performance Analytics</span>
          </h1>
          <p className="text-xs theme-text-secondary mt-1">
            Quantitative analysis derived strictly from your logged trade journal entries and account capital.
          </p>
        </div>

        {/* Live Capital Badge */}
        <div className="p-3 rounded-lg bg-[var(--bg-subpanel)] border border-amber-500/30 flex items-center space-x-3 font-mono-numeric">
          <div className="p-2 rounded-md bg-amber-500/10 text-amber-500 font-extrabold">
            <DollarSign size={18} />
          </div>
          <div>
            <span className="text-[10px] theme-text-secondary uppercase font-bold block">Account Capital ($ USD)</span>
            <span className="text-lg font-black text-amber-500">
              ${workspace.currentCapital?.toFixed(2) || '100.00'} USD
            </span>
          </div>
        </div>
      </div>

      {/* 1. Overall Performance Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-mono-numeric">
        <div className="terminal-card p-3">
          <span className="text-[10px] theme-text-secondary uppercase font-bold">Net P&L</span>
          <div className={`text-base font-extrabold ${netPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {netPnl >= 0 ? '+' : ''}${netPnl.toFixed(2)}
          </div>
        </div>
        <div className="terminal-card p-3">
          <span className="text-[10px] text-amber-500 uppercase font-bold">Win Rate</span>
          <div className="text-base font-extrabold text-amber-500">{winRate.toFixed(1)}%</div>
        </div>
        <div className="terminal-card p-3">
          <span className="text-[10px] text-emerald-500 uppercase font-bold">Profit Factor</span>
          <div className="text-base font-extrabold text-emerald-500">{profitFactor}</div>
        </div>
        <div className="terminal-card p-3">
          <span className="text-[10px] text-indigo-500 uppercase font-bold">Total Net R</span>
          <div className="text-base font-extrabold text-indigo-500">+{totalR.toFixed(2)}R</div>
        </div>
        <div className="terminal-card p-3">
          <span className="text-[10px] text-emerald-500 uppercase font-bold">Avg Win</span>
          <div className="text-base font-extrabold text-emerald-500">${avgWin.toFixed(2)}</div>
        </div>
        <div className="terminal-card p-3">
          <span className="text-[10px] text-rose-500 uppercase font-bold">Avg Loss</span>
          <div className="text-base font-extrabold text-rose-500">${avgLoss.toFixed(2)}</div>
        </div>
        <div className="terminal-card p-3">
          <span className="text-[10px] theme-text-secondary uppercase font-bold">Total Trades</span>
          <div className="text-base font-extrabold theme-text-primary">{totalTrades}</div>
        </div>
        <div className="terminal-card p-3">
          <span className="text-[10px] text-indigo-500 uppercase font-bold">Avg R / Trade</span>
          <div className="text-base font-extrabold text-indigo-500">+{avgR.toFixed(2)}R</div>
        </div>
      </div>

      {/* 2. Gap Analyzer Analytics Section */}
      <GapAnalyzerAnalytics trades={trades} />

      {/* 3. Breakdown Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <AssetBreakdown trades={trades} />
        </div>
        <div className="lg:col-span-5">
          <WinLossChart wins={winningTrades} losses={losingTrades} breakevens={breakevenTrades} />
        </div>
      </div>

      {/* 4. Session Performance Breakdown */}
      <SessionBreakdown trades={trades} />

      {/* 5. Strategy Performance Table */}
      <div className="terminal-card p-5 space-y-3">
        <h4 className="text-xs font-bold theme-text-secondary uppercase tracking-wider border-b border-[var(--border-color)] pb-2">
          Trade Journal Strategy Performance Breakdown
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-numeric">
            <thead className="bg-[var(--bg-subpanel)] theme-text-secondary uppercase text-[11px]">
              <tr>
                <th className="p-3">Strategy</th>
                <th className="p-3">Trades</th>
                <th className="p-3">Win Rate</th>
                <th className="p-3">Average R</th>
                <th className="p-3">Profit Factor</th>
                <th className="p-3 text-right font-bold">Net R</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {strategyBreakdown.map(s => (
                <tr key={s.name} className="hover:bg-[var(--bg-card-hover)] transition">
                  <td className="p-3 font-bold theme-text-primary font-sans">{s.name}</td>
                  <td className="p-3 theme-text-secondary">{s.trades}</td>
                  <td className="p-3 text-amber-500 font-bold">{s.winRate}%</td>
                  <td className="p-3 text-indigo-400 font-bold">+{s.avgR}R</td>
                  <td className="p-3 text-emerald-500 font-bold">{s.profitFactor}</td>
                  <td className="p-3 text-right text-amber-500 font-extrabold">+{s.totalR}R</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
