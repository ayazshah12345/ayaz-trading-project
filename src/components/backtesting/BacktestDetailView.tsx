import React, { useState } from 'react';
import type { BacktestCampaign, BacktestRecord } from '../../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ArrowLeft, Plus, DollarSign, Target, Award, ShieldAlert, Layers } from 'lucide-react';
import { BacktestPieChart } from './BacktestPieChart';
import { GapAnalyzer } from './GapAnalyzer';
import { AddBacktestRecordModal } from './AddBacktestRecordModal';

interface BacktestDetailViewProps {
  campaign: BacktestCampaign;
  onBack: () => void;
  onSaveRecord: (campaignId: string, record: Omit<BacktestRecord, 'id'>) => void;
}

export const BacktestDetailView: React.FC<BacktestDetailViewProps> = ({
  campaign,
  onBack,
  onSaveRecord,
}) => {
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);

  const records = campaign.records || [];
  const wins = records.filter(r => r.result === 'WIN').length;
  const losses = records.filter(r => r.result === 'LOSS').length;
  const breakevens = records.filter(r => r.result === 'BREAKEVEN').length;

  const totalProfit = campaign.totalProfit || records.reduce((a, b) => a + b.profitAmount, 0);

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="terminal-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-md transition flex items-center space-x-1.5 cursor-pointer shrink-0"
            title="Back to All Campaigns"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Campaigns</span>
            <span className="sm:hidden">Back</span>
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-extrabold theme-text-primary">{campaign.title}</h2>
              <span className="text-[10px] font-mono-numeric px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 font-extrabold">
                {campaign.id}
              </span>
            </div>
            <p className="text-xs theme-text-secondary font-mono-numeric font-medium">
              {campaign.asset} • {campaign.strategy} • {campaign.timeframe} ({campaign.startDate} to {campaign.endDate})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 font-mono-numeric text-xs bg-[var(--bg-subpanel)] px-3 py-1.5 rounded-lg border border-[var(--border-color)]">
            <span className="theme-text-secondary font-bold">Total Net Profit:</span>
            <span className={`font-extrabold text-sm ${totalProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => setIsAddRecordModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-lg shadow-md transition"
          >
            <Plus size={16} />
            <span>Add Backtest Record</span>
          </button>
        </div>
      </div>

      {/* Metric Summary Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 font-mono-numeric">
        <div className="terminal-card p-3.5 shadow-xs">
          <span className="theme-text-secondary text-[10px] uppercase font-extrabold">Total Trades</span>
          <div className="text-lg font-extrabold theme-text-primary">{campaign.totalTrades}</div>
        </div>

        <div className="terminal-card p-3.5 shadow-xs">
          <span className="theme-text-secondary text-[10px] uppercase font-extrabold">Win Rate</span>
          <div className="text-lg font-extrabold text-emerald-500">{campaign.winRate}%</div>
        </div>

        <div className="terminal-card p-3.5 shadow-xs">
          <span className="theme-text-secondary text-[10px] uppercase font-extrabold">Profit Factor</span>
          <div className="text-lg font-extrabold text-emerald-500">{campaign.profitFactor}</div>
        </div>

        <div className="terminal-card p-3.5 shadow-xs">
          <span className="theme-text-secondary text-[10px] uppercase font-extrabold">Max Drawdown</span>
          <div className="text-lg font-extrabold text-amber-500">{campaign.maxDrawdown}%</div>
        </div>

        <div className="terminal-card p-3.5 shadow-xs">
          <span className="theme-text-secondary text-[10px] uppercase font-extrabold">Avg Win R</span>
          <div className="text-lg font-extrabold text-emerald-500">+{campaign.avgWinR}R</div>
        </div>

        <div className="terminal-card p-3.5 shadow-xs">
          <span className="theme-text-secondary text-[10px] uppercase font-extrabold">Total Net Profit</span>
          <div className={`text-lg font-extrabold ${totalProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(0)}
          </div>
        </div>

        <div className="terminal-card p-3.5 shadow-xs">
          <span className="theme-text-secondary text-[10px] uppercase font-extrabold">Total R Multiple</span>
          <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">+{campaign.totalR}R</div>
        </div>
      </div>

      {/* Cumulative Growth Graph & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Growth Curve Graph */}
        <div className="lg:col-span-8 terminal-card p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-3">
            <h4 className="text-xs font-extrabold theme-text-primary uppercase tracking-wider">
              Strategy Cumulative R & Profit Growth Graph
            </h4>
            <span className="text-[10px] font-mono-numeric font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              +{campaign.totalR}R Cumulative
            </span>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={campaign.equityCurve} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="btGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.6} />
                <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="var(--text-secondary)" fontSize={11} fontFamily="JetBrains Mono" tickFormatter={val => `${val}R`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono',
                  }}
                  formatter={(val: any) => [`+${val}R`, 'Cumulative R']}
                />
                <Area type="monotone" dataKey="cumulativeR" stroke="#f59e0b" strokeWidth={2.5} fill="url(#btGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Win / Loss Distribution Pie Chart */}
        <div className="lg:col-span-4">
          <BacktestPieChart wins={wins} losses={losses} breakevens={breakevens} />
        </div>
      </div>

      {/* Gap Analyzer Component */}
      <GapAnalyzer records={records} />

      {/* Individual Backtested Trade Records Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold theme-text-primary uppercase tracking-wider">
            Backtested Strategy Trade Records ({records.length})
          </h3>
          <button
            onClick={() => setIsAddRecordModalOpen(true)}
            className="flex items-center space-x-1 text-xs font-bold text-amber-500 hover:text-amber-600 transition"
          >
            <Plus size={14} />
            <span>Add Record</span>
          </button>
        </div>

        <div className="terminal-card overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs font-mono-numeric">
            <thead className="bg-[var(--bg-subpanel)] theme-text-secondary uppercase tracking-wider text-[11px] border-b border-[var(--border-color)] font-bold">
              <tr>
                <th className="p-3">Record ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Asset</th>
                <th className="p-3">Direction</th>
                <th className="p-3">Open Price</th>
                <th className="p-3">Close Price</th>
                <th className="p-3">Strategy</th>
                <th className="p-3">Profit ($)</th>
                <th className="p-3">Risk : Reward</th>
                <th className="p-3">Gap Type</th>
                <th className="p-3">Gap Fill</th>
                <th className="p-3 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {records.map(r => (
                <tr key={r.id} className="hover:bg-[var(--bg-card-hover)] transition">
                  <td className="p-3 font-extrabold theme-text-primary">{r.id}</td>
                  <td className="p-3 theme-text-secondary font-semibold">{r.date}</td>
                  <td className="p-3 font-extrabold text-blue-600 dark:text-blue-400">{r.asset}</td>
                  <td className="p-3 font-bold">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                        r.direction === 'LONG'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      }`}
                    >
                      {r.direction}
                    </span>
                  </td>
                  <td className="p-3 theme-text-primary font-bold">${r.openPrice}</td>
                  <td className="p-3 theme-text-primary font-bold">${r.closePrice}</td>
                  <td className="p-3 theme-text-secondary font-sans font-medium">{r.strategy}</td>
                  <td className={`p-3 font-extrabold ${r.profitAmount >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {r.profitAmount >= 0 ? '+' : ''}${r.profitAmount.toFixed(2)}
                  </td>
                  <td className={`p-3 font-extrabold ${r.riskRewardRatio >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {r.riskRewardRatio >= 0 ? `1:${r.riskRewardRatio}` : `${r.riskRewardRatio}R`}
                  </td>
                  <td className="p-3 theme-text-secondary font-semibold text-[11px]">
                    {r.gapType || 'None'} {r.gapSize ? `(${r.gapSize} pts)` : ''}
                  </td>
                  <td className="p-3 font-bold">
                    {r.gapFilled ? (
                      <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] border border-emerald-500/20">
                        Filled
                      </span>
                    ) : (
                      <span className="theme-text-muted bg-[var(--bg-subpanel)] px-2 py-0.5 rounded text-[10px] border border-[var(--border-color)]">
                        Unfilled
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right font-extrabold">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        r.result === 'WIN'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : r.result === 'LOSS'
                          ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}
                    >
                      {r.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Record Modal */}
      <AddBacktestRecordModal
        isOpen={isAddRecordModalOpen}
        onClose={() => setIsAddRecordModalOpen(false)}
        campaignId={campaign.id}
        defaultStrategy={campaign.strategy}
        defaultAsset={campaign.asset}
        onSaveRecord={onSaveRecord}
      />
    </div>
  );
};
