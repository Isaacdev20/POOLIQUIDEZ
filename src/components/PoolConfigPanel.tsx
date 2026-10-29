'use client';

import React from 'react';
import { SimulationInput, PoolMetadata } from '../types';
import { Sliders, DollarSign, Layers, Compass, HelpCircle } from 'lucide-react';

interface PoolConfigPanelProps {
  input: SimulationInput;
  pool: PoolMetadata | null;
  onChangeInput: (newInput: SimulationInput) => void;
  onApplyPresetRange: (pctDown: number, pctUp: number) => void;
  onApplyFullRange: () => void;
}

export function PoolConfigPanel({
  input,
  pool,
  onChangeInput,
  onApplyPresetRange,
  onApplyFullRange,
}: PoolConfigPanelProps) {
  const currentPrice = input.currentPrice;

  const handleDepositQuickSet = (val: number) => {
    onChangeInput({ ...input, depositUsd: val });
  };

  const pctDown = (((input.priceMin - currentPrice) / currentPrice) * 100).toFixed(1);
  const pctUp = (((input.priceMax - currentPrice) / currentPrice) * 100).toFixed(1);

  return (
    <div className="bg-surface rounded-2xl border border-surfaceBorder p-5 md:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-surfaceBorder">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-base text-white">Configuração da Simulação</h3>
        </div>
        <span className="text-xs text-slate-400">
          Baseado em <span className="text-cyan-300 font-mono">DeFi-Lab V3 Math</span>
        </span>
      </div>

      <div className="space-y-6">
        {/* 1. Deposit Amount */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Capital para a Pool (USD):
            </label>
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400">$</span>
              <input
                type="number"
                min="10"
                step="100"
                value={input.depositUsd}
                onChange={(e) =>
                  onChangeInput({ ...input, depositUsd: Math.max(1, parseFloat(e.target.value) || 0) })
                }
                className="w-28 text-right font-mono font-bold text-sm bg-[#080B10] border border-surfaceBorder rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <input
            type="range"
            min="100"
            max="100000"
            step="500"
            value={input.depositUsd}
            onChange={(e) => onChangeInput({ ...input, depositUsd: parseFloat(e.target.value) })}
            className="w-full h-2 bg-[#080B10] rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />

          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {[1000, 3000, 5000, 10000, 25000, 50000].map((amt) => (
              <button
                key={amt}
                onClick={() => handleDepositQuickSet(amt)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-all ${
                  input.depositUsd === amt
                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                    : 'bg-surfaceLight text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                ${amt >= 1000 ? `${amt / 1000}k` : amt}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Concentrated Liquidity Range */}
        <div className="pt-2 border-t border-surfaceBorder">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-cyan-400" />
              Faixa de Preço Concentrada:
            </label>
            <div className="text-xs text-slate-400">
              Preço Atual:{' '}
              <span className="font-mono font-bold text-white">
                ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Range Presets (DeFi-Lab Style) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            <button
              onClick={() => onApplyPresetRange(5, 5)}
              className="px-2.5 py-2 rounded-xl text-xs font-semibold bg-surfaceLight border border-surfaceBorder hover:border-cyan-400 hover:text-cyan-300 transition-all flex flex-col items-center"
            >
              <span className="text-cyan-400">Estrito (±5%)</span>
              <span className="text-[10px] text-slate-400 font-normal">Máxima taxa / Mais ativo</span>
            </button>
            <button
              onClick={() => onApplyPresetRange(15, 15)}
              className="px-2.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 transition-all flex flex-col items-center"
            >
              <span>Equilibrado (±15%)</span>
              <span className="text-[10px] text-emerald-400/80 font-normal">Recomendado DeFi-Lab</span>
            </button>
            <button
              onClick={() => onApplyPresetRange(30, 30)}
              className="px-2.5 py-2 rounded-xl text-xs font-semibold bg-surfaceLight border border-surfaceBorder hover:border-cyan-400 hover:text-cyan-300 transition-all flex flex-col items-center"
            >
              <span className="text-purple-400">Amplo (±30%)</span>
              <span className="text-[10px] text-slate-400 font-normal">Menor risco de sair</span>
            </button>
            <button
              onClick={onApplyFullRange}
              className="px-2.5 py-2 rounded-xl text-xs font-semibold bg-surfaceLight border border-surfaceBorder hover:border-slate-500 text-slate-300 transition-all flex flex-col items-center"
            >
              <span>Full Range (V2)</span>
              <span className="text-[10px] text-slate-400 font-normal">0 a ∞ / Sem IL extra</span>
            </button>
          </div>

          {/* Min Price and Max Price Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {/* Min Price */}
            <div className="bg-[#080B10] p-3 rounded-xl border border-surfaceBorder">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Preço Mínimo (P_min)</span>
                <span className="font-mono text-cyan-400 text-[11px] font-semibold">{pctDown}%</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-500">$</span>
                <input
                  type="number"
                  step="any"
                  value={input.priceMin}
                  onChange={(e) =>
                    onChangeInput({ ...input, priceMin: Math.max(0.0001, parseFloat(e.target.value) || 0) })
                  }
                  className="w-full bg-transparent font-mono font-bold text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Max Price */}
            <div className="bg-[#080B10] p-3 rounded-xl border border-surfaceBorder">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Preço Máximo (P_max)</span>
                <span className="font-mono text-cyan-400 text-[11px] font-semibold">+{pctUp}%</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-500">$</span>
                <input
                  type="number"
                  step="any"
                  value={input.priceMax}
                  onChange={(e) =>
                    onChangeInput({ ...input, priceMax: Math.max(input.priceMin + 0.0001, parseFloat(e.target.value) || 0) })
                  }
                  className="w-full bg-transparent font-mono font-bold text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Pool Market Metrics (DefiLlama / Simulator Parameters) */}
        <div className="pt-2 border-t border-surfaceBorder space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purpleAccent" />
              Dados do Mercado (DefiLlama):
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">
              Fee Tier: {input.feeTierPct}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-surfaceLight/60 p-2.5 rounded-xl border border-surfaceBorder">
              <div className="text-slate-400 mb-0.5">TVL da Pool:</div>
              <div className="font-mono font-bold text-slate-100">
                ${(input.poolTvlUsd / 1_000_000).toFixed(1)}M USD
              </div>
            </div>

            <div className="bg-surfaceLight/60 p-2.5 rounded-xl border border-surfaceBorder">
              <div className="text-slate-400 mb-0.5">Volume 24h:</div>
              <div className="font-mono font-bold text-emerald-400">
                ${(input.poolDailyVolumeUsd / 1_000_000).toFixed(1)}M USD
              </div>
            </div>
          </div>

          {/* Volume Sensitivity Preset Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-400">Volume:</span>
            <button
              onClick={() =>
                onChangeInput({
                  ...input,
                  poolDailyVolumeUsd: (pool?.volumeUsd1d || 80000000) * 0.7,
                })
              }
              className="px-2 py-0.5 rounded text-[10px] bg-surfaceLight border border-surfaceBorder text-slate-300 hover:text-white"
            >
              Conservador (-30%)
            </button>
            <button
              onClick={() =>
                onChangeInput({
                  ...input,
                  poolDailyVolumeUsd: pool?.volumeUsd1d || 80000000,
                })
              }
              className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
            >
              DefiLlama Real
            </button>
            <button
              onClick={() =>
                onChangeInput({
                  ...input,
                  poolDailyVolumeUsd: (pool?.volumeUsd1d || 80000000) * 1.5,
                })
              }
              className="px-2 py-0.5 rounded text-[10px] bg-surfaceLight border border-surfaceBorder text-slate-300 hover:text-white"
            >
              Otimista (+50%)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

