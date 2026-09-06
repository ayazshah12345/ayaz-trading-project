import React from 'react';
import { Modal } from '../common/Modal';
import type { CalendarDayRecord, TradeRecord, DailyJournalEntry } from '../../types';
import { BookOpen, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DayDetailModalProps {
  record: CalendarDayRecord | null;
  trades?: TradeRecord[];
  journals?: DailyJournalEntry[];
  isOpen: boolean;
  onClose: () => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  record,
  trades = [],
  journals = [],
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  if (!record) return null;

  const isWinDay = record.pnl >= 0;
  const dayTrades = trades.filter(t => t.date === record.date);
  const dayJournal = journals.find(j => j.date === record.date);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Trading Breakdown: ${record.date}`}
      subtitle="Complete daily performance breakdown, trades logged, and daily journal"
      maxWidth="2xl"
    >
      <div className="space-y-5 text-xs font-mono-numeric">
        {/* Day P&L & Trade Metric Summary Bar */}
        <div className="p-4 rounded-xl bg-[var(--bg-subpanel)] border border-[var(--border-color)] flex items-center justify-between">
          <div>
            <div className="text-[11px] theme-text-secondary uppercase font-bold">Daily Net P&L</div>
            <div className={`text-2xl font-black ${isWinDay ? 'text-emerald-500' : 'text-rose-500'}`}>
              {record.pnl >= 0 ? '+' : ''}${record.pnl.toFixed(2)}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] theme-text-secondary uppercase font-bold">Executed Trades</div>
            <div className="theme-text-primary font-black text-base">
              {record.tradesCount} Trades ({record.winCount} Wins / {record.lossCount} Losses)
            </div>
          </div>
        </div>

        {/* Day Trades List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black theme-text-primary uppercase tracking-wider">
              Trades Executed ({dayTrades.length})
            </h4>
            <button
              onClick={() => {
                navigate('/trades');
                onClose();
              }}
              className="text-[11px] text-amber-500 hover:underline font-bold flex items-center space-x-1 cursor-pointer"
            >
              <span>Manage Trade Logs</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {dayTrades.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {dayTrades.map(t => (
                <div
                  key={t.id}
                  className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`p-1.5 rounded-md font-extrabold text-[10px] uppercase flex items-center space-x-1 ${
                        t.direction === 'LONG'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      }`}
                    >
                      {t.direction === 'LONG' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                      <span>{t.direction}</span>
                    </span>
                    <div>
                      <div className="font-black theme-text-primary">{t.asset}</div>
                      <div className="text-[10px] theme-text-secondary font-medium">
                        Entry: ${t.entryPrice} • Exit: ${t.exitPrice}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-black text-xs ${
                        t.result === 'WIN'
                          ? 'text-emerald-500'
                          : t.result === 'LOSS'
                          ? 'text-rose-500'
                          : 'text-amber-500'
                      }`}
                    >
                      {t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)}
                    </div>
                    <div className="text-[10px] theme-text-secondary font-bold">
                      {t.rMultiple > 0 ? '+' : ''}{t.rMultiple}R Multiple
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[var(--bg-subpanel)] border border-[var(--border-color)] text-center text-xs theme-text-secondary italic">
              No trade entries logged for this date.
            </div>
          )}
        </div>

        {/* Daily Journal Summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen size={16} className={dayJournal ? 'text-emerald-500' : 'theme-text-secondary'} />
              <h4 className="text-xs font-black theme-text-primary uppercase tracking-wider">
                Daily Journal Status: {dayJournal ? 'Completed' : 'Not Written'}
              </h4>
            </div>

            <button
              onClick={() => {
                navigate('/journal');
                onClose();
              }}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-md transition cursor-pointer"
            >
              {dayJournal ? 'Edit Daily Journal' : 'Write Journal Entry'}
            </button>
          </div>

          {dayJournal && (
            <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2 font-sans text-xs">
              <div className="flex items-center space-x-2 font-mono-numeric">
                <span className="font-bold theme-text-secondary">Asset Bias:</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-extrabold uppercase text-[10px]">
                  {dayJournal.asset} • {dayJournal.bias}
                </span>
              </div>
              {dayJournal.htfAnalysis && (
                <div>
                  <span className="font-bold theme-text-primary block mb-0.5">HTF & Market Analysis:</span>
                  <p className="theme-text-secondary leading-relaxed">{dayJournal.htfAnalysis}</p>
                </div>
              )}
              {dayJournal.lessonsLearned && (
                <div>
                  <span className="font-bold text-amber-500 block mb-0.5">Lessons Learned:</span>
                  <p className="theme-text-secondary leading-relaxed">{dayJournal.lessonsLearned}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
