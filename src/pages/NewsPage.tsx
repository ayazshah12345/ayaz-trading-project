import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Flame,
  Clock,
  ExternalLink,
  RefreshCw,
  Newspaper,
  AlertOctagon,
  TrendingUp,
  MessageSquare,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { useTradingWorkspace } from '../hooks/useTradingWorkspace';
import {
  ForexFactoryEvent,
  fetchForexFactoryEvents,
  computeForexFactorySummary,
  formatEventCountdown,
  CURRENCY_FLAGS,
} from '../services/forexFactoryService';
import { ForexFactoryCalendar } from '../components/news/ForexFactoryCalendar';
import { LoadingState } from '../components/common/LoadingState';

interface NewsPageProps {
  workspace: ReturnType<typeof useTradingWorkspace>;
}

export const NewsPage: React.FC<NewsPageProps> = ({ workspace }) => {
  const [events, setEvents] = useState<ForexFactoryEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [source, setSource] = useState<'live' | 'proxy' | 'fallback'>('live');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetchForexFactoryEvents();
      setEvents(res.events);
      setSource(res.source);
      setLastUpdated(res.lastUpdated);
    } catch (err) {
      console.error('Failed to load Forex Factory events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const summary = computeForexFactorySummary(events);

  const officialShortcuts = [
    {
      title: 'Forex Factory Calendar',
      desc: 'Official economic release calendar & forecasts',
      url: 'https://www.forexfactory.com/calendar',
      icon: Calendar,
      tag: 'Time Calendar',
    },
    {
      title: 'Forex Factory News',
      desc: 'Breaking global macro headlines & central banks',
      url: 'https://www.forexfactory.com/news',
      icon: Newspaper,
      tag: 'Daily News',
    },
    {
      title: 'Live Market Trades',
      desc: 'Real-time trader positioning & live execution sentiment',
      url: 'https://www.forexfactory.com/trades',
      icon: TrendingUp,
      tag: 'Live Sentiment',
    },
    {
      title: 'Trader Forums',
      desc: 'Trading strategy discussions & community market analysis',
      url: 'https://www.forexfactory.com/forum',
      icon: MessageSquare,
      tag: 'Discussion',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold theme-text-primary flex items-center space-x-2">
              <Newspaper className="text-amber-500" />
              <span>Forex Factory News & Economic Calendar</span>
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40">
              Live Feed
            </span>
          </div>
          <p className="text-xs theme-text-secondary mt-1 font-medium">
            Forex Factory economic news time calendars, high-impact volatility releases, and monthly market intelligence.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={loadEvents}
            disabled={isLoading}
            className="px-3 py-2 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] theme-text-secondary hover:theme-text-primary hover:border-amber-500/50 transition text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
            title="Refresh news and calendar feed"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin text-amber-500' : ''} />
            <span className="hidden sm:inline">Refresh Feed</span>
          </button>

          <a
            href="https://www.forexfactory.com/calendar"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Open ForexFactory.com</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* High Volatility Event Alert Banner (if imminent within 2 hours) */}
      {summary.nextHighImpactEvent &&
        formatEventCountdown(summary.nextHighImpactEvent.date).isImminent && (
          <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-rose-950/40 via-rose-900/20 to-amber-950/30 border border-rose-500/50 text-rose-300 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400">
                <AlertOctagon size={20} />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-rose-400">
                  High Volatility News Alert
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {CURRENCY_FLAGS[summary.nextHighImpactEvent.country]?.flag}{' '}
                  {summary.nextHighImpactEvent.country} — {summary.nextHighImpactEvent.title}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 self-end sm:self-auto">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Releases In</div>
                <div className="text-sm font-mono font-black text-rose-400">
                  {formatEventCountdown(summary.nextHighImpactEvent.date).label}
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Events */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold theme-text-secondary">
            <span>Weekly Releases</span>
            <Calendar size={16} className="text-blue-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black theme-text-primary font-mono-numeric mt-1.5">
            {summary.totalEvents}
          </div>
          <div className="text-[11px] theme-text-secondary mt-1 font-mono-numeric flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Sync: {source.toUpperCase()}</span>
          </div>
        </div>

        {/* High Impact */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-rose-400">
            <span>High Impact</span>
            <Flame size={16} className="text-rose-500 animate-pulse" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-400 font-mono-numeric mt-1.5">
            {summary.highImpactCount}
          </div>
          <div className="text-[11px] text-rose-300/80 mt-1 font-mono-numeric">
            Market Moving Releases
          </div>
        </div>

        {/* Today's Events */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold theme-text-secondary">
            <span>Today's Events</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black theme-text-primary font-mono-numeric mt-1.5">
            {summary.todayCount}
          </div>
          <div className="text-[11px] theme-text-secondary mt-1 font-mono-numeric">
            Scheduled for today
          </div>
        </div>

        {/* Next High Impact */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold theme-text-secondary">
            <span>Next High Impact</span>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          {summary.nextHighImpactEvent ? (
            <>
              <div className="text-sm font-bold text-amber-400 truncate mt-1.5">
                {summary.nextHighImpactEvent.country} {summary.nextHighImpactEvent.title}
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                {formatEventCountdown(summary.nextHighImpactEvent.date).label}
              </div>
            </>
          ) : (
            <>
              <div className="text-sm font-bold theme-text-primary mt-1.5">None Upcoming</div>
              <div className="text-[11px] theme-text-secondary mt-0.5">Clear calendar window</div>
            </>
          )}
        </div>
      </div>

      {/* Official Forex Factory Quick Launch Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {officialShortcuts.map(item => {
          const Icon = item.icon;
          return (
            <a
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-amber-500/50 hover:bg-[var(--bg-card-hover)] transition flex flex-col justify-between group shadow-xs cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-[var(--bg-subpanel)] text-amber-400 border border-[var(--border-color)]">
                    <Icon size={16} />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                    {item.tag}
                  </span>
                </div>
                <h4 className="text-xs font-bold theme-text-primary group-hover:text-amber-400 transition">
                  {item.title}
                </h4>
                <p className="text-[11px] theme-text-secondary mt-1 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-2 border-t border-[var(--border-color)]/60 text-[11px]">
                <span className="text-amber-400 font-bold inline-flex items-center space-x-1">
                  <span>Open Official</span>
                  <ExternalLink size={12} />
                </span>
                <span className="font-mono text-[10px] theme-text-secondary">ForexFactory.com</span>
              </div>
            </a>
          );
        })}
      </div>

      {/* Main Forex Factory Calendar & Month News */}
      {isLoading && events.length === 0 ? (
        <div className="py-20 flex justify-center">
          <LoadingState message="Connecting to Forex Factory Live Feed..." />
        </div>
      ) : (
        <ForexFactoryCalendar events={events} isDarkMode={workspace.isDarkMode} />
      )}

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] theme-text-secondary border-t border-[var(--border-color)]">
        <div>
          Economic data synchronized from{' '}
          <strong className="theme-text-primary">Forex Factory / Fair Economy CDN</strong>. All
          times converted to your local system clock.
        </div>
        {lastUpdated && <div className="font-mono">Last refreshed: {lastUpdated}</div>}
      </div>
    </div>
  );
};
