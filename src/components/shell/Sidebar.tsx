import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart2,
  CandlestickChart as ChartIcon,
  BookOpen,
  BookMarked,
  FlaskConical,
  LineChart,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import type { UserSettings } from '../../types';
import logoImg from '../../assets/logo.jpg';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  userSettings: UserSettings;
  userEmail?: string | null;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  userSettings,
  userEmail,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const displayName = userEmail ? userEmail.split('@')[0] : 'Trader';
  const initialLetter = displayName.charAt(0).toUpperCase();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Markets', icon: BarChart2, path: '/markets' },
    { label: 'Charts', icon: ChartIcon, path: '/charts' },
    { label: 'Daily Journal', icon: BookOpen, path: '/journal' },
    { label: 'Trade Journal', icon: BookMarked, path: '/trades' },
    { label: 'Backtesting', icon: FlaskConical, path: '/backtesting' },
    { label: 'Analytics', icon: LineChart, path: '/analytics' },
    { label: 'Calendar', icon: Calendar, path: '/calendar' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const renderContent = (isMobile: boolean = false) => (
    <>
      {/* Brand Header */}
      <div>
        <div className="h-16 px-3 flex items-center justify-between border-b border-[var(--border-color)]">
          {(!collapsed || isMobile) ? (
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <img
                src={logoImg}
                alt="Ayaz Markets Analysis Logo"
                className="w-9 h-9 rounded-lg border border-amber-500/50 object-cover shadow-md shrink-0"
              />
              <div className="flex flex-col truncate">
                <span className="text-xs font-black tracking-wide theme-text-primary uppercase font-mono-numeric truncate">
                  AYAZ MARKETS
                </span>
                <span className="text-[9px] uppercase tracking-wider text-amber-500 font-bold truncate">
                  FX & Crypto Analysis
                </span>
              </div>
            </div>
          ) : (
            <img
              src={logoImg}
              alt="Ayaz Logo"
              className="w-8 h-8 mx-auto rounded-lg border border-amber-500/50 object-cover shadow-md"
            />
          )}

          {/* Desktop Toggle Button */}
          {!isMobile && (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded theme-text-secondary hover:theme-text-primary hover:bg-[var(--bg-card-hover)] transition hidden md:block shrink-0 cursor-pointer"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}

          {/* Mobile Back / Close Button (Near AYAZ MARKETS) */}
          {isMobile && onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition flex items-center space-x-1 shrink-0 cursor-pointer"
              title="Close Menu & Go Back to Page"
            >
              <ArrowLeft size={15} />
              <span>Back</span>
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-2 space-y-1 mt-2">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (isMobile && onCloseMobile) {
                    onCloseMobile();
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg text-xs font-bold transition group ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/20'
                      : 'theme-text-secondary hover:theme-text-primary hover:bg-[var(--bg-card-hover)]'
                  } ${collapsed && !isMobile ? 'justify-center' : 'space-x-3'}`
                }
                title={collapsed && !isMobile ? item.label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                {(!collapsed || isMobile) && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info / Status */}
      <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-subpanel)] space-y-3">
        {(!collapsed || isMobile) && (
          <div className="flex items-center justify-between text-[11px] theme-text-secondary px-1 font-mono-numeric">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold">Terminal Online</span>
            </span>
            <span className="flex items-center font-bold">
              <ShieldCheck size={13} className="mr-1 text-blue-600 dark:text-blue-400" />
              <span>Phase 1</span>
            </span>
          </div>
        )}

        <div
          className={`flex items-center ${
            collapsed && !isMobile ? 'justify-center' : 'space-x-3'
          } p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs`}
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black text-xs shrink-0 shadow-sm">
            {initialLetter}
          </div>
          {(!collapsed || isMobile) && (
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-bold theme-text-primary truncate">
                {userEmail || displayName}
              </div>
              <div className="text-[10px] theme-text-secondary truncate font-mono-numeric font-medium">
                Active Trader
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside
        className={`hidden md:flex fixed top-0 left-0 bottom-0 z-40 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] flex-col justify-between transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {renderContent(false)}
      </aside>

      {/* Mobile Drawer Backdrop & Mobile Sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Semi-transparent dark overlay */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Sliding Sidebar Drawer */}
          <aside className="relative z-50 w-72 max-w-[85vw] bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] flex flex-col justify-between shadow-2xl h-full font-sans animate-in slide-in-from-left duration-200">
            {renderContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};
