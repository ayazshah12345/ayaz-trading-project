import React from 'react';
import { Modal } from '../common/Modal';
import { CalendarDayRecord } from '../../types';
import { BookOpen, BookMarked, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DayDetailModalProps {
  record: CalendarDayRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({ record, isOpen, onClose }) => {
  const navigate = useNavigate();
  if (!record) return null;

  const isWinDay = record.pnl >= 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Trading Day: ${record.date}`}
      subtitle="Complete daily trading breakdown, recorded trades, and journal notes"
      maxWidth="xl"
    >
      <div className="space-y-5 text-xs font-mono-numeric">
        {/* Day P&L Summary */}
        <div className="p-4 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] flex items-center justify-between">
          <div>
            <div className="text-[11px] theme-text-secondary uppercase font-semibold">Daily P&L</div>
            <div className={`text-xl font-bold ${isWinDay ? 'text-emerald-500' : 'text-rose-500'}`}>
              {record.pnl >= 0 ? '+' : ''}${record.pnl.toFixed(2)}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] theme-text-secondary uppercase font-semibold">Total Trades</div>
            <div className="theme-text-primary font-bold text-base">
              {record.tradesCount} Trades ({record.winCount}W / {record.lossCount}L)
            </div>
          </div>
        </div>

        {/* Journal Status */}
        <div className="p-3 rounded bg-[var(--bg-subpanel)] border border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen size={16} className={record.hasJournal ? 'text-emerald-500' : 'theme-text-secondary'} />
            <span className="theme-text-primary font-semibold">Daily Journal Status:</span>
            <span className={record.hasJournal ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>
              {record.hasJournal ? 'Completed' : 'Pending'}
            </span>
          </div>

          <button
            onClick={() => {
              navigate('/journal');
              onClose();
            }}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition shadow-sm"
          >
            Open Journal
          </button>
        </div>

        {/* Day Notes */}
        {record.notes && (
          <div className="space-y-1">
            <h5 className="text-[11px] font-bold theme-text-secondary uppercase">Daily Summary & Notes</h5>
            <p className="p-3 rounded bg-[var(--bg-subpanel)] border border-[var(--border-color)] theme-text-primary font-sans leading-relaxed">
              {record.notes}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
