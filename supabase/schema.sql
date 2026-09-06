-- ============================================================
-- AYAZ MARKETS ANALYSIS — SUPABASE POSTGRESQL DATABASE SCHEMA
-- Execute this script in your Supabase SQL Editor to set up tables
-- ============================================================

-- 1. Create Profiles Table (User settings & starting capital)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT DEFAULT 'Syed Ayaz Shah',
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
  initial_capital NUMERIC DEFAULT 100.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Trades Table (Trade Journal records)
CREATE TABLE IF NOT EXISTS public.trades (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time TEXT DEFAULT '12:00',
  asset TEXT NOT NULL DEFAULT 'XAUUSD',
  direction TEXT NOT NULL CHECK (direction IN ('LONG', 'SHORT')),
  timeframe TEXT NOT NULL DEFAULT '15m',
  entry_price NUMERIC NOT NULL,
  stop_loss NUMERIC,
  take_profit NUMERIC,
  exit_price NUMERIC NOT NULL,
  position_size NUMERIC DEFAULT 1.0,
  risk_percentage NUMERIC DEFAULT 1.0,
  strategy TEXT DEFAULT 'Fair Value Gap',
  session TEXT DEFAULT 'New York',
  result TEXT NOT NULL CHECK (result IN ('WIN', 'LOSS', 'BREAKEVEN')),
  pnl NUMERIC NOT NULL DEFAULT 0.0,
  r_multiple NUMERIC NOT NULL DEFAULT 0.0,
  trade_reason TEXT,
  lesson_learned TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Backtest Campaigns Table
CREATE TABLE IF NOT EXISTS public.backtest_campaigns (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  asset TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  strategy TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  total_trades INT DEFAULT 0,
  winning_trades INT DEFAULT 0,
  losing_trades INT DEFAULT 0,
  win_rate NUMERIC DEFAULT 0.0,
  total_r NUMERIC DEFAULT 0.0,
  total_profit NUMERIC DEFAULT 0.0,
  profit_factor NUMERIC DEFAULT 0.0,
  max_drawdown NUMERIC DEFAULT 0.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Backtest Records Table (Individual trades in a campaign)
CREATE TABLE IF NOT EXISTS public.backtest_records (
  id TEXT PRIMARY KEY,
  campaign_id TEXT REFERENCES public.backtest_campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  asset TEXT NOT NULL,
  direction TEXT NOT NULL,
  open_price NUMERIC NOT NULL,
  close_price NUMERIC NOT NULL,
  result TEXT NOT NULL,
  profit_amount NUMERIC NOT NULL,
  risk_reward_ratio NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Daily Journals Table
CREATE TABLE IF NOT EXISTS public.daily_journals (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  asset TEXT DEFAULT 'XAUUSD',
  bias TEXT DEFAULT 'BULLISH',
  pre_market_notes TEXT,
  post_market_notes TEXT,
  lessons TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backtest_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backtest_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_journals ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow users to view and manage their own data
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own trades" ON public.trades FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own backtest campaigns" ON public.backtest_campaigns FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own backtest records" ON public.backtest_records FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own daily journals" ON public.daily_journals FOR ALL USING (auth.uid() = user_id);
