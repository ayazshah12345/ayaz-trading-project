import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { BacktestRecord, TradeDirection, TradeResult } from '../../types';
import { Plus, Calculator } from 'lucide-react';

interface AddBacktestRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  defaultStrategy: string;
  defaultAsset: string;
  onSaveRecord: (campaignId: string, record: Omit<BacktestRecord, 'id'>) => void;
}

export const AddBacktestRecordModal: React.FC<AddBacktestRecordModalProps> = ({
  isOpen,
  onClose,
  campaignId,
  defaultStrategy,
  defaultAsset,
  onSaveRecord,
}) => {
  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(today);
  const [asset, setAsset] = useState(defaultAsset || 'XAUUSD');
  const [direction, setDirection] = useState<TradeDirection>('LONG');
  const [openPrice, setOpenPrice] = useState('2420.00');
  const [closePrice, setClosePrice] = useState('2445.00');
  const [strategy, setStrategy] = useState(defaultStrategy || 'Liquidity Sweep');
  const [profitAmount, setProfitAmount] = useState('500.00');
  const [riskRewardRatio, setRiskRewardRatio] = useState('2.5');
  const [result, setResult] = useState<TradeResult>('WIN');
  const [gapType, setGapType] = useState<'Fair Value Gap' | 'Weekend Open Gap' | 'Liquidity Void' | 'None'>('Fair Value Gap');
  const [gapSize, setGapSize] = useState('12.5');
  const [gapFilled, setGapFilled] = useState(true);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const open = parseFloat(openPrice) || 0;
    const close = parseFloat(closePrice) || 0;
    const pnl = parseFloat(profitAmount) || 0;
    const rr = parseFloat(riskRewardRatio) || 0;
    const size = parseFloat(gapSize) || 0;

    onSaveRecord(campaignId, {
      date,
      asset,
      direction,
      openPrice: open,
      closePrice: close,
      strategy,
      profitAmount: pnl,
      riskRewardRatio: rr,
      result,
      gapType,
      gapSize: size,
      gapFilled,
      notes,
    });

    onClose();
  };

  // Auto-calculate profit & R:R preview helper
  const handleCalculate = () => {
    const open = parseFloat(openPrice);
    const close = parseFloat(closePrice);
    if (!isNaN(open) && !isNaN(close) && open > 0) {
      let diff = close - open;
      if (direction === 'SHORT') diff = open - close;
      if (diff > 0) {
        setResult('WIN');
        setProfitAmount((diff * 20).toFixed(2)); // Sample lot scale
        setRiskRewardRatio((diff / (open * 0.005)).toFixed(2));
      } else if (diff < 0) {
        setResult('LOSS');
        setProfitAmount((diff * 20).toFixed(2));
        setRiskRewardRatio('-1.00');
      } else {
        setResult('BREAKEVEN');
        setProfitAmount('0.00');
        setRiskRewardRatio('0.00');
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Backtest Trade Record">

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] flex items-center justify-between text-xs font-mono-numeric">
          <div>
            <span className="theme-text-secondary font-bold">Target Campaign ID: </span>
            <span className="text-amber-500 font-extrabold">{campaignId}</span>
          </div>
          <button
            type="button"
            onClick={handleCalculate}
            className="px-2.5 py-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded border border-blue-500/30 text-[11px] font-bold flex items-center space-x-1"
          >
            <Calculator size={13} />
            <span>Auto-Calculate P&L</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono-numeric">
          <div>
            <label className="block theme-text-secondary font-bold mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2 theme-text-primary outline-none focus:border-blue-500 font-bold"
              required
            />
          </div>

          <div>
            <label className="block theme-text-secondary font-bold mb-1">Asset Symbol</label>
            <select
              value={asset}
              onChange={e => setAsset(e.target.value)}
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2 theme-text-primary outline-none focus:border-blue-500 font-bold"
            >
              <option value="XAUUSD">XAUUSD (Gold)</option>
              <option value="BTCUSDT">BTCUSDT (Bitcoin)</option>
              <option value="EURUSD">EURUSD</option>
              <option value="GBPUSD">GBPUSD</option>
              <option value="USDJPY">USDJPY</option>
              <option value="NAS100">NAS100</option>
            </select>
          </div>

          <div>
            <label className="block theme-text-secondary font-bold mb-1">Direction</label>
            <select
              value={direction}
              onChange={e => setDirection(e.target.value as TradeDirection)}
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2 theme-text-primary outline-none focus:border-blue-500 font-bold"
            >
              <option value="LONG">LONG 📈</option>
              <option value="SHORT">SHORT 📉</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono-numeric">
          <div>
            <label className="block theme-text-secondary font-bold mb-1">Open Price (Entry)</label>
            <input
              type="number"
              step="any"
              value={openPrice}
              onChange={e => setOpenPrice(e.target.value)}
              placeholder="e.g. 2420.00"
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2 theme-text-primary outline-none focus:border-blue-500 font-bold"
              required
            />
          </div>

          <div>
            <label className="block theme-text-secondary font-bold mb-1">Close Price (Exit)</label>
            <input
              type="number"
              step="any"
              value={closePrice}
              onChange={e => setClosePrice(e.target.value)}
              placeholder="e.g. 2445.00"
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2 theme-text-primary outline-none focus:border-blue-500 font-bold"
              required
            />
          </div>

          <div>
            <label className="block theme-text-secondary font-bold mb-1">Profit Amount ($)</label>
            <input
              type="number"
              step="any"
              value={profitAmount}
              onChange={e => setProfitAmount(e.target.value)}
              placeholder="e.g. 500.00"
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2 theme-text-primary outline-none focus:border-blue-500 font-bold"
              required
            />
          </div>

          <div>
            <label className="block theme-text-secondary font-bold mb-1">Risk Reward Ratio (R:R)</label>
            <input
              type="number"
              step="any"
              value={riskRewardRatio}
              onChange={e => setRiskRewardRatio(e.target.value)}
              placeholder="e.g. 2.5"
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2 theme-text-primary outline-none focus:border-blue-500 font-bold"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono-numeric">
          <div>
            <label className="block theme-text-secondary font-bold mb-1">Result</label>
            <select
              value={result}
              onChange={e => setResult(e.target.value as TradeResult)}
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2 theme-text-primary outline-none focus:border-blue-500 font-bold"
            >
              <option value="WIN">WIN ✅</option>
              <option value="LOSS">LOSS ❌</option>
              <option value="BREAKEVEN">BREAKEVEN ⚖️</option>
            </select>
          </div>

          <div>
            <label className="block theme-text-secondary font-bold mb-1">Gap Analyzer Type</label>
            <select
              value={gapType}
              onChange={e => setGapType(e.target.value as any)}
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2 theme-text-primary outline-none focus:border-blue-500 font-bold"
            >
              <option value="Fair Value Gap">Fair Value Gap (FVG)</option>
              <option value="Weekend Open Gap">Weekend Open Gap</option>
              <option value="Liquidity Void">Liquidity Void</option>
              <option value="None">None</option>
            </select>
          </div>

          <div>
            <label className="block theme-text-secondary font-bold mb-1">Gap Size (pts/pips)</label>
            <input
              type="number"
              step="any"
              value={gapSize}
              onChange={e => setGapSize(e.target.value)}
              placeholder="e.g. 12.5"
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2 theme-text-primary outline-none focus:border-blue-500 font-bold"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] font-mono-numeric">
          <input
            type="checkbox"
            id="gapFilledCheck"
            checked={gapFilled}
            onChange={e => setGapFilled(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor="gapFilledCheck" className="theme-text-primary font-bold cursor-pointer">
            Price Gap Fully Filled during backtested execution?
          </label>
        </div>

        <div>
          <label className="block theme-text-secondary font-bold mb-1">Strategy Name</label>
          <input
            type="text"
            value={strategy}
            onChange={e => setStrategy(e.target.value)}
            placeholder="e.g. Liquidity Sweep"
            className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2 theme-text-primary outline-none focus:border-blue-500 font-sans font-bold"
            required
          />
        </div>

        <div>
          <label className="block theme-text-secondary font-bold mb-1">Backtest Notes & Confluence</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            placeholder="Describe price action entry triggers, session context, or execution notes..."
            className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-2 theme-text-primary outline-none focus:border-blue-500 font-sans"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-[var(--border-color)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[var(--bg-subpanel)] hover:bg-[var(--bg-card-hover)] theme-text-secondary font-bold rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center space-x-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-lg shadow-md transition"
          >
            <Plus size={16} />
            <span>Save Backtest Record</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
