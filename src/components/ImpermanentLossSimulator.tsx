'use client';

import React, { useState } from 'react';
import { SimulationResult, PoolMetadata } from '../types';
import { Scale, ArrowRight, ShieldCheck, AlertCircle, TrendingUp, Info } from 'lucide-react';

interface ImpermanentLossSimulatorProps {
  result: SimulationResult;
  pool: PoolMetadata | null;
}

export function ImpermanentLossSimulator({ result, pool }: ImpermanentLossSimulatorProps) {
  const [sliderPct, setSliderPct] = useState<number>(0);

  const targetPrice = result.currentPrice * (1 + sliderPct / 100);
  const sqrtPNew = Math.sqrt(targetPrice);
  const sqrtPa = Math.sqrt(result.priceMin);
  const sqrtPb = Math.sqrt(result.priceMax);
  const L = result.liquidity;

  // HODL value
  const holdValue = result.token0Amount * targetPrice + result.token1Amount;

  // LP value at target price
  let lpValue = 0;
  let status = 'in_range';

  if (targetPrice <= result.priceMin) {
    status = 'below';
    const t0 = L * (1 / sqrtPa - 1 / sqrtPb);
    lpValue = t0 * targetPrice;
  } else if (targetPrice >= result.priceMax) {
    status = 'above';
    const t1 = L * (sqrtPb - sqrtPa);
    lpValue = t1;
  } else {
    status = 'in_range';
    const t0 = (L * (sqrtPb - sqrtPNew)) / (sqrtPNew * sqrtPb);
    const t1 = L * (sqrtPNew - sqrtPa);
    lpValue = t0 * targetPrice + t1;
  }

  const ilUsd = lpValue - holdValue;
  const ilPct = holdValue > 0 ? (ilUsd / holdValue) * 100 : 0;
  const feesMonth = result.monthlyFeeUsd;
  const netPnLMonth = ilUsd + feesMonth;
  const isNetProfitable = netPnLMonth >= 0;

  return (
    <div className="bg-surface rounded-2xl border border-surfaceBorder p-5 md:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-surfaceBorder">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-base text-white">
              Simulador de Perda Impermanente (IL) & Lucro Real
            </h3>
            <p className="text-xs text-slate-400">
              Compare o rendimento da Pool vs Apenas Segurar os Tokens (HODL)
            </p>
          </div>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Taxas 30 dias: <span className="text-emerald-400 font-bold">+${feesMonth.toFixed(2)}</span>
        </span>
      </div>

      {/* Interactive Price Move Slider */}
      <div className="bg-[#080B10] p-4 rounded-xl border border-surfaceBorder mb-6">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-300">
            Simular Variação de Preço do Ativo:
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`font-mono font-bold text-sm ${
                sliderPct > 0 ? 'text-emerald-400' : sliderPct < 0 ? 'text-danger' : 'text-slate-300'
              }`}
            >
              {sliderPct > 0 ? `+${sliderPct}%` : `${sliderPct}%`}
            </span>
            <span className="text-slate-400 font-mono">
              (Preço: ${targetPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
            </span>
          </div>
        </div>

        <input
          type="range"
          min="-50"
          max="50"
          step="1"
          value={sliderPct}
          onChange={(e) => setSliderPct(parseFloat(e.target.value))}
          className="w-full h-2 bg-surfaceLight rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />

        <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
          <span>-50% (Queda Forte)</span>
          <span>0% (Estável)</span>
          <span>+50% (Alta Forte)</span>
        </div>
      </div>

      {/* Outcome Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        {/* HODL Value */}
        <div className="bg-surfaceLight/50 p-3.5 rounded-xl border border-surfaceBorder">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">
            Se apenas fizesse HODL:
          </span>
          <div className="font-mono font-bold text-lg text-white">
            ${holdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Sem risco de pool
          </div>
        </div>

        {/* LP Value */}
        <div className="bg-surfaceLight/50 p-3.5 rounded-xl border border-surfaceBorder">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">
            Valor na Pool (Sem taxas):
          </span>
          <div className="font-mono font-bold text-lg text-white">
            ${lpValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Composição rebalanceada
          </div>
        </div>

        {/* Impermanent Loss */}
        <div className="bg-surfaceLight/50 p-3.5 rounded-xl border border-surfaceBorder">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">
            Perda Impermanente (IL):
          </span>
          <div className="font-mono font-bold text-lg text-danger">
            {ilUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
            <span className="text-xs">({ilPct.toFixed(2)}%)</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Diferença vs HODL
          </div>
        </div>

        {/* NET PROFIT (Fees + IL) */}
        <div
          className={`p-3.5 rounded-xl border ${
            isNetProfitable
              ? 'bg-emerald-500/10 border-emerald-500/40'
              : 'bg-danger/10 border-danger/40'
          }`}
        >
          <span className="text-[11px] font-semibold text-slate-300 block mb-1">
            Resultado Líquido (30d):
          </span>
          <div
            className={`font-mono font-bold text-lg ${
              isNetProfitable ? 'text-emerald-400' : 'text-danger'
            }`}
          >
            {netPnLMonth >= 0 ? '+' : ''}${netPnLMonth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-300 mt-0.5">
            {isNetProfitable ? '✨ Taxas superam o IL!' : 'Atenção ao IL'}
          </div>
        </div>
      </div>

      {/* Scenario Table */}
      <div className="overflow-x-auto rounded-xl border border-surfaceBorder">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#080B10] text-slate-400 border-b border-surfaceBorder">
            <tr>
              <th className="py-2.5 px-3">Variação Preço</th>
              <th className="py-2.5 px-3">Preço Alvo</th>
              <th className="py-2.5 px-3">HODL ($)</th>
              <th className="py-2.5 px-3">LP ($)</th>
              <th className="py-2.5 px-3">IL ($)</th>
              <th className="py-2.5 px-3">Taxas 30d ($)</th>
              <th className="py-2.5 px-3 text-right">Lucro Líquido</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surfaceBorder">
            {result.scenarios.map((sc, i) => {
              const isProfit = sc.netProfitUsd >= 0;
              const isCurrent = Math.abs(sc.priceChangePct) < 0.01;
              return (
                <tr
                  key={i}
                  className={`hover:bg-surfaceLight/50 transition-colors ${
                    isCurrent ? 'bg-emerald-500/10 font-bold' : ''
                  }`}
                >
                  <td className="py-2 px-3 text-slate-200">
                    {sc.priceChangePct > 0 ? `+${sc.priceChangePct}%` : `${sc.priceChangePct}%`}
                    {isCurrent && <span className="ml-1 text-[10px] text-emerald-400">(Atual)</span>}
                  </td>
                  <td className="py-2 px-3 text-slate-300">${sc.targetPrice.toFixed(2)}</td>
                  <td className="py-2 px-3 text-slate-400">${sc.holdValueUsd.toFixed(2)}</td>
                  <td className="py-2 px-3 text-slate-400">${sc.lpValueUsd.toFixed(2)}</td>
                  <td className="py-2 px-3 text-danger">
                    ${sc.impermanentLossUsd.toFixed(2)} ({sc.impermanentLossPct.toFixed(2)}%)
                  </td>
                  <td className="py-2 px-3 text-emerald-400 font-semibold">+${sc.feesEarnedUsd.toFixed(2)}</td>
                  <td className={`py-2 px-3 text-right font-bold ${isProfit ? 'text-emerald-400' : 'text-danger'}`}>
                    {sc.netProfitUsd >= 0 ? '+' : ''}${sc.netProfitUsd.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

