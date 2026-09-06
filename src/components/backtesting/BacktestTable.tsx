import React from 'react';
import { BacktestCampaign } from '../../types';
import { Eye, Edit } from 'lucide-react';

interface BacktestTableProps {
  backtests: BacktestCampaign[];
  onSelectBacktest: (b: BacktestCampaign) => void;
}

export const BacktestTable: React.FC<BacktestTableProps> = ({ backtests, onSelectBacktest }) => {
  return (
    <div className="terminal-card overflow-x-auto shadow-sm">
      <table className="w-full text-left text-xs font-mono-numeric">
        <thead className="bg-[var(--bg-subpanel)] theme-text-secondary uppercase tracking-wider text-[11px] border-b border-[var(--border-color)] font-bold">
          <tr>
            <th className="p-3">Backtest ID</th>
            <th className="p-3">Campaign Title</th>
            <th className="p-3">Asset</th>
            <th className="p-3">Strategy</th>
            <th className="p-3">TF</th>
            <th className="p-3">Period</th>
            <th className="p-3">Trades</th>
            <th className="p-3">Win Rate</th>
            <th className="p-3">Profit Factor</th>
            <th className="p-3">Max DD</th>
            <th className="p-3">Total R</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {backtests.map(b => (
            <tr
              key={b.id}
              onClick={() => onSelectBacktest(b)}
              className="hover:bg-[var(--bg-card-hover)] transition cursor-pointer group"
            >
              <td className="p-3 font-extrabold theme-text-primary group-hover:text-amber-500">{b.id}</td>
              <td className="p-3 font-bold theme-text-primary font-sans">{b.title}</td>
              <td className="p-3 font-extrabold text-blue-600 dark:text-blue-400">{b.asset}</td>
              <td className="p-3 theme-text-secondary font-sans font-medium">{b.strategy}</td>
              <td className="p-3 theme-text-secondary font-bold">{b.timeframe}</td>
              <td className="p-3 theme-text-secondary text-[11px] font-medium">
                {b.startDate} to {b.endDate}
              </td>
              <td className="p-3 theme-text-primary font-bold">{b.totalTrades}</td>
              <td className="p-3 text-emerald-500 font-extrabold">{b.winRate}%</td>
              <td className="p-3 text-emerald-500 font-extrabold">{b.profitFactor}</td>
              <td className="p-3 text-amber-500 font-extrabold">{b.maxDrawdown}%</td>
              <td className="p-3 text-blue-600 dark:text-blue-400 font-extrabold">+{b.totalR}R</td>
              <td className="p-3 text-right" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-end space-x-1">
                  <button
                    onClick={() => onSelectBacktest(b)}
                    className="p-1 theme-text-secondary hover:text-amber-500 hover:bg-[var(--bg-card-hover)] rounded"
                    title="View Backtest"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    className="p-1 theme-text-secondary hover:text-blue-500 hover:bg-[var(--bg-card-hover)] rounded"
                    title="Edit"
                  >
                    <Edit size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

