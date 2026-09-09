import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Flame,
  Clock,
  ExternalLink,
  RefreshCw,
  Newspaper,
  Globe,
  BarChart2,
  AlertOctagon,
  TrendingUp,
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
import { TradingViewNewsWidget } from '../components/news/TradingViewNewsWidget';
import { TradingViewCalendarWidget } from '../components/news/TradingViewCalendarWidget';
import { ForexFactoryWebPortal } from '../components/news/ForexFactoryWebPortal';
import { LoadingState } from '../components/common/LoadingState';

interface NewsPageProps {
  workspace: ReturnType<typeof useTradingWorkspace>;
}

export const NewsPage: React.FC<NewsPageProps> = ({ workspace }) => {
  const [events, setEvents] = useState<ForexFactoryEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [source, setSource] = useState<'live' | 'proxy' | 'fallback'>('live');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [activeTab, setActiveTab] = useState<
    'forexfactory' | 'daily_news' | 'portal' | 'tv_calendar'
  >('forexfactory');

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
  const theme = workspace.isDarkMode ? 'dark' : 'light';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold theme-text-primary flex items-center space-x-2">
              <Newspaper className="text-amber-500" />
              <span>Market News & Forex Factory Calendar</span>
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40">
              Live Feed
            </span>
          </div>
          <p className="text-xs theme-text-secondary mt-1 font-medium">
            Forex Factory economic news time calendars, high-impact volatility alerts, and daily market
            intelligence.
          </p>
        </div>

        {/* Action Buttons */}
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

      {/* High Volatility Event Banner (if imminent within 2 hours) */}
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
              <button
                onClick={() => setActiveTab('forexfactory')}
                className="px-3 py-1.5 rounded-lg bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition"
              >
                Inspect Event
              </button>
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

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 border-b border-[var(--border-color)] overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('forexfactory')}
          className={`px-3.5 py-2 rounded-t-lg text-xs font-black transition flex items-center space-x-2 shrink-0 border-b-2 cursor-pointer ${
            activeTab === 'forexfactory'
              ? 'border-amber-500 text-amber-500 bg-amber-500/10'
              : 'border-transparent theme-text-secondary hover:theme-text-primary hover:bg-[var(--bg-subpanel)]'
          }`}
        >
          <Calendar size={14} />
          <span>Forex Factory Calendar & All Month News</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-400 font-mono">
            LIVE
          </span>
        </button>

        <button
          onClick={() => setActiveTab('daily_news')}
          className={`px-3.5 py-2 rounded-t-lg text-xs font-black transition flex items-center space-x-2 shrink-0 border-b-2 cursor-pointer ${
            activeTab === 'daily_news'
              ? 'border-amber-500 text-amber-500 bg-amber-500/10'
              : 'border-transparent theme-text-secondary hover:theme-text-primary hover:bg-[var(--bg-subpanel)]'
          }`}
        >
          <Newspaper size={14} />
          <span>Market Daily News Feed</span>
        </button>

        <button
          onClick={() => setActiveTab('portal')}
          className={`px-3.5 py-2 rounded-t-lg text-xs font-black transition flex items-center space-x-2 shrink-0 border-b-2 cursor-pointer ${
            activeTab === 'portal'
              ? 'border-amber-500 text-amber-500 bg-amber-500/10'
              : 'border-transparent theme-text-secondary hover:theme-text-primary hover:bg-[var(--bg-subpanel)]'
          }`}
        >
          <Globe size={14} />
          <span>Forex Factory Official Portal</span>
        </button>

        <button
          onClick={() => setActiveTab('tv_calendar')}
          className={`px-3.5 py-2 rounded-t-lg text-xs font-black transition flex items-center space-x-2 shrink-0 border-b-2 cursor-pointer ${
            activeTab === 'tv_calendar'
              ? 'border-amber-500 text-amber-500 bg-amber-500/10'
              : 'border-transparent theme-text-secondary hover:theme-text-primary hover:bg-[var(--bg-subpanel)]'
          }`}
        >
          <BarChart2 size={14} />
          <span>Macro Economic Events</span>
        </button>
      </div>

      {/* Tab Content Display */}
      {isLoading && events.length === 0 ? (
        <div className="py-20 flex justify-center">
          <LoadingState message="Connecting to Forex Factory Live Feed..." />
        </div>
      ) : (
        <div>
          {activeTab === 'forexfactory' && (
            <ForexFactoryCalendar events={events} isDarkMode={workspace.isDarkMode} />
          )}

          {activeTab === 'daily_news' && <TradingViewNewsWidget theme={theme} height={700} />}

          {activeTab === 'portal' && <ForexFactoryWebPortal />}

          {activeTab === 'tv_calendar' && (
            <TradingViewCalendarWidget theme={theme} height={700} />
          )}
        </div>
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
