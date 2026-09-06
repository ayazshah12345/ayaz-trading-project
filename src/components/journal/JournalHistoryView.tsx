import React, { useState } from 'react';
import type { DailyJournalEntry } from '../../types';
import { Search, Calendar, Image as ImageIcon, Star, Eye, Trash2, Edit3, Filter } from 'lucide-react';
import { JournalDetailModal } from './JournalDetailModal';

interface JournalHistoryViewProps {
  journals: DailyJournalEntry[];
  onSelectJournalToEdit: (journal: DailyJournalEntry) => void;
  onDeleteJournal: (id: string) => void;
}

export const JournalHistoryView: React.FC<JournalHistoryViewProps> = ({
  journals,
  onSelectJournalToEdit,
  onDeleteJournal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBias, setSelectedBias] = useState<string>('ALL');
  const [inspectJournal, setInspectJournal] = useState<DailyJournalEntry | null>(null);

  const filteredJournals = journals.filter(j => {
    const matchesSearch =
      j.date.includes(searchQuery) ||
      j.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.tradingPlan && j.tradingPlan.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (j.lessonsLearned && j.lessonsLearned.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBias = selectedBias === 'ALL' || j.bias === selectedBias;

    return matchesSearch && matchesBias;
  });

  const getBiasBadge = (bias: string) => {
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
    <div className="space-y-6">
      {/* Filter and Search Bar */}
      <div className="terminal-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search journals by date, asset (e.g. XAUUSD), plan, or keywords..."
              className="w-full pl-9 pr-4 py-2 bg-[var(--bg-subpanel)] border border-[var(--border-color)] rounded-lg text-xs theme-text-primary placeholder:theme-text-muted outline-none focus:border-purple-500 transition"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Filter size={14} className="theme-text-secondary" />
          <span className="text-xs font-semibold theme-text-secondary">Bias Filter:</span>
          <select
            value={selectedBias}
            onChange={e => setSelectedBias(e.target.value)}
            className="px-3 py-1.5 bg-[var(--bg-subpanel)] border border-[var(--border-color)] theme-text-primary rounded-lg text-xs outline-none focus:border-purple-500 transition font-medium"
          >
            <option value="ALL">All Biases</option>
            <option value="Bullish">Bullish 📈</option>
            <option value="Bearish">Bearish 📉</option>
            <option value="Neutral">Neutral ⚖️</option>
          </select>
        </div>
      </div>

      {/* Journal Cards List */}
      {filteredJournals.length === 0 ? (
        <div className="terminal-card p-12 text-center space-y-3">
          <Calendar size={36} className="mx-auto text-purple-400 opacity-40" />
          <h4 className="text-base font-bold theme-text-primary">No Journal Entries Found</h4>
          <p className="text-xs theme-text-secondary max-w-sm mx-auto">
            No daily journals matched your current search filter. Save new daily journals to track your trading plans.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJournals.map(entry => (
            <div
              key={entry.id}
              className="terminal-card p-5 space-y-4 flex flex-col justify-between hover:border-purple-500/50 transition group"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-mono-numeric">
                    <span className="p-1.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-500 font-bold text-xs">
                      {entry.date}
                    </span>
                    <span className="font-extrabold text-sm theme-text-primary">{entry.asset}</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getBiasBadge(entry.bias)}`}>
                    {entry.bias}
                  </span>
                </div>

                {/* Ratings & Screenshot count */}
                <div className="flex items-center justify-between text-[11px] theme-text-secondary pt-1 border-t border-[var(--border-color)]">
                  <div className="flex items-center space-x-1">
                    <span>Mood:</span>
                    <div className="flex text-amber-400">
                      {Array.from({ length: entry.moodRating }).map((_, i) => (
                        <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {entry.screenshots && entry.screenshots.length > 0 && (
                    <div className="flex items-center space-x-1 text-purple-400 font-semibold">
                      <ImageIcon size={12} />
                      <span>{entry.screenshots.length} Chart Pics</span>
                    </div>
                  )}
                </div>

                {/* Snippet Plan */}
                <p className="theme-text-secondary text-xs line-clamp-3 font-sans leading-relaxed bg-[var(--bg-subpanel)] p-2.5 rounded border border-[var(--border-color)]">
                  {entry.tradingPlan || entry.htfAnalysis || 'Daily journal entry recorded.'}
                </p>
              </div>

                {/* Action Buttons Footer */}
                <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setInspectJournal(entry)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-extrabold rounded-lg border border-amber-500/30 text-xs transition"
                  >
                    <Eye size={13} />
                    <span>View Journal</span>
                  </button>

                  <button
                    onClick={() => onSelectJournalToEdit(entry)}
                    className="p-1.5 text-amber-500 hover:text-amber-400 hover:bg-[var(--bg-card-hover)] rounded-lg transition"
                    title="Edit Journal"
                  >
                    <Edit3 size={15} />
                  </button>

                <button
                  onClick={() => onDeleteJournal(entry.id)}
                  className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition"
                  title="Delete Journal"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspect Journal Detail Modal */}
      {inspectJournal && (
        <JournalDetailModal
          isOpen={!!inspectJournal}
          onClose={() => setInspectJournal(null)}
          journal={inspectJournal}
          onEdit={journalToEdit => {
            onSelectJournalToEdit(journalToEdit);
            setInspectJournal(null);
          }}
        />
      )}
    </div>
  );
};
