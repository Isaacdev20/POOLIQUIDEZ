'use client';

import React, { useState, useEffect } from 'react';
import { SimulationInput, PoolMetadata } from '../types';
import { Sliders, DollarSign, Layers, Compass, Plus, Minus, AlertCircle } from 'lucide-react';

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

  // Local text buffers to allow natural typing, backspacing and editing
  const [minStr, setMinStr] = useState<string>(input.priceMin.toString());
  const [maxStr, setMaxStr] = useState<string>(input.priceMax.toString());

  // Synchronize when external props change (e.g. presets or pool change)
  useEffect(() => {
    setMinStr(input.priceMin.toString());
  }, [input.priceMin]);

  useEffect(() => {
    setMaxStr(input.priceMax.toString());
  }, [input.priceMax]);

  const handleDepositQuickSet = (val: number) => {
    onChangeInput({ ...input, depositUsd: val });
  };

  const handleMinChange = (val: string) => {
    setMinStr(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      onChangeInput({ ...input, priceMin: num });
    }
  };

  const handleMaxChange = (val: string) => {
    setMaxStr(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      onChangeInput({ ...input, priceMax: num });
    }
  };

  const handleNudgeMin = (pctDelta: number) => {
    const nextVal = Math.max(0.0001, input.priceMin * (1 + pctDelta / 100));
    onChangeInput({ ...input, priceMin: Number(nextVal.toFixed(nextVal < 10 ? 4 : 2)) });
  };

  const handleNudgeMax = (pctDelta: number) => {
    const nextVal = Math.max(0.0001, input.priceMax * (1 + pctDelta / 100));
    onChangeInput({ ...input, priceMax: Number(nextVal.toFixed(nextVal < 10 ? 4 : 2)) });
  };

  // Percent calculation from current price
  const pctDownNum = ((input.priceMin - currentPrice) / currentPrice) * 100;
  const pctDownStr = pctDownNum >= 0 ? `+${pctDownNum.toFixed(1)}%` : `${pctDownNum.toFixed(1)}%`;

  const pctUpNum = ((input.priceMax - currentPrice) / currentPrice) * 100;
  const pctUpStr = pctUpNum >= 0 ? `+${pctUpNum.toFixed(1)}%` : `${pctUpNum.toFixed(1)}%`;

  const isInvalidRange = input.priceMax <= input.priceMin;

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

          {/* Min Price and Max Price Inputs with Natural Editing & Step Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
            {/* Min Price (P_min) */}
            <div className="bg-[#080B10] p-3.5 rounded-xl border border-surfaceBorder">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="font-semibold text-slate-300">Preço Mínimo (P_min)</span>
                <span className="font-mono text-cyan-400 text-[11px] font-semibold">{pctDownStr}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-surfaceLight/60 px-3 py-1.5 rounded-lg border border-surfaceBorder focus-within:border-cyan-400">
                <span className="text-xs text-slate-400 font-bold">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={minStr}
                  onChange={(e) => handleMinChange(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent font-mono font-bold text-sm text-white focus:outline-none"
                />
              </div>

              {/* Nudge Buttons P_min */}
              <div className="flex items-center justify-between gap-1 mt-2">
                <span className="text-[10px] text-slate-500">Ajuste:</span>
                <div className="flex gap-1">
                  {[-5, -1, 1, 5].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleNudgeMin(pct)}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface border border-surfaceBorder text-slate-400 hover:text-white hover:bg-surfaceLight"
                    >
                      {pct > 0 ? `+${pct}%` : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Max Price (P_max) */}
            <div className="bg-[#080B10] p-3.5 rounded-xl border border-surfaceBorder">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="font-semibold text-slate-300">Preço Máximo (P_max)</span>
                <span className="font-mono text-cyan-400 text-[11px] font-semibold">{pctUpStr}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-surfaceLight/60 px-3 py-1.5 rounded-lg border border-surfaceBorder focus-within:border-cyan-400">
                <span className="text-xs text-slate-400 font-bold">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={maxStr}
                  onChange={(e) => handleMaxChange(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent font-mono font-bold text-sm text-white focus:outline-none"
                />
              </div>

              {/* Nudge Buttons P_max */}
              <div className="flex items-center justify-between gap-1 mt-2">
                <span className="text-[10px] text-slate-500">Ajuste:</span>
                <div className="flex gap-1">
                  {[-5, -1, 1, 5, 10].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleNudgeMax(pct)}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface border border-surfaceBorder text-slate-400 hover:text-white hover:bg-surfaceLight"
                    >
                      {pct > 0 ? `+${pct}%` : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Warning badge if range is inverted */}
          {isInvalidRange && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 flex items-center gap-2 text-xs text-amber-300 mt-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400" />
              <span>
                Atenção: O <strong>P_max</strong> (${input.priceMax}) deve ser estritamente superior ao <strong>P_min</strong> (${input.priceMin}).
              </span>
            </div>
          )}
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
