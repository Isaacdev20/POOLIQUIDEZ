'use client';

import React from 'react';
import { DefiLlamaHistoryPoint, PoolMetadata } from '../types';
import { History, TrendingUp, Layers } from 'lucide-react';

interface HistoricalDefiLlamaChartProps {
  history: DefiLlamaHistoryPoint[];
  pool: PoolMetadata | null;
}

export function HistoricalDefiLlamaChart({ history, pool }: HistoricalDefiLlamaChartProps) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-surface rounded-2xl border border-surfaceBorder p-5 text-center text-slate-500 text-xs">
        Carregando histórico do DefiLlama...
      </div>
    );
  }

  // Calculate scales for APY and TVL
  const apys = history.map((h) => h.apy || h.apyBase || 0);
  const tvls = history.map((h) => h.tvlUsd || 0);

  const minApy = Math.max(0, Math.min(...apys) * 0.9);
  const maxApy = Math.max(...apys) * 1.1 || 100;

  const minTvl = Math.min(...tvls) * 0.9;
  const maxTvl = Math.max(...tvls) * 1.1 || 200000000;

  const pointsCount = history.length;
  const width = 800;
  const height = 180;
  const padding = 20;

  // Build SVG path for APY line
  const apyPoints = history.map((pt, i) => {
    const x = padding + (i / (pointsCount - 1 || 1)) * (width - 2 * padding);
    const val = pt.apy || pt.apyBase || 0;
    const y = height - padding - ((val - minApy) / (maxApy - minApy || 1)) * (height - 2 * padding);
    return `${x},${y}`;
  });
  const apyPathD = `M ${apyPoints.join(' L ')}`;

  // Area under APY
  const lastX = padding + (width - 2 * padding);
  const firstX = padding;
  const apyAreaD = `${apyPathD} L ${lastX},${height - padding} L ${firstX},${height - padding} Z`;

  const latestPoint = history[history.length - 1];

  return (
    <div className="bg-surface rounded-2xl border border-surfaceBorder p-5 md:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-surfaceBorder">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="font-bold text-base text-white">
              Histórico Real de Rendimento DefiLlama
            </h3>
            <p className="text-xs text-slate-400">
              Evolução diária do APY e Liquidez (TVL) nos últimos 30-60 dias
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-400">APY Atual:</span>
            <span className="text-emerald-400 font-bold">
              {(latestPoint.apy || latestPoint.apyBase || 0).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-slate-400">TVL:</span>
            <span className="text-cyan-400 font-bold">
              ${((latestPoint.tvlUsd || 0) / 1000000).toFixed(1)}M
            </span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden bg-[#080B10] rounded-xl border border-surfaceBorder p-3">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="apyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={padding}
            y1={padding}
            x2={width - padding}
            y2={padding}
            stroke="#232D42"
            strokeDasharray="4 4"
          />
          <line
            x1={padding}
            y1={height / 2}
            x2={width - padding}
            y2={height / 2}
            stroke="#232D42"
            strokeDasharray="4 4"
          />
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#232D42"
          />

          {/* APY Area & Line */}
          <path d={apyAreaD} fill="url(#apyGradient)" />
          <path
            d={apyPathD}
            fill="none"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Min and Max labels */}
          <text x={padding + 5} y={padding + 12} fill="#94A3B8" fontSize="10" fontFamily="monospace">
            Máx: {maxApy.toFixed(1)}% APY
          </text>
          <text
            x={padding + 5}
            y={height - padding - 5}
            fill="#94A3B8"
            fontSize="10"
            fontFamily="monospace"
          >
            Mín: {minApy.toFixed(1)}% APY
          </text>
        </svg>

        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-2 px-1">
          <span>{new Date(history[0]?.timestamp || '').toLocaleDateString('pt-BR')}</span>
          <span>Dados Oficiais via DefiLlama Yields API</span>
          <span>{new Date(latestPoint?.timestamp || '').toLocaleDateString('pt-BR')}</span>
        </div>
      </div>
    </div>
  );
}

