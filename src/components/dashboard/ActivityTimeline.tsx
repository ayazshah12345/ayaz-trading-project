import React from 'react';
import { ActivityTimelineItem } from '../../types';
import { BookOpen, BookMarked, FlaskConical, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActivityTimelineProps {
  items: ActivityTimelineItem[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ items }) => {
  const navigate = useNavigate();

  const getIcon = (type: ActivityTimelineItem['type']) => {
    switch (type) {
      case 'JOURNAL':
        return <BookOpen size={14} className="text-emerald-500" />;
      case 'TRADE':
        return <BookMarked size={14} className="text-blue-500" />;
      case 'BACKTEST':
        return <FlaskConical size={14} className="text-amber-500" />;
      default:
        return <Clock size={14} className="theme-text-secondary" />;
    }
  };

  return (
    <div className="terminal-card p-5">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
        <h3 className="text-xs font-extrabold theme-text-primary uppercase tracking-wider">
          Daily Activity Timeline
        </h3>
        <span className="text-[11px] font-mono-numeric theme-text-secondary font-medium">
          Historical Audit Trail
        </span>
      </div>

      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border-color)]">
        {items.map(item => (
          <div key={item.id} className="relative group">
            {/* Timeline node icon */}
            <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center shadow-xs">
              {getIcon(item.type)}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
              <div>
                <span
                  className="font-bold theme-text-primary group-hover:text-blue-600 dark:group-hover:text-blue-400 transition cursor-pointer"
                  onClick={() => item.link && navigate(item.link)}
                >
                  {item.title}
                </span>
                <p className="theme-text-secondary text-xs mt-0.5 font-medium">{item.description}</p>
              </div>
              <div className="text-right font-mono-numeric text-[11px] theme-text-secondary mt-1 sm:mt-0 font-semibold">
                <span>{item.date}</span> at <span>{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

