import React, { useEffect, useRef } from 'react';

interface TradingViewNewsWidgetProps {
  theme?: 'dark' | 'light';
  height?: number | string;
}

export const TradingViewNewsWidget: React.FC<TradingViewNewsWidgetProps> = ({
  theme = 'dark',
  height = 680,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';
    containerRef.current.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      feedMode: 'all_symbols',
      isTransparent: false,
      displayMode: 'regular',
      width: '100%',
      height: '100%',
      colorTheme: theme,
      locale: 'en',
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [theme]);

  return (
    <div
      className="tradingview-widget-container w-full rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm"
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
