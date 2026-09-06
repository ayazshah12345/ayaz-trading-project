import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import type { TradeRecord } from '../../types';

interface AssetBreakdownProps {
  trades?: TradeRecord[];
}

export const AssetBreakdown: React.FC<AssetBreakdownProps> = ({ trades = [] }) => {
  // Group trades dynamically by asset symbol
  const assetMap: Record<string, { pnl: number; wins: number; total: number }> = {};

  trades.forEach(t => {
    if (!assetMap[t.asset]) {
      assetMap[t.asset] = { pnl: 0, wins: 0, total: 0 };
    }
    assetMap[t.asset].pnl += t.pnl;
    assetMap[t.asset].total += 1;
    if (t.result === 'WIN') assetMap[t.asset].wins += 1;
  });

  const chartData = Object.keys(assetMap).map(symbol => ({
    symbol,
    pnl: Number(assetMap[symbol].pnl.toFixed(2)),
    trades: assetMap[symbol].total,
    winRate: Number(((assetMap[symbol].wins / assetMap[symbol].total) * 100).toFixed(1)),
  }));

  const fallbackData = [
    { symbol: 'XAUUSD', pnl: 650.0, winRate: 72.4, trades: 45 },
    { symbol: 'BTCUSDT', pnl: 420.0, winRate: 65.0, trades: 32 },
    { symbol: 'EURUSD', pnl: -120.0, winRate: 48.0, trades: 25 },
  ];

  const dataToRender = chartData.length > 0 ? chartData : fallbackData;

  return (
    <div className="terminal-card p-5">
      <h4 className="text-xs font-bold theme-text-secondary uppercase tracking-wider mb-4 border-b border-[var(--border-color)] pb-2">
        Trade Journal P&L Performance By Asset
      </h4>
      <div className="w-full h-56 font-mono-numeric">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dataToRender} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <XAxis dataKey="symbol" stroke="var(--text-muted)" fontSize={11} />
            <YAxis stroke="var(--text-muted)" fontSize={11} tickFormatter={v => `$${v}`} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', fontSize: '12px' }}
              formatter={(val: any) => [`$${val}`, 'Net P&L']}
            />
            <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
              {dataToRender.map((entry, idx) => (
                <Cell key={idx} fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
