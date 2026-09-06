import { useState, useEffect } from 'react';
import {
  mockMarkets,
  mockAccountPerformance,
  mockTrades,
  mockDailyJournals,
  mockDailyJournal,
  mockBacktestCampaigns,
  mockCalendarRecords,
  mockActivityTimeline,
  mockUserSettings
} from '../data/mockData';
import {
  fetchLiveMetalsTickers,
  fetchLiveCryptoTickers,
  fetchLiveForexTickers,
} from '../services/liveMarketService';
import type {
  MarketAsset,
  TradeRecord,
  DailyJournalEntry,
  BacktestCampaign,
  BacktestRecord,
  CalendarDayRecord,
  ActivityTimelineItem,
  UserSettings
} from '../types';


import { supabaseDatabaseService } from '../services/supabaseDatabaseService';
import { isSupabaseConfigured } from '../lib/supabase';

export function useTradingWorkspace() {
  const [markets, setMarkets] = useState<MarketAsset[]>(mockMarkets);
  const [trades, setTrades] = useState<TradeRecord[]>(mockTrades);
  const [journals, setJournals] = useState<DailyJournalEntry[]>(mockDailyJournals);
  const [journal, setJournal] = useState<DailyJournalEntry>(mockDailyJournal);
  const [initialCapital, setInitialCapitalState] = useState<number>(100.0);
  const [backtests, setBacktests] = useState<BacktestCampaign[]>(mockBacktestCampaigns);
  const [calendarRecords] = useState<CalendarDayRecord[]>(mockCalendarRecords);
  const [activityTimeline, setActivityTimeline] = useState<ActivityTimelineItem[]>(mockActivityTimeline);
  const [userSettings, setUserSettings] = useState<UserSettings>(mockUserSettings);
  const [accountSummary] = useState(mockAccountPerformance);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Load database data from Supabase on startup if configured
  useEffect(() => {
    if (isSupabaseConfigured) {
      supabaseDatabaseService.fetchTrades().then(fetchedTrades => {
        if (fetchedTrades && fetchedTrades.length > 0) {
          setTrades(fetchedTrades);
        }
      });
      supabaseDatabaseService.fetchInitialCapital().then(cap => {
        if (cap !== null && cap > 0) {
          setInitialCapitalState(cap);
        }
      });
    }
  }, []);

  const setInitialCapital = (amount: number) => {
    setInitialCapitalState(amount);
    if (isSupabaseConfigured) {
      supabaseDatabaseService.updateInitialCapital(amount);
    }
  };

  // Dynamic Capital auto-calculation from trade journal P&L
  const totalTradeNetPnl = trades.reduce((acc, t) => acc + (t.pnl || 0), 0);
  const currentCapital = Number((initialCapital + totalTradeNetPnl).toFixed(2));

  // Apply theme attribute to root HTML tag whenever isDarkMode changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const login = (email: string) => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Poll live market tickers periodically (Metals + Crypto + Forex APIs)
  useEffect(() => {
    let isMounted = true;

    const updateLivePrices = async () => {
      try {
        const [metalsMap, cryptoMap, forexMap] = await Promise.all([
          fetchLiveMetalsTickers(),
          fetchLiveCryptoTickers(),
          fetchLiveForexTickers(),
        ]);

        if (!isMounted) return;

        const liveMap = { ...metalsMap, ...cryptoMap, ...forexMap };

        setMarkets(prevMarkets =>
          prevMarkets.map(m => {
            if (liveMap[m.symbol]) {
              const live = liveMap[m.symbol];
              return {
                ...m,
                price: live.price,
                change24h: live.change24h,
                high24h: live.high24h,
                low24h: live.low24h,
                volume24h: live.volume24h,
                prevClose: live.prevClose || m.prevClose,
                sparkline: [...m.sparkline.slice(1), live.price],
              };
            }
            return m;
          })
        );
      } catch (err) {
        console.warn('Live price polling error:', err);
      }
    };

    updateLivePrices();
    const interval = setInterval(updateLivePrices, 8000); // Poll every 8s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const toggleFavoriteMarket = (symbol: string) => {
    setMarkets(prev =>
      prev.map(m => (m.symbol === symbol ? { ...m, isFavorite: !m.isFavorite } : m))
    );
  };

  const addTrade = (newTrade: Omit<TradeRecord, 'id'>) => {
    const generatedId = `TRD-${1090 + trades.length + 1}`;
    const trade: TradeRecord = {
      ...newTrade,
      id: generatedId,
    };
    setTrades(prev => [trade, ...prev]);

    if (isSupabaseConfigured) {
      supabaseDatabaseService.insertTrade(trade);
    }

    const newActivity: ActivityTimelineItem = {
      id: `ACT-${Date.now()}`,
      date: newTrade.date,
      time: newTrade.time || '12:00',
      type: 'TRADE',
      title: `Trade Logged: ${newTrade.asset} ${newTrade.direction}`,
      description: `Entry: ${newTrade.entryPrice} | Result: ${newTrade.result} (${newTrade.rMultiple > 0 ? '+' : ''}${newTrade.rMultiple}R)`,
      asset: newTrade.asset,
      link: '/trades',
    };
    setActivityTimeline(prev => [newActivity, ...prev]);
  };

  const deleteTrade = (tradeId: string) => {
    setTrades(prev => prev.filter(t => t.id !== tradeId));
    if (isSupabaseConfigured) {
      supabaseDatabaseService.deleteTrade(tradeId);
    }
  };

  const deleteAllTrades = () => {
    setTrades([]);
    if (isSupabaseConfigured) {
      supabaseDatabaseService.deleteAllTrades();
    }
  };

  const saveDailyJournal = (updatedEntry: DailyJournalEntry) => {
    setJournal(updatedEntry);
    setJournals(prev => {
      const exists = prev.some(j => j.id === updatedEntry.id || j.date === updatedEntry.date);
      if (exists) {
        return prev.map(j => (j.id === updatedEntry.id || j.date === updatedEntry.date ? updatedEntry : j));
      }
      return [updatedEntry, ...prev];
    });

    const newActivity: ActivityTimelineItem = {
      id: `ACT-${Date.now()}`,
      date: updatedEntry.date,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'JOURNAL',
      title: 'Daily Journal Updated',
      description: `${updatedEntry.asset} ${updatedEntry.bias} Bias analysis logged.`,
      asset: updatedEntry.asset,
      link: '/journal',
    };
    setActivityTimeline(prev => [newActivity, ...prev]);
  };

  const deleteDailyJournal = (journalId: string) => {
    setJournals(prev => prev.filter(j => j.id !== journalId));
  };

  const addBacktest = (newBacktest: Omit<BacktestCampaign, 'id' | 'createdDate'>) => {
    const generatedId = `BT-${newBacktest.asset.substring(0, 3)}-${String(backtests.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    const campaign: BacktestCampaign = {
      ...newBacktest,
      id: generatedId,
      createdDate: today,
    };
    setBacktests(prev => [campaign, ...prev]);

    const newActivity: ActivityTimelineItem = {
      id: `ACT-${Date.now()}`,
      date: today,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'BACKTEST',
      title: `Backtest Created: ${campaign.title}`,
      description: `Strategy: ${campaign.strategy} on ${campaign.asset} (${campaign.winRate}% Win Rate)`,
      asset: campaign.asset,
      link: '/backtesting',
    };
    setActivityTimeline(prev => [newActivity, ...prev]);
  };

  const addBacktestRecord = (campaignId: string, newRecord: Omit<BacktestRecord, 'id'>) => {
    const generatedId = `BTR-${Date.now().toString().slice(-4)}`;
    const record: BacktestRecord = {
      ...newRecord,
      id: generatedId,
    };

    setBacktests(prev =>
      prev.map(c => {
        if (c.id === campaignId) {
          const updatedRecords = [record, ...(c.records || [])];
          const totalTrades = updatedRecords.length;
          const winningTrades = updatedRecords.filter(r => r.result === 'WIN').length;
          const losingTrades = updatedRecords.filter(r => r.result === 'LOSS').length;
          const winRate = totalTrades ? Number(((winningTrades / totalTrades) * 100).toFixed(1)) : 0;
          const totalR = Number(updatedRecords.reduce((acc, r) => acc + r.riskRewardRatio, 0).toFixed(2));
          const totalProfit = Number(updatedRecords.reduce((acc, r) => acc + r.profitAmount, 0).toFixed(2));
          const winRs = updatedRecords.filter(r => r.result === 'WIN').map(r => r.riskRewardRatio);
          const lossRs = updatedRecords.filter(r => r.result === 'LOSS').map(r => Math.abs(r.riskRewardRatio));
          const avgWinR = winRs.length ? Number((winRs.reduce((a, b) => a + b, 0) / winRs.length).toFixed(2)) : 0;
          const avgLossR = lossRs.length ? Number((lossRs.reduce((a, b) => a + b, 0) / lossRs.length).toFixed(2)) : 0;
          const grossProfit = updatedRecords.filter(r => r.profitAmount > 0).reduce((a, b) => a + b.profitAmount, 0);
          const grossLoss = Math.abs(updatedRecords.filter(r => r.profitAmount < 0).reduce((a, b) => a + b.profitAmount, 0));
          const profitFactor = grossLoss > 0 ? Number((grossProfit / grossLoss).toFixed(2)) : grossProfit > 0 ? 9.99 : 0;

          return {
            ...c,
            totalTrades,
            winningTrades,
            losingTrades,
            winRate,
            totalR,
            totalProfit,
            avgWinR,
            avgLossR,
            profitFactor,
            records: updatedRecords,
          };
        }
        return c;
      })
    );

    const today = new Date().toISOString().split('T')[0];
    const newActivity: ActivityTimelineItem = {
      id: `ACT-${Date.now()}`,
      date: today,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'BACKTEST',
      title: `Backtest Trade Added: ${newRecord.asset} ${newRecord.direction}`,
      description: `Entry: ${newRecord.openPrice} | Exit: ${newRecord.closePrice} | P&L: $${newRecord.profitAmount} (${newRecord.riskRewardRatio > 0 ? '+' : ''}${newRecord.riskRewardRatio}R)`,
      asset: newRecord.asset,
      link: '/backtesting',
    };
    setActivityTimeline(prev => [newActivity, ...prev]);
  };

  const updateSettings = (newSettings: UserSettings) => {
    setUserSettings(newSettings);
  };

  return {
    markets,
    trades,
    journals,
    journal,
    initialCapital,
    currentCapital,
    setInitialCapital,
    backtests,
    calendarRecords,
    activityTimeline,
    userSettings,
    accountSummary,
    isDarkMode,
    isAuthenticated,
    login,
    logout,
    toggleDarkMode,
    toggleFavoriteMarket,
    addTrade,
    deleteTrade,
    deleteAllTrades,
    saveDailyJournal,
    deleteDailyJournal,
    addBacktest,
    addBacktestRecord,
    updateSettings,
  };
}

