import { HistoricalPricePoint, TimeInRangeStats, DailyTimelinePoint } from '../types';

/**
 * Calculates comprehensive Time-in-Range metrics, historical backtest uptime,
 * and estimated duration before exit based on Uniswap V3 concentrated liquidity math.
 */
export function calculateTimeInRangeStats(
  prices: HistoricalPricePoint[],
  priceMin: number,
  priceMax: number,
  currentPrice: number
): TimeInRangeStats {
  if (!prices || prices.length === 0 || priceMin <= 0 || priceMax <= 0 || priceMin >= priceMax) {
    return {
      currentStatus: 'in_range',
      currentStreakDays: 1,
      days7: { inRangeDays: 7, totalDays: 7, inRangePct: 100 },
      days30: { inRangeDays: 30, totalDays: 30, inRangePct: 100 },
      days60: { inRangeDays: 60, totalDays: 60, inRangePct: 100 },
      estimatedDurationDays: 30,
      dailyVolatilityPct: 2.5,
      minPriceHistorical30d: currentPrice * 0.9,
      maxPriceHistorical30d: currentPrice * 1.1,
      dailyTimeline: [],
    };
  }

  // Sort chronologically
  const sorted = [...prices].sort((a, b) => a.timestamp - b.timestamp);

  // Build daily timeline
  const dailyTimeline: DailyTimelinePoint[] = sorted.map((pt) => {
    const p = pt.price;
    let status: 'in_range' | 'below' | 'above' = 'in_range';
    if (p < priceMin) status = 'below';
    else if (p > priceMax) status = 'above';

    const d = new Date(pt.timestamp * 1000);
    const dateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;

    return {
      date: dateStr,
      timestamp: pt.timestamp,
      price: p,
      inRange: status === 'in_range',
      status,
    };
  });

  // Current status based on currentPrice
  let currentStatus: 'in_range' | 'below_range' | 'above_range' = 'in_range';
  if (currentPrice < priceMin) currentStatus = 'below_range';
  else if (currentPrice > priceMax) currentStatus = 'above_range';

  // Calculate current streak counting backwards from the latest points
  let currentStreakDays = 1;
  const isCurrentlyIn = currentStatus === 'in_range';

  for (let i = dailyTimeline.length - 1; i >= 0; i--) {
    const ptIn = dailyTimeline[i].inRange;
    if (ptIn === isCurrentlyIn) {
      currentStreakDays++;
    } else {
      break;
    }
  }

  // Slice historical windows (7, 30, 60 days)
  const calcWindow = (count: number) => {
    const windowSlice = dailyTimeline.slice(-count);
    if (windowSlice.length === 0) return { inRangeDays: 0, totalDays: 0, inRangePct: 100 };
    const inRangeDays = windowSlice.filter((pt) => pt.inRange).length;
    const inRangePct = (inRangeDays / windowSlice.length) * 100;
    return {
      inRangeDays,
      totalDays: windowSlice.length,
      inRangePct,
    };
  };

  const days7 = calcWindow(7);
  const days30 = calcWindow(30);
  const days60 = calcWindow(60);

  // 30d Min & Max
  const last30Prices = dailyTimeline.slice(-30).map((pt) => pt.price);
  const minPriceHistorical30d = last30Prices.length > 0 ? Math.min(...last30Prices) : currentPrice * 0.9;
  const maxPriceHistorical30d = last30Prices.length > 0 ? Math.max(...last30Prices) : currentPrice * 1.1;

  // Calculate Daily Volatility from log-returns of the last 30-60 days
  const logReturns: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1].price;
    const curr = sorted[i].price;
    if (prev > 0 && curr > 0) {
      logReturns.push(Math.log(curr / prev));
    }
  }

  let dailyVolatilityPct = 2.5; // fallback 2.5%
  if (logReturns.length > 5) {
    const mean = logReturns.reduce((acc, v) => acc + v, 0) / logReturns.length;
    const variance =
      logReturns.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (logReturns.length - 1);
    const stdDev = Math.sqrt(variance);
    dailyVolatilityPct = Math.max(0.5, stdDev * 100);
  }

  // Estimated Duration before First Exit (First Passage Time)
  let estimatedDurationDays = 0;
  if (currentStatus === 'in_range') {
    const sigma = dailyVolatilityPct / 100;
    const a = Math.log(currentPrice / priceMin);
    const b = Math.log(priceMax / currentPrice);

    if (a > 0 && b > 0 && sigma > 0) {
      // E[tau] = (a * b) / sigma^2
      const expectedDays = (a * b) / Math.pow(sigma, 2);
      estimatedDurationDays = Math.max(1, Math.min(365, Math.round(expectedDays)));
    } else {
      estimatedDurationDays = 365;
    }
  }

  return {
    currentStatus,
    currentStreakDays,
    days7,
    days30,
    days60,
    estimatedDurationDays,
    dailyVolatilityPct,
    minPriceHistorical30d,
    maxPriceHistorical30d,
    dailyTimeline: dailyTimeline.slice(-30), // keep last 30 days for display
  };
}

