import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { TradeRecord, BacktestCampaign, DailyJournalEntry } from '../types';

export const supabaseDatabaseService = {
  // --- Trade Journal CRUD ---
  async fetchTrades(): Promise<TradeRecord[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.warn('Supabase fetchTrades error:', error.message);
      return null;
    }

    return (data || []).map(row => ({
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
  },

  async insertTrade(trade: TradeRecord): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase.from('trades').insert([{
      id: trade.id,
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
      console.warn('Supabase insertTrade error:', error.message);
      return false;
    }
    return true;
  },

  async deleteTrade(tradeId: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase.from('trades').delete().eq('id', tradeId);
    if (error) {
      console.warn('Supabase deleteTrade error:', error.message);
      return false;
    }
    return true;
  },

  async deleteAllTrades(): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase.from('trades').delete().neq('id', '0');
    if (error) {
      console.warn('Supabase deleteAllTrades error:', error.message);
      return false;
    }
    return true;
  },

  // --- Starting Capital & Profile Persistence ---
  async fetchInitialCapital(): Promise<number | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('initial_capital')
      .single();

    if (error || !data) return null;
    return Number(data.initial_capital);
  },

  async updateInitialCapital(amount: number): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return false;

    const { error } = await supabase.from('profiles').upsert({
      id: userData.user.id,
      email: userData.user.email,
      initial_capital: amount,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('Supabase updateInitialCapital error:', error.message);
      return false;
    }
    return true;
  },
};
