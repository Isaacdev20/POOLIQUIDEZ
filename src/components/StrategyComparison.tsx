'use client';

import React from 'react';
import { calculateUniswapV3Simulation } from '../lib/uniswapMath';
import { SimulationInput, PoolMetadata } from '../types';
import { Target, Zap, Shield, Check, ArrowRight } from 'lucide-react';

interface StrategyComparisonProps {
  baseInput: SimulationInput;
  pool: PoolMetadata | null;
  onSelectStrategy: (pctDown: number, pctUp: number) => void;
  onSelectFullRange: () => void;
}

export function StrategyComparison({
  baseInput,
  pool,
  onSelectStrategy,
  onSelectFullRange,
}: StrategyComparisonProps) {
  const currentPrice = baseInput.currentPrice;

  // 1. Narrow
  const narrowMin = currentPrice * 0.95;
  const narrowMax = currentPrice * 1.05;
  const narrowRes = calculateUniswapV3Simulation({
    ...baseInput,
    priceMin: narrowMin,
    priceMax: narrowMax,
  });

  // 2. Balanced
  const balancedMin = currentPrice * 0.85;
  const balancedMax = currentPrice * 1.15;
  const balancedRes = calculateUniswapV3Simulation({
    ...baseInput,
    priceMin: balancedMin,
    priceMax: balancedMax,
  });

  // 3. Wide
  const wideMin = currentPrice * 0.7;
  const wideMax = currentPrice * 1.3;
  const wideRes = calculateUniswapV3Simulation({
    ...baseInput,
    priceMin: wideMin,
    priceMax: wideMax,
  });

  // 4. Full Range (V2)
  const fullMin = currentPrice * 0.001;
  const fullMax = currentPrice * 1000;
  const fullRes = calculateUniswapV3Simulation({
    ...baseInput,
    priceMin: fullMin,
    priceMax: fullMax,
  });

  const strategies = [
    {
      title: 'Estrito / Agressivo',
      rangeLabel: '±5% do preço',
      min: narrowMin,
      max: narrowMax,
      res: narrowRes,
      riskLevel: 'Alto (Requer Gestão Ativa)',
      riskBadgeClass: 'bg-danger/20 text-danger border-danger/30',
      badge: 'Ganhos Máximos',
      onClick: () => onSelectStrategy(5, 5),
    },
    {
      title: 'Equilibrado (DeFi-Lab)',
      rangeLabel: '±15% do preço',
      min: balancedMin,
      max: balancedMax,
      res: balancedRes,
      riskLevel: 'Moderado (Recomendado)',
      riskBadgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      badge: 'Melhor Custo/Benefício',
      isPopular: true,
      onClick: () => onSelectStrategy(15, 15),
    },
    {
      title: 'Amplo / Conservador',
      rangeLabel: '±30% do preço',
      min: wideMin,
      max: wideMax,
      res: wideRes,
      riskLevel: 'Baixo (Pouca Manutenção)',
      riskBadgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      badge: 'Mais Seguro',
      onClick: () => onSelectStrategy(30, 30),
    },
    {
      title: 'Full Range (V2)',
      rangeLabel: '0 até ∞',
      min: fullMin,
      max: fullMax,
      res: fullRes,
      riskLevel: 'Nenhum Risco de Range',
      riskBadgeClass: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
      badge: 'Modo Passivo',
      onClick: () => onSelectFullRange(),
    },
  ];

  return (
    <div className="bg-surface rounded-2xl border border-surfaceBorder p-5 md:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-surfaceBorder">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purpleAccent" />
          <div>
            <h3 className="font-bold text-base text-white">
              Comparativo de Estratégias de Faixa
            </h3>
            <p className="text-xs text-slate-400">
              Veja quanto o mesmo capital (${baseInput.depositUsd.toLocaleString('en-US')}) rende em diferentes perfis
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {strategies.map((strat, i) => (
          <div
            key={i}
            className={`rounded-2xl p-4 border flex flex-col justify-between transition-all ${
              strat.isPopular
                ? 'bg-gradient-to-b from-emerald-500/10 to-surfaceLight border-emerald-500/50 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                : 'bg-[#080B10] border-surfaceBorder hover:border-slate-600'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/40 text-slate-300 border border-surfaceBorder">
                  {strat.badge}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${strat.riskBadgeClass}`}>
                  {strat.rangeLabel}
                </span>
              </div>

              <h4 className="font-bold text-sm text-white mb-3">{strat.title}</h4>

              {/* Monthly Profit */}
              <div className="bg-surface/80 rounded-xl p-3 border border-surfaceBorder mb-3">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  Ganho Estimado / Mês
                </div>
                <div className="text-xl font-black font-mono text-emerald-400 my-0.5">
                  +${strat.res.monthlyFeeUsd.toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-300 font-mono">
                  +{strat.res.monthlyReturnPct.toFixed(2)}% / mês
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-1.5 text-xs font-mono mb-4 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Por dia:</span>
                  <span className="text-white">+${strat.res.dailyFeeUsd.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">APR Anual:</span>
                  <span className="text-emerald-400 font-bold">+{strat.res.feeAprPct.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Eficiência V3:</span>
                  <span className="text-amber-400 font-bold">{strat.res.capitalEfficiency.toFixed(1)}x</span>
                </div>
              </div>
            </div>

            <button
              onClick={strat.onClick}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                strat.isPopular
                  ? 'bg-emerald-400 text-black hover:bg-emerald-300 shadow-md shadow-emerald-400/20'
                  : 'bg-surfaceLight text-slate-200 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span>Aplicar Faixa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

