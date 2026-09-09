import React, { useState } from 'react';
import {
  ExternalLink,
  Globe,
  Calendar,
  Newspaper,
  TrendingUp,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { TradingViewNewsWidget } from './TradingViewNewsWidget';

export const ForexFactoryWebPortal: React.FC = () => {
  const [activeShortcut, setActiveShortcut] = useState<string>('news');

  const portalShortcuts = [
    {
      id: 'news',
      title: 'Forex Factory News',
      desc: 'Breaking macro headlines, central bank speeches & market insights',
      url: 'https://www.forexfactory.com/news',
      icon: Newspaper,
      badge: 'Daily News',
    },
    {
      id: 'calendar',
      title: 'Forex Factory Calendar',
      desc: 'Official high-impact economic calendar, forecasts and historical records',
      url: 'https://www.forexfactory.com/calendar',
      icon: Calendar,
      badge: 'Time Calendar',
    },
    {
      id: 'trades',
      title: 'Live Market Trades',
      desc: 'Real-time positioning & live trade feeds from verified traders',
      url: 'https://www.forexfactory.com/trades',
      icon: TrendingUp,
      badge: 'Sentiment',
    },
    {
      id: 'forum',
      title: 'Trader Forums',
      desc: 'Discussion threads on trading strategies, setups and market bias',
      url: 'https://www.forexfactory.com/forum',
      icon: MessageSquare,
      badge: 'Community',
    },
  ];

  const handleOpenExternal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const selectedItem = portalShortcuts.find(s => s.id === activeShortcut) || portalShortcuts[0];

  return (
    <div className="space-y-4">
      {/* Quick Launchpad Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {portalShortcuts.map(item => {
          const Icon = item.icon;
          const isActive = activeShortcut === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setActiveShortcut(item.id)}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-amber-500/10 border-amber-500 shadow-sm'
                  : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-amber-500/50 hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-[var(--bg-subpanel)] text-amber-400 border border-[var(--border-color)]">
                    <Icon size={16} />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                    {item.badge}
                  </span>
                </div>
                <h4 className="text-xs font-bold theme-text-primary">{item.title}</h4>
                <p className="text-[11px] theme-text-secondary mt-1 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-2 border-t border-[var(--border-color)]/60 text-[11px]">
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    handleOpenExternal(item.url);
                  }}
                  className="inline-flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-bold"
                >
                  <span>Launch Official</span>
                  <ExternalLink size={12} />
                </button>
                <span className="font-mono text-[10px] theme-text-secondary">Direct Link</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Official Forex Factory Quick-Launch Hero Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900/90 to-amber-950/40 border border-amber-500/50 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-amber-500 text-slate-950 font-black shrink-0 shadow-lg">
            <Zap size={22} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 font-mono">
                OFFICIAL PORTAL
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck size={10} className="mr-1" />
                Verified Link
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
              Open {selectedItem.title} on ForexFactory.com
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              Launch the official Forex Factory portal in an isolated, high-speed tab with full access to
              breaking economic events, live forum sentiment, and original calendar tables.
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenExternal(selectedItem.url)}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-lg transition flex items-center space-x-2 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <span>Launch {selectedItem.badge} Now</span>
          <ExternalLink size={15} />
        </button>
      </div>

      {/* Embedded Live Market News Feed (Clean & 100% Connected, No Frame Rejection) */}
      <div className="rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-card)] shadow-md">
        <div className="px-4 py-2.5 bg-[var(--bg-subpanel)] border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe size={15} className="text-amber-500" />
            <span className="text-xs font-mono font-bold theme-text-primary">
              Live Financial Market Feed & Breaking News
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
              ● Connected
            </span>
          </div>
          <span className="text-[11px] theme-text-secondary">Real-time Stream</span>
        </div>

        <div className="p-3">
          <TradingViewNewsWidget height={600} theme="dark" />
        </div>
      </div>
    </div>
  );
};
