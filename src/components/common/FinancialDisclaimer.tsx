import React from 'react';
import { AlertCircle } from 'lucide-react';

export const FinancialDisclaimer: React.FC = () => {
  return (
    <footer className="mt-auto py-4 px-6 border-t border-[var(--border-color)] bg-[var(--bg-subpanel)] theme-text-secondary text-[11px] leading-relaxed flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center space-x-2">
        <AlertCircle size={14} className="text-amber-500 shrink-0" />
        <span className="font-medium">
          Trading involves substantial risk. Trading Aura is intended for personal record-keeping, analysis and educational purposes only and does not constitute financial advice.
        </span>
      </div>
      <div className="font-mono-numeric text-[10px] theme-text-muted font-bold">
        TRADING AURA v1.0.0 • Founder: Syed Ayaz Shah
      </div>
    </footer>
  );
};

