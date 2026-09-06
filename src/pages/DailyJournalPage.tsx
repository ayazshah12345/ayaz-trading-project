import React, { useState } from 'react';
import { DailyJournalEditor } from '../components/journal/DailyJournalEditor';
import { JournalHistoryView } from '../components/journal/JournalHistoryView';
import { useTradingWorkspace } from '../hooks/useTradingWorkspace';
import type { DailyJournalEntry } from '../types';
import { Edit3, BookOpen } from 'lucide-react';

interface DailyJournalPageProps {
  workspace: ReturnType<typeof useTradingWorkspace>;
}

export const DailyJournalPage: React.FC<DailyJournalPageProps> = ({ workspace }) => {
  const [activeTab, setActiveTab] = useState<'EDITOR' | 'HISTORY'>('EDITOR');
  const [journalToEdit, setJournalToEdit] = useState<DailyJournalEntry>(workspace.journal);

  const handleSelectToEdit = (entry: DailyJournalEntry) => {
    setJournalToEdit(entry);
    setActiveTab('EDITOR');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <h1 className="text-xl font-bold theme-text-primary flex items-center space-x-2">
            <BookOpen className="text-amber-500" size={22} />
            <span>Daily Market Journal & Pre-Market Playbook</span>
          </h1>
          <p className="text-xs theme-text-secondary mt-1">
            Log higher timeframe biases, market liquidity, pre-market trading plans, and review historical journal entries.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[var(--bg-subpanel)] p-1 rounded-lg border border-[var(--border-color)]">
          <button
            onClick={() => setActiveTab('EDITOR')}
            className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-md transition ${
              activeTab === 'EDITOR'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                : 'theme-text-secondary hover:theme-text-primary hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            <Edit3 size={14} />
            <span>Journal Editor / Form</span>
          </button>

          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-md transition ${
              activeTab === 'HISTORY'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                : 'theme-text-secondary hover:theme-text-primary hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            <BookOpen size={14} />
            <span>View All Saved Journals ({workspace.journals?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* Main Content View Switcher */}
      {activeTab === 'EDITOR' ? (
        <DailyJournalEditor
          initialJournal={journalToEdit}
          onSave={updated => {
            workspace.saveDailyJournal(updated);
            setJournalToEdit(updated);
          }}
        />
      ) : (
        <JournalHistoryView
          journals={workspace.journals || []}
          onSelectJournalToEdit={handleSelectToEdit}
          onDeleteJournal={workspace.deleteDailyJournal}
        />
      )}
    </div>
  );
};
