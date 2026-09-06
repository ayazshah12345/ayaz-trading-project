import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string | number;
  isPositive?: boolean;
  isNegative?: boolean;
  icon?: LucideIcon;
  badge?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  isPositive,
  isNegative,
  icon: Icon,
  badge,
  className = '',
}) => {
  return (
    <div className={`terminal-card p-4 flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="p-1.5 rounded bg-slate-800/80 text-slate-300">
            <Icon size={16} />
          </div>
        )}
        {badge && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-baseline space-x-2">
        <span className="text-xl sm:text-2xl font-bold font-mono-numeric text-slate-100">{value}</span>
        {change !== undefined && (
          <span
            className={`text-xs font-semibold font-mono-numeric ${
              isPositive
                ? 'text-emerald-400'
                : isNegative
                ? 'text-rose-400'
                : 'text-slate-400'
            }`}
          >
            {change}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
};
