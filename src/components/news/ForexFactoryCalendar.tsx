import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Flame,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
  TrendingUp,
  ShieldAlert,
  Info,
  X,
  Sparkles,
  CalendarDays,
  ListFilter,
} from 'lucide-react';
import {
  ForexFactoryEvent,
  CURRENCY_FLAGS,
  CURRENCY_AFFECTED_ASSETS,
  formatEventCountdown,
  ImpactLevel,
  generateMonthlyForexEvents,
} from '../../services/forexFactoryService';

interface ForexFactoryCalendarProps {
  events: ForexFactoryEvent[];
  isDarkMode?: boolean;
}

export const ForexFactoryCalendar: React.FC<ForexFactoryCalendarProps> = ({ events }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImpact, setSelectedImpact] = useState<'ALL' | ImpactLevel>('ALL');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('ALL');

  // Date and Scope navigation
  const now = new Date();
  const [currentYear, setCurrentYear] = useState<number>(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(now.getMonth()); // 0-indexed
  const [viewScope, setViewScope] = useState<'WEEK' | 'TODAY' | 'TOMORROW' | 'MONTH' | 'DAY'>('WEEK');
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(now.getDate());
  const [showMonthPickerGrid, setShowMonthPickerGrid] = useState<boolean>(false);

  const [activeModalEvent, setActiveModalEvent] = useState<ForexFactoryEvent | null>(null);

  // Month Events: merges live week's data with scheduled macro calendar for the entire selected month
  const monthlyEvents = useMemo(() => {
    return generateMonthlyForexEvents(currentYear, currentMonth, events);
  }, [currentYear, currentMonth, events]);

  // Available currencies from the current dataset
  const currencies = useMemo(() => {
    const list = Array.from(new Set(monthlyEvents.map(e => e.country))).filter(Boolean);
    return ['ALL', ...list];
  }, [monthlyEvents]);

  const todayStr = now.toDateString();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toDateString();

  // Current Month String (e.g. "September 2026")
  const monthName = new Date(currentYear, currentMonth, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  // Calculate days for the visual month calendar grid
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Monday = 0

  // Count events per day for the month grid
  const eventsByDayMap = useMemo(() => {
    const map: { [day: number]: { total: number; high: number; med: number; low: number } } = {};
    for (const e of monthlyEvents) {
      const d = new Date(e.date);
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        const day = d.getDate();
        if (!map[day]) map[day] = { total: 0, high: 0, med: 0, low: 0 };
        map[day].total++;
        if (e.impact === 'High') map[day].high++;
        else if (e.impact === 'Medium') map[day].med++;
        else map[day].low++;
      }
    }
    return map;
  }, [monthlyEvents, currentYear, currentMonth]);

  // Filter events based on View Scope, Impact, Currency, Search
  const filteredEvents = useMemo(() => {
    return monthlyEvents.filter(e => {
      const eventDate = new Date(e.date);
      const isThisMonth =
        eventDate.getFullYear() === currentYear && eventDate.getMonth() === currentMonth;

      // Scope filter
      if (viewScope === 'TODAY') {
        if (eventDate.toDateString() !== todayStr) return false;
      } else if (viewScope === 'TOMORROW') {
        if (eventDate.toDateString() !== tomorrowStr) return false;
      } else if (viewScope === 'DAY') {
        if (!isThisMonth || eventDate.getDate() !== selectedDayNumber) return false;
      } else if (viewScope === 'WEEK') {
        // Current week events
        const eventMs = eventDate.getTime();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        if (eventMs < startOfWeek.getTime() || eventMs > endOfWeek.getTime()) return false;
      } else if (viewScope === 'MONTH') {
        // Entire Month news
        if (!isThisMonth) return false;
      }

      // Impact filter
      if (selectedImpact !== 'ALL') {
        if (selectedImpact === 'High' && e.impact !== 'High') return false;
        if (selectedImpact === 'Medium' && e.impact !== 'Medium') return false;
        if (selectedImpact === 'Low' && e.impact !== 'Low') return false;
        if (selectedImpact === 'Holiday' && e.impact !== 'Holiday') return false;
      }

      // Currency filter
      if (selectedCurrency !== 'ALL' && e.country !== selectedCurrency) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = e.title.toLowerCase().includes(q);
        const matchesCountry = e.country.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCountry) return false;
      }

      return true;
    });
  }, [
    monthlyEvents,
    viewScope,
    selectedDayNumber,
    currentYear,
    currentMonth,
    selectedImpact,
    selectedCurrency,
    searchQuery,
    todayStr,
    tomorrowStr,
  ]);

  // Group events by Date String
  const groupedEvents = useMemo(() => {
    const groups: { [dateKey: string]: { label: string; events: ForexFactoryEvent[] } } = {};

    filteredEvents.forEach(e => {
      const d = new Date(e.date);
      const key = d.toISOString().split('T')[0];
      const isToday = d.toDateString() === todayStr;
      const isTomorrow = d.toDateString() === tomorrowStr;

      let dateLabel = d.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });

      if (isToday) dateLabel = `Today — ${dateLabel}`;
      else if (isTomorrow) dateLabel = `Tomorrow — ${dateLabel}`;

      if (!groups[key]) {
        groups[key] = { label: dateLabel, events: [] };
      }
      groups[key].events.push(e);
    });

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredEvents, todayStr, tomorrowStr]);

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

  const handleJumpToToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDayNumber(today.getDate());
    setViewScope('TODAY');
  };

  const renderImpactBadge = (impact: ImpactLevel) => {
    switch (impact) {
      case 'High':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-xs shadow-rose-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-pulse" />
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-xs shadow-orange-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5" />
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-xs shadow-emerald-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            Low
          </span>
        );
      case 'Holiday':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-slate-500/20 text-slate-400 border border-slate-500/30">
            Holiday
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Month Navigation & Scope Selector Bar */}
      <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-4">
        {/* Top Month Header & Scope Toggles */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Month Selector Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] theme-text-secondary hover:theme-text-primary hover:border-amber-500/50 transition cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)]">
              <CalendarIcon size={16} className="text-amber-500" />
              <span className="text-sm font-black theme-text-primary font-mono-numeric uppercase tracking-wide">
                {monthName}
              </span>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] theme-text-secondary hover:theme-text-primary hover:border-amber-500/50 transition cursor-pointer"
              title="Next Month"
            >
              <ChevronRight size={16} />
            </button>

            <button
              onClick={handleJumpToToday}
              className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] theme-text-secondary hover:text-amber-400 transition"
            >
              Today
            </button>

            <button
              onClick={() => setShowMonthPickerGrid(!showMonthPickerGrid)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition flex items-center space-x-1.5 ${
                showMonthPickerGrid
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                  : 'bg-[var(--bg-subpanel)] border-[var(--border-color)] text-amber-400 hover:border-amber-500/50'
              }`}
            >
              <CalendarDays size={14} />
              <span>{showMonthPickerGrid ? 'Hide Month Grid' : 'Open Month Grid'}</span>
            </button>
          </div>

          {/* Scope Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[var(--bg-subpanel)] p-1 rounded-lg border border-[var(--border-color)]">
            <button
              onClick={() => setViewScope('TODAY')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                viewScope === 'TODAY'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'theme-text-secondary hover:theme-text-primary'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setViewScope('TOMORROW')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                viewScope === 'TOMORROW'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'theme-text-secondary hover:theme-text-primary'
              }`}
            >
              Tomorrow
            </button>
            <button
              onClick={() => setViewScope('WEEK')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                viewScope === 'WEEK'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'theme-text-secondary hover:theme-text-primary'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setViewScope('MONTH')}
              className={`px-3.5 py-1.5 rounded text-xs font-black transition flex items-center space-x-1 ${
                viewScope === 'MONTH'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <CalendarDays size={13} />
              <span>All Month News ({monthlyEvents.length})</span>
            </button>
          </div>
        </div>

        {/* Visual Monthly Calendar Grid (Interactive Month Explorer) */}
        {showMonthPickerGrid && (
          <div className="p-4 rounded-xl bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold theme-text-primary flex items-center space-x-1.5">
                <CalendarDays size={14} className="text-amber-500" />
                <span>Click any day to inspect that day's news schedule:</span>
              </span>
              <div className="flex items-center space-x-3 text-[11px] font-mono">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-rose-400">High</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-orange-400">Medium</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-emerald-400">Low</span>
                </span>
              </div>
            </div>

            {/* Grid of Days */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(dayName => (
                <div key={dayName} className="font-bold theme-text-secondary py-1 text-[11px]">
                  {dayName}
                </div>
              ))}

              {/* Blank offset days */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`offset-${idx}`} className="h-14 rounded-lg bg-[var(--bg-card)]/30 opacity-20" />
              ))}

              {/* Month Days 1..N */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const isSelected = viewScope === 'DAY' && selectedDayNumber === dayNum;
                const isToday =
                  now.getFullYear() === currentYear &&
                  now.getMonth() === currentMonth &&
                  now.getDate() === dayNum;
                const dayStats = eventsByDayMap[dayNum];

                return (
                  <button
                    key={`day-${dayNum}`}
                    onClick={() => {
                      setSelectedDayNumber(dayNum);
                      setViewScope('DAY');
                    }}
                    className={`h-14 p-1.5 rounded-lg border transition flex flex-col justify-between text-left cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-md'
                        : isToday
                        ? 'bg-amber-500/15 border-amber-500/60 theme-text-primary'
                        : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-amber-500/50 hover:bg-[var(--bg-card-hover)] theme-text-primary'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                      <span>{dayNum}</span>
                      {isToday && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500 text-slate-950">
                          TODAY
                        </span>
                      )}
                    </div>

                    {dayStats && dayStats.total > 0 ? (
                      <div className="flex items-center space-x-1">
                        {dayStats.high > 0 && (
                          <span
                            className="w-2 h-2 rounded-full bg-rose-500 shrink-0"
                            title={`${dayStats.high} High Impact`}
                          />
                        )}
                        {dayStats.med > 0 && (
                          <span
                            className="w-2 h-2 rounded-full bg-orange-500 shrink-0"
                            title={`${dayStats.med} Medium Impact (Orange)`}
                          />
                        )}
                        {dayStats.low > 0 && (
                          <span
                            className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"
                            title={`${dayStats.low} Low Impact (Green)`}
                          />
                        )}
                        <span className="text-[10px] font-mono theme-text-secondary">
                          {dayStats.total}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[9px] text-slate-500 font-mono">—</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Search, Impact & Currency Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-[var(--border-color)]">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search month news (e.g. CPI, NFP, Powell, Rate, Unemployment)..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] text-xs theme-text-primary placeholder:text-[var(--text-muted)] focus:outline-none focus:border-amber-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs theme-text-secondary hover:theme-text-primary"
              >
                Clear
              </button>
            )}
          </div>

          {/* Impact filter chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] uppercase font-bold theme-text-secondary mr-1 flex items-center">
              <Filter size={12} className="mr-1" />
              Impact:
            </span>
            <button
              onClick={() => setSelectedImpact('ALL')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition border ${
                selectedImpact === 'ALL'
                  ? 'bg-slate-800 text-white border-slate-600'
                  : 'bg-[var(--bg-subpanel)] border-[var(--border-color)] theme-text-secondary hover:theme-text-primary'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedImpact('High')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition border flex items-center space-x-1 ${
                selectedImpact === 'High'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500'
                  : 'bg-[var(--bg-subpanel)] border-[var(--border-color)] text-rose-400/80 hover:text-rose-400'
              }`}
            >
              <Flame size={13} className="text-rose-500" />
              <span>High Impact Only</span>
            </button>
            <button
              onClick={() => setSelectedImpact('Medium')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition border ${
                selectedImpact === 'Medium'
                  ? 'bg-orange-500/20 text-orange-400 border-orange-500 shadow-xs'
                  : 'bg-[var(--bg-subpanel)] border-[var(--border-color)] text-orange-400/80 hover:text-orange-400'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setSelectedImpact('Low')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition border ${
                selectedImpact === 'Low'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-xs'
                  : 'bg-[var(--bg-subpanel)] border-[var(--border-color)] text-emerald-400/80 hover:text-emerald-400'
              }`}
            >
              Low
            </button>
          </div>
        </div>

        {/* Currency Scrollable Bar */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 max-w-full pt-2 border-t border-[var(--border-color)]">
          <span className="text-[11px] uppercase font-bold theme-text-secondary mr-1 shrink-0">
            Currency:
          </span>
          {currencies.map(curr => {
            const flagInfo = CURRENCY_FLAGS[curr];
            const isSelected = selectedCurrency === curr;
            return (
              <button
                key={curr}
                onClick={() => setSelectedCurrency(curr)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition border shrink-0 flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                    : 'bg-[var(--bg-subpanel)] border-[var(--border-color)] theme-text-secondary hover:theme-text-primary'
                }`}
              >
                {flagInfo && <span>{flagInfo.flag}</span>}
                <span>{curr}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scope Status Banner */}
      <div className="flex items-center justify-between text-xs px-1 text-[var(--text-secondary)]">
        <div>
          Showing:{' '}
          <strong className="theme-text-primary">
            {viewScope === 'TODAY'
              ? "Today's Releases"
              : viewScope === 'TOMORROW'
              ? "Tomorrow's Releases"
              : viewScope === 'WEEK'
              ? 'This Week Releases'
              : viewScope === 'DAY'
              ? `${monthName} Day ${selectedDayNumber}`
              : `All Month Releases (${monthName})`}
          </strong>
        </div>
        <div className="font-mono">{filteredEvents.length} economic events found</div>
      </div>

      {/* Events Results List */}
      {groupedEvents.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto text-amber-500">
            <Info size={24} />
          </div>
          <div className="text-sm font-bold theme-text-primary">No Economic Events Found</div>
          <p className="text-xs theme-text-secondary max-w-md mx-auto">
            No events match your current filter selection. Try selecting "All Month News" or resetting
            impact filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedImpact('ALL');
              setSelectedCurrency('ALL');
              setViewScope('MONTH');
            }}
            className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-600 transition cursor-pointer"
          >
            Show All Month News
          </button>
        </div>
      ) : (
        groupedEvents.map(([dateKey, group]) => (
          <div
            key={dateKey}
            className="rounded-xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm"
          >
            {/* Group Header */}
            <div className="px-4 py-2.5 bg-[var(--bg-subpanel)] border-b border-[var(--border-color)] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <h3 className="text-xs font-black uppercase tracking-wide theme-text-primary">
                  {group.label}
                </h3>
              </div>
              <span className="text-[11px] font-mono theme-text-secondary">
                {group.events.length} {group.events.length === 1 ? 'event' : 'events'}
              </span>
            </div>

            {/* Event rows */}
            <div className="divide-y divide-[var(--border-color)]">
              {group.events.map(event => {
                const eventDate = new Date(event.date);
                const timeString = eventDate.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const countdown = formatEventCountdown(event.date);
                const flagInfo = CURRENCY_FLAGS[event.country];

                return (
                  <div
                    key={event.id}
                    onClick={() => setActiveModalEvent(event)}
                    className="p-3 sm:px-4 sm:py-3 hover:bg-[var(--bg-card-hover)] cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    {/* Left: Time & Currency */}
                    <div className="flex items-center space-x-3 shrink-0">
                      <div className="w-16 flex flex-col">
                        <span className="text-xs font-mono font-bold theme-text-primary">
                          {timeString}
                        </span>
                        <span
                          className={`text-[10px] font-mono ${
                            countdown.isImminent
                              ? 'text-rose-400 font-bold animate-pulse'
                              : 'theme-text-secondary'
                          }`}
                        >
                          {countdown.label}
                        </span>
                      </div>

                      {/* Currency badge */}
                      <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-[var(--bg-subpanel)] border border-[var(--border-color)] font-mono font-bold text-xs theme-text-primary w-20 justify-center">
                        <span>{flagInfo?.flag || '🌐'}</span>
                        <span>{event.country}</span>
                      </div>

                      {/* Impact badge */}
                      <div className="w-24 shrink-0">{renderImpactBadge(event.impact)}</div>
                    </div>

                    {/* Middle: Event Title */}
                    <div className="flex-1 min-w-0 sm:px-2">
                      <div className="text-xs sm:text-sm font-semibold theme-text-primary group-hover:text-amber-400 transition truncate">
                        {event.title}
                      </div>
                      <div className="text-[10px] theme-text-secondary font-mono flex items-center space-x-2 mt-0.5">
                        <span>Forex Factory Calendar Feed</span>
                        {CURRENCY_AFFECTED_ASSETS[event.country] && (
                          <span className="hidden md:inline text-amber-500/80">
                            Affects: {CURRENCY_AFFECTED_ASSETS[event.country].slice(0, 3).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Forecast / Previous / Actual Figures & Action */}
                    <div className="flex items-center justify-between sm:justify-end space-x-4 shrink-0 text-xs font-mono">
                      {event.actual !== undefined && (
                        <div className="text-right">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Actual</div>
                          <div className="font-bold text-emerald-400">{event.actual || '—'}</div>
                        </div>
                      )}
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Forecast</div>
                        <div className="theme-text-primary font-bold">{event.forecast || '—'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Previous</div>
                        <div className="theme-text-secondary">{event.previous || '—'}</div>
                      </div>

                      <ChevronRight
                        size={16}
                        className="theme-text-secondary group-hover:text-amber-400 group-hover:translate-x-0.5 transition hidden sm:block"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Event Details Drawer/Modal */}
      {activeModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[var(--bg-subpanel)] border-b border-[var(--border-color)] flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="text-2xl p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                  {CURRENCY_FLAGS[activeModalEvent.country]?.flag || '🌐'}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-black text-sm text-amber-500">
                      {activeModalEvent.country}
                    </span>
                    {renderImpactBadge(activeModalEvent.impact)}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold theme-text-primary mt-1">
                    {activeModalEvent.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveModalEvent(null)}
                className="p-1 rounded-lg theme-text-secondary hover:theme-text-primary hover:bg-[var(--bg-card)] transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              {/* Release Time & Relative Countdown */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[var(--bg-subpanel)] border border-[var(--border-color)]">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center">
                    <Clock size={12} className="mr-1" />
                    Scheduled Time
                  </div>
                  <div className="text-sm font-bold theme-text-primary font-mono mt-0.5">
                    {new Date(activeModalEvent.date).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZoneName: 'short',
                    })}
                  </div>
                  <div className="text-[11px] theme-text-secondary mt-0.5">
                    {new Date(activeModalEvent.date).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center">
                    <Sparkles size={12} className="mr-1 text-amber-500" />
                    Status / Countdown
                  </div>
                  <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">
                    {formatEventCountdown(activeModalEvent.date).label}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Forex Factory Release</div>
                </div>
              </div>

              {/* Forecast / Previous Data */}
              <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-[var(--bg-subpanel)] border border-[var(--border-color)]">
                <div className="p-2 rounded bg-[var(--bg-card)] border border-[var(--border-color)]">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Previous</div>
                  <div className="text-sm font-bold theme-text-primary font-mono mt-1">
                    {activeModalEvent.previous || '—'}
                  </div>
                </div>
                <div className="p-2 rounded bg-[var(--bg-card)] border border-[var(--border-color)]">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Forecast</div>
                  <div className="text-sm font-bold text-amber-400 font-mono mt-1">
                    {activeModalEvent.forecast || '—'}
                  </div>
                </div>
                <div className="p-2 rounded bg-[var(--bg-card)] border border-[var(--border-color)]">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Actual</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono mt-1">
                    {activeModalEvent.actual || 'Pending'}
                  </div>
                </div>
              </div>

              {/* Affected Pairs */}
              {CURRENCY_AFFECTED_ASSETS[activeModalEvent.country] && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider theme-text-secondary flex items-center">
                    <TrendingUp size={13} className="mr-1 text-amber-500" />
                    High Volatility Affected Pairs:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {CURRENCY_AFFECTED_ASSETS[activeModalEvent.country].map(pair => (
                      <span
                        key={pair}
                        className="px-2.5 py-1 rounded bg-[var(--bg-subpanel)] border border-[var(--border-color)] font-mono font-bold text-amber-400 text-[11px]"
                      >
                        {pair}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Trading Rule Advisory */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300/90 space-y-1">
                <div className="font-bold flex items-center space-x-1.5 text-amber-400">
                  <ShieldAlert size={14} />
                  <span>Execution Risk Checklist</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {activeModalEvent.impact === 'High'
                    ? 'High volatility expected. Consider pausing new limit orders 15 minutes before and after this event to prevent slippage on spread widening.'
                    : 'Standard volatility expected. Maintain normal risk management and stop-loss positioning.'}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[var(--bg-subpanel)] border-t border-[var(--border-color)] flex items-center justify-between">
              <a
                href="https://www.forexfactory.com/calendar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold transition"
              >
                <span>Open on ForexFactory.com</span>
                <ExternalLink size={14} />
              </a>

              <button
                onClick={() => setActiveModalEvent(null)}
                className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-600 transition cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
