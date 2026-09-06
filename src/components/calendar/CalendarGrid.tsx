import React, { useState } from 'react';
import type { CalendarDayRecord } from '../../types';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface CalendarGridProps {
  records: CalendarDayRecord[];
  onSelectDate: (record: CalendarDayRecord) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ records, onSelectDate }) => {
  const [currentMonth] = useState('September 2026');

  // September 2026 starts on Tuesday (day index 2)
  const daysInMonth = 30;
  const startDayOffset = 2;

  const getRecordForDay = (dayNum: number): CalendarDayRecord | undefined => {
    const dayStr = String(dayNum).padStart(2, '0');
    const dateStr = `2026-09-${dayStr}`;
    return records.find(r => r.date === dateStr);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="terminal-card p-5 space-y-4">
      {/* Calendar Month Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center space-x-3">
          <h3 className="text-sm font-extrabold theme-text-primary uppercase tracking-wider font-mono-numeric">
            {currentMonth}
          </h3>
          <span className="text-xs theme-text-secondary font-mono-numeric font-medium">
            (Monthly Trading Journal Overview)
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-1.5 theme-text-secondary hover:theme-text-primary hover:bg-[var(--bg-card-hover)] rounded-lg border border-[var(--border-color)] transition">
            <ChevronLeft size={16} />
          </button>
          <button className="p-1.5 theme-text-secondary hover:theme-text-primary hover:bg-[var(--bg-card-hover)] rounded-lg border border-[var(--border-color)] transition">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Grid Headers */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-extrabold theme-text-secondary uppercase tracking-wider font-mono-numeric">
        {weekDays.map(wd => (
          <div key={wd} className="py-1">{wd}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty leading cells */}
        {Array.from({ length: startDayOffset }).map((_, idx) => (
          <div key={`empty-${idx}`} className="h-24 bg-[var(--bg-subpanel)] rounded-lg border border-transparent opacity-40" />
        ))}

        {/* Month Days */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNum = idx + 1;
          const rec = getRecordForDay(dayNum);
          const isProfitable = rec && rec.pnl > 0;
          const isLoss = rec && rec.pnl < 0;

          return (
            <div
              key={dayNum}
              onClick={() => rec && onSelectDate(rec)}
              className={`h-24 p-2.5 rounded-lg border flex flex-col justify-between transition cursor-pointer font-mono-numeric shadow-xs ${
                rec
                  ? isProfitable
                    ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/60'
                    : isLoss
                    ? 'bg-rose-500/10 border-rose-500/30 hover:border-rose-500/60'
                    : 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/60'
                  : 'bg-[var(--bg-subpanel)] border-[var(--border-color)] hover:border-[var(--border-hover)] theme-text-secondary'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className={`font-extrabold ${rec ? 'theme-text-primary' : 'theme-text-muted'}`}>{dayNum}</span>
                {rec?.hasJournal && (
                  <span title="Daily Journal Completed">
                    <BookOpen size={13} className="text-emerald-500" />
                  </span>
                )}
              </div>

              {rec ? (
                <div className="space-y-1">
                  <div className={`font-extrabold text-xs ${isProfitable ? 'text-emerald-500' : isLoss ? 'text-rose-500' : 'text-amber-500'}`}>
                    {rec.pnl >= 0 ? '+' : ''}${rec.pnl.toFixed(2)}
                  </div>
                  <div className="text-[10px] theme-text-secondary font-bold">
                    {rec.tradesCount} Trade{rec.tradesCount > 1 ? 's' : ''}
                  </div>
                </div>
              ) : (
                <div className="text-[10px] theme-text-muted italic">No trades</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

