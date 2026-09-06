import React, { useState } from 'react';
import { Sidebar } from '../components/shell/Sidebar';
import { Header } from '../components/shell/Header';
import { GlobalSearchModal } from '../components/shell/GlobalSearchModal';
import { FinancialDisclaimer } from '../components/common/FinancialDisclaimer';
import { useTradingWorkspace } from '../hooks/useTradingWorkspace';

interface MainLayoutProps {
  children: React.ReactNode;
  workspaceState: ReturnType<typeof useTradingWorkspace>;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, workspaceState }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans antialiased transition-colors duration-200">
      {/* Desktop & Mobile Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        userSettings={workspaceState.userSettings}
        userEmail={workspaceState.userEmail}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Right Content Container */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ml-0 ${
          collapsed ? 'md:ml-16' : 'md:ml-64'
        }`}
      >
        {/* Header */}
        <Header
          onOpenSearch={() => setSearchModalOpen(true)}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          userSettings={workspaceState.userSettings}
          isDarkMode={workspaceState.isDarkMode}
          onToggleDarkMode={workspaceState.toggleDarkMode}
          onLogout={workspaceState.logout}
          userEmail={workspaceState.userEmail}
        />

        {/* Page Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] w-full mx-auto overflow-x-hidden">
          {children}
        </main>

        {/* Subtle Financial Disclaimer Footer */}
        <FinancialDisclaimer />
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        markets={workspaceState.markets}
        trades={workspaceState.trades}
        journal={workspaceState.journal}
        backtests={workspaceState.backtests}
      />
    </div>
  );
};
