import React, { useMemo, useState } from 'react';
import { TradingTimeframe } from '../../types';

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CandlestickChartProps {
  symbol: string;
  timeframe: TradingTimeframe;
  currentPrice: number;
  showGrid?: boolean;
  showVolume?: boolean;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  symbol,
  timeframe,
  currentPrice,
  showGrid = true,
  showVolume = true,
}) => {
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);

  // Generate realistic candles relative to currentPrice
  const candles: Candle[] = useMemo(() => {
    const list: Candle[] = [];
    const count = 36;
    let base = currentPrice * 0.96;
    const isCrypto = symbol.includes('BTC') || symbol.includes('ETH');
    const stepVolatility = isCrypto ? currentPrice * 0.008 : currentPrice * 0.0025;

    const times = [
      '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45',
      '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45',
      '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45',
      '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45',
      '16:00', '16:15', '16:30', '16:45',
    ];

    for (let i = 0; i < count; i++) {
      const open = base;
      const delta = (Math.sin(i * 0.4) + (Math.random() - 0.48)) * stepVolatility;
      const close = i === count - 1 ? currentPrice : open + delta;
      const high = Math.max(open, close) + Math.random() * stepVolatility * 0.8;
      const low = Math.min(open, close) - Math.random() * stepVolatility * 0.8;
      const volume = Math.floor(Math.random() * 1200 + 400);

      list.push({
        time: times[i] || `${i}:00`,
        open,
        high,
        low,
        close,
        volume,
      });

      base = close;
    }
    return list;
  }, [symbol, timeframe, currentPrice]);

  const activeCandle = hoveredCandle || candles[candles.length - 1];

  // Calculations for chart geometry
  const allHighs = candles.map(c => c.high);
  const allLows = candles.map(c => c.low);
  const maxPrice = Math.max(...allHighs);
  const minPrice = Math.min(...allLows);
  const priceRange = maxPrice - minPrice || 1;

  const maxVolume = Math.max(...candles.map(c => c.volume));

  const chartHeight = 380;
  const candleAreaHeight = 300;
  const volumeAreaHeight = 70;

  const getY = (price: number) => {
    return candleAreaHeight - ((price - minPrice) / priceRange) * (candleAreaHeight - 20) - 10;
  };

  const getVolY = (vol: number) => {
    return chartHeight - (vol / maxVolume) * volumeAreaHeight;
  };

  // Price grid ticks
  const priceTicks = [
    maxPrice,
    maxPrice - priceRange * 0.25,
    maxPrice - priceRange * 0.5,
    maxPrice - priceRange * 0.75,
    minPrice,
  ];

  return (
    <div className="relative w-full bg-[#131722] border border-[#2a2e39] rounded-md overflow-hidden p-4 select-none">
      {/* Top Candle OHLC Header */}
      <div className="flex items-center justify-between mb-3 text-xs font-mono-numeric border-b border-[#2a2e39] pb-2 flex-wrap gap-2">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-slate-100 text-sm">{symbol}</span>
          <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 text-[11px]">
            {timeframe}
          </span>
          <span className="text-slate-400">Time: <span className="text-slate-200">{activeCandle.time}</span></span>
        </div>
        <div className="flex items-center space-x-3">
          <span>O: <span className="text-slate-200">{activeCandle.open.toFixed(2)}</span></span>
          <span>H: <span className="text-emerald-400">{activeCandle.high.toFixed(2)}</span></span>
          <span>L: <span className="text-rose-400">{activeCandle.low.toFixed(2)}</span></span>
          <span>C: <span className={activeCandle.close >= activeCandle.open ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
            {activeCandle.close.toFixed(2)}
          </span></span>
          <span>Vol: <span className="text-indigo-300">{activeCandle.volume}</span></span>
        </div>
      </div>

      {/* SVG Canvas Candlestick Engine */}
      <div className="relative w-full h-[380px]">
        <svg
          viewBox={`0 0 800 ${chartHeight}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {showGrid && (
            <g stroke="#2a2e39" strokeWidth="0.5" strokeDasharray="3 3">
              {priceTicks.map((price, i) => (
                <line key={i} x1="0" y1={getY(price)} x2="740" y2={getY(price)} />
              ))}
            </g>
          )}

          {/* Volume Bars */}
          {showVolume &&
            candles.map((c, i) => {
              const x = (i / candles.length) * 730 + 10;
              const isBull = c.close >= c.open;
              const volY = getVolY(c.volume);
              const volHeight = chartHeight - volY;
              return (
                <rect
                  key={`vol-${i}`}
                  x={x - 4}
                  y={volY}
                  width="8"
                  height={volHeight}
                  fill={isBull ? '#00e676' : '#ff5252'}
                  opacity="0.22"
                />
              );
            })}

          {/* Candlestick Wicks & Bodies */}
          {candles.map((c, i) => {
            const x = (i / candles.length) * 730 + 10;
            const isBull = c.close >= c.open;
            const openY = getY(c.open);
            const closeY = getY(c.close);
            const highY = getY(c.high);
            const lowY = getY(c.low);
            const bodyY = Math.min(openY, closeY);
            const bodyHeight = Math.max(2, Math.abs(closeY - openY));
            const color = isBull ? '#00e676' : '#ff5252';

            return (
              <g
                key={`candle-${i}`}
                onMouseEnter={() => setHoveredCandle(c)}
                onMouseLeave={() => setHoveredCandle(null)}
                className="cursor-crosshair group"
              >
                {/* Wick line */}
                <line
                  x1={x}
                  y1={highY}
                  x2={x}
                  y2={lowY}
                  stroke={color}
                  strokeWidth="1.2"
                />
                {/* Body rect */}
                <rect
                  x={x - 4}
                  y={bodyY}
                  width="8"
                  height={bodyHeight}
                  fill={color}
                  rx="1"
                />
              </g>
            );
          })}

          {/* Y-Axis Price Label Sidebar */}
          <g transform="translate(740, 0)">
            <rect x="0" y="0" width="60" height={chartHeight} fill="#0b0e14" />
            <line x1="0" y1="0" x2="0" y2={chartHeight} stroke="#2a2e39" strokeWidth="1" />
            {priceTicks.map((price, i) => (
              <text
                key={i}
                x="6"
                y={getY(price) + 4}
                fill="#94a3b8"
                fontSize="10"
                fontFamily="JetBrains Mono"
              >
                {price >= 1000 ? price.toFixed(1) : price.toFixed(2)}
              </text>
            ))}
          </g>
        </svg>
      </div>

      {/* TradingView Phase 2 Badge Notice */}
      <div className="mt-2 pt-2 border-t border-[#2a2e39] flex items-center justify-between text-[11px] text-slate-400 font-mono-numeric">
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span>Chart Container: Interactive Canvas Mode</span>
        </span>
        <span className="text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
          TradingView Widget Integration Ready (Phase 2)
        </span>
      </div>
    </div>
  );
};
