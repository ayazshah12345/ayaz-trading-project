import React from 'react';
import { DollarSign, TrendingUp, Target, RefreshCw, BarChart, ShieldAlert } from 'lucide-react';
import type { AccountPerformanceSummary } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/formatters';

interface TopMetricsProps {
  account: AccountPerformanceSummary;
}

export const TopMetrics: React.FC<TopMetricsProps> = ({ account }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-extrabold theme-text-secondary uppercase tracking-wider">
          Top Performance Metrics
        </h3>
        <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono-numeric font-extrabold">
          MOCK DEMO DATA
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Account Balance */}
        <div className="terminal-card p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between theme-text-secondary mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wide">Account Balance</span>
            <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <DollarSign size={15} />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-extrabold font-mono-numeric theme-text-primary">
            {formatCurrency(account.accountBalance)}
          </div>
          <span className="text-[10px] theme-text-secondary mt-1 font-mono-numeric font-bold">Starting: $10,000.00</span>
        </div>

        {/* 2. Net P&L */}
        <div className="terminal-card p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between theme-text-secondary mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wide">Net P&L</span>
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-500">
              <TrendingUp size={15} />
            </div>
          </div>
          <div
            className={`text-lg sm:text-xl font-extrabold font-mono-numeric ${
              account.netPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            {account.netPnl >= 0 ? '+' : ''}{formatCurrency(account.netPnl)}
          </div>
          <span className="text-[10px] text-emerald-500 font-mono-numeric mt-1 font-extrabold">+4.5% All-Time</span>
        </div>

        {/* 3. Win Rate */}
        <div className="terminal-card p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between theme-text-secondary mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wide">Win Rate</span>
            <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-500">
              <Target size={15} />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-extrabold font-mono-numeric theme-text-primary">
            {formatPercent(account.winRate)}
          </div>
          <span className="text-[10px] theme-text-secondary mt-1 font-mono-numeric font-bold">87 Wins / 36 Losses</span>
        </div>

        {/* 4. Total Trades */}
        <div className="terminal-card p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between theme-text-secondary mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wide">Total Trades</span>
            <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <RefreshCw size={15} />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-extrabold font-mono-numeric theme-text-primary">
            {account.totalTrades}
          </div>
          <span className="text-[10px] theme-text-secondary mt-1 font-mono-numeric font-bold">Avg 2.4 Trades/Day</span>
        </div>

        {/* 5. Profit Factor */}
        <div className="terminal-card p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between theme-text-secondary mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wide">Profit Factor</span>
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-500">
              <BarChart size={15} />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-extrabold font-mono-numeric text-emerald-500">
            {account.profitFactor}
          </div>
          <span className="text-[10px] theme-text-secondary mt-1 font-mono-numeric font-bold">Gross Win/Loss Ratio</span>
        </div>

        {/* 6. Maximum Drawdown */}
        <div className="terminal-card p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between theme-text-secondary mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wide">Max Drawdown</span>
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-500">
              <ShieldAlert size={15} />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-extrabold font-mono-numeric text-amber-500">
            {account.maxDrawdownCurrent}%
          </div>
          <span className="text-[10px] theme-text-secondary mt-1 font-mono-numeric font-bold">Peak-to-Trough Max</span>
        </div>
      </div>
    </div>
  );
};

