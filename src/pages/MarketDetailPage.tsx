import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTradingWorkspace } from '../hooks/useTradingWorkspace';
import { ChartContainer } from '../components/charts/ChartContainer';
import { TradeTable } from '../components/trades/TradeTable';
import { ArrowLeft, Star } from 'lucide-react';
import { NotFoundPage } from './NotFoundPage';

import type { MarketAsset, TradeRecord } from '../types';

interface MarketDetailPageProps {
  workspace: ReturnType<typeof useTradingWorkspace>;
}

export const MarketDetailPage: React.FC<MarketDetailPageProps> = ({ workspace }) => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();

  const targetSymbol = (symbol || 'XAUUSD').toUpperCase();
  const market = workspace.markets.find((m: MarketAsset) => m.symbol === targetSymbol);

  if (!market) {
    return <NotFoundPage message={`Market asset "${symbol}" not found.`} />;
  }

  const marketTrades = workspace.trades.filter((t: TradeRecord) => t.asset === targetSymbol);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#2a2e39] pb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/markets')}
            className="p-2 bg-[#131722] hover:bg-[#1e222d] text-slate-300 rounded border border-[#2a2e39] transition"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold font-mono-numeric text-slate-100">{market.symbol}</h1>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold uppercase">
                {market.category}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{market.name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 font-mono-numeric">
          <div className="text-right">
            <div className="text-xl font-bold text-slate-100">${market.price}</div>
            <div className={market.change24h >= 0 ? 'text-emerald-400 text-xs font-bold' : 'text-rose-400 text-xs font-bold'}>
              {market.change24h >= 0 ? '+' : ''}{market.change24h}% (24h)
            </div>
          </div>

          <button
            onClick={() => workspace.toggleFavoriteMarket(market.symbol)}
            className="p-2 rounded border border-[#2a2e39] hover:bg-[#131722] transition"
          >
            <Star size={18} fill={market.isFavorite ? '#f59e0b' : 'none'} className={market.isFavorite ? 'text-amber-400' : 'text-slate-400'} />
          </button>
        </div>
      </div>

      {/* Chart Workspace Container */}
      <ChartContainer
        markets={workspace.markets}
        initialSymbol={market.symbol}
        onToggleFavorite={workspace.toggleFavoriteMarket}
        isDarkMode={workspace.isDarkMode}
      />

      {/* Symbol Trade History */}
      <div>
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          Recorded Trades for {market.symbol} ({marketTrades.length})
        </h3>
        {marketTrades.length > 0 ? (
          <TradeTable trades={marketTrades} onSelectTrade={() => {}} />
        ) : (
          <div className="terminal-card p-6 text-center text-xs text-slate-400">
            No trades logged for {market.symbol} yet. Use the Trade Journal to add trades.
          </div>
        )}
      </div>
    </div>
  );
};
