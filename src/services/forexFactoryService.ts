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

/**
 * Generate a complete month of Forex Factory economic events, merging live events
 * with standard macro economic release schedules.
 */
export function generateMonthlyForexEvents(
  year: number,
  month: number, // 0-indexed (0 = Jan, 8 = Sep)
  liveEvents: ForexFactoryEvent[] = []
): ForexFactoryEvent[] {
  const result: ForexFactoryEvent[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create a map of existing live events keyed by "YYYY-MM-DD"
  const liveMap = new Map<string, ForexFactoryEvent[]>();
  for (const e of liveEvents) {
    const d = new Date(e.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!liveMap.has(key)) liveMap.set(key, []);
      liveMap.get(key)!.push(e);
    }
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // If we have live events for this day, include them
    const existing = liveMap.get(key);
    if (existing && existing.length > 0) {
      result.push(...existing);
      continue;
    }

    // Skip weekends for economic news releases, but add holiday note if needed
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue;
    }

    // Scheduled releases based on standard macro release windows:
    // First Friday: NFP & Unemployment
    if (dayOfWeek === 5 && day <= 7) {
      result.push(
        {
          id: `gen-${key}-nfp`,
          title: 'Non-Farm Employment Change (NFP)',
          country: 'USD',
          date: new Date(year, month, day, 8, 30).toISOString(),
          impact: 'High',
          forecast: '165K',
          previous: '142K',
        },
        {
          id: `gen-${key}-ur`,
          title: 'Unemployment Rate',
          country: 'USD',
          date: new Date(year, month, day, 8, 30).toISOString(),
          impact: 'High',
          forecast: '4.2%',
          previous: '4.3%',
        },
        {
          id: `gen-${key}-ahe`,
          title: 'Average Hourly Earnings m/m',
          country: 'USD',
          date: new Date(year, month, day, 8, 30).toISOString(),
          impact: 'High',
          forecast: '0.3%',
          previous: '0.2%',
        },
        {
          id: `gen-${key}-cad-emp`,
          title: 'Employment Change',
          country: 'CAD',
          date: new Date(year, month, day, 8, 30).toISOString(),
          impact: 'High',
          forecast: '25.0K',
          previous: '-2.8K',
        }
      );
      continue;
    }

    // Every Thursday: Unemployment Claims
    if (dayOfWeek === 4) {
      result.push(
        {
          id: `gen-${key}-claims`,
          title: 'Unemployment Claims',
          country: 'USD',
          date: new Date(year, month, day, 8, 30).toISOString(),
          impact: 'High',
          forecast: '229K',
          previous: '227K',
        },
        {
          id: `gen-${key}-gas`,
          title: 'Natural Gas Storage',
          country: 'USD',
          date: new Date(year, month, day, 10, 30).toISOString(),
          impact: 'Low',
          forecast: '42B',
          previous: '35B',
        }
      );
    }

    // Every Wednesday: Crude Oil Inventories
    if (dayOfWeek === 3) {
      result.push(
        {
          id: `gen-${key}-oil`,
          title: 'Crude Oil Inventories',
          country: 'USD',
          date: new Date(year, month, day, 10, 30).toISOString(),
          impact: 'Medium',
          forecast: '-1.2M',
          previous: '-6.9M',
        }
      );
    }

    // CPI Window (Days 10 to 14)
    if (day >= 10 && day <= 14 && dayOfWeek >= 1 && dayOfWeek <= 5) {
      if (day === 11 || (day === 12 && dayOfWeek === 3)) {
        result.push(
          {
            id: `gen-${key}-cpi-m`,
            title: 'Core CPI m/m',
            country: 'USD',
            date: new Date(year, month, day, 8, 30).toISOString(),
            impact: 'High',
            forecast: '0.3%',
            previous: '0.2%',
          },
          {
            id: `gen-${key}-cpi-y`,
            title: 'CPI y/y & m/m',
            country: 'USD',
            date: new Date(year, month, day, 8, 30).toISOString(),
            impact: 'High',
            forecast: '2.8%',
            previous: '2.9%',
          },
          {
            id: `gen-${key}-gbp-gdp`,
            title: 'GDP m/m',
            country: 'GBP',
            date: new Date(year, month, day, 2, 0).toISOString(),
            impact: 'High',
            forecast: '0.2%',
            previous: '0.0%',
          }
        );
      } else if (day === 12 || day === 13) {
        result.push(
          {
            id: `gen-${key}-ppi`,
            title: 'Core PPI m/m',
            country: 'USD',
            date: new Date(year, month, day, 8, 30).toISOString(),
            impact: 'Medium',
            forecast: '0.2%',
            previous: '0.0%',
          },
          {
            id: `gen-${key}-ecb-rate`,
            title: 'ECB Main Refinancing Rate & Statement',
            country: 'EUR',
            date: new Date(year, month, day, 8, 15).toISOString(),
            impact: 'High',
            forecast: '3.65%',
            previous: '3.75%',
          },
          {
            id: `gen-${key}-ecb-press`,
            title: 'ECB Press Conference',
            country: 'EUR',
            date: new Date(year, month, day, 8, 45).toISOString(),
            impact: 'High',
            forecast: '',
            previous: '',
          }
        );
      }
    }

    // Mid-month: Retail Sales & Central Bank Decisions (Days 16 to 21)
    if (day >= 16 && day <= 21 && dayOfWeek >= 1 && dayOfWeek <= 5) {
      if (day === 17 || day === 18) {
        result.push(
          {
            id: `gen-${key}-retail`,
            title: 'Retail Sales m/m',
            country: 'USD',
            date: new Date(year, month, day, 8, 30).toISOString(),
            impact: 'High',
            forecast: '0.3%',
            previous: '1.0%',
          },
          {
            id: `gen-${key}-fomc-rate`,
            title: 'Federal Funds Rate & FOMC Statement',
            country: 'USD',
            date: new Date(year, month, day, 14, 0).toISOString(),
            impact: 'High',
            forecast: '5.00%',
            previous: '5.25%',
          },
          {
            id: `gen-${key}-fomc-press`,
            title: 'FOMC Press Conference (Fed Chair Powell)',
            country: 'USD',
            date: new Date(year, month, day, 14, 30).toISOString(),
            impact: 'High',
            forecast: '',
            previous: '',
          }
        );
      } else if (day === 19 || day === 20) {
        result.push(
          {
            id: `gen-${key}-boe`,
            title: 'Official Bank Rate & MPC Vote',
            country: 'GBP',
            date: new Date(year, month, day, 7, 0).toISOString(),
            impact: 'High',
            forecast: '5.00%',
            previous: '5.00%',
          },
          {
            id: `gen-${key}-boj`,
            title: 'BOJ Policy Rate & Monetary Policy Statement',
            country: 'JPY',
            date: new Date(year, month, day, 3, 0).toISOString(),
            impact: 'High',
            forecast: '0.25%',
            previous: '0.25%',
          }
        );
      }
    }

    // Flash PMIs (Days 22 to 25)
    if (day >= 22 && day <= 25 && dayOfWeek >= 1 && dayOfWeek <= 5) {
      if (day === 23 || day === 24) {
        result.push(
          {
            id: `gen-${key}-eur-pmi`,
            title: 'French & German Flash Manufacturing PMI',
            country: 'EUR',
            date: new Date(year, month, day, 3, 30).toISOString(),
            impact: 'Medium',
            forecast: '43.5',
            previous: '42.4',
          },
          {
            id: `gen-${key}-gbp-pmi`,
            title: 'Flash Manufacturing & Services PMI',
            country: 'GBP',
            date: new Date(year, month, day, 4, 30).toISOString(),
            impact: 'Medium',
            forecast: '52.5',
            previous: '52.5',
          },
          {
            id: `gen-${key}-usd-pmi`,
            title: 'Flash Manufacturing & Services PMI',
            country: 'USD',
            date: new Date(year, month, day, 9, 45).toISOString(),
            impact: 'High',
            forecast: '51.5',
            previous: '52.1',
          }
        );
      }
    }

    // Month-End: Core PCE & Prelim GDP (Days 26 to 31)
    if (day >= 26 && dayOfWeek >= 1 && dayOfWeek <= 5) {
      if (day === 27 || day === 28) {
        result.push(
          {
            id: `gen-${key}-pce`,
            title: 'Core PCE Price Index m/m',
            country: 'USD',
            date: new Date(year, month, day, 8, 30).toISOString(),
            impact: 'High',
            forecast: '0.2%',
            previous: '0.2%',
          },
          {
            id: `gen-${key}-gdp-prelim`,
            title: 'Prelim GDP q/q',
            country: 'USD',
            date: new Date(year, month, day, 8, 30).toISOString(),
            impact: 'High',
            forecast: '3.0%',
            previous: '2.8%',
          }
        );
      } else if (day === daysInMonth || (day === daysInMonth - 1 && dayOfWeek === 5)) {
        result.push(
          {
            id: `gen-${key}-chicago-pmi`,
            title: 'Chicago PMI',
            country: 'USD',
            date: new Date(year, month, day, 9, 45).toISOString(),
            impact: 'Medium',
            forecast: '45.3',
            previous: '45.3',
          },
          {
            id: `gen-${key}-tokyo-cpi`,
            title: 'Tokyo Core CPI y/y',
            country: 'JPY',
            date: new Date(year, month, day, 19, 30).toISOString(),
            impact: 'Medium',
            forecast: '2.4%',
            previous: '2.2%',
          }
        );
      }
    }

    // Early Month (Days 1 to 5)
    if (day >= 1 && day <= 5 && dayOfWeek >= 1 && dayOfWeek <= 5) {
      result.push(
        {
          id: `gen-${key}-ism-mfg`,
          title: 'ISM Manufacturing PMI',
          country: 'USD',
          date: new Date(year, month, day, 10, 0).toISOString(),
          impact: 'High',
          forecast: '47.5',
          previous: '46.8',
        },
        {
          id: `gen-${key}-adp`,
          title: 'ADP Non-Farm Employment Change',
          country: 'USD',
          date: new Date(year, month, day, 8, 15).toISOString(),
          impact: 'Medium',
          forecast: '145K',
          previous: '122K',
        }
      );
    }
  }

  // Sort chronologically
  return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

