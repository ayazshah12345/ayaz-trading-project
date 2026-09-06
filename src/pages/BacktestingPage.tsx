import React, { useState } from 'react';
import { BacktestTable } from '../components/backtesting/BacktestTable';
import { BacktestFormModal } from '../components/backtesting/BacktestFormModal';
import { BacktestDetailView } from '../components/backtesting/BacktestDetailView';
import { useTradingWorkspace } from '../hooks/useTradingWorkspace';
import type { BacktestCampaign } from '../types';
import { FlaskConical, Plus } from 'lucide-react';

interface BacktestingPageProps {
  workspace: ReturnType<typeof useTradingWorkspace>;
}

export const BacktestingPage: React.FC<BacktestingPageProps> = ({ workspace }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDetailCampaign, setActiveDetailCampaign] = useState<BacktestCampaign | null>(null);

  if (activeDetailCampaign) {
    const currentCampaign = workspace.backtests.find((b: BacktestCampaign) => b.id === activeDetailCampaign.id) || activeDetailCampaign;

    return (
      <BacktestDetailView
        campaign={currentCampaign}
        onBack={() => setActiveDetailCampaign(null)}
        onSaveRecord={workspace.addBacktestRecord}
      />
    );
  }


  const campaigns = workspace.backtests;
  const primaryCampaign = campaigns[0];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold theme-text-primary flex items-center space-x-2">
            <FlaskConical className="text-amber-500" />
            <span>Backtesting Lab</span>
          </h1>
          <p className="text-xs theme-text-secondary mt-1 font-medium">
            Store, analyze, and review historical trading strategy test results & campaign metrics.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold rounded-lg shadow-md transition self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>New Backtest Campaign</span>
        </button>
      </div>

      {/* Primary Campaign Highlight Metrics */}
      {primaryCampaign && (
        <div className="terminal-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div>
              <span className="text-[10px] uppercase font-mono-numeric font-extrabold text-amber-500">Featured Campaign</span>
              <h3 className="text-base font-extrabold theme-text-primary">{primaryCampaign.title}</h3>
            </div>
            <span className="text-xs font-mono-numeric theme-text-secondary font-medium">
              {primaryCampaign.startDate} to {primaryCampaign.endDate}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 font-mono-numeric">
            <div className="p-3 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)]">
              <span className="theme-text-secondary text-[10px] uppercase font-extrabold">Total Trades</span>
              <div className="text-lg font-extrabold theme-text-primary">{primaryCampaign.totalTrades}</div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)]">
              <span className="text-emerald-500 text-[10px] uppercase font-extrabold">Win Rate</span>
              <div className="text-lg font-extrabold text-emerald-500">{primaryCampaign.winRate}%</div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)]">
              <span className="text-emerald-500 text-[10px] uppercase font-extrabold">Profit Factor</span>
              <div className="text-lg font-extrabold text-emerald-500">{primaryCampaign.profitFactor}</div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)]">
              <span className="text-amber-500 text-[10px] uppercase font-extrabold">Max Drawdown</span>
              <div className="text-lg font-extrabold text-amber-500">{primaryCampaign.maxDrawdown}%</div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)]">
              <span className="text-blue-600 dark:text-blue-400 text-[10px] uppercase font-extrabold">Avg R / Trade</span>
              <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">+{primaryCampaign.avgR}R</div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)]">
              <span className="text-blue-600 dark:text-blue-400 text-[10px] uppercase font-extrabold">Total R</span>
              <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">+{primaryCampaign.totalR}R</div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Backtests Table */}
      <div>
        <h3 className="text-xs font-extrabold theme-text-primary uppercase tracking-wider mb-3">
          Saved Backtest Campaigns ({campaigns.length})
        </h3>
        <BacktestTable backtests={campaigns} onSelectBacktest={setActiveDetailCampaign} />
      </div>

      {/* New Backtest Modal */}
      <BacktestFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveBacktest={workspace.addBacktest}
      />
    </div>
  );
};

