export type MarketCategory = 'ALL' | 'FOREX' | 'METALS' | 'CRYPTO' | 'INDICES';
export type MarketStatus = 'OPEN' | 'CLOSED' | 'WEEKEND';

export interface MarketAsset {
  symbol: string;
  name: string;
  category: MarketCategory;
  price: number;
  change24h: number;
  change24hAmount: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  status: MarketStatus;
  isFavorite: boolean;
  sparkline: number[];
  prevClose: number;
}

export type TradeDirection = 'LONG' | 'SHORT';
export type TradeResult = 'WIN' | 'LOSS' | 'BREAKEVEN';
export type TradingSession = 'Asia' | 'London' | 'New York';
export type TradingTimeframe = '1m' | '5m' | '15m' | '30m' | '1H' | '4H' | '1D' | '1W';

export interface TradeRecord {
  id: string;
  date: string; // ISO string or YYYY-MM-DD
  time: string;
  asset: string;
  direction: TradeDirection;
  timeframe: TradingTimeframe;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  exitPrice: number;
  positionSize: number; // in lots or units
  riskPercentage: number;
  strategy: string;
  session: TradingSession;
  result: TradeResult;
  pnl: number;
  rMultiple: number;
  tradeReason?: string;
  marketContext?: string;
  tradeManagement?: string;
  mistake?: string;
  lessonLearned?: string;
  gapType?: 'Fair Value Gap' | 'Weekend Open Gap' | 'Liquidity Void' | 'None';
  gapSize?: number;
  gapFilled?: boolean;
  screenshots?: {
    before?: string;
    during?: string;
    after?: string;
  };
}

export type DailyBias = 'Bullish' | 'Bearish' | 'Neutral';

export interface DailyJournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  asset: string;
  bias: DailyBias;
  htfAnalysis: string;
  marketStructure: string;
  liquidity: string;
  keyLevels: string;
  sessionExpectations: string;
  tradingPlan: string;
  whatIExpected: string;
  whatActuallyHappened: string;
  mistakes: string;
  lessonsLearned: string;
  moodRating: number; // 1 to 5 stars
  disciplineRating: number; // 1 to 5 stars
  screenshots: string[];
  updatedAt: string;
}

export interface BacktestRecord {
  id: string;
  date: string;
  asset: string;
  direction: TradeDirection;
  openPrice: number;
  closePrice: number;
  strategy: string;
  profitAmount: number;
  riskRewardRatio: number; // e.g. 2.5 means 1:2.5
  result: TradeResult;
  gapType?: 'Fair Value Gap' | 'Weekend Open Gap' | 'Liquidity Void' | 'None';
  gapSize?: number;
  gapFilled?: boolean;
  notes?: string;
}

export interface BacktestCampaign {
  id: string;
  title: string;
  strategy: string;
  asset: string;
  timeframe: TradingTimeframe;
  startDate: string;
  endDate: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  avgWinR: number;
  avgLossR: number;
  avgR: number;
  profitFactor: number;
  maxDrawdown: number;
  totalR: number;
  totalProfit: number;
  createdDate: string;
  description: string;
  records: BacktestRecord[];
  monthlyPerformance: { month: string; r: number; winRate: number; trades: number }[];
  equityCurve: { date: string; cumulativeR: number; cumulativeProfit: number }[];
}


export interface AccountPerformanceSummary {
  accountBalance: number;
  netPnl: number;
  startingBalance: number;
  currentBalance: number;
  profitTarget: number;
  dailyDrawdownLimit: number;
  dailyDrawdownCurrent: number;
  maxDrawdownLimit: number;
  maxDrawdownCurrent: number;
  winRate: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  breakevenTrades: number;
  profitFactor: number;
  tradingDays: number;
  winningDays: number;
  losingDays: number;
  expectancyR: number;
  avgWinAmount: number;
  avgLossAmount: number;
  avgRMultiple: number;
}

export interface ActivityTimelineItem {
  id: string;
  date: string;
  time: string;
  type: 'JOURNAL' | 'TRADE' | 'BACKTEST' | 'SYSTEM';
  title: string;
  description: string;
  asset?: string;
  link?: string;
}

export interface CalendarDayRecord {
  date: string; // YYYY-MM-DD
  pnl: number;
  tradesCount: number;
  winCount: number;
  lossCount: number;
  hasJournal: boolean;
  notes?: string;
}

export interface UserSettings {
  general: {
    defaultMarket: string;
    defaultTimeframe: TradingTimeframe;
    currency: string;
    timeZone: string;
  };
  appearance: {
    darkMode: boolean;
    compactMode: boolean;
    chartPreferences: {
      showGrid: boolean;
      candleStyle: 'candlestick' | 'hollow' | 'line';
      showVolume: boolean;
    };
  };
  trading: {
    defaultRiskPercentage: number;
    defaultSession: TradingSession;
    defaultStrategy: string;
  };
  profile: {
    name: string;
    email: string;
    avatar: string;
    role: string;
  };
}
