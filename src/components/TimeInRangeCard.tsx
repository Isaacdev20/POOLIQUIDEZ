'use client';

import React, { useState } from 'react';
import { TimeInRangeStats, SimulationResult, PoolMetadata } from '../types';
import { Clock, CheckCircle2, AlertTriangle, ShieldCheck, Zap, Calendar, TrendingUp, Info } from 'lucide-react';

interface TimeInRangeCardProps {
  stats: TimeInRangeStats;
  result: SimulationResult;
  pool: PoolMetadata | null;
}

export function TimeInRangeCard({ stats, result, pool }: TimeInRangeCardProps) {
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);

  const isInRange = stats.currentStatus === 'in_range';
  const isCovering30dExtremes =
    result.priceMin <= stats.minPriceHistorical30d && result.priceMax >= stats.maxPriceHistorical30d;

  return (
    <div className="bg-surface rounded-2xl border border-surfaceBorder p-5 md:p-6 shadow-xl relative overflow-hidden">
      {/* Subtle background glow */}
      <div
        className={`absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
          isInRange ? 'bg-emerald-500/10' : 'bg-danger/10'
        }`}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-surfaceBorder relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              Tempo no Range & Estabilidade da Pool
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Backtest DefiLlama
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Quanto tempo o par {pool?.symbol || 'ativo'} permaneceu na sua faixa e expectativa de duração
            </p>
          </div>
        </div>

        {/* Current status indicator */}
        <div className="flex items-center gap-2">
          {isInRange ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Ativo no Range há {stats.currentStreakDays} {stats.currentStreakDays === 1 ? 'dia' : 'dias'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-danger/20 border border-danger/40 text-danger">
              <span className="w-2 h-2 rounded-full bg-danger animate-ping" />
              Fora do Range há {stats.currentStreakDays} {stats.currentStreakDays === 1 ? 'dia' : 'dias'}
            </span>
          )}
        </div>
      </div>

      {/* 2-Column Spotlight: Duração Média Estimada vs Taxa Histórica 30d */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 relative z-10">
        {/* Card 1: Expectativa de Duração */}
        <div className="bg-[#080B10] rounded-xl p-4 border border-surfaceBorder flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Duração Média Estimada no Range:
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Modelo Browniano</span>
          </div>

          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-extrabold font-mono text-amber-400">
              ~{stats.estimatedDurationDays > 0 ? stats.estimatedDurationDays : 0} dias
            </span>
            <span className="text-xs text-slate-400">
              {stats.estimatedDurationDays > 60
                ? '(Alta estabilidade / Pouca manutenção)'
                : stats.estimatedDurationDays > 15
                ? '(Equilíbrio ideal entre taxas e rebalanceamento)'
                : '(Faixa agressiva: exige rebalanceamento frequente)'}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-surfaceBorder/80 leading-relaxed">
            Com volatilidade de <span className="text-white font-mono">{stats.dailyVolatilityPct.toFixed(1)}%/dia</span> e amplitude de <span className="text-cyan-300 font-mono">{result.rangeWidthPct.toFixed(1)}%</span>, essa é a média de dias que a pool costuma gerar taxas antes de atingir os limites.
          </p>
        </div>

        {/* Card 2: Backtest de Retenção nos Últimos 30 Dias */}
        <div className="bg-[#080B10] rounded-xl p-4 border border-surfaceBorder flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              Tempo no Range (Últimos 30 Dias):
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {stats.days30.inRangePct.toFixed(1)}% do tempo
            </span>
          </div>

          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-extrabold font-mono text-white">
              {stats.days30.inRangeDays} <span className="text-lg font-normal text-slate-400">de 30 dias</span>
            </span>
            <span className="text-xs text-emerald-400 font-semibold font-mono">
              ({stats.days30.inRangePct.toFixed(0)}% in-range)
            </span>
          </div>

          {/* Mini Progress bars for 7d, 30d and 60d */}
          <div className="space-y-1.5 mt-2 pt-2 border-t border-surfaceBorder/80 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Últimos 7 dias:</span>
              <span className="font-mono text-slate-200">
                {stats.days7.inRangeDays}/{stats.days7.totalDays} dias ({stats.days7.inRangePct.toFixed(0)}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-surfaceLight rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${stats.days7.inRangePct}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400">Últimos 60 dias:</span>
              <span className="font-mono text-slate-200">
                {stats.days60.inRangeDays}/{stats.days60.totalDays} dias ({stats.days60.inRangePct.toFixed(0)}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-surfaceLight rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${stats.days60.inRangePct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Timeline of the Last 30 Days (Daily In-Range Blocks) */}
      <div className="bg-[#080B10] rounded-xl p-4 border border-surfaceBorder relative z-10 mb-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            Histórico Diário dos Últimos 30 Dias:
          </span>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 font-mono">
              <span className="w-2.5 h-2.5 rounded bg-emerald-400 inline-block" />
              Dentro do Range
            </span>
            <span className="flex items-center gap-1 font-mono">
              <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" />
              Fora do Range
            </span>
          </div>
        </div>

        {/* 30 Day Blocks Grid */}
        <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-30 gap-1.5">
          {stats.dailyTimeline.map((pt, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
              className={`h-8 rounded-md transition-all cursor-pointer flex items-center justify-center text-[9px] font-mono font-bold ${
                pt.inRange
                  ? 'bg-emerald-500/25 border border-emerald-500/60 text-emerald-300 hover:bg-emerald-400 hover:text-black'
                  : 'bg-rose-500/25 border border-rose-500/60 text-rose-300 hover:bg-rose-400 hover:text-black'
              }`}
              title={`${pt.date}: $${pt.price.toFixed(2)} (${pt.inRange ? 'Dentro do Range' : 'Fora'})`}
            >
              {idx === stats.dailyTimeline.length - 1 ? 'Hoje' : ''}
            </div>
          ))}
        </div>

        {/* Hovered point details */}
        <div className="mt-2.5 min-h-[20px] text-[11px] text-slate-400 flex items-center justify-between font-mono">
          {hoveredPoint ? (
            <>
              <span className="text-white">
                Data: <span className="text-cyan-400 font-bold">{hoveredPoint.date}</span> | Preço: <span className="text-emerald-400 font-bold">${hoveredPoint.price.toFixed(2)}</span>
              </span>
              <span className={hoveredPoint.inRange ? 'text-emerald-400' : 'text-danger'}>
                {hoveredPoint.inRange ? '✓ Estava dentro da faixa' : '✕ Estava fora da faixa'}
              </span>
            </>
          ) : (
            <span className="text-slate-500 italic">
              Passe o mouse sobre os blocos acima para inspecionar cada dia individualmente.
            </span>
          )}
        </div>
      </div>

      {/* Extremes vs Range Boundaries footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surfaceLight/40 rounded-xl p-3 border border-surfaceBorder text-xs text-slate-300 relative z-10">
        <div className="flex items-center gap-2">
          {isCovering30dExtremes ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          )}
          <span>
            Extremos dos últimos 30d:{' '}
            <span className="font-mono font-bold text-white">
              ${stats.minPriceHistorical30d.toFixed(2)}
            </span>{' '}
            a{' '}
            <span className="font-mono font-bold text-white">
              ${stats.maxPriceHistorical30d.toFixed(2)}
            </span>{' '}
            | Seu Range:{' '}
            <span className="font-mono text-cyan-300">
              ${result.priceMin.toFixed(2)} — ${result.priceMax.toFixed(2)}
            </span>
          </span>
        </div>

        {isCovering30dExtremes ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 whitespace-nowrap">
            ✓ Cobre 100% da oscilação de 30d
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 whitespace-nowrap">
            Parcialmente fora dos extremos de 30d
          </span>
        )}
      </div>
    </div>
  );
}
