import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

interface WinLossChartProps {
  wins: number;
  losses: number;
  breakevens: number;
}

export const WinLossChart: React.FC<WinLossChartProps> = ({ wins, losses, breakevens }) => {
  const data = [
    { name: 'Wins', count: wins, color: '#00e676' },
    { name: 'Losses', count: losses, color: '#ff5252' },
    { name: 'Breakeven', count: breakevens, color: '#f59e0b' },
  ];

  const total = wins + losses + breakevens || 1;
  const winPercent = ((wins / total) * 100).toFixed(1);

  return (
    <div className="terminal-card p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Win / Loss Distribution
        </span>
        <span className="text-xs font-bold font-mono-numeric text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          {winPercent}% Win Rate
        </span>
      </div>

      <div className="w-full h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" />
            <YAxis stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#131722',
                borderColor: '#2a2e39',
                borderRadius: '6px',
                color: '#f8fafc',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono-numeric border-t border-[#2a2e39] pt-2">
        <div>
          <div className="text-emerald-400 font-bold text-sm">{wins}</div>
          <div className="text-slate-400 text-[10px]">Winning Trades</div>
        </div>
        <div>
          <div className="text-rose-400 font-bold text-sm">{losses}</div>
          <div className="text-slate-400 text-[10px]">Losing Trades</div>
        </div>
        <div>
          <div className="text-amber-400 font-bold text-sm">{breakevens}</div>
          <div className="text-slate-400 text-[10px]">Breakevens</div>
        </div>
      </div>
    </div>
  );
};
