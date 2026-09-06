import React from 'react';
import { Modal } from '../common/Modal';
import type { TradeRecord } from '../../types';
import { formatRMultiple } from '../../utils/formatters';

interface TradeDetailModalProps {
  trade: TradeRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TradeDetailModal: React.FC<TradeDetailModalProps> = ({ trade, isOpen, onClose }) => {
  if (!trade) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Trade Record: ${trade.id}`}
      subtitle={`${trade.asset} ${trade.direction} on ${trade.date} (${trade.session} Session)`}
      maxWidth="2xl"
    >
      <div className="space-y-5 text-xs font-mono-numeric">
        {/* Top Summary Banner */}
        <div className="p-4 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-[11px] theme-text-secondary uppercase font-extrabold">Outcome</div>
            <div className="flex items-center space-x-2 mt-0.5 font-extrabold text-sm">
              <span
                className={`px-2 py-0.5 rounded-md ${
                  trade.result === 'WIN'
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                }`}
              >
                {trade.result}
              </span>
              <span className={trade.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
                {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <div className="text-[11px] theme-text-secondary uppercase font-extrabold">R-Multiple</div>
            <div className={`text-base font-extrabold ${trade.rMultiple >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {formatRMultiple(trade.rMultiple)}
            </div>
          </div>

          <div>
            <div className="text-[11px] theme-text-secondary uppercase font-extrabold">Strategy</div>
            <div className="theme-text-primary font-extrabold font-sans">{trade.strategy}</div>
          </div>
        </div>

        {/* Execution Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[var(--bg-subpanel)] p-4 rounded-lg border border-[var(--border-color)]">
          <div>
            <span className="theme-text-secondary text-[10px] uppercase font-extrabold block">Entry Price</span>
            <span className="theme-text-primary font-extrabold text-sm">${trade.entryPrice}</span>
          </div>
          <div>
            <span className="text-rose-500 text-[10px] uppercase font-extrabold block">Stop Loss</span>
            <span className="text-rose-500 font-extrabold text-sm">${trade.stopLoss}</span>
          </div>
          <div>
            <span className="text-emerald-500 text-[10px] uppercase font-extrabold block">Take Profit</span>
            <span className="text-emerald-500 font-extrabold text-sm">${trade.takeProfit}</span>
          </div>
          <div>
            <span className="theme-text-secondary text-[10px] uppercase font-extrabold block">Exit Price</span>
            <span className="theme-text-primary font-extrabold text-sm">${trade.exitPrice}</span>
          </div>
        </div>

        {/* Rationale & Notes */}
        {trade.tradeReason && (
          <div className="space-y-1">
            <h5 className="text-[11px] font-extrabold theme-text-primary uppercase">Trade Reason</h5>
            <p className="p-3.5 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] theme-text-primary font-sans leading-relaxed font-medium">
              {trade.tradeReason}
            </p>
          </div>
        )}

        {trade.marketContext && (
          <div className="space-y-1">
            <h5 className="text-[11px] font-extrabold theme-text-primary uppercase">Market Context</h5>
            <p className="p-3.5 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] theme-text-primary font-sans leading-relaxed font-medium">
              {trade.marketContext}
            </p>
          </div>
        )}

        {trade.lessonLearned && (
          <div className="space-y-1">
            <h5 className="text-[11px] font-extrabold theme-text-primary uppercase">Lessons Learned</h5>
            <p className="p-3.5 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] theme-text-primary font-sans leading-relaxed font-medium">
              {trade.lessonLearned}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

