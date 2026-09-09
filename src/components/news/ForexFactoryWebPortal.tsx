import React, { useState } from 'react';
import {
  ExternalLink,
  Globe,
  Calendar,
  Newspaper,
  TrendingUp,
  MessageSquare,
  Maximize2,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

export const ForexFactoryWebPortal: React.FC = () => {
  const [activeUrl, setActiveUrl] = useState<string>('https://www.forexfactory.com/news');
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  const portalShortcuts = [
    {
      title: 'Forex Factory News',
      desc: 'Breaking macro headlines, central bank speeches & market insights',
      url: 'https://www.forexfactory.com/news',
      icon: Newspaper,
      badge: 'Daily News',
    },
    {
      title: 'Forex Factory Calendar',
      desc: 'Official high-impact economic calendar, forecasts and historical records',
      url: 'https://www.forexfactory.com/calendar',
      icon: Calendar,
      badge: 'Time Calendar',
    },
    {
      title: 'Live Market Trades',
      desc: 'Real-time positioning & live trade feeds from thousands of verified traders',
      url: 'https://www.forexfactory.com/trades',
      icon: TrendingUp,
      badge: 'Sentiment',
    },
    {
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

  const handleRefreshIframe = () => {
    setHasLoaded(false);
    setIframeKey(prev => prev + 1);
  };

  return (
    <div className="space-y-4">
      {/* Quick Launchpad Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {portalShortcuts.map(item => {
          const Icon = item.icon;
          const isActive = activeUrl === item.url;
          return (
            <div
              key={item.url}
              onClick={() => {
                setActiveUrl(item.url);
                setHasLoaded(false);
                setIframeKey(prev => prev + 1);
              }}
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
                <span className="font-mono font-bold text-amber-400">
                  {isActive ? 'Active View' : 'Select View'}
                </span>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleOpenExternal(item.url);
                  }}
                  className="p-1 rounded hover:bg-[var(--bg-subpanel)] text-slate-400 hover:text-white transition"
                  title="Open in new window"
                >
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded Portal Webview Bar */}
      <div className="rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-card)] shadow-md">
        {/* Browser-style Titlebar */}
        <div className="px-4 py-2.5 bg-[var(--bg-subpanel)] border-b border-[var(--border-color)] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Globe size={15} className="text-amber-500 shrink-0" />
            <span className="text-xs font-mono font-bold theme-text-primary truncate max-w-xs sm:max-w-md">
              {activeUrl}
            </span>
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck size={11} className="mr-1" />
              Secure Portal
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefreshIframe}
              className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] theme-text-secondary hover:theme-text-primary hover:border-amber-500/50 transition text-xs flex items-center space-x-1"
              title="Reload Frame"
            >
              <RefreshCw size={13} />
              <span className="hidden sm:inline">Reload</span>
            </button>
            <button
              onClick={() => handleOpenExternal(activeUrl)}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-600 transition flex items-center space-x-1.5 shadow-sm"
              title="Open full page directly on Forex Factory"
            >
              <Maximize2 size={13} />
              <span>Open in New Tab</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>

        {/* Security & Frame Policy Notice */}
        <div className="px-4 py-2 bg-slate-900/60 border-b border-[var(--border-color)] text-[11px] theme-text-secondary flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span>
            💡 <strong>Trader Note:</strong> Forex Factory web pages use Cloudflare security. For
            interactive charting and filters, you can use our built-in{' '}
            <strong className="text-amber-400">Forex Factory Calendar</strong> tab or click{' '}
            <strong className="text-white">"Open in New Tab"</strong> above.
          </span>
          <a
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 font-bold hover:underline shrink-0"
          >
            Direct Launch ↗
          </a>
        </div>

        {/* Iframe Frame Container */}
        <div className="relative w-full h-[650px] bg-[#0c1017]">
          {!hasLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-[var(--bg-card)]/90 backdrop-blur-xs space-y-3">
              <div className="w-10 h-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
              <div className="text-xs font-bold theme-text-primary">Loading Forex Factory Portal...</div>
              <p className="text-[11px] theme-text-secondary max-w-sm">
                Connecting to Forex Factory secure servers. If your browser blocks external iframe
                embedding, click "Open in New Tab" to launch instantly.
              </p>
              <button
                onClick={() => handleOpenExternal(activeUrl)}
                className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-600 transition"
              >
                Open Full Forex Factory ↗
              </button>
            </div>
          )}

          <iframe
            key={iframeKey}
            src={activeUrl}
            title="Forex Factory Web"
            onLoad={() => setHasLoaded(true)}
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </div>
    </div>
  );
};
