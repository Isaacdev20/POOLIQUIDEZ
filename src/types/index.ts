export interface PoolMetadata {
  id: string;
  chain: string;
  project: string;
  symbol: string;
  token0: string;
  token1: string;
  token0Address?: string;
  token1Address?: string;
  tvlUsd: number;
  volumeUsd1d: number;
  volumeUsd7d: number;
  feeTierPct: number; // e.g. 0.3 for 0.3%
  feeTierLabel: string; // "0.3%"
  apyBase: number; // DefiLlama 24h APY
  apyBase7d: number;
  apyMean30d: number;
  currentPrice: number; // Price of token0 in token1 (e.g., ETH in USD)
}

export interface DefiLlamaHistoryPoint {
  timestamp: string;
  tvlUsd: number;
  apy: number;
  apyBase: number;
  apyBase7d?: number;
}

export interface HistoricalPricePoint {
  timestamp: number;
  price: number;
}

export interface DailyTimelinePoint {
  date: string;
  timestamp: number;
  price: number;
  inRange: boolean;
  status: 'in_range' | 'below' | 'above';
}

export interface TimeInRangeStats {
  currentStatus: 'in_range' | 'below_range' | 'above_range';
  currentStreakDays: number;
  days7: {
    inRangeDays: number;
    totalDays: number;
    inRangePct: number;
  };
  days30: {
    inRangeDays: number;
    totalDays: number;
    inRangePct: number;
  };
  days60: {
    inRangeDays: number;
    totalDays: number;
    inRangePct: number;
  };
  estimatedDurationDays: number; // e.g. ~24 days
  dailyVolatilityPct: number;
  minPriceHistorical30d: number;
  maxPriceHistorical30d: number;
  dailyTimeline: DailyTimelinePoint[];
}

export interface SimulationInput {
  depositUsd: number;
  currentPrice: number;
  priceMin: number;
  priceMax: number;
  feeTierPct: number;
  poolTvlUsd: number;
  poolDailyVolumeUsd: number;
  days: number;
  timeHorizon: 'day' | 'week' | 'month' | 'quarter' | 'year';
  inRangePercentage: number; // estimated % of time price stays in range (default 85-95%)
}

export interface ILScenario {
  targetPrice: number;
  priceChangePct: number;
  holdValueUsd: number;
  lpValueUsd: number;
  impermanentLossUsd: number;
  impermanentLossPct: number;
  feesEarnedUsd: number;
  netProfitUsd: number;
  netProfitPct: number;
  token0Amount: number;
  token1Amount: number;
  status: 'below' | 'in_range' | 'above';
}

export interface SimulationResult {
  // Initial Capital Split
  initialDepositUsd: number;
  token0Amount: number;
  token1Amount: number;
  token0ValueUsd: number;
  token1ValueUsd: number;
  token0RatioPct: number;
  token1RatioPct: number;

  // Uniswap V3 Metrics
  liquidity: number;
  capitalEfficiency: number; // Multiplier compared to full range Uniswap V2

  // Projected Earnings (Fees)
  dailyFeeUsd: number;
  weeklyFeeUsd: number;
  monthlyFeeUsd: number; // HERO METRIC: "o quanto eu vou ganhar por mês"
  periodFeeUsd: number;
  yearlyFeeUsd: number;

  // Returns / Yields
  dailyReturnPct: number;
  monthlyReturnPct: number;
  feeAprPct: number;
  feeApyCompoundPct: number;

  // Risk & Bounds
  priceMin: number;
  priceMax: number;
  currentPrice: number;
  rangeWidthPct: number;
  downsideBufferPct: number;
  upsideBufferPct: number;

  // IL Analysis at current price (IL = 0) and target scenarios
  scenarios: ILScenario[];
  breakEvenDays: number; // Days of fees needed to offset 10% price drop IL
}

