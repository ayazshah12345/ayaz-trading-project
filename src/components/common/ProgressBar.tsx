import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  sublabel?: string;
  variant?: 'green' | 'amber' | 'red' | 'blue';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  sublabel,
  variant = 'green',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const barColors = {
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-rose-500',
    blue: 'bg-blue-500',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || sublabel) && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-mono-numeric">
          {label && <span className="theme-text-primary font-bold">{label}</span>}
          {sublabel && <span className="theme-text-secondary font-semibold font-mono-numeric">{sublabel}</span>}
        </div>
      )}
      <div className="w-full h-2 bg-[var(--bg-subpanel)] rounded-full overflow-hidden border border-[var(--border-color)]">
        <div
          className={`h-full ${barColors[variant]} transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
