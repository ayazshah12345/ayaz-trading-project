import React, { useEffect, useRef } from 'react';
import type { TradingTimeframe } from '../../types';

interface TradingViewWidgetProps {
  symbol: string;
  timeframe?: TradingTimeframe;
  theme?: 'dark' | 'light';
  height?: number;
  showNativeSidebar?: boolean;
}

export const getTradingViewSymbol = (symbol: string): string => {
  const s = symbol.toUpperCase();
  switch (s) {
    case 'XAUUSD':
      return 'OANDA:XAUUSD';
    case 'BTCUSDT':
      return 'BINANCE:BTCUSDT';
    case 'ETHUSDT':
      return 'BINANCE:ETHUSDT';
    case 'EURUSD':
      return 'FX:EURUSD';
    case 'GBPUSD':
      return 'FX:GBPUSD';
    case 'USDJPY':
      return 'FX:USDJPY';
    case 'XAGUSD':
      return 'OANDA:XAGUSD';
    case 'NAS100':
      return 'CAPITALCOM:NAS100';
    case 'US30':
      return 'CAPITALCOM:US30';
    case 'SPX500':
      return 'CAPITALCOM:SPX500';
    default:
      return s;
  }
};

export const getTradingViewInterval = (tf: TradingTimeframe = '15m'): string => {
  switch (tf) {
    case '1m':
      return '1';
    case '5m':
      return '5';
    case '15m':
      return '15';
    case '30m':
      return '30';
    case '1H':
      return '60';
    case '4H':
      return '240';
    case '1D':
      return 'D';
    case '1W':
      return 'W';
    default:
      return '15';
  }
};

declare global {
  interface Window {
    TradingView?: any;
  }
}

export const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol,
  timeframe = '15m',
  theme = 'dark',
  height = 500,
  showNativeSidebar = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerId = useRef(`tradingview_${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;
    const tvSymbol = getTradingViewSymbol(symbol);
    const tvInterval = getTradingViewInterval(timeframe);

    const initWidget = () => {
      if (window.TradingView && containerRef.current) {
        containerRef.current.innerHTML = `<div id="${containerId.current}" style="height: 100%; width: 100%;"></div>`;
        new window.TradingView.widget({
          autosize: true,
          symbol: tvSymbol,
          interval: tvInterval,
          timezone: 'America/New_York',
          theme,
          style: '1', // Candlestick style
          locale: 'en',
          toolbar_bg: theme === 'light' ? '#ffffff' : '#0b0e14',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerId.current,
          hide_side_toolbar: false,
          details: showNativeSidebar,
          hotlist: showNativeSidebar,
          calendar: showNativeSidebar,
          studies: [],
          overrides: {
            'mainSeriesProperties.style': 1,
            'paneProperties.background': theme === 'light' ? '#ffffff' : '#0b0e14',
            'paneProperties.vertGridProperties.color': theme === 'light' ? '#f1f5f9' : '#1e293b',
            'paneProperties.horzGridProperties.color': theme === 'light' ? '#f1f5f9' : '#1e293b',
            'symbolWatermarkProperties.transparency': 90,
            'scalesProperties.textColor': theme === 'light' ? '#334155' : '#94a3b8',
          },
        });
      }
    };

    if (window.TradingView) {
      initWidget();
    } else {
      script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, timeframe, theme, height, showNativeSidebar]);

  return (
    <div className="w-full h-full bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-color)] relative" style={{ height: typeof height === 'number' ? `${height}px` : '100%' }}>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
