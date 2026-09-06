import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BarChart2, BookMarked, BookOpen, FlaskConical, ArrowRight, X } from 'lucide-react';
import { MarketAsset, TradeRecord, DailyJournalEntry, BacktestCampaign } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  markets: MarketAsset[];
  trades: TradeRecord[];
  journal: DailyJournalEntry;
  backtests: BacktestCampaign[];
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  markets,
  trades,
  journal,
  backtests,
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or state
        }
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  const filteredMarkets = cleanQuery
    ? markets.filter(
        m =>
          m.symbol.toLowerCase().includes(cleanQuery) ||
          m.name.toLowerCase().includes(cleanQuery) ||
          m.category.toLowerCase().includes(cleanQuery)
      )
    : markets.slice(0, 4);

  const filteredTrades = cleanQuery
    ? trades.filter(
        t =>
          t.id.toLowerCase().includes(cleanQuery) ||
          t.asset.toLowerCase().includes(cleanQuery) ||
          t.strategy.toLowerCase().includes(cleanQuery) ||
          t.result.toLowerCase().includes(cleanQuery)
      )
    : trades.slice(0, 3);

  const isJournalMatch =
    cleanQuery &&
    (journal.asset.toLowerCase().includes(cleanQuery) ||
      journal.bias.toLowerCase().includes(cleanQuery) ||
      journal.tradingPlan.toLowerCase().includes(cleanQuery));

  const filteredBacktests = cleanQuery
    ? backtests.filter(
        b =>
          b.id.toLowerCase().includes(cleanQuery) ||
          b.title.toLowerCase().includes(cleanQuery) ||
          b.asset.toLowerCase().includes(cleanQuery) ||
          b.strategy.toLowerCase().includes(cleanQuery)
      )
    : backtests.slice(0, 2);

  const handleSelectMarket = (symbol: string) => {
    navigate(`/markets/${symbol}`);
    onClose();
  };

  const handleSelectTrade = () => {
    navigate('/trades');
    onClose();
  };

  const handleSelectJournal = () => {
    navigate('/journal');
    onClose();
  };

  const handleSelectBacktest = () => {
    navigate('/backtesting');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-colors">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-subpanel)]">
          <Search size={18} className="text-blue-500 shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search markets, trades (e.g. XAUUSD), journals, or backtests..."
            className="w-full bg-transparent text-sm theme-text-primary placeholder:theme-text-muted outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 theme-text-secondary hover:theme-text-primary mr-1">
              <X size={14} />
            </button>
          )}
          <button onClick={onClose} className="text-xs px-2 py-1 bg-[var(--bg-subpanel)] border border-[var(--border-color)] theme-text-secondary rounded hover:theme-text-primary">
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-6 flex-1 text-xs custom-scrollbar">
          {/* Markets Section */}
          {filteredMarkets.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold theme-text-secondary uppercase tracking-wider mb-2">
                <span className="flex items-center space-x-1.5">
                  <BarChart2 size={13} className="text-blue-500" />
                  <span>Markets</span>
                </span>
                <span>{filteredMarkets.length} matches</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredMarkets.map(m => (
                  <button
                    key={m.symbol}
                    onClick={() => handleSelectMarket(m.symbol)}
                    className="flex items-center justify-between p-2.5 rounded bg-[var(--bg-subpanel)] border border-[var(--border-color)] hover:border-blue-500/50 hover:bg-[var(--bg-card-hover)] text-left transition group"
                  >
                    <div>
                      <div className="font-bold theme-text-primary font-mono-numeric">{m.symbol}</div>
                      <div className="text-[11px] theme-text-secondary truncate max-w-[140px]">{m.name}</div>
                    </div>
                    <div className="text-right font-mono-numeric">
                      <div className="theme-text-primary font-semibold">${m.price}</div>
                      <div className={m.change24h >= 0 ? 'text-emerald-500 font-medium' : 'text-rose-500 font-medium'}>
                        {m.change24h >= 0 ? '+' : ''}{m.change24h}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trades Section */}
          {filteredTrades.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold theme-text-secondary uppercase tracking-wider mb-2">
                <span className="flex items-center space-x-1.5">
                  <BookMarked size={13} className="text-indigo-500" />
                  <span>Trades</span>
                </span>
              </div>
              <div className="space-y-1.5">
                {filteredTrades.map(t => (
                  <button
                    key={t.id}
                    onClick={handleSelectTrade}
                    className="w-full flex items-center justify-between p-2.5 rounded bg-[var(--bg-subpanel)] border border-[var(--border-color)] hover:border-indigo-500/50 hover:bg-[var(--bg-card-hover)] text-left transition font-mono-numeric"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-bold theme-text-primary">{t.id}</span>
                      <span className="text-xs text-blue-500 font-semibold">{t.asset}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${t.direction === 'LONG' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {t.direction}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs">
                      <span className="theme-text-secondary">{t.strategy}</span>
                      <span className={t.pnl >= 0 ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
                        {t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)} ({t.rMultiple}R)
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Daily Journal Section */}
          {isJournalMatch && (
            <div>
              <div className="text-[11px] font-semibold theme-text-secondary uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <BookOpen size={13} className="text-emerald-500" />
                <span>Daily Journal Entry</span>
              </div>
              <button
                onClick={handleSelectJournal}
                className="w-full p-3 rounded bg-[var(--bg-subpanel)] border border-[var(--border-color)] hover:border-emerald-500/50 hover:bg-[var(--bg-card-hover)] text-left transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold theme-text-primary">{journal.date} ({journal.asset})</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Bias: {journal.bias}
                  </span>
                </div>
                <p className="theme-text-secondary text-xs line-clamp-2">{journal.tradingPlan}</p>
              </button>
            </div>
          )}

          {/* Backtests Section */}
          {filteredBacktests.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold theme-text-secondary uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <FlaskConical size={13} className="text-amber-500" />
                <span>Backtest Campaigns</span>
              </div>
              <div className="space-y-1.5">
                {filteredBacktests.map(b => (
                  <button
                    key={b.id}
                    onClick={handleSelectBacktest}
                    className="w-full flex items-center justify-between p-2.5 rounded bg-[var(--bg-subpanel)] border border-[var(--border-color)] hover:border-amber-500/50 hover:bg-[var(--bg-card-hover)] text-left transition"
                  >
                    <div>
                      <div className="font-semibold theme-text-primary">{b.title}</div>
                      <div className="text-[11px] theme-text-secondary">{b.asset} • {b.strategy}</div>
                    </div>
                    <div className="text-right font-mono-numeric text-xs">
                      <div className="text-amber-500 font-bold">{b.winRate}% WR</div>
                      <div className="theme-text-secondary">{b.totalR} Total R</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredMarkets.length === 0 && filteredTrades.length === 0 && !isJournalMatch && filteredBacktests.length === 0 && (
            <div className="py-8 text-center text-slate-400">
              No matching records found for "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
