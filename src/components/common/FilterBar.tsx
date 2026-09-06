import React from 'react';

export interface FilterOption<T extends string = string> {
  id: T;
  label: string;
  count?: number;
}

interface FilterBarProps<T extends string = string> {
  options: FilterOption<T>[];
  activeId: T;
  onSelect: (id: T) => void;
  className?: string;
}

export function FilterBar<T extends string = string>({
  options,
  activeId,
  onSelect,
  className = '',
}: FilterBarProps<T>) {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 p-1 bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-md ${className}`}>
      {options.map(opt => {
        const isActive = opt.id === activeId;
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition flex items-center space-x-1.5 ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'theme-text-secondary hover:theme-text-primary hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[var(--bg-card)] border border-[var(--border-color)] theme-text-secondary'
                }`}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
