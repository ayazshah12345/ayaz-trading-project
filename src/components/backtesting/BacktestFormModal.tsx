import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { BacktestCampaign, TradingTimeframe } from '../../types';
import { Plus } from 'lucide-react';

interface BacktestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBacktest: (b: Omit<BacktestCampaign, 'id' | 'createdDate'>) => void;
}

export const BacktestFormModal: React.FC<BacktestFormModalProps> = ({
  isOpen,
  onClose,
  onSaveBacktest,
}) => {
  const [title, setTitle] = useState('');
  const [asset, setAsset] = useState('XAUUSD');
  const [strategy, setStrategy] = useState('Liquidity Sweep');
  const [timeframe, setTimeframe] = useState<TradingTimeframe>('15m');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-06-30');

  const [totalTrades, setTotalTrades] = useState(100);
  const [winningTrades, setWinningTrades] = useState(65);
  const [losingTrades, setLosingTrades] = useState(35);
  const [winRate, setWinRate] = useState(65.0);
  const [profitFactor, setProfitFactor] = useState(2.1);
  const [maxDrawdown, setMaxDrawdown] = useState(4.5);
  const [totalR, setTotalR] = useState(115.0);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBacktest({
      title: title || `${asset} ${strategy} Test`,
      asset,
      strategy,
      timeframe,
      startDate,
      endDate,
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      avgWinR: 2.1,
      avgLossR: -1.0,
      avgR: 1.15,
      profitFactor,
      maxDrawdown,
      totalR,
      totalProfit: totalR * 100,
      description,
      records: [],
      monthlyPerformance: [
        { month: 'Jan', r: 20.5, winRate: 64, trades: 18 },
        { month: 'Feb', r: 18.0, winRate: 62, trades: 16 },
        { month: 'Mar', r: 25.4, winRate: 68, trades: 20 },
      ],
      equityCurve: [
        { date: 'Jan', cumulativeR: 20.5, cumulativeProfit: 2050 },
        { date: 'Feb', cumulativeR: 38.5, cumulativeProfit: 3850 },
        { date: 'Mar', cumulativeR: 63.9, cumulativeProfit: 6390 },
      ],
    });
    onClose();
  };


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Backtest Campaign"
      subtitle="Store historical strategy performance parameters and stats"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono-numeric">
        <div>
          <label className="block text-[11px] font-bold theme-text-secondary uppercase mb-1">
            Campaign Title
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. XAUUSD 15M Asian Range Breakout Test"
            className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded px-3 py-2 theme-text-primary font-sans outline-none focus:border-amber-500 transition"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold theme-text-secondary uppercase mb-1">Asset</label>
            <select
              value={asset}
              onChange={e => setAsset(e.target.value)}
              className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded px-3 py-2 theme-text-primary outline-none transition"
            >
              <option value="XAUUSD">XAUUSD</option>
              <option value="BTCUSDT">BTCUSDT</option>
              <option value="EURUSD">EURUSD</option>
              <option value="GBPUSD">GBPUSD</option>
              <option value="NAS100">NAS100</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold theme-text-secondary uppercase mb-1">Strategy</label>
            <select
              value={strategy}
              onChange={e => setStrategy(e.target.value)}
              className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded px-3 py-2 theme-text-primary outline-none transition"
            >
              <option value="Liquidity Sweep">Liquidity Sweep</option>
              <option value="Market Structure">Market Structure</option>
              <option value="Breakout">Breakout</option>
              <option value="Trend Following">Trend Following</option>
              <option value="Custom">Custom Strategy</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold theme-text-secondary uppercase mb-1">Timeframe</label>
            <select
              value={timeframe}
              onChange={e => setTimeframe(e.target.value as TradingTimeframe)}
              className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded px-3 py-2 theme-text-primary outline-none transition"
            >
              <option value="5m">5m</option>
              <option value="15m">15m</option>
              <option value="1H">1H</option>
              <option value="4H">4H</option>
              <option value="1D">1D</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold theme-text-secondary uppercase mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded px-3 py-2 theme-text-primary outline-none transition"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold theme-text-secondary uppercase mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded px-3 py-2 theme-text-primary outline-none transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 bg-[var(--bg-subpanel)] p-3 rounded border border-[var(--border-color)]">
          <div>
            <label className="block text-[10px] theme-text-secondary uppercase font-semibold">Total Trades</label>
            <input
              type="number"
              value={totalTrades}
              onChange={e => setTotalTrades(parseInt(e.target.value) || 0)}
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded px-2 py-1 theme-text-primary font-bold transition"
            />
          </div>
          <div>
            <label className="block text-[10px] text-emerald-500 uppercase font-semibold">Win Rate %</label>
            <input
              type="number"
              step="0.1"
              value={winRate}
              onChange={e => setWinRate(parseFloat(e.target.value) || 0)}
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded px-2 py-1 text-emerald-500 font-bold transition"
            />
          </div>
          <div>
            <label className="block text-[10px] text-emerald-500 uppercase font-semibold">Profit Factor</label>
            <input
              type="number"
              step="0.01"
              value={profitFactor}
              onChange={e => setProfitFactor(parseFloat(e.target.value) || 0)}
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded px-2 py-1 text-emerald-500 font-bold transition"
            />
          </div>
          <div>
            <label className="block text-[10px] text-blue-500 uppercase font-semibold">Total R</label>
            <input
              type="number"
              step="0.1"
              value={totalR}
              onChange={e => setTotalR(parseFloat(e.target.value) || 0)}
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded px-2 py-1 text-blue-500 font-bold transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold theme-text-secondary uppercase mb-1">
            Backtest Notes & Strategy Overview
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe rules, indicators used, session constraints..."
            className="w-full bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded p-2.5 theme-text-primary font-sans outline-none resize-none transition"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[var(--border-color)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[var(--bg-subpanel)] border border-[var(--border-color)] theme-text-secondary hover:theme-text-primary rounded font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded shadow transition flex items-center space-x-1.5"
          >
            <Plus size={16} />
            <span>Create Campaign</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
