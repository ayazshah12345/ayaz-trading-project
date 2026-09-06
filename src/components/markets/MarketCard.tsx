import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { MarketAsset } from '../../types';
import { Sparkline } from '../charts/Sparkline';

interface MarketCardProps {
  market: MarketAsset;
  onToggleFavorite: (symbol: string) => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market, onToggleFavorite }) => {
  const navigate = useNavigate();
  const isPositive = market.change24h >= 0;

  return (
    <div
      onClick={() => navigate(`/markets/${market.symbol}`)}
      className="terminal-card p-4 flex flex-col justify-between hover:border-blue-500/50 cursor-pointer transition group shadow-sm"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold theme-text-primary text-base font-mono-numeric group-hover:text-blue-500 transition">
              {market.symbol}
            </span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-[var(--bg-subpanel)] theme-text-secondary border border-[var(--border-color)]">
              {market.category}
            </span>
          </div>
          <p className="text-xs theme-text-secondary font-medium truncate max-w-[170px] mt-0.5">{market.name}</p>
        </div>

        <button
          onClick={e => {
            e.stopPropagation();
            onToggleFavorite(market.symbol);
          }}
          className="theme-text-secondary hover:text-amber-500 transition p-1"
        >
          <Star
            size={16}
            fill={market.isFavorite ? '#f59e0b' : 'none'}
            className={market.isFavorite ? 'text-amber-500' : ''}
          />
        </button>
      </div>

      <div className="flex items-end justify-between mt-3 font-mono-numeric">
        <div>
          <div className="text-lg font-bold theme-text-primary">${market.price}</div>
          <div
            className={`inline-flex items-center space-x-0.5 text-xs font-bold ${
              isPositive ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>
              {isPositive ? '+' : ''}{market.change24h}%
            </span>
          </div>
        </div>

        <div className="pb-1">
          <Sparkline data={market.sparkline} isPositive={isPositive} width={75} height={28} />
        </div>
      </div>
    </div>
  );
};
