import React, { useState } from 'react';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { DayDetailModal } from '../components/calendar/DayDetailModal';
import { useTradingWorkspace } from '../hooks/useTradingWorkspace';
import type { CalendarDayRecord } from '../types';
import { Calendar as CalendarIcon } from 'lucide-react';

interface CalendarPageProps {
  workspace: ReturnType<typeof useTradingWorkspace>;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({ workspace }) => {
  const [selectedDayRecord, setSelectedDayRecord] = useState<CalendarDayRecord | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[var(--border-color)] pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold theme-text-primary flex items-center space-x-2">
          <CalendarIcon className="text-blue-600 dark:text-blue-400" />
          <span>Trading Calendar</span>
        </h1>
        <p className="text-xs theme-text-secondary mt-1 font-medium">
          Visual monthly breakdown of daily P&L, trade counts, and journal entry completion.
        </p>
      </div>

      {/* Calendar Grid */}
      <CalendarGrid
        trades={workspace.trades}
        journals={workspace.journals}
        mockRecords={workspace.calendarRecords}
        onSelectDate={setSelectedDayRecord}
      />

      {/* Day Inspector Modal */}
      <DayDetailModal
        record={selectedDayRecord}
        trades={workspace.trades}
        journals={workspace.journals}
        isOpen={!!selectedDayRecord}
        onClose={() => setSelectedDayRecord(null)}
      />
    </div>
  );
};
