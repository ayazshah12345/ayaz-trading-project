import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { TradeRecord, TradeDirection, TradeResult } from '../../types';
import { Plus, DollarSign, Target, BookOpen, AlertCircle } from 'lucide-react';

interface TradeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTrade: (trade: Omit<TradeRecord, 'id'>) => void;
}

export const TradeFormModal: React.FC<TradeFormModalProps> = ({
  isOpen,
  onClose,
  onSaveTrade,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [asset, setAsset] = useState('XAUUSD');
  const [direction, setDirection] = useState<TradeDirection>('LONG');
  
  // Simplified Core Inputs requested by User
  const [entryPrice, setEntryPrice] = useState<number>(4420.0);
  const [exitPrice, setExitPrice] = useState<number>(4448.0);
  const [pnl, setPnl] = useState<number>(100.0); // Total Profit or Loss ($)
  const [tradeReason, setTradeReason] = useState('');
  const [lessonLearned, setLessonLearned] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const computedResult: TradeResult = pnl > 0 ? 'WIN' : pnl < 0 ? 'LOSS' : 'BREAKEVEN';
    const computedR = pnl !== 0 ? Number((pnl / 100).toFixed(2)) : 0;

    // Derived stop loss / take profit fallbacks for full system compatibility
    const slOffset = Math.abs(entryPrice * 0.005) || 5;
    const tpOffset = Math.abs(entryPrice * 0.01) || 10;
    const derivedSl = direction === 'LONG' ? entryPrice - slOffset : entryPrice + slOffset;
    const derivedTp = direction === 'LONG' ? entryPrice + tpOffset : entryPrice - tpOffset;

    onSaveTrade({
      date,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      asset,
      direction,
      timeframe: '15m',
      entryPrice,
      stopLoss: derivedSl,
      takeProfit: derivedTp,
      exitPrice,
      positionSize: 1.0,
      riskPercentage: 1.0,
      strategy: 'Fair Value Gap',
      session: 'New York',
      result: computedResult,
      pnl: Number(pnl),
      rMultiple: computedR,
      tradeReason,
      lessonLearned,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Trade Record"
      subtitle="Simple & fast trade journal entry"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Asset, Direction & Date Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-extrabold theme-text-primary uppercase tracking-wider mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-lg px-3 py-2 theme-text-primary font-mono-numeric font-bold outline-none focus:border-amber-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold theme-text-primary uppercase tracking-wider mb-1">
              Asset
            </label>
            <select
              value={asset}
              onChange={e => setAsset(e.target.value)}
              className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-lg px-3 py-2 theme-text-primary font-mono-numeric font-extrabold outline-none focus:border-amber-500 cursor-pointer transition"
            >
              <option value="XAUUSD">XAUUSD (Gold)</option>
              <option value="BTCUSDT">BTCUSDT (Bitcoin)</option>
              <option value="EURUSD">EURUSD</option>
              <option value="GBPUSD">GBPUSD</option>
              <option value="USDJPY">USDJPY</option>
              <option value="ETHUSDT">ETHUSDT</option>
              <option value="NAS100">NAS100</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold theme-text-primary uppercase tracking-wider mb-1">
              Direction
            </label>
            <div className="flex space-x-1">
              <button
                type="button"
                onClick={() => setDirection('LONG')}
                className={`flex-1 py-2 font-black text-xs rounded-lg border transition font-mono-numeric ${
                  direction === 'LONG'
                    ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50 shadow-xs'
                    : 'bg-[var(--bg-subpanel)] theme-text-secondary border-[var(--border-color)]'
                }`}
              >
                LONG
              </button>
              <button
                type="button"
                onClick={() => setDirection('SHORT')}
                className={`flex-1 py-2 font-black text-xs rounded-lg border transition font-mono-numeric ${
                  direction === 'SHORT'
                    ? 'bg-rose-500/20 text-rose-500 border-rose-500/50 shadow-xs'
                    : 'bg-[var(--bg-subpanel)] theme-text-secondary border-[var(--border-color)]'
                }`}
              >
                SHORT
              </button>
            </div>
          </div>
        </div>

        {/* Entry & Exit Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[var(--bg-subpanel)] p-3.5 rounded-xl border border-[var(--border-color)]">
          <div>
            <label className="block text-[11px] font-extrabold theme-text-primary uppercase tracking-wider mb-1 flex items-center space-x-1">
              <Target size={14} className="text-amber-500" />
              <span>Entry Price</span>
            </label>
            <input
              type="number"
              step="any"
              value={entryPrice}
              onChange={e => setEntryPrice(parseFloat(e.target.value) || 0)}
              placeholder="e.g. 4420.50"
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-3 py-2 theme-text-primary font-mono-numeric font-bold outline-none focus:border-amber-500 transition text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold theme-text-primary uppercase tracking-wider mb-1 flex items-center space-x-1">
              <Target size={14} className="text-purple-400" />
              <span>Exit Price</span>
            </label>
            <input
              type="number"
              step="any"
              value={exitPrice}
              onChange={e => setExitPrice(parseFloat(e.target.value) || 0)}
              placeholder="e.g. 4448.00"
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-3 py-2 theme-text-primary font-mono-numeric font-bold outline-none focus:border-amber-500 transition text-sm"
              required
            />
          </div>
        </div>

        {/* Total Profit or Loss ($) */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-[var(--bg-subpanel)] to-amber-500/10 border border-amber-500/30 space-y-1">
          <label className="block text-[11px] font-extrabold theme-text-primary uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <DollarSign size={14} className="text-amber-500" />
              <span>Total Profit or Loss ($ USD)</span>
            </span>
            <span className={`text-xs font-black font-mono-numeric px-2 py-0.5 rounded ${
              pnl > 0 ? 'bg-emerald-500/10 text-emerald-500' : pnl < 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
            }`}>
              {pnl > 0 ? 'PROFIT' : pnl < 0 ? 'LOSS' : 'BREAKEVEN'}
            </span>
          </label>
          <input
            type="number"
            step="any"
            value={pnl}
            onChange={e => setPnl(parseFloat(e.target.value) || 0)}
            placeholder="Enter profit (+100) or loss (-50)"
            className={`w-full bg-[var(--bg-card)] border rounded-lg px-3 py-2 font-mono-numeric text-base font-extrabold outline-none transition ${
              pnl >= 0 ? 'text-emerald-500 border-emerald-500/40 focus:border-emerald-500' : 'text-rose-500 border-rose-500/40 focus:border-rose-500'
            }`}
            required
          />
          <p className="text-[10px] theme-text-secondary font-medium">
            Enter a positive value for Profit (e.g. 100) or negative for Loss (e.g. -50).
          </p>
        </div>

        {/* Trade Reason */}
        <div>
          <label className="block text-[11px] font-extrabold theme-text-primary uppercase tracking-wider mb-1 flex items-center space-x-1">
            <AlertCircle size={14} className="text-amber-500" />
            <span>Trade Reason</span>
          </label>
          <textarea
            rows={2}
            value={tradeReason}
            onChange={e => setTradeReason(e.target.value)}
            placeholder="Why did you take this trade? (e.g. Liquidity sweep + Fair Value Gap fill)"
            className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-lg p-2.5 theme-text-primary font-medium outline-none focus:border-amber-500 transition resize-none text-xs"
          />
        </div>

        {/* Lesson Learned */}
        <div>
          <label className="block text-[11px] font-extrabold theme-text-primary uppercase tracking-wider mb-1 flex items-center space-x-1">
            <BookOpen size={14} className="text-amber-500" />
            <span>Lesson Learned</span>
          </label>
          <textarea
            rows={2}
            value={lessonLearned}
            onChange={e => setLessonLearned(e.target.value)}
            placeholder="What key lesson did you learn from this trade?"
            className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-lg p-2.5 theme-text-primary font-medium outline-none focus:border-amber-500 transition resize-none text-xs"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[var(--border-color)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[var(--bg-subpanel)] theme-text-primary hover:bg-[var(--bg-card-hover)] font-bold rounded-lg border border-[var(--border-color)] transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-lg shadow-md flex items-center space-x-1.5 transition"
          >
            <Plus size={16} />
            <span>Save Trade</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
