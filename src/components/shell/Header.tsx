import React, { useState, useEffect } from 'react';
import { Search, Bell, Clock, Menu, Calendar as CalendarIcon, CheckCircle2, Sun, Moon, LogOut, User } from 'lucide-react';
import type { UserSettings } from '../../types';

interface HeaderProps {
  onOpenSearch: () => void;
  onToggleMobileSidebar: () => void;
  userSettings: UserSettings;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout?: () => void;
  userEmail?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onToggleMobileSidebar,
  userSettings,
  isDarkMode,
  onToggleDarkMode,
  onLogout,
  userEmail,
}) => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const displayName = userEmail ? userEmail.split('@')[0] : 'Trader';
  const initialLetter = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateTime(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' EST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-[var(--bg-header)] backdrop-blur border-b border-[var(--border-color)] sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between transition-colors">
      {/* Mobile Menu Trigger & Search */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 theme-text-secondary hover:theme-text-primary hover:bg-[var(--bg-card-hover)] rounded md:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Global Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center space-x-3 px-3 py-1.5 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-md theme-text-secondary text-xs transition w-48 sm:w-64 md:w-80 shadow-sm"
        >
          <Search size={14} className="theme-text-secondary shrink-0" />
          <span className="truncate">Search markets, trades, journals...</span>
          <kbd className="hidden sm:inline-block ml-auto text-[10px] bg-[var(--bg-subpanel)] px-1.5 py-0.5 rounded border border-[var(--border-color)] theme-text-muted font-mono-numeric">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Header Right Items: Clock, Status, Theme Toggle, Notifications, User */}
      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
        {/* Date & Time */}
        <div className="hidden lg:flex items-center space-x-2 text-xs theme-text-secondary font-mono-numeric bg-[var(--bg-card)] px-3 py-1.5 rounded border border-[var(--border-color)] shadow-sm">
          <Clock size={13} className="text-blue-500" />
          <span>{currentDateTime}</span>
        </div>

        {/* Market Status Indicator */}
        <div className="hidden sm:flex items-center space-x-1.5 text-[11px] font-mono-numeric px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="uppercase tracking-wider">Markets Live</span>
        </div>

        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 theme-text-secondary hover:theme-text-primary hover:bg-[var(--bg-card-hover)] rounded transition flex items-center space-x-1 border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? (
            <Sun size={17} className="text-amber-400" />
          ) : (
            <Moon size={17} className="text-indigo-500" />
          )}
          <span className="text-[10px] font-mono-numeric font-bold hidden md:inline uppercase ml-1">
            {isDarkMode ? 'Dark' : 'Light'}
          </span>
        </button>

        {/* Notifications Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 theme-text-secondary hover:theme-text-primary hover:bg-[var(--bg-card-hover)] rounded transition border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm"
            title="Notifications"
          >
            <Bell size={17} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-md shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2 mb-3">
                <span className="text-xs font-semibold theme-text-primary uppercase tracking-wider">
                  Terminal Notifications
                </span>
                <span className="text-[10px] text-blue-500 font-mono-numeric font-bold">Live Sync Active</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-2 rounded bg-[var(--bg-subpanel)] border border-[var(--border-color)] flex items-start space-x-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="theme-text-primary font-semibold">Account Sync Active</div>
                    <div className="theme-text-secondary text-[11px]">Database connected strictly for {userEmail || 'current user'}.</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic User Profile Initials Badge & Logout */}
        <div className="flex items-center space-x-2 pl-2 border-l border-[var(--border-color)]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black text-xs shadow-md border border-amber-500/40">
            {initialLetter}
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold theme-text-primary truncate max-w-[140px]">{userEmail || displayName}</div>
            <div className="text-[10px] text-amber-500 font-mono-numeric font-semibold">Trader Account</div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 theme-text-secondary hover:text-rose-500 hover:bg-rose-500/10 rounded transition ml-1 cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
