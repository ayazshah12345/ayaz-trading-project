import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface BacktestPieChartProps {
  wins: number;
  losses: number;
  breakevens?: number;
}

export const BacktestPieChart: React.FC<BacktestPieChartProps> = ({ wins, losses, breakevens = 0 }) => {
  const data = [
    { name: 'Winning Trades', value: wins, color: '#10b981' },
    { name: 'Losing Trades', value: losses, color: '#ef4444' },
  ];

  if (breakevens > 0) {
    data.push({ name: 'Breakeven Trades', value: breakevens, color: '#f59e0b' });
  }

  const total = wins + losses + breakevens;
  const winPercent = total ? ((wins / total) * 100).toFixed(1) : '0';

  return (
    <div className="terminal-card p-5 flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-2">
        <h4 className="text-xs font-extrabold theme-text-primary uppercase tracking-wider">
          Win / Loss Distribution Pie Chart
        </h4>
        <span className="text-[10px] font-mono-numeric font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          {winPercent}% Win Rate
        </span>
      </div>

      <div className="w-full h-56 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`pie-cell-${index}`} fill={entry.color} stroke="var(--bg-card)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono',
              }}
              formatter={(value: any, name: any) => [`${value} Trades`, name]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="theme-text-primary text-xs font-mono-numeric font-bold">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono-numeric border-t border-[var(--border-color)] pt-3 mt-2">
        <div className="p-2 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)]">
          <span className="text-emerald-500 font-extrabold text-sm">{wins}</span>
          <span className="theme-text-secondary text-[10px] block font-bold">Wins</span>
        </div>
        <div className="p-2 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)]">
          <span className="text-rose-500 font-extrabold text-sm">{losses}</span>
          <span className="theme-text-secondary text-[10px] block font-bold">Losses</span>
        </div>
      </div>
    </div>
  );
};
