import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { MarketsPage } from '../pages/MarketsPage';
import { MarketDetailPage } from '../pages/MarketDetailPage';
import { ChartsPage } from '../pages/ChartsPage';
import { DailyJournalPage } from '../pages/DailyJournalPage';
import { TradeJournalPage } from '../pages/TradeJournalPage';
import { BacktestingPage } from '../pages/BacktestingPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { CalendarPage } from '../pages/CalendarPage';
import { SettingsPage } from '../pages/SettingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { useTradingWorkspace } from '../hooks/useTradingWorkspace';

interface AppRoutesProps {
  workspace: ReturnType<typeof useTradingWorkspace>;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({ workspace }) => {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<LoginPage onLogin={workspace.login} />} />

      {/* Main Workspace Routes wrapped in Layout */}
      <Route
        path="/*"
        element={
          workspace.isAuthenticated ? (
            <MainLayout workspaceState={workspace}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage workspace={workspace} />} />
                <Route path="/markets" element={<MarketsPage workspace={workspace} />} />
                <Route path="/markets/:symbol" element={<MarketDetailPage workspace={workspace} />} />
                <Route path="/charts" element={<ChartsPage workspace={workspace} />} />
                <Route path="/journal" element={<DailyJournalPage workspace={workspace} />} />
                <Route path="/trades" element={<TradeJournalPage workspace={workspace} />} />
                <Route path="/backtesting" element={<BacktestingPage workspace={workspace} />} />
                <Route path="/analytics" element={<AnalyticsPage workspace={workspace} />} />
                <Route path="/calendar" element={<CalendarPage workspace={workspace} />} />
                <Route path="/settings" element={<SettingsPage workspace={workspace} />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};
