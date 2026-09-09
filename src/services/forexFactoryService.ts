export type ImpactLevel = 'High' | 'Medium' | 'Low' | 'Holiday' | 'Non-Economic';

export interface ForexFactoryEvent {
  id: string;
  title: string;
  country: string;
  date: string; // ISO 8601 string, e.g. "2026-09-09T08:30:00-04:00"
  impact: ImpactLevel;
  forecast: string;
  previous: string;
  actual?: string;
}

export interface ForexFactorySummary {
  totalEvents: number;
  highImpactCount: number;
  mediumImpactCount: number;
  lowImpactCount: number;
  todayCount: number;
  nextHighImpactEvent: ForexFactoryEvent | null;
}

export const CURRENCY_FLAGS: Record<string, { flag: string; name: string }> = {
  USD: { flag: '🇺🇸', name: 'United States Dollar' },
  EUR: { flag: '🇪🇺', name: 'Eurozone Euro' },
  GBP: { flag: '🇬🇧', name: 'British Pound' },
  JPY: { flag: '🇯🇵', name: 'Japanese Yen' },
  CAD: { flag: '🇨🇦', name: 'Canadian Dollar' },
  AUD: { flag: '🇦🇺', name: 'Australian Dollar' },
  NZD: { flag: '🇳🇿', name: 'New Zealand Dollar' },
  CHF: { flag: '🇨🇭', name: 'Swiss Franc' },
  CNY: { flag: '🇨🇳', name: 'Chinese Yuan' },
};

export const CURRENCY_AFFECTED_ASSETS: Record<string, string[]> = {
  USD: ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'NAS100', 'US30'],
  EUR: ['EURUSD', 'EURGBP', 'EURJPY', 'EURAUD'],
  GBP: ['GBPUSD', 'EURGBP', 'GBPJPY'],
  JPY: ['USDJPY', 'GBPJPY', 'EURJPY'],
  CAD: ['USDCAD', 'CADJPY'],
  AUD: ['AUDUSD', 'AUDJPY', 'AUDNZD'],
  NZD: ['NZDUSD', 'AUDNZD'],
  CHF: ['USDCHF', 'EURCHF'],
  CNY: ['USDCNY', 'AUDUSD'],
};

// Curated high-fidelity fallback dataset
export const FALLBACK_FOREX_FACTORY_EVENTS: ForexFactoryEvent[] = [
  {
    id: 'ff-fb-1',
    title: 'Core CPI m/m',
    country: 'USD',
    date: new Date(Date.now() + 1000 * 60 * 95).toISOString(),
    impact: 'High',
    forecast: '0.3%',
    previous: '0.2%',
  },
  {
    id: 'ff-fb-2',
    title: 'CPI m/m & y/y',
    country: 'USD',
    date: new Date(Date.now() + 1000 * 60 * 95).toISOString(),
    impact: 'High',
    forecast: '2.9%',
    previous: '3.1%',
  },
  {
    id: 'ff-fb-3',
    title: 'Unemployment Claims',
    country: 'USD',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    impact: 'High',
    forecast: '228K',
    previous: '227K',
  },
  {
    id: 'ff-fb-4',
    title: 'ECB Main Refinancing Rate',
    country: 'EUR',
    date: new Date(Date.now() + 1000 * 60 * 60 * 28).toISOString(),
    impact: 'High',
    forecast: '3.65%',
    previous: '3.75%',
  },
  {
    id: 'ff-fb-5',
    title: 'ECB Monetary Policy Statement & Press Conference',
    country: 'EUR',
    date: new Date(Date.now() + 1000 * 60 * 60 * 28.75).toISOString(),
    impact: 'High',
    forecast: '',
    previous: '',
  },
  {
    id: 'ff-fb-6',
    title: 'Preliminary UoM Consumer Sentiment',
    country: 'USD',
    date: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    impact: 'Medium',
    forecast: '68.5',
    previous: '67.9',
  },
  {
    id: 'ff-fb-7',
    title: 'BOJ Monetary Policy Statement & Rate Decision',
    country: 'JPY',
    date: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
    impact: 'High',
    forecast: '0.25%',
    previous: '0.25%',
  },
  {
    id: 'ff-fb-8',
    title: 'Employment Change & Unemployment Rate',
    country: 'AUD',
    date: new Date(Date.now() + 1000 * 60 * 60 * 80).toISOString(),
    impact: 'High',
    forecast: '25.0K',
    previous: '58.2K',
  },
  {
    id: 'ff-fb-9',
    title: 'GDP m/m',
    country: 'GBP',
    date: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    impact: 'High',
    forecast: '0.2%',
    previous: '0.0%',
    actual: '0.1%',
  },
  {
    id: 'ff-fb-10',
    title: 'Goods Trade Balance',
    country: 'GBP',
    date: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    impact: 'Medium',
    forecast: '-18.2B',
    previous: '-18.9B',
    actual: '-17.5B',
  },
  {
    id: 'ff-fb-11',
    title: 'PPI m/m',
    country: 'USD',
    date: new Date(Date.now() + 1000 * 60 * 60 * 52).toISOString(),
    impact: 'Medium',
    forecast: '0.2%',
    previous: '0.1%',
  },
  {
    id: 'ff-fb-12',
    title: 'Bank Holiday',
    country: 'CAD',
    date: new Date(Date.now() + 1000 * 60 * 60 * 96).toISOString(),
    impact: 'Holiday',
    forecast: '',
    previous: '',
  },
];

/**
 * Fetch live Forex Factory calendar events with multi-tier failover.
 */
export async function fetchForexFactoryEvents(): Promise<{
  events: ForexFactoryEvent[];
  source: 'live' | 'proxy' | 'fallback';
  lastUpdated: string;
}> {
  // 1. First attempt: Vite / Vercel API proxy
  try {
    const res = await fetch('/api/forexfactory/ff_calendar_thisweek.json', {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const rawData = await res.json();
      if (Array.isArray(rawData) && rawData.length > 0) {
        return {
          events: normalizeEvents(rawData),
          source: 'live',
          lastUpdated: new Date().toLocaleTimeString(),
        };
      }
    }
  } catch (err) {
    // Continue to next fallback
  }

  // 2. Second attempt: Direct Faireconomy CDN
  try {
    const res = await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.json');
    if (res.ok) {
      const rawData = await res.json();
      if (Array.isArray(rawData) && rawData.length > 0) {
        return {
          events: normalizeEvents(rawData),
          source: 'live',
          lastUpdated: new Date().toLocaleTimeString(),
        };
      }
    }
  } catch (err) {
    // Continue to next fallback
  }

  // 3. Third attempt: Public CORS proxy
  try {
    const corsProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
      'https://nfs.faireconomy.media/ff_calendar_thisweek.json'
    )}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(corsProxyUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const rawData = await res.json();
      if (Array.isArray(rawData) && rawData.length > 0) {
        return {
          events: normalizeEvents(rawData),
          source: 'proxy',
          lastUpdated: new Date().toLocaleTimeString(),
        };
      }
    }
  } catch (err) {
    // Fallback below
  }

  // 4. Default high-fidelity dataset
  return {
    events: FALLBACK_FOREX_FACTORY_EVENTS,
    source: 'fallback',
    lastUpdated: new Date().toLocaleTimeString(),
  };
}

function normalizeEvents(rawItems: any[]): ForexFactoryEvent[] {
  return rawItems.map((item, idx) => ({
    id: `ff-${idx}-${item.country || 'fx'}-${item.date || ''}`,
    title: item.title || 'Market Economic Event',
    country: (item.country || 'USD').toUpperCase().trim(),
    date: item.date || new Date().toISOString(),
    impact: normalizeImpact(item.impact),
    forecast: item.forecast ? String(item.forecast).trim() : '',
    previous: item.previous ? String(item.previous).trim() : '',
    actual: item.actual ? String(item.actual).trim() : undefined,
  }));
}

function normalizeImpact(impactRaw: any): ImpactLevel {
  const str = String(impactRaw || '').toLowerCase();
  if (str.includes('high')) return 'High';
  if (str.includes('medium') || str.includes('med')) return 'Medium';
  if (str.includes('low')) return 'Low';
  if (str.includes('holiday')) return 'Holiday';
  return 'Low';
}

/**
 * Computes calendar summary metrics (high impact count, next release, etc.)
 */
export function computeForexFactorySummary(events: ForexFactoryEvent[]): ForexFactorySummary {
  const now = Date.now();
  let highImpactCount = 0;
  let mediumImpactCount = 0;
  let lowImpactCount = 0;
  let todayCount = 0;
  let nextHighImpactEvent: ForexFactoryEvent | null = null;
  let smallestFutureDiff = Infinity;

  const todayStr = new Date().toDateString();

  for (const event of events) {
    if (event.impact === 'High') highImpactCount++;
    else if (event.impact === 'Medium') mediumImpactCount++;
    else if (event.impact === 'Low') lowImpactCount++;

    const eventDate = new Date(event.date);
    if (eventDate.toDateString() === todayStr) {
      todayCount++;
    }

    const diff = eventDate.getTime() - now;
    if (event.impact === 'High' && diff > 0 && diff < smallestFutureDiff) {
      smallestFutureDiff = diff;
      nextHighImpactEvent = event;
    }
  }

  return {
    totalEvents: events.length,
    highImpactCount,
    mediumImpactCount,
    lowImpactCount,
    todayCount,
    nextHighImpactEvent,
  };
}

/**
 * Format relative countdown string (e.g. "in 1h 24m", "in 15 mins", "passed")
 */
export function formatEventCountdown(dateIso: string): { label: string; isPast: boolean; isImminent: boolean } {
  const target = new Date(dateIso).getTime();
  const now = Date.now();
  const diffMs = target - now;

  if (diffMs <= 0) {
    const agoMins = Math.floor(Math.abs(diffMs) / (1000 * 60));
    if (agoMins < 60) {
      return { label: `${agoMins}m ago`, isPast: true, isImminent: false };
    }
    const agoHours = Math.floor(agoMins / 60);
    return { label: `${agoHours}h ago`, isPast: true, isImminent: false };
  }

  const mins = Math.floor(diffMs / (1000 * 60));
  const isImminent = mins <= 120; // within 2 hours

  if (mins < 60) {
    return { label: `in ${mins}m`, isPast: false, isImminent };
  }
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return { label: `in ${hours}h ${remMins}m`, isPast: false, isImminent };
}
