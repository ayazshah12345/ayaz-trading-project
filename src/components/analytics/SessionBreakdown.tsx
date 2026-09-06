import React from 'react';
import type { TradeRecord } from '../../types';

interface SessionBreakdownProps {
  trades?: TradeRecord[];
}

export const SessionBreakdown: React.FC<SessionBreakdownProps> = ({ trades = [] }) => {
  const sessionNames: Array<{ key: 'Asia' | 'London' | 'New York'; label: string; color: string }> = [
    { key: 'Asia', label: 'Asia Session', color: '#a855f7' },
    { key: 'London', label: 'London Session', color: '#10b981' },
    { key: 'New York', label: 'New York Session', color: '#7c3aed' },
  ];

  const sessions = sessionNames.map(s => {
    const sTrades = trades.filter(t => t.session === s.key);
    const count = sTrades.length;
    const wins = sTrades.filter(t => t.result === 'WIN').length;
    const winRate = count ? Number(((wins / count) * 100).toFixed(1)) : 0;
    const pnl = Number(sTrades.reduce((acc, t) => acc + t.pnl, 0).toFixed(2));
    const totalR = sTrades.reduce((acc, t) => acc + t.rMultiple, 0);
    const avgR = count ? Number((totalR / count).toFixed(2)) : 0;

    return {
      name: s.label,
      trades: count,
      winRate,
      pnl,
      avgR,
      color: s.color,
    };
  });

  return (
    <div className="terminal-card p-5">
      <h4 className="text-xs font-bold theme-text-secondary uppercase tracking-wider mb-4 border-b border-[var(--border-color)] pb-2">
        Trade Journal Performance By Trading Session
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono-numeric text-xs">
        {sessions.map(s => (
          <div key={s.name} className="p-4 rounded bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold theme-text-primary">{s.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold" style={{ backgroundColor: `${s.color}20`, color: s.color }}>
                {s.winRate}% Win Rate
              </span>
            </div>
            <div className={`text-lg font-bold ${s.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {s.pnl >= 0 ? '+' : ''}${s.pnl.toFixed(2)}
            </div>
            <div className="flex justify-between text-[11px] theme-text-secondary">
              <span>{s.trades} Trades</span>
              <span>Avg {s.avgR >= 0 ? '+' : ''}{s.avgR}R</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
