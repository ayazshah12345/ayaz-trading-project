import React from 'react';
import { LucideIcon, FileX } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = FileX,
}) => {
  return (
    <div className="terminal-card p-12 text-center flex flex-col items-center justify-center my-4">
      <div className="p-4 rounded-full bg-slate-800/60 text-slate-400 mb-4 border border-slate-700/50">
        <Icon size={32} />
      </div>
      <h4 className="text-base font-semibold text-slate-200 mb-1">{title}</h4>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-[#2962ff] hover:bg-[#1e4bd8] text-white text-xs font-semibold rounded shadow transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
