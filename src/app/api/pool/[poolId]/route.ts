import { NextRequest, NextResponse } from 'next/server';

interface CachedPools {
  timestamp: number;
  data: any[];
}

let cachedPools: CachedPools | null = null;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ poolId: string }> }
) {
  try {
    const { poolId } = await params;

    if (!poolId) {
      return NextResponse.json({ error: 'Pool ID is required' }, { status: 400 });
    }

    // 1. Fetch historical yields/tvl chart for the pool
    const chartRes = await fetch(`https://yields.llama.fi/chart/${poolId}`, {
      next: { revalidate: 300 }, // 5 min cache
    });

    let chartData: any[] = [];
    if (chartRes.ok) {
      const chartJson = await chartRes.json();
      chartData = chartJson.data || [];
    }

    // 2. Fetch current pool metadata (from cache or live list)
    const now = Date.now();
    if (!cachedPools || now - cachedPools.timestamp > CACHE_TTL_MS) {
      const poolsRes = await fetch('https://yields.llama.fi/pools', {
        headers: { 'User-Agent': 'QuantPool-Simulator/1.0' },
      });
      if (poolsRes.ok) {
        const poolsJson = await poolsRes.json();
        cachedPools = {
          timestamp: now,
          data: poolsJson.data || [],
        };
      }
    }

    const poolMeta = cachedPools?.data.find((p: any) => p.pool === poolId);

    // Fallback if pool not found in current snapshot
    const latestChart = chartData.length > 0 ? chartData[chartData.length - 1] : null;

    // Detect fee tier from poolMeta or string like "0.3%"
    let feeTierPct = 0.3; // Default 0.3%
    if (poolMeta?.poolMeta) {
      const parsed = parseFloat(poolMeta.poolMeta.replace('%', ''));
      if (!isNaN(parsed)) feeTierPct = parsed;
    }

    // Extract symbols
    const symbol = poolMeta?.symbol || 'WETH-USDC';
    const parts = symbol.split('-');
    const token0 = parts[0] || 'TOKEN0';
    const token1 = parts[1] || 'TOKEN1';

    // Fetch token prices
    let currentPrice = 2350; // Fallback ETH price
    if (poolMeta?.underlyingTokens && poolMeta.underlyingTokens.length > 0 && poolMeta.chain) {
      try {
        const tokenKey = `${poolMeta.chain.toLowerCase()}:${poolMeta.underlyingTokens[0]}`;
        const priceRes = await fetch(`https://coins.llama.fi/prices/current/${tokenKey}`);
        if (priceRes.ok) {
          const priceJson = await priceRes.json();
          if (priceJson.coins?.[tokenKey]?.price) {
            currentPrice = priceJson.coins[tokenKey].price;
          }
        }
      } catch (err) {
        console.warn('Could not fetch token price from coins.llama.fi:', err);
      }
    } else {
      // Common pairs price fallbacks
      if (symbol.toUpperCase().includes('BTC')) currentPrice = 96000;
      else if (symbol.toUpperCase().includes('SOL')) currentPrice = 180;
      else if (symbol.toUpperCase().includes('USDT') && symbol.toUpperCase().includes('USDC')) currentPrice = 1.0;
    }

    const responsePayload = {
      pool: {
        id: poolId,
        chain: poolMeta?.chain || 'Base',
        project: poolMeta?.project || 'Uniswap V3',
        symbol,
        token0,
        token1,
        tvlUsd: poolMeta?.tvlUsd || latestChart?.tvlUsd || 150000000,
        volumeUsd1d: poolMeta?.volumeUsd1d || (poolMeta?.volumeUsd7d ? poolMeta.volumeUsd7d / 7 : 80000000),
        volumeUsd7d: poolMeta?.volumeUsd7d || 500000000,
        feeTierPct,
        feeTierLabel: `${feeTierPct}%`,
        apyBase: poolMeta?.apyBase || latestChart?.apyBase || 35,
        apyBase7d: poolMeta?.apyBase7d || latestChart?.apyBase7d || 25,
        apyMean30d: poolMeta?.apyMean30d || 30,
        currentPrice,
        underlyingTokens: poolMeta?.underlyingTokens || [],
      },
      chart: chartData.slice(-60).map((pt) => ({
        timestamp: pt.timestamp,
        tvlUsd: pt.tvlUsd,
        apy: pt.apy,
        apyBase: pt.apyBase,
        apyBase7d: pt.apyBase7d,
      })),
    };

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.error('Error fetching pool data:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch pool details' },
      { status: 500 }
    );
  }
}

