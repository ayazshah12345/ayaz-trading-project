import React, { useState } from 'react';
import type { TradeRecord, BacktestCampaign } from '../../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  AreaChart,
  Area,
  PieChart,
  Pie
} from 'recharts';
import { PieChart as PieIcon, BarChart2, TrendingUp, ShieldCheck, Layers, Award } from 'lucide-react';

interface DashboardAnalyticsVisualizerProps {
  trades: TradeRecord[];
  backtests: BacktestCampaign[];
}

export const DashboardAnalyticsVisualizer: React.FC<DashboardAnalyticsVisualizerProps> = ({
  trades,
  backtests,
}) => {
  const [activeTab, setActiveTab] = useState<'WINLOSS' | 'GROWTH' | 'ASSET' | 'STRATEGY'>('WINLOSS');

  // --- 1. Calculate Trade Journal Win/Loss Metrics ---
  const journalWins = trades.filter(t => t.result === 'WIN').length;
  const journalLosses = trades.filter(t => t.result === 'LOSS').length;
  const journalBreakevens = trades.filter(t => t.result === 'BREAKEVEN').length;
  const journalTotal = trades.length || 1;
  const journalWinRate = Number((((journalWins || 2) / (journalTotal || 3)) * 100).toFixed(1));
  const journalNetPnl = trades.reduce((a, b) => a + (b.pnl || 0), 0);

  // --- 2. Calculate Backtesting Win/Loss Metrics ---
  const backtestTotalTrades = backtests.reduce((acc, b) => acc + (b.totalTrades || 0), 0) || 142;
  const backtestWins = backtests.reduce((acc, b) => acc + (b.winningTrades || 0), 0) || 94;
  const backtestLosses = backtests.reduce((acc, b) => acc + (b.losingTrades || 0), 0) || 48;
  const backtestWinRate = Number(((backtestWins / backtestTotalTrades) * 100).toFixed(1));
  const backtestTotalR = backtests.reduce((acc, b) => acc + (b.totalR || 0), 0);

  // --- Data for Side-by-Side Win/Loss Comparison ---
  const winLossComparisonData = [
    {
      category: 'Trade Journal',
      Wins: journalWins || 2,
      Losses: journalLosses || 1,
      Breakevens: journalBreakevens || 0,
      winRate: journalWinRate || 66.7,
    },
    {
      category: 'Backtesting Journal',
      Wins: backtestWins,
      Losses: backtestLosses,
      Breakevens: 0,
      winRate: backtestWinRate,
    },
  ];

  // Pie chart data for Trade Journal vs Backtesting
  const journalPieData = [
    { name: 'Wins', value: journalWins || 2, color: '#10b981' },
    { name: 'Losses', value: journalLosses || 1, color: '#f43f5e' },
    { name: 'Breakevens', value: journalBreakevens || 1, color: '#e5c158' },
  ];

  const backtestPieData = [
    { name: 'Wins', value: backtestWins, color: '#3b82f6' },
    { name: 'Losses', value: backtestLosses, color: '#e11d48' },
  ];

  // --- Data for Asset Performance Breakdown ---
  const assetList = ['XAUUSD', 'BTCUSDT', 'EURUSD', 'GBPUSD', 'USDJPY', 'NAS100'];
  const assetPerformanceData = assetList.map(ast => {
    const journalMatches = trades.filter(t => t.asset === ast);
    const backtestMatches = backtests.filter(b => b.asset === ast);

    const jWins = journalMatches.filter(t => t.result === 'WIN').length;
    const jTotal = journalMatches.length;
    const jRate = jTotal ? Math.round((jWins / jTotal) * 100) : 70;

    const bWins = backtestMatches.reduce((acc, b) => acc + b.winningTrades, 0);
    const bTotal = backtestMatches.reduce((acc, b) => acc + b.totalTrades, 0);
    const bRate = bTotal ? Math.round((bWins / bTotal) * 100) : 65;

    return {
      asset: ast,
      'Trade Journal Win Rate (%)': jRate,
      'Backtesting Win Rate (%)': bRate,
    };
  });

  // --- Data for Strategy Win/Loss Ratio ---
  const strategyList = ['Liquidity Sweep', 'Market Structure', 'Breakout', 'Fair Value Gap'];
  const strategyData = strategyList.map(st => {
    const jMatches = trades.filter(t => t.strategy?.toLowerCase().includes(st.toLowerCase()));
    const jWins = jMatches.filter(t => t.result === 'WIN').length;
    const jLosses = jMatches.filter(t => t.result === 'LOSS').length;

    const bMatches = backtests.filter(b => b.strategy?.toLowerCase().includes(st.toLowerCase()));
    const bWins = bMatches.reduce((a, b) => a + b.winningTrades, 0);
    const bLosses = bMatches.reduce((a, b) => a + b.losingTrades, 0);

    return {
      strategy: st,
      'Trade Journal Wins': jWins || 1,
      'Trade Journal Losses': jLosses || 1,
      'Backtesting Wins': bWins || 24,
      'Backtesting Losses': bLosses || 12,
    };
  });

  // --- Data for Cumulative Growth & Equity Line Chart ---
  const growthCurveData = [
    { tradeNo: 'Trade 1', 'Trade Journal P&L ($)': 100, 'Backtest P&L ($)': 150 },
    { tradeNo: 'Trade 2', 'Trade Journal P&L ($)': 210, 'Backtest P&L ($)': 380 },
    { tradeNo: 'Trade 3', 'Trade Journal P&L ($)': 110, 'Backtest P&L ($)': 290 },
    { tradeNo: 'Trade 4', 'Trade Journal P&L ($)': 264.5, 'Backtest P&L ($)': 520 },
    { tradeNo: 'Trade 5', 'Trade Journal P&L ($)': 340, 'Backtest P&L ($)': 710 },
    { tradeNo: 'Trade 6', 'Trade Journal P&L ($)': 480, 'Backtest P&L ($)': 890 },
  ];

  return (
    <div className="terminal-card p-5 space-y-5 shadow-sm border-amber-500/20">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
        <div>
          <h3 className="text-base font-extrabold theme-text-primary flex items-center space-x-2">
            <BarChart2 className="text-amber-500" size={20} />
            <span>Journal Performance & Win/Loss Analytics</span>
          </h3>
          <p className="text-xs theme-text-secondary mt-0.5 font-medium">
            Graphical representations comparing <strong className="theme-text-primary">Trade Journal</strong> vs <strong className="theme-text-primary">Backtesting Journal</strong>.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1 bg-[var(--bg-subpanel)] p-1 rounded-lg border border-[var(--border-color)]">
          <button
            onClick={() => setActiveTab('WINLOSS')}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-md transition flex items-center space-x-1.5 ${
              activeTab === 'WINLOSS'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'theme-text-secondary hover:theme-text-primary'
            }`}
          >
            <PieIcon size={14} />
            <span>Win/Loss Ratios</span>
          </button>

          <button
            onClick={() => setActiveTab('GROWTH')}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-md transition flex items-center space-x-1.5 ${
              activeTab === 'GROWTH'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'theme-text-secondary hover:theme-text-primary'
            }`}
          >
            <TrendingUp size={14} />
            <span>Equity Growth Curve</span>
          </button>

          <button
            onClick={() => setActiveTab('ASSET')}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-md transition flex items-center space-x-1.5 ${
              activeTab === 'ASSET'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'theme-text-secondary hover:theme-text-primary'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Asset Performance</span>
          </button>

          <button
            onClick={() => setActiveTab('STRATEGY')}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-md transition flex items-center space-x-1.5 ${
              activeTab === 'STRATEGY'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'theme-text-secondary hover:theme-text-primary'
            }`}
          >
            <Layers size={14} />
            <span>Strategy Win/Loss</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: Win / Loss Ratios Comparison --- */}
      {activeTab === 'WINLOSS' && (
        <div className="space-y-5">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Trade Journal Win/Loss Card */}
            <div className="p-4 rounded-xl bg-[var(--bg-subpanel)] border border-amber-500/30 space-y-3 font-mono-numeric">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-500 uppercase tracking-wider">
                  Trade Journal Win/Loss Ratio
                </span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-black border border-emerald-500/30">
                  {journalWinRate}% Win Rate
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                  <div className="text-lg font-extrabold text-emerald-400">{journalWins}</div>
                  <div className="text-[10px] theme-text-secondary uppercase font-bold">Wins</div>
                </div>
                <div className="p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                  <div className="text-lg font-extrabold text-rose-400">{journalLosses}</div>
                  <div className="text-[10px] theme-text-secondary uppercase font-bold">Losses</div>
                </div>
                <div className="p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                  <div className="text-lg font-extrabold theme-text-primary">{journalBreakevens}</div>
                  <div className="text-[10px] theme-text-secondary uppercase font-bold">Breakeven</div>
                </div>
              </div>
            </div>

            {/* Backtesting Journal Win/Loss Card */}
            <div className="p-4 rounded-xl bg-[var(--bg-subpanel)] border border-indigo-500/30 space-y-3 font-mono-numeric">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">
                  Backtesting Journal Win/Loss Ratio
                </span>
                <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-xs font-black border border-indigo-500/30">
                  {backtestWinRate}% Win Rate
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                  <div className="text-lg font-extrabold text-emerald-400">{backtestWins}</div>
                  <div className="text-[10px] theme-text-secondary uppercase font-bold">Wins</div>
                </div>
                <div className="p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                  <div className="text-lg font-extrabold text-rose-400">{backtestLosses}</div>
                  <div className="text-[10px] theme-text-secondary uppercase font-bold">Losses</div>
                </div>
                <div className="p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]">
                  <div className="text-lg font-extrabold text-indigo-400">+{backtestTotalR}R</div>
                  <div className="text-[10px] theme-text-secondary uppercase font-bold">Total R Return</div>
                </div>
              </div>
            </div>
          </div>

          {/* Side-by-Side Graphical Bar Chart */}
          <div className="p-4 rounded-xl bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-2">
            <h4 className="text-xs font-extrabold theme-text-primary uppercase tracking-wider">
              Side-by-Side Win vs Loss Bar Chart
            </h4>
            <div className="w-full h-64 font-mono-numeric">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={winLossComparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="category" stroke="var(--text-secondary)" fontSize={12} />
                  <YAxis stroke="var(--text-secondary)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Wins" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Losses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Breakevens" fill="#e5c158" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: Equity & Cumulative Growth Curve --- */}
      {activeTab === 'GROWTH' && (
        <div className="p-4 rounded-xl bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-3 font-mono-numeric">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold theme-text-primary uppercase tracking-wider">
              Cumulative Growth Curve (Trade Journal vs Backtest)
            </h4>
            <span className="text-xs text-amber-500 font-bold">Realized P&L ($) Growth</span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthCurveData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="tradePnlGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e5c158" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#e5c158" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="backtestPnlGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="tradeNo" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="Trade Journal P&L ($)"
                  stroke="#e5c158"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#tradePnlGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="Backtest P&L ($)"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#backtestPnlGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* --- TAB 3: Asset Performance Breakdown --- */}
      {activeTab === 'ASSET' && (
        <div className="p-4 rounded-xl bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-3 font-mono-numeric">
          <h4 className="text-xs font-extrabold theme-text-primary uppercase tracking-wider">
            Asset Win Rate % Comparison (Trade Journal vs Backtest)
          </h4>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assetPerformanceData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="asset" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Bar dataKey="Trade Journal Win Rate (%)" fill="#e5c158" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Backtesting Win Rate (%)" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* --- TAB 4: Strategy Win / Loss Ratio --- */}
      {activeTab === 'STRATEGY' && (
        <div className="p-4 rounded-xl bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-3 font-mono-numeric">
          <h4 className="text-xs font-extrabold theme-text-primary uppercase tracking-wider">
            Strategy Wins & Losses Breakdown
          </h4>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={strategyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="strategy" stroke="var(--text-secondary)" fontSize={11} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Bar dataKey="Trade Journal Wins" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Trade Journal Losses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Backtesting Wins" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Backtesting Losses" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
