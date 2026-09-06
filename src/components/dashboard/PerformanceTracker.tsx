import React from 'react';
import { Award } from 'lucide-react';
import type { AccountPerformanceSummary } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { ProgressBar } from '../common/ProgressBar';

interface PerformanceTrackerProps {
  account: AccountPerformanceSummary;
}

export const PerformanceTracker: React.FC<PerformanceTrackerProps> = ({ account }) => {
  const profitTargetPercent = Math.min(100, (account.netPnl / account.profitTarget) * 100);
  const dailyDrawdownPercent = (account.dailyDrawdownCurrent / account.dailyDrawdownLimit) * 100;
  const maxDrawdownPercent = (account.maxDrawdownCurrent / account.maxDrawdownLimit) * 100;

  return (
    <div className="terminal-card p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <Award size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold theme-text-primary uppercase tracking-wider">
              Performance Tracker
            </h3>
            <p className="text-[11px] theme-text-secondary">
              Institutional prop-style personal drawdown & target monitor
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono-numeric font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
          Account Status: ON TRACK
        </span>
      </div>

      {/* Starting & Current Balance Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-numeric">
        <div className="p-3 rounded bg-[var(--bg-subpanel)] border border-[var(--border-color)]">
          <span className="theme-text-secondary text-[10px] uppercase font-bold block">Starting Balance</span>
          <span className="theme-text-primary font-bold text-base">{formatCurrency(account.startingBalance)}</span>
        </div>
        <div className="p-3 rounded bg-[var(--bg-subpanel)] border border-[var(--border-color)]">
          <span className="theme-text-secondary text-[10px] uppercase font-bold block">Current Balance</span>
          <span className="theme-text-primary font-bold text-base">{formatCurrency(account.currentBalance)}</span>
        </div>
        <div className="p-3 rounded bg-[var(--bg-subpanel)] border border-[var(--border-color)]">
          <span className="theme-text-secondary text-[10px] uppercase font-bold block">Profit / Loss</span>
          <span className={`font-bold text-base ${account.netPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {account.netPnl >= 0 ? '+' : ''}{formatCurrency(account.netPnl)}
          </span>
        </div>
        <div className="p-3 rounded bg-[var(--bg-subpanel)] border border-[var(--border-color)]">
          <span className="theme-text-secondary text-[10px] uppercase font-bold block">Profit Target</span>
          <span className="text-blue-500 font-bold text-base">{formatCurrency(account.profitTarget)}</span>
        </div>
      </div>

      {/* Progress Bars for Target & Drawdown */}
      <div className="space-y-4 pt-1">
        {/* Profit Target Progress */}
        <ProgressBar
          value={account.netPnl}
          max={account.profitTarget}
          label="Profit Target Goal ($1,000.00)"
          sublabel={`${formatCurrency(account.netPnl)} / $1,000.00 (${profitTargetPercent.toFixed(1)}%)`}
          variant="green"
        />

        {/* Daily Drawdown Limit */}
        <ProgressBar
          value={account.dailyDrawdownCurrent}
          max={account.dailyDrawdownLimit}
          label="Daily Drawdown Cushion (Limit $500.00)"
          sublabel={`${formatCurrency(account.dailyDrawdownCurrent)} used / $500.00 limit (${dailyDrawdownPercent.toFixed(1)}%)`}
          variant={dailyDrawdownPercent > 60 ? 'amber' : 'blue'}
        />

        {/* Maximum Drawdown Limit */}
        <ProgressBar
          value={account.maxDrawdownCurrent}
          max={account.maxDrawdownLimit}
          label="Maximum Trailing Drawdown (Limit $1,000.00)"
          sublabel={`${formatCurrency(account.maxDrawdownCurrent)} used / $1,000.00 max (${maxDrawdownPercent.toFixed(1)}%)`}
          variant={maxDrawdownPercent > 70 ? 'red' : 'green'}
        />
      </div>

      {/* Trading Days Statistics Row */}
      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[var(--border-color)] text-center text-xs font-mono-numeric">
        <div className="p-2.5 rounded bg-[var(--bg-subpanel)] border border-[var(--border-color)]">
          <div className="theme-text-primary font-bold text-sm">{account.tradingDays} Days</div>
          <div className="theme-text-secondary text-[10px] font-semibold">Total Trading Days</div>
        </div>
        <div className="p-2.5 rounded bg-[var(--bg-subpanel)] border border-[var(--border-color)]">
          <div className="text-emerald-500 font-bold text-sm">{account.winningDays} Days</div>
          <div className="theme-text-secondary text-[10px] font-semibold">Winning Days (66.7%)</div>
        </div>
        <div className="p-2.5 rounded bg-[var(--bg-subpanel)] border border-[var(--border-color)]">
          <div className="text-rose-500 font-bold text-sm">{account.losingDays} Days</div>
          <div className="theme-text-secondary text-[10px] font-semibold">Losing Days (33.3%)</div>
        </div>
      </div>
    </div>
  );
};
