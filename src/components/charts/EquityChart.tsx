import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { mockEquityCurveData } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';

type EquityFilter = '7D' | '30D' | '3M' | '6M' | '1Y' | 'ALL';

export const EquityChart: React.FC = () => {
  const [filter, setFilter] = useState<EquityFilter>('30D');

  const data = mockEquityCurveData[filter] || mockEquityCurveData['30D'];
  const filters: EquityFilter[] = ['7D', '30D', '3M', '6M', '1Y', 'ALL'];

  const startingBalance = data[0]?.balance || 10000;
  const currentBalance = data[data.length - 1]?.balance || 10450;
  const netGrowth = currentBalance - startingBalance;
  const growthPercent = (netGrowth / startingBalance) * 100;

  return (
    <div className="terminal-card p-5 flex flex-col justify-between">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold theme-text-primary uppercase tracking-wider">
            Equity Curve & Drawdown
          </h3>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-xl font-bold font-mono-numeric theme-text-primary">
              {formatCurrency(currentBalance)}
            </span>
            <span
              className={`text-xs font-bold font-mono-numeric ${
                netGrowth >= 0 ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              {netGrowth >= 0 ? '+' : ''}{formatCurrency(netGrowth)} ({growthPercent >= 0 ? '+' : ''}{growthPercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center space-x-1 bg-[var(--bg-subpanel)] p-1 rounded border border-[var(--border-color)] self-start sm:self-auto">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 text-xs font-mono-numeric font-medium rounded transition ${
                filter === f
                  ? 'bg-[#2962ff] text-white font-bold'
                  : 'theme-text-secondary hover:theme-text-primary hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2962ff" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2962ff" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.8} />
            <XAxis
              dataKey="date"
              stroke="var(--text-secondary)"
              fontSize={11}
              fontFamily="JetBrains Mono"
              tickLine={false}
            />
            <YAxis
              stroke="var(--text-secondary)"
              fontSize={11}
              fontFamily="JetBrains Mono"
              tickLine={false}
              domain={['auto', 'auto']}
              tickFormatter={val => `$${val}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono',
              }}
              formatter={(val: any) => [`$${val}`, 'Balance']}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#2962ff"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#equityGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] theme-text-secondary mt-2 font-mono-numeric border-t border-[var(--border-color)] pt-2 font-medium">
        <span>Initial Deposit: $10,000.00</span>
        <span>Peak Drawdown: <span className="text-amber-500 font-bold">1.8%</span></span>
      </div>
    </div>
  );
};
