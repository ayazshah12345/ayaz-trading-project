import React, { useState } from 'react';
import type { TradeRecord } from '../../types';
import { ArrowUpRight, ArrowDownRight, Eye, Trash2 } from 'lucide-react';
import { formatRMultiple } from '../../utils/formatters';

interface TradeTableProps {
  trades: TradeRecord[];
  onSelectTrade: (trade: TradeRecord) => void;
  onDeleteTrade?: (id: string) => void;
}

export const TradeTable: React.FC<TradeTableProps> = ({ trades, onSelectTrade, onDeleteTrade }) => {
  const [assetFilter, setAssetFilter] = useState('ALL');
  const [directionFilter, setDirectionFilter] = useState('ALL');
  const [resultFilter, setResultFilter] = useState('ALL');

  const assets = ['ALL', 'XAUUSD', 'BTCUSDT', 'EURUSD', 'GBPUSD', 'USDJPY', 'NAS100'];

  const filteredTrades = trades.filter(t => {
    if (assetFilter !== 'ALL' && t.asset !== assetFilter) return false;
    if (directionFilter !== 'ALL' && t.direction !== directionFilter) return false;
    if (resultFilter !== 'ALL' && t.result !== resultFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Table Filters Header */}
      <div className="terminal-card p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Asset filter dropdown */}
          <select
            value={assetFilter}
            onChange={e => setAssetFilter(e.target.value)}
            className="bg-[var(--bg-subpanel)] theme-text-primary border border-[var(--border-color)] rounded px-2.5 py-1.5 outline-none focus:border-amber-500 font-mono-numeric font-bold"
          >
            {assets.map(a => (
              <option key={a} value={a}>
                Asset: {a}
              </option>
            ))}
          </select>

          {/* Direction filter */}
          <select
            value={directionFilter}
            onChange={e => setDirectionFilter(e.target.value)}
            className="bg-[var(--bg-subpanel)] theme-text-primary border border-[var(--border-color)] rounded px-2.5 py-1.5 outline-none focus:border-amber-500 font-mono-numeric font-bold"
          >
            <option value="ALL">Direction: All</option>
            <option value="LONG">LONG</option>
            <option value="SHORT">SHORT</option>
          </select>

          {/* Result filter */}
          <select
            value={resultFilter}
            onChange={e => setResultFilter(e.target.value)}
            className="bg-[var(--bg-subpanel)] theme-text-primary border border-[var(--border-color)] rounded px-2.5 py-1.5 outline-none focus:border-amber-500 font-mono-numeric font-bold"
          >
            <option value="ALL">Result: All</option>
            <option value="WIN">WIN</option>
            <option value="LOSS">LOSS</option>
            <option value="BREAKEVEN">BREAKEVEN</option>
          </select>
        </div>

        <span className="theme-text-secondary font-mono-numeric text-xs font-medium">
          Showing <span className="theme-text-primary font-bold">{filteredTrades.length}</span> of {trades.length} Trades
        </span>
      </div>

      {/* Main Trade Records Table */}
      <div className="terminal-card overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs font-mono-numeric">
          <thead className="bg-[var(--bg-subpanel)] theme-text-secondary uppercase tracking-wider text-[11px] border-b border-[var(--border-color)] font-bold">
            <tr>
              <th className="p-3">Trade ID</th>
              <th className="p-3">Date</th>
              <th className="p-3">Asset</th>
              <th className="p-3">Direction</th>
              <th className="p-3">TF</th>
              <th className="p-3">Entry</th>
              <th className="p-3">Stop Loss</th>
              <th className="p-3">Take Profit</th>
              <th className="p-3">Exit Price</th>
              <th className="p-3">Result</th>
              <th className="p-3">P&L ($)</th>
              <th className="p-3">R Multiple</th>
              <th className="p-3">Strategy</th>
              <th className="p-3">Session</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {filteredTrades.map(t => {
              const isWin = t.result === 'WIN';
              const isLoss = t.result === 'LOSS';
              return (
                <tr
                  key={t.id}
                  onClick={() => onSelectTrade(t)}
                  className="hover:bg-[var(--bg-card-hover)] transition cursor-pointer group"
                >
                  <td className="p-3 font-bold theme-text-primary group-hover:text-amber-500">{t.id}</td>
                  <td className="p-3 theme-text-secondary font-semibold">{t.date}</td>
                  <td className="p-3 font-bold text-amber-500">{t.asset}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded font-bold text-[10px] ${
                        t.direction === 'LONG'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {t.direction === 'LONG' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      <span>{t.direction}</span>
                    </span>
                  </td>
                  <td className="p-3 theme-text-secondary font-semibold">{t.timeframe}</td>
                  <td className="p-3 theme-text-primary font-bold">${t.entryPrice}</td>
                  <td className="p-3 text-rose-500 font-bold">${t.stopLoss}</td>
                  <td className="p-3 text-emerald-500 font-bold">${t.takeProfit}</td>
                  <td className="p-3 theme-text-primary font-bold">${t.exitPrice}</td>
                  <td className="p-3 font-bold">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        isWin
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : isLoss
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {t.result}
                    </span>
                  </td>
                  <td className={`p-3 font-bold ${t.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)}
                  </td>
                  <td className={`p-3 font-bold ${t.rMultiple >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {formatRMultiple(t.rMultiple)}
                  </td>
                  <td className="p-3 theme-text-secondary font-sans font-medium">{t.strategy}</td>
                  <td className="p-3 theme-text-secondary font-sans font-medium">{t.session}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end space-x-1" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectTrade(t)}
                        className="p-1.5 theme-text-secondary hover:text-amber-500 hover:bg-[var(--bg-card-hover)] rounded transition"
                        title="Inspect Trade"
                      >
                        <Eye size={15} />
                      </button>

                      {onDeleteTrade && (
                        <button
                          onClick={() => onDeleteTrade(t.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition"
                          title="Delete Trade Record"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
