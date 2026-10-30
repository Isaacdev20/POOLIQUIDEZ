'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from '../components/Header';
import { HeroMonthlyProfitCard } from '../components/HeroMonthlyProfitCard';
import { TimeInRangeCard } from '../components/TimeInRangeCard';
import { PoolConfigPanel } from '../components/PoolConfigPanel';
import { CapitalSplitCard } from '../components/CapitalSplitCard';
import { PriceRangeVisualizer } from '../components/PriceRangeVisualizer';
import { ImpermanentLossSimulator } from '../components/ImpermanentLossSimulator';
import { HistoricalDefiLlamaChart } from '../components/HistoricalDefiLlamaChart';
import { StrategyComparison } from '../components/StrategyComparison';
import { PRESET_POOLS, PresetPool } from '../lib/constants';
import { calculateUniswapV3Simulation } from '../lib/uniswapMath';
import { calculateTimeInRangeStats } from '../lib/timeInRangeMath';
import { SimulationInput, PoolMetadata, DefiLlamaHistoryPoint, HistoricalPricePoint } from '../types';
import { AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';

export default function Home() {
  const [selectedPoolId, setSelectedPoolId] = useState<string>(
    'b99bcdf5-1350-4269-981e-0e9b5cccb007' // WETH-USDC on Base (DefiLlama pool mentioned by user)
  );
  const [pool, setPool] = useState<PoolMetadata | null>(null);
  const [history, setHistory] = useState<DefiLlamaHistoryPoint[]>([]);
  const [historicalPrices, setHistoricalPrices] = useState<HistoricalPricePoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Simulation parameters
  const [input, setInput] = useState<SimulationInput>({
    depositUsd: 10000, // Default $10,000 USD
    currentPrice: 2350,
    priceMin: 2000,
    priceMax: 2700,
    feeTierPct: 0.3,
    poolTvlUsd: 157000000,
    poolDailyVolumeUsd: 96000000,
    days: 30,
    timeHorizon: 'month',
    inRangePercentage: 90,
  });

  // Fetch pool data from internal API route
  const loadPoolData = useCallback(async (poolId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pool/${poolId}`);
      if (!res.ok) {
        throw new Error('Não foi possível carregar os dados desta pool do DefiLlama.');
      }
      const data = await res.json();
      if (data.pool) {
        const p = data.pool;
        setPool(p);
        setHistory(data.chart || []);
        setHistoricalPrices(data.prices || []);

        const curPrice = p.currentPrice || 2350;
        const defaultMin = curPrice * 0.85; // -15%
        const defaultMax = curPrice * 1.15; // +15%

        setInput((prev) => ({
          ...prev,
          currentPrice: curPrice,
          priceMin: defaultMin,
          priceMax: defaultMax,
          feeTierPct: p.feeTierPct || 0.3,
          poolTvlUsd: p.tvlUsd || prev.poolTvlUsd,
          poolDailyVolumeUsd: p.volumeUsd1d || prev.poolDailyVolumeUsd,
        }));
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Erro ao sincronizar com DefiLlama.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadPoolData(selectedPoolId);
  }, [selectedPoolId, loadPoolData]);

  // Handle Preset Pool Selection
  const handleSelectPreset = (preset: PresetPool) => {
    setSelectedPoolId(preset.id);
  };

  // Handle Custom DefiLlama Pool ID
  const handleLoadCustomPoolId = (newPoolId: string) => {
    setSelectedPoolId(newPoolId);
  };

  // Preset range actions
  const handleApplyPresetRange = (pctDown: number, pctUp: number) => {
    const cur = input.currentPrice;
    setInput((prev) => ({
      ...prev,
      priceMin: cur * (1 - pctDown / 100),
      priceMax: cur * (1 + pctUp / 100),
    }));
  };

  const handleApplyFullRange = () => {
    const cur = input.currentPrice;
    setInput((prev) => ({
      ...prev,
      priceMin: cur * 0.001,
      priceMax: cur * 1000,
    }));
  };

  // Compute real Time-in-Range statistics based on DefiLlama historical price series
  const timeInRangeStats = useMemo(() => {
    return calculateTimeInRangeStats(
      historicalPrices,
      input.priceMin,
      input.priceMax,
      input.currentPrice
    );
  }, [historicalPrices, input.priceMin, input.priceMax, input.currentPrice]);

  // Compute simulation result dynamically
  const result = useMemo(() => {
    try {
      return calculateUniswapV3Simulation({
        ...input,
        inRangePercentage: timeInRangeStats.days30.inRangePct > 0 ? timeInRangeStats.days30.inRangePct : 90,
      });
    } catch (e) {
      console.error('Calculation error:', e);
      return null;
    }
  }, [input, timeInRangeStats.days30.inRangePct]);

  return (
    <div className="min-h-screen bg-[#080B10] text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Header
        currentPool={pool}
        onSelectPreset={handleSelectPreset}
        onLoadCustomPoolId={handleLoadCustomPoolId}
        isLoading={isLoading}
        onRefresh={() => loadPoolData(selectedPoolId)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Error notification if any */}
        {error && (
          <div className="bg-danger/10 border border-danger/30 rounded-xl p-3.5 flex items-center justify-between text-xs text-danger">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadPoolData(selectedPoolId)}
              className="px-2.5 py-1 rounded bg-danger/20 hover:bg-danger/30 font-semibold"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* HERO MONTHLY PROFIT CARD - The core answer to the user prompt */}
        {result && (
          <HeroMonthlyProfitCard result={result} pool={pool} />
        )}

        {/* TIME IN RANGE CARD - Box de tempo no range, histórico e duração estimada */}
        {result && (
          <TimeInRangeCard stats={timeInRangeStats} result={result} pool={pool} />
        )}

        {/* 2-Column Grid: Config Controls & Capital Allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Settings */}
          <div className="lg:col-span-7 space-y-6">
            <PoolConfigPanel
              input={input}
              pool={pool}
              onChangeInput={setInput}
              onApplyPresetRange={handleApplyPresetRange}
              onApplyFullRange={handleApplyFullRange}
            />

            {result && (
              <PriceRangeVisualizer result={result} pool={pool} />
            )}
          </div>

          {/* Right Column: Capital Allocation Split & DefiLlama Pool History */}
          <div className="lg:col-span-5 space-y-6">
            {result && (
              <CapitalSplitCard result={result} pool={pool} />
            )}

            <HistoricalDefiLlamaChart history={history} pool={pool} />
          </div>
        </div>

        {/* Strategy Comparison Section */}
        {result && (
          <StrategyComparison
            baseInput={input}
            pool={pool}
            onSelectStrategy={handleApplyPresetRange}
            onSelectFullRange={handleApplyFullRange}
          />
        )}

        {/* Impermanent Loss & PnL Simulator */}
        {result && (
          <ImpermanentLossSimulator result={result} pool={pool} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-surfaceBorder bg-[#0B0F17] py-6 px-4 lg:px-8 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">QuantPool V3 Simulator</span>
            <span>•</span>
            <span>Baseado nos modelos matemáticos do DeFi-Lab e dados em tempo real da DefiLlama</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="https://defi-lab.xyz/uniswapv3simulator"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors"
            >
              DeFi-Lab Simulator ↗
            </a>
            <a
              href="https://defillama.com/yields/pool/b99bcdf5-1350-4269-981e-0e9b5cccb007"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              DefiLlama Base WETH-USDC ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

