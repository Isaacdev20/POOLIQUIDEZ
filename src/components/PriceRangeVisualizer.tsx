'use client';

import React from 'react';
import { SimulationResult, PoolMetadata } from '../types';
import { BarChart3, CheckCircle2, AlertTriangle } from 'lucide-react';

interface PriceRangeVisualizerProps {
  result: SimulationResult;
  pool: PoolMetadata | null;
}

export function PriceRangeVisualizer({ result, pool }: PriceRangeVisualizerProps) {
  const { currentPrice, priceMin, priceMax, capitalEfficiency } = result;
  const isInRange = currentPrice >= priceMin && currentPrice <= priceMax;

  // Calculate percentage position of current price inside a broader visual window [0.6 * min, 1.4 * max]
  const viewMin = priceMin * 0.7;
  const viewMax = priceMax * 1.3;
  const viewSpan = viewMax - viewMin;

  const leftPct = Math.max(0, Math.min(100, ((priceMin - viewMin) / viewSpan) * 100));
  const rightPct = Math.max(0, Math.min(100, ((priceMax - viewMin) / viewSpan) * 100));
  const currentPct = Math.max(0, Math.min(100, ((currentPrice - viewMin) / viewSpan) * 100));
  const widthPct = Math.max(2, rightPct - leftPct);

  return (
    <div className="bg-surface rounded-2xl border border-surfaceBorder p-5 md:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-surfaceBorder">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-base text-white">Visualizador da Faixa de Concentração</h3>
        </div>
        <div className="flex items-center gap-2">
          {isInRange ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Preço Ativo ({result.downsideBufferPct.toFixed(1)}% / +{result.upsideBufferPct.toFixed(1)}%)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-danger bg-danger/10 border border-danger/20 px-2.5 py-1 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5" />
              Fora da Faixa
            </span>
          )}
        </div>
      </div>

      {/* Visual Chart Canvas / SVG Container */}
      <div className="relative h-44 bg-[#080B10] rounded-xl border border-surfaceBorder p-4 overflow-hidden flex flex-col justify-end">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-6 pointer-events-none opacity-10 border-b border-surfaceBorder">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border-r border-slate-500 h-full" />
          ))}
        </div>

        {/* Concentrated Liquidity Area (Box & Density Mountain) */}
        <div
          className="absolute bottom-10 top-6 rounded-xl bg-gradient-to-t from-emerald-500/25 via-emerald-500/15 to-emerald-400/5 border-2 border-emerald-400/60 transition-all duration-300 flex flex-col items-center justify-between py-2"
          style={{
            left: `${leftPct}%`,
            width: `${widthPct}%`,
          }}
        >
          <div className="text-[10px] font-mono font-bold text-emerald-300 bg-[#0B0F17]/90 px-2 py-0.5 rounded border border-emerald-500/30 shadow">
            Concentração {capitalEfficiency.toFixed(1)}x
          </div>
          <div className="text-[9px] text-emerald-400/80 uppercase font-semibold tracking-wider">
            Zona de Coleta de Taxas
          </div>
        </div>

        {/* Left Out of Range Label */}
        <div
          className="absolute bottom-12 text-[10px] text-slate-500 font-mono text-center pointer-events-none"
          style={{ left: `${Math.max(2, leftPct / 2)}%` }}
        >
          100% {pool?.token0 || 'TOKEN0'}
        </div>

        {/* Right Out of Range Label */}
        <div
          className="absolute bottom-12 text-[10px] text-slate-500 font-mono text-center pointer-events-none"
          style={{ right: `${Math.max(2, (100 - rightPct) / 2)}%` }}
        >
          100% {pool?.token1 || 'USDC'}
        </div>

        {/* Current Price Pin */}
        <div
          className="absolute top-2 bottom-8 w-[2px] bg-cyan-400 transition-all duration-300 z-20"
          style={{ left: `${currentPct}%` }}
        >
          <div className="absolute -top-1 -translate-x-1/2 bg-cyan-400 text-black text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow-lg shadow-cyan-400/50 whitespace-nowrap">
            Atual: ${currentPrice.toFixed(2)}
          </div>
          <div className="absolute top-5 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 animate-ping opacity-75" />
        </div>

        {/* Axis Bar */}
        <div className="h-1.5 w-full bg-surfaceBorder rounded-full relative z-10">
          {/* Price Min Pin */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black"
            style={{ left: `${leftPct}%` }}
          />
          {/* Price Max Pin */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black"
            style={{ left: `${rightPct}%` }}
          />
        </div>

        {/* Axis Labels */}
        <div className="relative w-full h-6 mt-1 text-[11px] font-mono text-slate-400">
          <span
            className="absolute -translate-x-1/2 text-emerald-400 font-bold"
            style={{ left: `${leftPct}%` }}
          >
            ${priceMin.toFixed(2)} (Min)
          </span>
          <span
            className="absolute -translate-x-1/2 text-emerald-400 font-bold"
            style={{ left: `${rightPct}%` }}
          >
            ${priceMax.toFixed(2)} (Max)
          </span>
        </div>
      </div>
    </div>
  );
}

