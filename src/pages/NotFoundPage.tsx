import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

export const NotFoundPage: React.FC<{ message?: string }> = ({
  message = 'The requested route or trading terminal resource could not be found.',
}) => {
  const navigate = useNavigate();

  return (
    <div className="terminal-card p-12 text-center flex flex-col items-center justify-center my-8 space-y-4 max-w-lg mx-auto">
      <div className="p-4 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
        <ShieldAlert size={40} />
      </div>
      <h2 className="text-xl font-bold text-slate-100 font-mono-numeric">404 — Route Not Found</h2>
      <p className="text-xs text-slate-400 max-w-sm">{message}</p>
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center space-x-2 px-4 py-2 bg-[#2962ff] hover:bg-[#1e4bd8] text-white text-xs font-bold rounded shadow transition mt-4"
      >
        <Home size={15} />
        <span>Return to Dashboard</span>
      </button>
    </div>
  );
};
