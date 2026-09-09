import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Flame,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ShieldAlert,
  Info,
  X,
  Sparkles,
} from 'lucide-react';
import {
  ForexFactoryEvent,
  CURRENCY_FLAGS,
  CURRENCY_AFFECTED_ASSETS,
  formatEventCountdown,
  ImpactLevel,
} from '../../services/forexFactoryService';

interface ForexFactoryCalendarProps {
  events: ForexFactoryEvent[];
  isDarkMode?: boolean;
}

export const ForexFactoryCalendar: React.FC<ForexFactoryCalendarProps> = ({ events }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImpact, setSelectedImpact] = useState<'ALL' | ImpactLevel>('ALL');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('ALL');
  const [selectedDay, setSelectedDay] = useState<'ALL' | 'TODAY' | 'TOMORROW'>('ALL');
  const [activeModalEvent, setActiveModalEvent] = useState<ForexFactoryEvent | null>(null);

  // Available currencies from current events
  const currencies = useMemo(() => {
    const list = Array.from(new Set(events.map(e => e.country))).filter(Boolean);
    return ['ALL', ...list];
  }, [events]);

  const todayStr = new Date().toDateString();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toDateString();

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      // Day filter
      if (selectedDay === 'TODAY') {
        if (new Date(e.date).toDateString() !== todayStr) return false;
      } else if (selectedDay === 'TOMORROW') {
        if (new Date(e.date).toDateString() !== tomorrowStr) return false;
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
  }, [events, selectedDay, selectedImpact, selectedCurrency, searchQuery, todayStr, tomorrowStr]);

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
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5" />
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
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium text-slate-400 bg-slate-500/10">
            Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
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
              placeholder="Search event (e.g. CPI, Powell, Rate Decision, NFP)..."
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

          {/* Day Range Filter */}
          <div className="flex items-center space-x-1.5 bg-[var(--bg-subpanel)] p-1 rounded-lg border border-[var(--border-color)] self-start md:self-auto">
            <button
              onClick={() => setSelectedDay('ALL')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                selectedDay === 'ALL'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'theme-text-secondary hover:theme-text-primary'
              }`}
            >
              All Week
            </button>
            <button
              onClick={() => setSelectedDay('TODAY')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                selectedDay === 'TODAY'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'theme-text-secondary hover:theme-text-primary'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setSelectedDay('TOMORROW')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                selectedDay === 'TOMORROW'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'theme-text-secondary hover:theme-text-primary'
              }`}
            >
              Tomorrow
            </button>
          </div>
        </div>

        {/* Impact Filter Chips & Currency Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--border-color)]">
          {/* Impact buttons */}
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
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500'
                  : 'bg-[var(--bg-subpanel)] border-[var(--border-color)] text-amber-400/80 hover:text-amber-400'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setSelectedImpact('Low')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition border ${
                selectedImpact === 'Low'
                  ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500'
                  : 'bg-[var(--bg-subpanel)] border-[var(--border-color)] text-yellow-400/80 hover:text-yellow-400'
              }`}
            >
              Low
            </button>
          </div>

          {/* Currency Scrollable Bar */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 max-w-full">
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
      </div>

      {/* Events Results List */}
      {groupedEvents.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto text-amber-500">
            <Info size={24} />
          </div>
          <div className="text-sm font-bold theme-text-primary">No Economic Events Found</div>
          <p className="text-xs theme-text-secondary max-w-md mx-auto">
            No events match your current filter selection. Try selecting "All Week" or resetting
            impact filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedImpact('ALL');
              setSelectedCurrency('ALL');
              setSelectedDay('ALL');
            }}
            className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-600 transition"
          >
            Reset All Filters
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
                        <span>Forex Factory Feed</span>
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
                className="p-1 rounded-lg theme-text-secondary hover:theme-text-primary hover:bg-[var(--bg-card)] transition"
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
                  <div className="text-[11px] text-slate-400 mt-0.5">Live Forex Factory Track</div>
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
                className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-600 transition"
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
