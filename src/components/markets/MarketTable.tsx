import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { MarketAsset } from '../../types';
import { Sparkline } from '../charts/Sparkline';

interface MarketTableProps {
  markets: MarketAsset[];
  onToggleFavorite: (symbol: string) => void;
}

export const MarketTable: React.FC<MarketTableProps> = ({ markets, onToggleFavorite }) => {
  const navigate = useNavigate();

  return (
    <div className="terminal-card overflow-x-auto shadow-sm">
      <table className="w-full text-left text-xs font-mono-numeric">
        <thead className="bg-[var(--bg-subpanel)] theme-text-secondary uppercase tracking-wider text-[11px] border-b border-[var(--border-color)] font-bold">
          <tr>
            <th className="p-3 w-10 text-center">Fav</th>
            <th className="p-3">Symbol</th>
            <th className="p-3">Price</th>
            <th className="p-3">24H Change</th>
            <th className="p-3">High</th>
            <th className="p-3">Low</th>
            <th className="p-3">Volume</th>
            <th className="p-3">Trend</th>
            <th className="p-3 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {markets.map(m => {
            const isPositive = m.change24h >= 0;
            return (
              <tr
                key={m.symbol}
                onClick={() => navigate(`/markets/${m.symbol}`)}
                className="hover:bg-[var(--bg-card-hover)] transition cursor-pointer group"
              >
                {/* Favorite Star */}
                <td className="p-3 text-center" onClick={e => { e.stopPropagation(); onToggleFavorite(m.symbol); }}>
                  <button className="theme-text-secondary hover:text-amber-500 transition">
                    <Star
                      size={15}
                      fill={m.isFavorite ? '#f59e0b' : 'none'}
                      className={m.isFavorite ? 'text-amber-500' : ''}
                    />
                  </button>
                </td>

                {/* Symbol & Name */}
                <td className="p-3">
                  <div className="font-bold theme-text-primary text-sm group-hover:text-blue-500 transition">
                    {m.symbol}
                  </div>
                  <div className="text-[10px] theme-text-secondary font-sans font-medium">{m.name}</div>
                </td>

                {/* Price */}
                <td className="p-3 font-bold theme-text-primary text-sm">
                  ${m.price >= 1000 ? m.price.toLocaleString('en-US') : m.price}
                </td>

                {/* 24H Change */}
                <td className="p-3">
                  <div
                    className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded font-bold text-xs ${
                      isPositive
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>
                      {isPositive ? '+' : ''}{m.change24h}%
                    </span>
                  </div>
                </td>

                {/* High / Low */}
                <td className="p-3 theme-text-secondary font-semibold">${m.high24h}</td>
                <td className="p-3 theme-text-secondary font-semibold">${m.low24h}</td>

                {/* Volume */}
                <td className="p-3 theme-text-secondary">{m.volume24h}</td>

                {/* Sparkline mini chart */}
                <td className="p-3">
                  <Sparkline data={m.sparkline} isPositive={isPositive} width={75} height={24} />
                </td>

                {/* Status Badge */}
                <td className="p-3 text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {m.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
