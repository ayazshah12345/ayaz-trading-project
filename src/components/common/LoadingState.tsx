import React from 'react';

export const LoadingState: React.FC<{ message?: string }> = ({
  message = 'Loading workspace data...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-400 space-y-3">
      <div className="w-8 h-8 border-2 border-[#2962ff] border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs font-mono-numeric tracking-wider uppercase text-slate-400">{message}</span>
    </div>
  );
};
