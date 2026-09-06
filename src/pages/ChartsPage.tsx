import React from 'react';
import { ChartContainer } from '../components/charts/ChartContainer';
import { useTradingWorkspace } from '../hooks/useTradingWorkspace';
import { BarChart2, Maximize2 } from 'lucide-react';

interface ChartsPageProps {
  workspace: ReturnType<typeof useTradingWorkspace>;
}

export const ChartsPage: React.FC<ChartsPageProps> = ({ workspace }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold theme-text-primary flex items-center space-x-2">
            <BarChart2 className="text-amber-500" />
            <span>Charts Workspace</span>
          </h1>
          <p className="text-xs theme-text-secondary mt-1 font-medium">
            Live interactive TradingView charting workspace with drawing tools, timeframes, and full screen mode.
          </p>
        </div>
      </div>

      <ChartContainer
        markets={workspace.markets}
        initialSymbol="XAUUSD"
        onToggleFavorite={workspace.toggleFavoriteMarket}
        isDarkMode={workspace.isDarkMode}
      />
    </div>
  );
};
