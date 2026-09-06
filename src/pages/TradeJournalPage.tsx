import React, { useState } from 'react';
import { TradeTable } from '../components/trades/TradeTable';
import { TradeFormModal } from '../components/trades/TradeFormModal';
import { TradeDetailModal } from '../components/trades/TradeDetailModal';
import { useTradingWorkspace } from '../hooks/useTradingWorkspace';
import type { TradeRecord } from '../types';
import { Plus, Download, BookMarked, Trash2, AlertTriangle } from 'lucide-react';

interface TradeJournalPageProps {
  workspace: ReturnType<typeof useTradingWorkspace>;
}

export const TradeJournalPage: React.FC<TradeJournalPageProps> = ({ workspace }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<TradeRecord | null>(null);

  const trades: TradeRecord[] = workspace.trades;
  const wins = trades.filter((t: TradeRecord) => t.result === 'WIN').length;
  const losses = trades.filter((t: TradeRecord) => t.result === 'LOSS').length;
  const winRate = trades.length ? ((wins / trades.length) * 100).toFixed(1) : '0.0';
  const totalR = trades.reduce((acc: number, t: TradeRecord) => acc + t.rMultiple, 0);
  const avgR = trades.length ? (totalR / trades.length).toFixed(2) : '0.00';
  const netPnl = trades.reduce((acc: number, t: TradeRecord) => acc + t.pnl, 0);

  const handleExportCSV = () => {
    const headers = 'Trade ID,Date,Asset,Direction,Timeframe,Entry,StopLoss,TakeProfit,Exit,Result,PnL,RMultiple,Strategy,Session\n';
    const rows = trades
      .map(
        (t: TradeRecord) =>
          `${t.id},${t.date},${t.asset},${t.direction},${t.timeframe},${t.entryPrice},${t.stopLoss},${t.takeProfit},${t.exitPrice},${t.result},${t.pnl},${t.rMultiple},"${t.strategy}","${t.session}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Trading_Journal_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleConfirmDeleteAll = () => {
    workspace.deleteAllTrades();
    setIsDeleteAllModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold theme-text-primary flex items-center space-x-2">
            <BookMarked className="text-amber-500" />
            <span>Trade Journal</span>
          </h1>
          <p className="text-xs theme-text-secondary mt-1 font-medium">
            Complete record-keeping of executed trades, risk parameters, and performance statistics.
          </p>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {trades.length > 0 && (
            <button
              onClick={() => setIsDeleteAllModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 text-xs font-extrabold rounded-lg transition shadow-xs"
              title="Delete All Trades"
            >
              <Trash2 size={15} />
              <span>Delete All</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] theme-text-primary text-xs font-bold rounded-lg border border-[var(--border-color)] transition shadow-xs"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold rounded-lg shadow-md transition"
          >
            <Plus size={16} />
            <span>Add Trade</span>
          </button>
        </div>
      </div>

      {/* Dynamic Account Capital Banner */}
      <div className="terminal-card p-5 bg-gradient-to-r from-amber-500/10 via-[var(--bg-card)] to-amber-500/10 border-amber-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-500 font-extrabold text-[11px] uppercase tracking-wider border border-amber-500/30">
                Account Equity & Capital
              </span>
              <span className="text-xs theme-text-secondary">Auto-calculated from Trade Journal P&L</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold theme-text-primary font-mono-numeric flex items-center space-x-3">
              <span className="text-amber-500 font-black">${workspace.currentCapital?.toFixed(2) || '100.00'} USD</span>
              <span className={`text-sm px-2.5 py-0.5 rounded-full font-bold font-mono-numeric ${
                netPnl >= 0 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
              }`}>
                {netPnl >= 0 ? '+' : ''}${netPnl.toFixed(2)} ({workspace.initialCapital > 0 ? (((workspace.currentCapital - workspace.initialCapital) / workspace.initialCapital) * 100).toFixed(1) : '0.0'}%)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-[var(--bg-subpanel)] p-2.5 rounded-lg border border-[var(--border-color)]">
            <div className="text-right">
              <label className="block text-[10px] uppercase font-bold theme-text-secondary">Starting Capital ($ USD)</label>
              <div className="flex items-center space-x-1 mt-0.5">
                <span className="theme-text-muted font-bold text-xs">$</span>
                <input
                  type="number"
                  step="any"
                  value={workspace.initialCapital}
                  onChange={e => workspace.setInitialCapital(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-[var(--bg-card)] border border-[var(--border-color)] rounded px-2 py-1 text-xs font-extrabold theme-text-primary outline-none focus:border-amber-500 font-mono-numeric text-right transition"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono-numeric">
        <div className="terminal-card p-3.5 shadow-xs">
          <span className="text-[10px] theme-text-secondary uppercase font-extrabold">Total Trades</span>
          <div className="text-lg font-extrabold theme-text-primary">{trades.length}</div>
        </div>

        <div className="terminal-card p-3.5 shadow-xs">
          <span className="text-[10px] text-emerald-500 uppercase font-extrabold">Winning Trades</span>
          <div className="text-lg font-extrabold text-emerald-500">{wins}</div>
        </div>

        <div className="terminal-card p-3.5 shadow-xs">
          <span className="text-[10px] text-rose-500 uppercase font-extrabold">Losing Trades</span>
          <div className="text-lg font-extrabold text-rose-500">{losses}</div>
        </div>

        <div className="terminal-card p-3.5 shadow-xs">
          <span className="text-[10px] text-purple-500 uppercase font-extrabold">Win Rate</span>
          <div className="text-lg font-extrabold text-purple-500">{winRate}%</div>
        </div>

        <div className="terminal-card p-3.5 shadow-xs">
          <span className="text-[10px] text-indigo-500 uppercase font-extrabold">Average R</span>
          <div className="text-lg font-extrabold text-indigo-500">+{avgR}R</div>
        </div>

        <div className="terminal-card p-3.5 shadow-xs">
          <span className="text-[10px] theme-text-secondary uppercase font-extrabold">Net P&L ($)</span>
          <div className={`text-lg font-extrabold ${netPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {netPnl >= 0 ? '+' : ''}${netPnl.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Main Trade Table with Delete Option */}
      <TradeTable
        trades={trades}
        onSelectTrade={setSelectedTrade}
        onDeleteTrade={workspace.deleteTrade}
      />

      {/* Add Trade Form Modal */}
      <TradeFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaveTrade={workspace.addTrade}
      />

      {/* Trade Detail Inspector Modal */}
      <TradeDetailModal
        trade={selectedTrade}
        isOpen={!!selectedTrade}
        onClose={() => setSelectedTrade(null)}
      />

      {/* Delete All Trades Confirmation Modal */}
      {isDeleteAllModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="terminal-card max-w-md w-full p-6 space-y-4 shadow-2xl border-rose-500/40">
            <div className="flex items-center space-x-3 text-rose-500">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-extrabold theme-text-primary">Delete All Trade Records?</h3>
            </div>
            <p className="text-xs theme-text-secondary leading-relaxed">
              Are you sure you want to permanently clear all <strong className="theme-text-primary">{trades.length} trade journal records</strong>?
              This will reset your Account Equity P&L calculation back to your initial capital.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setIsDeleteAllModalOpen(false)}
                className="px-4 py-2 bg-[var(--bg-subpanel)] hover:bg-[var(--bg-card-hover)] theme-text-primary text-xs font-bold rounded-lg border border-[var(--border-color)] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteAll}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-lg shadow-md transition flex items-center space-x-1.5"
              >
                <Trash2 size={14} />
                <span>Confirm Delete All</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

