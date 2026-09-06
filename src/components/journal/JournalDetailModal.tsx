import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { DailyJournalEntry } from '../../types';
import { Calendar, Target, Shield, BookOpen, Star, Sparkles, Image as ImageIcon, Edit3, X, ZoomIn } from 'lucide-react';

interface JournalDetailModalProps {
  journal: DailyJournalEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (journal: DailyJournalEntry) => void;
}

export const JournalDetailModal: React.FC<JournalDetailModalProps> = ({
  journal,
  isOpen,
  onClose,
  onEdit,
}) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (!journal) return null;

  const getBiasBadgeClass = (bias: string) => {
    switch (bias) {
      case 'Bullish':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
      case 'Bearish':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/30';
      default:
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Daily Journal: ${journal.date}`}
        subtitle={`Asset: ${journal.asset} • Bias: ${journal.bias}`}
        maxWidth="4xl"
      >
        <div className="space-y-6 text-xs font-sans">
          {/* Header Summary Bar */}
          <div className="p-4 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold flex items-center space-x-1 font-mono-numeric">
                <Calendar size={16} />
                <span>{journal.date}</span>
              </div>

              <div className="font-bold text-sm theme-text-primary">
                {journal.asset} Market Journal
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getBiasBadgeClass(journal.bias)}`}>
                Bias: {journal.bias}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span className="theme-text-secondary font-medium">Mood:</span>
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < journal.moodRating ? 'fill-amber-400 text-amber-400' : 'text-slate-400 opacity-30'}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <span className="theme-text-secondary font-medium">Discipline:</span>
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < journal.disciplineRating ? 'fill-amber-500 text-amber-500' : 'text-slate-400 opacity-30'}
                    />
                  ))}
                </div>
              </div>

              {onEdit && (
                <button
                  onClick={() => {
                    onEdit(journal);
                    onClose();
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-lg transition shadow-sm"
                >
                  <Edit3 size={14} />
                  <span>Edit Entry</span>
                </button>
              )}
            </div>
          </div>

          {/* Screenshot Gallery Section */}
          {journal.screenshots && journal.screenshots.length > 0 && (
            <div className="p-4 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-3">
              <div className="flex items-center space-x-2 font-bold theme-text-primary text-xs uppercase tracking-wider">
                <ImageIcon size={16} className="text-purple-500" />
                <span>Chart Screenshots & Markups ({journal.screenshots.length})</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {journal.screenshots.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className="relative group rounded-lg overflow-hidden border border-[var(--border-color)] bg-[var(--bg-card)] aspect-video cursor-pointer hover:border-purple-500 transition shadow-sm"
                  >
                    <img src={img} alt={`Chart Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-purple-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold text-xs space-x-1">
                      <ZoomIn size={16} />
                      <span>View Image</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pre-Market Plan Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-2">
              <div className="flex items-center space-x-2 font-bold text-purple-500 uppercase tracking-wider text-[11px]">
                <Target size={14} />
                <span>Higher Timeframe Analysis</span>
              </div>
              <p className="theme-text-primary leading-relaxed font-sans">
                {journal.htfAnalysis || 'No HTF analysis recorded.'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-2">
              <div className="flex items-center space-x-2 font-bold text-indigo-500 uppercase tracking-wider text-[11px]">
                <Shield size={14} />
                <span>Market Structure & Liquidity</span>
              </div>
              <p className="theme-text-primary leading-relaxed font-sans">
                {journal.marketStructure} {journal.liquidity}
              </p>
            </div>
          </div>

          {/* Key Levels & Trading Plan */}
          <div className="p-4 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-3">
            <div className="font-bold text-purple-500 uppercase tracking-wider text-[11px] flex items-center space-x-2">
              <BookOpen size={14} />
              <span>Key Levels & Trading Plan Execution</span>
            </div>
            {journal.keyLevels && (
              <div className="p-2.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] theme-text-primary font-mono-numeric">
                <strong className="text-purple-400">Levels: </strong> {journal.keyLevels}
              </div>
            )}
            <p className="theme-text-primary leading-relaxed bg-[var(--bg-card)] p-3 rounded border border-[var(--border-color)] whitespace-pre-wrap font-sans">
              {journal.tradingPlan || 'No formal plan detailed.'}
            </p>
          </div>

          {/* Post-Market Review */}
          <div className="p-4 rounded-lg bg-[var(--bg-subpanel)] border border-[var(--border-color)] space-y-3">
            <div className="font-bold text-amber-500 uppercase tracking-wider text-[11px] flex items-center space-x-2">
              <Sparkles size={14} />
              <span>Post-Market Review & Lessons</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-500">What Actually Happened</span>
                <p className="theme-text-primary font-sans">{journal.whatActuallyHappened || 'N/A'}</p>
              </div>

              <div className="p-3 rounded bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-500">Mistakes & Friction</span>
                <p className="theme-text-primary font-sans">{journal.mistakes || 'No mistakes logged.'}</p>
              </div>
            </div>

            {journal.lessonsLearned && (
              <div className="p-3 rounded bg-purple-500/10 border border-purple-500/30 theme-text-primary font-medium">
                <strong className="text-purple-400 uppercase text-[10px] block mb-1">Lesson Learned:</strong>
                {journal.lessonsLearned}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Lightbox Image Preview Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-4 right-4 p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full transition"
          >
            <X size={20} />
          </button>
          <img
            src={activeImage}
            alt="Enlarged Chart"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </>
  );
};
