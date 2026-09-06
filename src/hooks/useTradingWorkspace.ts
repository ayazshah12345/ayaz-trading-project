import { useState, useEffect } from 'react';
import {
  mockMarkets,
  mockAccountPerformance,
  mockCalendarRecords,
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
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AUTH_STORAGE_KEY_EMAIL = 'ayaz_markets_user_email';
const AUTH_STORAGE_KEY_UID = 'ayaz_markets_user_uid';

export function useTradingWorkspace() {
  const [markets, setMarkets] = useState<MarketAsset[]>(mockMarkets);
  const [trades, setTrades] = useState<TradeRecord[]>([]);
  const [journals, setJournals] = useState<DailyJournalEntry[]>([]);
  const [journal, setJournal] = useState<DailyJournalEntry>({
    id: `JRN-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    asset: 'XAUUSD',
    bias: 'Bullish',
    htfAnalysis: '',
    marketStructure: '',
    liquidity: '',
    keyLevels: '',
    sessionExpectations: '',
    tradingPlan: '',
    whatIExpected: '',
    whatActuallyHappened: '',
    mistakes: '',
    lessonsLearned: '',
    moodRating: 5,
    disciplineRating: 5,
    screenshots: [],
    updatedAt: new Date().toISOString(),
  });
  const [initialCapital, setInitialCapitalState] = useState<number>(100.0);
  const [backtests, setBacktests] = useState<BacktestCampaign[]>([]);
  const [calendarRecords] = useState<CalendarDayRecord[]>(mockCalendarRecords);
  const [activityTimeline, setActivityTimeline] = useState<ActivityTimelineItem[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings>(mockUserSettings);
  const [accountSummary] = useState(mockAccountPerformance);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Instant initial auth check from localStorage on refresh
  const storedEmail = localStorage.getItem(AUTH_STORAGE_KEY_EMAIL);
  const storedUid = localStorage.getItem(AUTH_STORAGE_KEY_UID);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(storedEmail && storedUid));
  const [userId, setUserId] = useState<string | null>(storedUid);
  const [userEmail, setUserEmail] = useState<string | null>(storedEmail);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Check Supabase Auth session on load
  useEffect(() => {
    let isSubscribed = true;

    if (isSupabaseConfigured && supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (!isSubscribed) return;
        if (data?.user) {
          setIsAuthenticated(true);
          setUserId(data.user.id);
          setUserEmail(data.user.email || '');
          localStorage.setItem(AUTH_STORAGE_KEY_EMAIL, data.user.email || '');
          localStorage.setItem(AUTH_STORAGE_KEY_UID, data.user.id);
        } else if (!storedUid) {
          setIsAuthenticated(false);
          setUserId(null);
          setUserEmail(null);
        }
        setIsAuthLoading(false);
      }).catch(() => {
        if (isSubscribed) setIsAuthLoading(false);
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!isSubscribed) return;
        if (session?.user) {
          setIsAuthenticated(true);
          setUserId(session.user.id);
          setUserEmail(session.user.email || '');
          localStorage.setItem(AUTH_STORAGE_KEY_EMAIL, session.user.email || '');
          localStorage.setItem(AUTH_STORAGE_KEY_UID, session.user.id);
        } else if (_event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setUserId(null);
          setUserEmail(null);
          localStorage.removeItem(AUTH_STORAGE_KEY_EMAIL);
          localStorage.removeItem(AUTH_STORAGE_KEY_UID);
          setTrades([]);
          setJournals([]);
          setBacktests([]);
          setActivityTimeline([]);
        }
        setIsAuthLoading(false);
      });

      return () => {
        isSubscribed = false;
        authListener?.subscription.unsubscribe();
      };
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  // Fetch isolated user data whenever userId changes
  useEffect(() => {
    if (userId && isSupabaseConfigured) {
      supabaseDatabaseService.fetchTrades(userId).then(fetchedTrades => {
        setTrades(fetchedTrades || []);
      });
      supabaseDatabaseService.fetchJournals(userId).then(fetchedJournals => {
        setJournals(fetchedJournals || []);
      });
      supabaseDatabaseService.fetchBacktests(userId).then(fetchedBacktests => {
        setBacktests(fetchedBacktests || []);
      });
      supabaseDatabaseService.fetchInitialCapital(userId).then(cap => {
        if (cap !== null && cap > 0) {
          setInitialCapitalState(cap);
        } else {
          setInitialCapitalState(100.0);
        }
      });
    } else if (!userId) {
      setTrades([]);
      setJournals([]);
      setBacktests([]);
      setActivityTimeline([]);
    }
  }, [userId]);

  const setInitialCapital = (amount: number) => {
    setInitialCapitalState(amount);
    if (isSupabaseConfigured && userId) {
      supabaseDatabaseService.updateInitialCapital(amount, userId, userEmail || undefined);
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

  const login = (email: string, uId?: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    const validUid = uId || `usr-${Date.now()}`;
    setUserId(validUid);
    localStorage.setItem(AUTH_STORAGE_KEY_EMAIL, email);
    localStorage.setItem(AUTH_STORAGE_KEY_UID, validUid);
    setIsAuthLoading(false);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    setUserEmail(null);
    localStorage.removeItem(AUTH_STORAGE_KEY_EMAIL);
    localStorage.removeItem(AUTH_STORAGE_KEY_UID);
    setTrades([]);
    setJournals([]);
    setBacktests([]);
    setActivityTimeline([]);
    setInitialCapitalState(100.0);
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
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
    const interval = setInterval(updateLivePrices, 8000);

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
    const generatedId = `TRD-${Date.now().toString().slice(-6)}`;
    const trade: TradeRecord = {
      ...newTrade,
      id: generatedId,
    };
    setTrades(prev => [trade, ...prev]);

    if (isSupabaseConfigured && userId) {
      supabaseDatabaseService.insertTrade(trade, userId);
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
    if (isSupabaseConfigured && userId) {
      supabaseDatabaseService.deleteTrade(tradeId, userId);
    }
  };

  const deleteAllTrades = () => {
    setTrades([]);
    if (isSupabaseConfigured && userId) {
      supabaseDatabaseService.deleteAllTrades(userId);
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

    if (isSupabaseConfigured && userId) {
      supabaseDatabaseService.saveJournal(updatedEntry, userId);
    }

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

    if (isSupabaseConfigured && userId) {
      supabaseDatabaseService.insertBacktest(campaign, userId);
    }

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
    isAuthLoading,
    userId,
    userEmail,
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
