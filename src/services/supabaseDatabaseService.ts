import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { TradeRecord, BacktestCampaign, DailyJournalEntry, DailyBias } from '../types';

// Helper for offline / local persistence caching
const getCache = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const setCache = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore quota or serialization errors
  }
};

export const supabaseDatabaseService = {
  // --- Trade Journal CRUD (User Scoped) ---
  async fetchTrades(userId: string): Promise<TradeRecord[] | null> {
    const cacheKey = `aura_trades_${userId}`;

    if (!isSupabaseConfigured || !supabase || !userId) {
      return getCache<TradeRecord[]>(cacheKey) || [];
    }

    try {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.warn('Supabase fetchTrades error, using local fallback:', error.message);
        return getCache<TradeRecord[]>(cacheKey) || [];
      }

      const formatted: TradeRecord[] = (data || []).map(row => ({
        id: row.id,
        date: row.date,
        time: row.time || '12:00',
        asset: row.asset,
        direction: row.direction,
        timeframe: row.timeframe,
        entryPrice: Number(row.entry_price),
        stopLoss: Number(row.stop_loss),
        takeProfit: Number(row.take_profit),
        exitPrice: Number(row.exit_price),
        positionSize: Number(row.position_size || 1.0),
        riskPercentage: Number(row.risk_percentage || 1.0),
        strategy: row.strategy || 'Fair Value Gap',
        session: row.session || 'New York',
        result: row.result,
        pnl: Number(row.pnl),
        rMultiple: Number(row.r_multiple),
        tradeReason: row.trade_reason || '',
        lessonLearned: row.lesson_learned || '',
      }));

      setCache(cacheKey, formatted);
      return formatted;
    } catch (err) {
      console.warn('Network error fetching trades, using offline cache:', err);
      return getCache<TradeRecord[]>(cacheKey) || [];
    }
  },

  async insertTrade(trade: TradeRecord, userId: string): Promise<boolean> {
    const cacheKey = `aura_trades_${userId}`;
    const cached = getCache<TradeRecord[]>(cacheKey) || [];
    setCache(cacheKey, [trade, ...cached]);

    if (!isSupabaseConfigured || !supabase || !userId) return true;

    try {
      const { error } = await supabase.from('trades').insert([{
        id: trade.id,
        user_id: userId,
        date: trade.date,
        time: trade.time,
        asset: trade.asset,
        direction: trade.direction,
        timeframe: trade.timeframe,
        entry_price: trade.entryPrice,
        stop_loss: trade.stopLoss,
        take_profit: trade.takeProfit,
        exit_price: trade.exitPrice,
        position_size: trade.positionSize,
        risk_percentage: trade.riskPercentage,
        strategy: trade.strategy,
        session: trade.session,
        result: trade.result,
        pnl: trade.pnl,
        r_multiple: trade.rMultiple,
        trade_reason: trade.tradeReason,
        lesson_learned: trade.lessonLearned,
      }]);

      if (error) {
        console.warn('Supabase insertTrade warning:', error.message);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  async deleteTrade(tradeId: string, userId: string): Promise<boolean> {
    const cacheKey = `aura_trades_${userId}`;
    const cached = getCache<TradeRecord[]>(cacheKey) || [];
    setCache(cacheKey, cached.filter(t => t.id !== tradeId));

    if (!isSupabaseConfigured || !supabase || !userId) return true;

    try {
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', tradeId)
        .eq('user_id', userId);
      if (error) {
        console.warn('Supabase deleteTrade warning:', error.message);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  async deleteAllTrades(userId: string): Promise<boolean> {
    const cacheKey = `aura_trades_${userId}`;
    setCache(cacheKey, []);

    if (!isSupabaseConfigured || !supabase || !userId) return true;

    try {
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('user_id', userId);
      if (error) {
        console.warn('Supabase deleteAllTrades warning:', error.message);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  // --- Starting Capital & Profile Persistence (User Scoped) ---
  async fetchInitialCapital(userId: string): Promise<number | null> {
    const cacheKey = `aura_capital_${userId}`;

    if (!isSupabaseConfigured || !supabase || !userId) {
      return getCache<number>(cacheKey);
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('initial_capital')
        .eq('id', userId)
        .maybeSingle();

      if (error || !data) {
        return getCache<number>(cacheKey);
      }
      const cap = Number(data.initial_capital);
      setCache(cacheKey, cap);
      return cap;
    } catch {
      return getCache<number>(cacheKey);
    }
  },

  async updateInitialCapital(amount: number, userId: string, email?: string): Promise<boolean> {
    const cacheKey = `aura_capital_${userId}`;
    setCache(cacheKey, amount);

    if (!isSupabaseConfigured || !supabase || !userId) return true;

    try {
      const { error } = await supabase.from('profiles').upsert({
        id: userId,
        email: email || '',
        initial_capital: amount,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.warn('Supabase updateInitialCapital warning:', error.message);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  // --- Daily Journal CRUD (User Scoped) ---
  async fetchJournals(userId: string): Promise<DailyJournalEntry[] | null> {
    const cacheKey = `aura_journals_${userId}`;

    if (!isSupabaseConfigured || !supabase || !userId) {
      return getCache<DailyJournalEntry[]>(cacheKey) || [];
    }

    try {
      const { data, error } = await supabase
        .from('daily_journals')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.warn('Supabase fetchJournals warning:', error.message);
        return getCache<DailyJournalEntry[]>(cacheKey) || [];
      }

      const formatted: DailyJournalEntry[] = (data || []).map(row => ({
        id: row.id,
        date: row.date,
        asset: row.asset || 'XAUUSD',
        bias: (row.bias === 'BEARISH' || row.bias === 'Bearish' ? 'Bearish' : row.bias === 'NEUTRAL' || row.bias === 'Neutral' ? 'Neutral' : 'Bullish') as DailyBias,
        htfAnalysis: row.pre_market_notes || '',
        marketStructure: '',
        liquidity: '',
        keyLevels: '',
        sessionExpectations: '',
        tradingPlan: '',
        whatIExpected: row.pre_market_notes || '',
        whatActuallyHappened: row.post_market_notes || '',
        mistakes: '',
        lessonsLearned: row.lessons || '',
        moodRating: 5,
        disciplineRating: 5,
        screenshots: row.image_url ? [row.image_url] : [],
        updatedAt: row.created_at || new Date().toISOString(),
      }));

      setCache(cacheKey, formatted);
      return formatted;
    } catch {
      return getCache<DailyJournalEntry[]>(cacheKey) || [];
    }
  },

  async saveJournal(entry: DailyJournalEntry, userId: string): Promise<boolean> {
    const cacheKey = `aura_journals_${userId}`;
    const cached = getCache<DailyJournalEntry[]>(cacheKey) || [];
    const exists = cached.some(j => j.id === entry.id);
    const updated = exists ? cached.map(j => (j.id === entry.id ? entry : j)) : [entry, ...cached];
    setCache(cacheKey, updated);

    if (!isSupabaseConfigured || !supabase || !userId) return true;

    try {
      const { error } = await supabase.from('daily_journals').upsert({
        id: entry.id,
        user_id: userId,
        date: entry.date,
        asset: entry.asset,
        bias: entry.bias.toUpperCase(),
        pre_market_notes: entry.htfAnalysis || entry.whatIExpected || '',
        post_market_notes: entry.whatActuallyHappened || '',
        lessons: entry.lessonsLearned || '',
        image_url: entry.screenshots && entry.screenshots.length > 0 ? entry.screenshots[0] : null,
      });

      if (error) {
        console.warn('Supabase saveJournal warning:', error.message);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  // --- Backtest Campaigns CRUD (User Scoped) ---
  async fetchBacktests(userId: string): Promise<BacktestCampaign[] | null> {
    const cacheKey = `aura_backtests_${userId}`;

    if (!isSupabaseConfigured || !supabase || !userId) {
      return getCache<BacktestCampaign[]>(cacheKey) || [];
    }

    try {
      const { data, error } = await supabase
        .from('backtest_campaigns')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetchBacktests warning:', error.message);
        return getCache<BacktestCampaign[]>(cacheKey) || [];
      }

      const formatted: BacktestCampaign[] = (data || []).map(row => ({
        id: row.id,
        title: row.title,
        strategy: row.strategy,
        asset: row.asset,
        timeframe: (row.timeframe || '15m') as any,
        startDate: row.start_date || new Date().toISOString().split('T')[0],
        endDate: row.end_date || new Date().toISOString().split('T')[0],
        totalTrades: Number(row.total_trades || 0),
        winningTrades: Number(row.winning_trades || 0),
        losingTrades: Number(row.losing_trades || 0),
        winRate: Number(row.win_rate || 0.0),
        avgWinR: 2.0,
        avgLossR: 1.0,
        avgR: 1.5,
        totalR: Number(row.total_r || 0.0),
        totalProfit: Number(row.total_profit || 0.0),
        profitFactor: Number(row.profit_factor || 0.0),
        maxDrawdown: Number(row.max_drawdown || 0.0),
        createdDate: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        description: `${row.strategy} testing on ${row.asset}`,
        records: [],
        monthlyPerformance: [],
        equityCurve: [],
      }));

      setCache(cacheKey, formatted);
      return formatted;
    } catch {
      return getCache<BacktestCampaign[]>(cacheKey) || [];
    }
  },

  async insertBacktest(campaign: BacktestCampaign, userId: string): Promise<boolean> {
    const cacheKey = `aura_backtests_${userId}`;
    const cached = getCache<BacktestCampaign[]>(cacheKey) || [];
    setCache(cacheKey, [campaign, ...cached]);

    if (!isSupabaseConfigured || !supabase || !userId) return true;

    try {
      const { error } = await supabase.from('backtest_campaigns').insert([{
        id: campaign.id,
        user_id: userId,
        title: campaign.title,
        asset: campaign.asset,
        timeframe: campaign.timeframe,
        strategy: campaign.strategy,
        total_trades: campaign.totalTrades,
        winning_trades: campaign.winningTrades,
        losing_trades: campaign.losingTrades,
        win_rate: campaign.winRate,
        total_r: campaign.totalR,
        total_profit: campaign.totalProfit,
        profit_factor: campaign.profitFactor,
        max_drawdown: campaign.maxDrawdown,
      }]);

      if (error) {
        console.warn('Supabase insertBacktest warning:', error.message);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },
};
