import React from 'react';
import type { BacktestRecord } from '../../types';
import { Layers, Activity, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

interface GapAnalyzerProps {
  records: BacktestRecord[];
}

export const GapAnalyzer: React.FC<GapAnalyzerProps> = ({ records }) => {
  const gapRecords = records.filter(r => r.gapType && r.gapType !== 'None');

  const totalGaps = gapRecords.length;
  const filledGaps = gapRecords.filter(r => r.gapFilled).length;
  const fillRate = totalGaps ? ((filledGaps / totalGaps) * 100).toFixed(1) : '0.0';
  const winningGaps = gapRecords.filter(r => r.result === 'WIN').length;
  const gapWinRate = totalGaps ? ((winningGaps / totalGaps) * 100).toFixed(1) : '0.0';

  const avgGapSize = totalGaps
    ? (gapRecords.reduce((acc, r) => acc + (r.gapSize || 0), 0) / totalGaps).toFixed(1)
    : '0.0';

  const totalGapProfit = gapRecords.reduce((acc, r) => acc + r.profitAmount, 0);

  // Group by Gap Type
  const gapTypeStats = [
    {
      name: 'Fair Value Gap',
      count: gapRecords.filter(r => r.gapType === 'Fair Value Gap').length,
      profit: gapRecords.filter(r => r.gapType === 'Fair Value Gap').reduce((a, b) => a + b.profitAmount, 0),
    },
    {
      name: 'Weekend Open Gap',
      count: gapRecords.filter(r => r.gapType === 'Weekend Open Gap').length,
      profit: gapRecords.filter(r => r.gapType === 'Weekend Open Gap').reduce((a, b) => a + b.profitAmount, 0),
    },
    {
      name: 'Liquidity Void',
      count: gapRecords.filter(r => r.gapType === 'Liquidity Void').length,
      profit: gapRecords.filter(r => r.gapType === 'Liquidity Void').reduce((a, b) => a + b.profitAmount, 0),
    },
  ];

  // Data for Gap Performance Bar Chart
  const chartData = gapRecords.map((r, idx) => ({
    label: `#${idx + 1} (${r.asset})`,
    gapSize: r.gapSize || 0,
    profit: r.profitAmount,
    result: r.result,
    type: r.gapType,
  }));

  return (
    <div className="terminal-card p-5 space-y-5 shadow-sm">
      {/* Analyzer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-color)] pb-3 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Layers size={18} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold theme-text-primary uppercase tracking-wider">
              Price Gap Analyzer
            </h3>
            <p className="text-[11px] theme-text-secondary font-medium">
              Fair Value Gap (FVG), Weekend Open Gap, & Liquidity Void efficiency breakdown
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono-numeric font-extrabold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 self-start sm:self-auto">
          {totalGaps} Gaps Analyzed
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-numeric">
        <div className="p-3 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)]">
          <span className="theme-text-secondary text-[10px] uppercase font-bold block mb-1">Gap Fill Rate</span>
          <div className="text-lg font-extrabold text-emerald-500 flex items-center space-x-1">
            <CheckCircle2 size={16} />
            <span>{fillRate}%</span>
          </div>
          <span className="text-[10px] theme-text-secondary mt-0.5 block">{filledGaps} of {totalGaps} filled</span>
        </div>

        <div className="p-3 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)]">
          <span className="theme-text-secondary text-[10px] uppercase font-bold block mb-1">Gap Win Rate</span>
          <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
            {gapWinRate}%
          </div>
          <span className="text-[10px] theme-text-secondary mt-0.5 block">{winningGaps} wins on gap trades</span>
        </div>

        <div className="p-3 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)]">
          <span className="theme-text-secondary text-[10px] uppercase font-bold block mb-1">Avg Gap Size</span>
          <div className="text-lg font-extrabold theme-text-primary">
            {avgGapSize} <span className="text-xs theme-text-secondary">pts</span>
          </div>
          <span className="text-[10px] theme-text-secondary mt-0.5 block">Average price imbalance</span>
        </div>

        <div className="p-3 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)]">
          <span className="theme-text-secondary text-[10px] uppercase font-bold block mb-1">Gap Total Net P&L</span>
          <div className={`text-lg font-extrabold ${totalGapProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {totalGapProfit >= 0 ? '+' : ''}${totalGapProfit.toFixed(2)}
          </div>
          <span className="text-[10px] theme-text-secondary mt-0.5 block">Cumulative gap profit</span>
        </div>
      </div>

      {/* Gap Type Distribution Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono-numeric">
        {gapTypeStats.map(gt => (
          <div key={gt.name} className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-xs theme-text-primary">{gt.name}</span>
              <span className="text-[10px] theme-text-secondary font-bold px-1.5 py-0.5 rounded bg-[var(--bg-subpanel)] border border-[var(--border-color)]">
                {gt.count} Trades
              </span>
            </div>
            <div className={`text-sm font-extrabold ${gt.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {gt.profit >= 0 ? '+' : ''}${gt.profit.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Gap Performance Graph Chart */}
      {chartData.length > 0 && (
        <div className="pt-2">
          <h4 className="text-xs font-bold theme-text-primary uppercase tracking-wider mb-2">
            Backtested Gap Trades P&L Performance ($)
          </h4>
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.6} />
                <XAxis dataKey="label" stroke="var(--text-secondary)" fontSize={10} fontFamily="JetBrains Mono" />
                <YAxis stroke="var(--text-secondary)" fontSize={10} fontFamily="JetBrains Mono" tickFormatter={val => `$${val}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono',
                  }}
                  formatter={(val: any) => [`$${val}`, 'Profit / Loss']}
                />
                <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
