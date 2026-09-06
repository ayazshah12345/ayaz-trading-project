import React, { useState } from 'react';
import { MarketTable } from '../components/markets/MarketTable';
import { MarketCard } from '../components/markets/MarketCard';
import { FilterBar } from '../components/common/FilterBar';
import { useTradingWorkspace } from '../hooks/useTradingWorkspace';
import { Search, LayoutGrid, List, BarChart2 } from 'lucide-react';
import type { MarketCategory, MarketAsset } from '../types';

interface MarketsPageProps {
  workspace: ReturnType<typeof useTradingWorkspace>;
}

export const MarketsPage: React.FC<MarketsPageProps> = ({ workspace }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');

  const categories = [
    { id: 'ALL' as MarketCategory, label: 'All Markets', count: workspace.markets.length },
    { id: 'FOREX' as MarketCategory, label: 'Forex' },
    { id: 'METALS' as MarketCategory, label: 'Metals' },
    { id: 'CRYPTO' as MarketCategory, label: 'Crypto' },
    { id: 'INDICES' as MarketCategory, label: 'Indices' },
  ];

  const filteredMarkets = workspace.markets.filter((m: MarketAsset) => {
    if (activeCategory !== 'ALL' && m.category !== activeCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return m.symbol.toLowerCase().includes(q) || m.name.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold theme-text-primary flex items-center space-x-2">
            <BarChart2 className="text-purple-500" />
            <span>Market Assets Overview</span>
          </h1>
          <p className="text-xs theme-text-secondary mt-1">
            Real-time multi-asset market prices, volume metrics, and asset tracking.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* View mode toggle */}
          <div className="flex items-center p-1 bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition ${
                viewMode === 'grid' ? 'bg-purple-600 text-white' : 'theme-text-secondary hover:theme-text-primary'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition ${
                viewMode === 'table' ? 'bg-purple-600 text-white' : 'theme-text-secondary hover:theme-text-primary'
              }`}
              title="Table View"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <FilterBar options={categories} activeId={activeCategory} onSelect={setActiveCategory} />

        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-secondary" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search symbol or asset name..."
            className="w-full pl-9 pr-3 py-1.5 bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded text-xs theme-text-primary placeholder:theme-text-muted outline-none focus:border-purple-500 font-sans"
          />
        </div>
      </div>

      {/* Content */}
      {viewMode === 'table' ? (
        <MarketTable markets={filteredMarkets} onToggleFavorite={workspace.toggleFavoriteMarket} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredMarkets.map((m: MarketAsset) => (
            <MarketCard key={m.symbol} market={m} onToggleFavorite={workspace.toggleFavoriteMarket} />
          ))}
        </div>
      )}
    </div>
  );
};

