import React, { useState } from 'react';
import { useTradingWorkspace } from '../hooks/useTradingWorkspace';
import { DashboardAnalyticsVisualizer } from '../components/dashboard/DashboardAnalyticsVisualizer';
import { GaugeAnalysisSection } from '../components/dashboard/GaugeAnalysisSection';
import { TradeTable } from '../components/trades/TradeTable';
import { TradeDetailModal } from '../components/trades/TradeDetailModal';
import { BacktestTable } from '../components/backtesting/BacktestTable';
import { BacktestDetailView } from '../components/backtesting/BacktestDetailView';
import type { TradeRecord, BacktestCampaign } from '../types';
import {
  BookMarked,
  FlaskConical,
  Plus,
  ArrowRight,
  TrendingUp,
  Award,
  DollarSign,
  BarChart2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardPageProps {
  workspace: ReturnType<typeof useTradingWorkspace>;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ workspace }) => {
  const navigate = useNavigate();
  const [selectedTrade, setSelectedTrade] = useState<TradeRecord | null>(null);
  const [activeBacktest, setActiveBacktest] = useState<BacktestCampaign | null>(null);

  const trades = workspace.trades;
  const backtests = workspace.backtests;

  // Trade Journal Statistics
  const wins = trades.filter(t => t.result === 'WIN').length;
  const winRate = trades.length ? ((wins / trades.length) * 100).toFixed(1) : '0.0';
  const netPnl = trades.reduce((acc, t) => acc + (t.pnl || 0), 0);

  // Backtesting Statistics
  const totalBacktestTrades = backtests.reduce((acc, b) => acc + (b.totalTrades || 0), 0);
  const totalBacktestWins = backtests.reduce((acc, b) => acc + (b.winningTrades || 0), 0);
  const avgBacktestWinRate = backtests.length
    ? (backtests.reduce((acc, b) => acc + (b.winRate || 0), 0) / backtests.length).toFixed(1)
    : '0.0';
  const totalBacktestR = backtests.reduce((acc, b) => acc + (b.totalR || 0), 0).toFixed(2);

  if (activeBacktest) {
    const campaign = backtests.find(b => b.id === activeBacktest.id) || activeBacktest;
    return (
      <BacktestDetailView
        campaign={campaign}
        onBack={() => setActiveBacktest(null)}
        onSaveRecord={workspace.addBacktestRecord}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Greeting & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold theme-text-primary flex items-center space-x-2 font-sans tracking-tight">
            <span>Trader Dashboard</span>
          </h1>
          <p className="text-xs theme-text-secondary mt-1 font-medium">
            Strictly displaying your <strong className="theme-text-primary">Trade Journal Records</strong> and <strong className="theme-text-primary">Backtesting Campaigns</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/trades')}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold rounded-lg shadow-md transition"
          >
            <BookMarked size={15} />
            <span>Open Trade Journal</span>
          </button>

          <button
            onClick={() => navigate('/backtesting')}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] theme-text-primary text-xs font-bold rounded-lg border border-[var(--border-color)] transition shadow-xs"
          >
            <FlaskConical size={15} />
            <span>Backtesting Lab</span>
          </button>
        </div>
      </div>

      {/* Top 2 Metric Groups: Trade Journal Summary & Backtesting Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trade Journal Summary Card */}
        <div className="terminal-card p-5 space-y-4 border-amber-500/30 bg-gradient-to-br from-[var(--bg-card)] to-amber-500/5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2.5">
            <div className="flex items-center space-x-2">
              <BookMarked className="text-amber-500" size={18} />
              <h3 className="text-sm font-extrabold theme-text-primary uppercase tracking-wider">
                Trade Journal Overview
              </h3>
            </div>
            <span className="text-xs font-mono-numeric font-bold text-amber-500 px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              {trades.length} Recorded Trades
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-numeric">
            <div className="p-3 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] theme-text-secondary uppercase font-bold">Account Equity</span>
              <div className="text-base font-extrabold text-amber-500">${workspace.currentCapital?.toFixed(2)}</div>
            </div>

            <div className="p-3 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] theme-text-secondary uppercase font-bold">Net P&L ($)</span>
              <div className={`text-base font-extrabold ${netPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {netPnl >= 0 ? '+' : ''}${netPnl.toFixed(2)}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] theme-text-secondary uppercase font-bold">Win Rate</span>
              <div className="text-base font-extrabold text-purple-400">{winRate}%</div>
            </div>

            <div className="p-3 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] theme-text-secondary uppercase font-bold">Total Trades</span>
              <div className="text-base font-extrabold theme-text-primary">{trades.length}</div>
            </div>
          </div>
        </div>

        {/* Backtesting Summary Card */}
        <div className="terminal-card p-5 space-y-4 border-indigo-500/30 bg-gradient-to-br from-[var(--bg-card)] to-indigo-500/5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2.5">
            <div className="flex items-center space-x-2">
              <FlaskConical className="text-indigo-400" size={18} />
              <h3 className="text-sm font-extrabold theme-text-primary uppercase tracking-wider">
                Backtesting Summary
              </h3>
            </div>
            <span className="text-xs font-mono-numeric font-bold text-indigo-400 px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
              {backtests.length} Saved Campaigns
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-numeric">
            <div className="p-3 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] theme-text-secondary uppercase font-bold">Total Backtests</span>
              <div className="text-base font-extrabold theme-text-primary">{backtests.length}</div>
            </div>

            <div className="p-3 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] theme-text-secondary uppercase font-bold">Backtest Trades</span>
              <div className="text-base font-extrabold text-indigo-400">{totalBacktestTrades}</div>
            </div>

            <div className="p-3 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] theme-text-secondary uppercase font-bold">Avg Win Rate</span>
              <div className="text-base font-extrabold text-emerald-400">{avgBacktestWinRate}%</div>
            </div>

            <div className="p-3 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] theme-text-secondary uppercase font-bold">Total R Return</span>
              <div className="text-base font-extrabold text-blue-400">+{totalBacktestR}R</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Win/Loss & Graphical Visualizations Suite */}
      <DashboardAnalyticsVisualizer trades={trades} backtests={backtests} />

      {/* Short Analysis, Profitability & Long Analysis Semi-Circle Gauges */}
      <GaugeAnalysisSection trades={trades} backtests={backtests} />

      {/* Trade Journal Records Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookMarked className="text-amber-500" size={16} />
            <h3 className="text-sm font-extrabold theme-text-primary uppercase tracking-wider">
              Trade Journal Records ({trades.length})
            </h3>
          </div>

          <button
            onClick={() => navigate('/trades')}
            className="text-xs font-bold text-amber-500 hover:text-amber-600 flex items-center space-x-1 font-mono-numeric"
          >
            <span>View All Trades</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <TradeTable
          trades={trades}
          onSelectTrade={setSelectedTrade}
          onDeleteTrade={workspace.deleteTrade}
        />
      </div>

      {/* Backtesting Records Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FlaskConical className="text-amber-500" size={16} />
            <h3 className="text-sm font-extrabold theme-text-primary uppercase tracking-wider">
              Backtesting Campaigns ({backtests.length})
            </h3>
          </div>

          <button
            onClick={() => navigate('/backtesting')}
            className="text-xs font-bold text-amber-500 hover:text-amber-600 flex items-center space-x-1 font-mono-numeric"
          >
            <span>View All Backtests</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <BacktestTable
          backtests={backtests}
          onSelectBacktest={setActiveBacktest}
        />
      </div>

      {/* Trade Inspector Modal */}
      <TradeDetailModal
        trade={selectedTrade}
        isOpen={!!selectedTrade}
        onClose={() => setSelectedTrade(null)}
      />
    </div>
  );
};
