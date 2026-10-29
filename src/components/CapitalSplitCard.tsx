'use client';

import React from 'react';
import { SimulationResult, PoolMetadata } from '../types';
import { PieChart, ArrowRightLeft, Info } from 'lucide-react';

interface CapitalSplitCardProps {
  result: SimulationResult;
  pool: PoolMetadata | null;
}

export function CapitalSplitCard({ result, pool }: CapitalSplitCardProps) {
  const token0Symbol = pool?.token0 || 'TOKEN 0';
  const token1Symbol = pool?.token1 || 'TOKEN 1';

  return (
    <div className="bg-surface rounded-2xl border border-surfaceBorder p-5 md:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-surfaceBorder">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-base text-white">Composição do Capital Inicial</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Total: ${result.initialDepositUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Visual Progress Bar Ratio */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-cyan-400 flex items-center gap-1 font-mono">
            {token0Symbol}: {result.token0RatioPct.toFixed(1)}%
          </span>
          <span className="text-emerald-400 flex items-center gap-1 font-mono">
            {token1Symbol}: {result.token1RatioPct.toFixed(1)}%
          </span>
        </div>

        <div className="w-full h-3.5 bg-[#080B10] rounded-full overflow-hidden flex border border-surfaceBorder p-0.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-l-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, result.token0RatioPct))}%` }}
          />
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-r-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, result.token1RatioPct))}%` }}
          />
        </div>
      </div>

      {/* Detailed Tokens Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Token 0 */}
        <div className="bg-[#080B10] p-3.5 rounded-xl border border-cyan-500/30">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-cyan-300">{token0Symbol}</span>
            <span className="text-[11px] text-slate-400 font-mono">
              ${result.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="text-lg font-mono font-bold text-white mb-0.5">
            {result.token0Amount.toFixed(4)} {token0Symbol}
          </div>
          <div className="text-xs text-slate-400 font-mono">
            ≈ ${result.token0ValueUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Token 1 */}
        <div className="bg-[#080B10] p-3.5 rounded-xl border border-emerald-500/30">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-emerald-300">{token1Symbol}</span>
            <span className="text-[11px] text-slate-400 font-mono">$1.00</span>
          </div>
          <div className="text-lg font-mono font-bold text-white mb-0.5">
            {result.token1Amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
            {token1Symbol}
          </div>
          <div className="text-xs text-slate-400 font-mono">
            ≈ ${result.token1ValueUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="bg-surfaceLight/50 p-3 rounded-xl border border-surfaceBorder flex items-start gap-2 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Na liquidez concentrada do Uniswap V3, a divisão não precisa ser 50/50. Conforme o preço atual se aproxima da borda mínima ou máxima, a proporção necessária de cada token se ajusta automaticamente.
        </p>
      </div>
    </div>
  );
}

