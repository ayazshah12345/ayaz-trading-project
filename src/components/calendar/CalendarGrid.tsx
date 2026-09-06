import React, { useState } from 'react';
import type { CalendarDayRecord, TradeRecord, DailyJournalEntry } from '../../types';
import { ChevronLeft, ChevronRight, BookOpen, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';

interface CalendarGridProps {
  trades: TradeRecord[];
  journals: DailyJournalEntry[];
  onSelectDate: (record: CalendarDayRecord) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  trades = [],
  journals = [],
  onSelectDate,
}) => {
  const todayDate = new Date();
  const [currentYear, setCurrentYear] = useState<number>(todayDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(todayDate.getMonth());

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(todayDate.getFullYear());
    setCurrentMonth(todayDate.getMonth());
  };

  // Days calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDayOffset = new Date(currentYear, currentMonth, 1).getDay(); // Sunday = 0

  const formattedMonthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  
  const getRecordForDay = (dayNum: number): CalendarDayRecord => {
    const dayStr = String(dayNum).padStart(2, '0');
    const dateStr = `${formattedMonthStr}-${dayStr}`;

    // Real user trades on this date
    const dayTrades = trades.filter(t => t.date === dateStr);
    
    // Real user journal on this date
    const dayJournal = journals.find(j => j.date === dateStr);

    if (dayTrades.length > 0 || dayJournal) {
      const pnl = dayTrades.reduce((acc, t) => acc + (t.pnl || 0), 0);
      const winCount = dayTrades.filter(t => t.result === 'WIN').length;
      const lossCount = dayTrades.filter(t => t.result === 'LOSS').length;
      const notes = dayJournal
        ? `${dayJournal.asset} (${dayJournal.bias} Bias) - ${dayJournal.htfAnalysis || dayJournal.tradingPlan || 'Journal Logged'}`
        : `${dayTrades.length} Trade(s) logged. Net P&L: ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`;

      return {
        date: dateStr,
        pnl: Number(pnl.toFixed(2)),
        tradesCount: dayTrades.length,
        winCount,
        lossCount,
        hasJournal: Boolean(dayJournal),
        notes,
      };
    }

    return {
      date: dateStr,
      pnl: 0,
      tradesCount: 0,
      winCount: 0,
      lossCount: 0,
      hasJournal: false,
    };
  };

  // Month Total P&L & Trade Metrics Summary
  let totalMonthPnl = 0;
  let totalMonthTrades = 0;
  let winningDaysCount = 0;
  let losingDaysCount = 0;

  for (let i = 1; i <= daysInMonth; i++) {
    const r = getRecordForDay(i);
    totalMonthPnl += r.pnl;
    totalMonthTrades += r.tradesCount;
    if (r.pnl > 0) winningDaysCount++;
    if (r.pnl < 0) losingDaysCount++;
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="terminal-card p-4 sm:p-6 space-y-5 shadow-lg">
      {/* Calendar Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black theme-text-primary uppercase tracking-tight font-sans flex items-center space-x-2">
              <span>{MONTH_NAMES[currentMonth]} {currentYear}</span>
            </h3>
            <p className="text-xs theme-text-secondary font-mono-numeric font-medium">
              Live Monthly Trading Journal & Performance Breakdown
            </p>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center space-x-2 font-mono-numeric">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--bg-subpanel)] hover:bg-[var(--bg-card-hover)] theme-text-primary border border-[var(--border-color)] transition flex items-center space-x-1 cursor-pointer"
            title="Jump to Current Month"
          >
            <RotateCcw size={13} />
            <span>Today</span>
          </button>
          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 theme-text-secondary hover:theme-text-primary hover:bg-[var(--bg-card-hover)] rounded-lg border border-[var(--border-color)] transition cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 theme-text-secondary hover:theme-text-primary hover:bg-[var(--bg-card-hover)] rounded-lg border border-[var(--border-color)] transition cursor-pointer"
              title="Next Month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Month Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-numeric text-xs">
        <div className="p-3 rounded-xl bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-1">
          <span className="theme-text-secondary text-[10px] uppercase font-bold">Month Net P&L</span>
          <div className={`text-base font-extrabold ${totalMonthPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {totalMonthPnl >= 0 ? '+' : ''}${totalMonthPnl.toFixed(2)}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-1">
          <span className="theme-text-secondary text-[10px] uppercase font-bold">Total Month Trades</span>
          <div className="text-base font-extrabold theme-text-primary">
            {totalMonthTrades} Trades
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-1">
          <span className="theme-text-secondary text-[10px] uppercase font-bold">Winning Days</span>
          <div className="text-base font-extrabold text-emerald-500">
            {winningDaysCount} Days
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-1">
          <span className="theme-text-secondary text-[10px] uppercase font-bold">Losing Days</span>
          <div className="text-base font-extrabold text-rose-500">
            {losingDaysCount} Days
          </div>
        </div>
      </div>

      {/* Grid Headers */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-xs font-extrabold theme-text-secondary uppercase tracking-wider font-mono-numeric">
        {weekDays.map(wd => (
          <div key={wd} className="py-1">{wd}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {/* Empty leading cells */}
        {Array.from({ length: startDayOffset }).map((_, idx) => (
          <div key={`empty-${idx}`} className="h-20 sm:h-24 bg-[var(--bg-subpanel)]/50 rounded-xl border border-transparent opacity-40" />
        ))}

        {/* Month Days */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNum = idx + 1;
          const rec = getRecordForDay(dayNum);
          const hasActivity = rec.tradesCount > 0 || rec.hasJournal || rec.pnl !== 0;
          const isProfitable = rec.pnl > 0;
          const isLoss = rec.pnl < 0;

          const isToday =
            todayDate.getFullYear() === currentYear &&
            todayDate.getMonth() === currentMonth &&
            todayDate.getDate() === dayNum;

          return (
            <div
              key={dayNum}
              onClick={() => onSelectDate(rec)}
              className={`h-20 sm:h-24 p-2 rounded-xl border flex flex-col justify-between transition cursor-pointer font-mono-numeric shadow-xs hover:scale-[1.02] ${
                isToday ? 'ring-2 ring-amber-500 shadow-lg' : ''
              } ${
                hasActivity
                  ? isProfitable
                    ? 'bg-emerald-500/10 border-emerald-500/40 hover:border-emerald-500/80'
                    : isLoss
                    ? 'bg-rose-500/10 border-rose-500/40 hover:border-rose-500/80'
                    : 'bg-amber-500/10 border-amber-500/40 hover:border-amber-500/80'
                  : 'bg-[var(--bg-subpanel)] border-[var(--border-color)] hover:border-[var(--border-hover)]'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className={`font-extrabold ${isToday ? 'text-amber-500 underline' : hasActivity ? 'theme-text-primary' : 'theme-text-muted'}`}>
                  {dayNum}
                </span>
                {rec.hasJournal && (
                  <span title="Daily Journal Completed">
                    <BookOpen size={14} className="text-emerald-500 shrink-0" />
                  </span>
                )}
              </div>

              {hasActivity ? (
                <div className="space-y-0.5">
                  <div className={`font-black text-xs ${isProfitable ? 'text-emerald-500' : isLoss ? 'text-rose-500' : 'text-amber-500'}`}>
                    {rec.pnl >= 0 ? '+' : ''}${rec.pnl.toFixed(2)}
                  </div>
                  <div className="text-[10px] theme-text-secondary font-bold">
                    {rec.tradesCount} Trade{rec.tradesCount !== 1 ? 's' : ''}
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
