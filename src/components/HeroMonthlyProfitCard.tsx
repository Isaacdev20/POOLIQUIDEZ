'use client';

import React from 'react';
import { SimulationResult, PoolMetadata } from '../types';
import { DollarSign, TrendingUp, Calendar, Zap, ShieldCheck, ArrowUpRight, Percent, Award } from 'lucide-react';

interface HeroMonthlyProfitCardProps {
  result: SimulationResult;
  pool: PoolMetadata | null;
}

export function HeroMonthlyProfitCard({ result, pool }: HeroMonthlyProfitCardProps) {
  const isOutOfRange =
    result.currentPrice < result.priceMin || result.currentPrice > result.priceMax;

  // Estimate in BRL for Brazilian context (USDT/BRL ~ 5.80)
  const usdToBrl = 5.8;
  const monthlyBrl = result.monthlyFeeUsd * usdToBrl;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D1420] via-[#0B0F17] to-[#0A101D] border border-emerald-500/30 p-6 md:p-8 shadow-2xl glow-emerald">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Header of the Hero Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wider text-slate-300 uppercase">
              Projeção de Rendimento Mensal Líquido
            </h2>
            <p className="text-xs text-slate-400">
              Taxas brutas estimadas com base no volume e liquidez da pool {pool?.symbol || ''} ({pool?.feeTierLabel || '0.3%'})
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {isOutOfRange ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-danger/20 border border-danger/40 text-danger">
              <span className="w-2 h-2 rounded-full bg-danger animate-ping" />
              Fora da Faixa (0 taxas geradas)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              No Range Ativo (Gerando taxas 24/7)
            </span>
          )}
        </div>
      </div>

      {/* MAIN HERO NUMBERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Left: The Big Monthly Metric */}
        <div className="lg:col-span-6 bg-[#080C14]/90 rounded-2xl p-6 border border-emerald-500/20 shadow-inner">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              O QUE VOCÊ VAI GANHAR POR MÊS:
            </span>
            <span className="text-xs font-mono font-semibold text-slate-400">
              (Projeção 30 dias)
            </span>
          </div>

          <div className="flex items-baseline gap-3 my-2">
            <span className="text-4xl md:text-5xl font-black font-mono tracking-tight text-white">
              +${result.monthlyFeeUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xl md:text-2xl font-bold font-mono text-emerald-400 flex items-center">
              (+{result.monthlyReturnPct.toFixed(2)}%)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-surfaceBorder text-xs text-slate-300">
            <span className="text-slate-400">Aproximadamente em Reais:</span>
            <span className="font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ≈ R$ {monthlyBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mês
            </span>
            <span className="text-[11px] text-slate-500">(câmbio US$ 1 = R$ {usdToBrl.toFixed(2)})</span>
          </div>
        </div>

        {/* Right: Daily, Weekly & Annual Breakdown */}
        <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Daily Card */}
          <div className="bg-surface/80 rounded-xl p-3.5 border border-surfaceBorder hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-semibold uppercase">Por Dia</span>
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="font-mono font-bold text-lg text-white">
              +${result.dailyFeeUsd.toFixed(2)}
            </div>
            <div className="text-[11px] font-mono text-emerald-400 mt-0.5">
              +{result.dailyReturnPct.toFixed(3)}% / dia
            </div>
          </div>

          {/* Weekly Card */}
          <div className="bg-surface/80 rounded-xl p-3.5 border border-surfaceBorder hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-semibold uppercase">Por Semana</span>
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="font-mono font-bold text-lg text-white">
              +${result.weeklyFeeUsd.toFixed(2)}
            </div>
            <div className="text-[11px] font-mono text-emerald-400 mt-0.5">
              +{(result.dailyReturnPct * 7).toFixed(2)}% / semana
            </div>
          </div>

          {/* APR Card */}
          <div className="bg-surface/80 rounded-xl p-3.5 border border-surfaceBorder hover:border-slate-600 transition-all col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-semibold uppercase">Taxa Anual (APR)</span>
              <TrendingUp className="w-3.5 h-3.5 text-purpleAccent" />
            </div>
            <div className="font-mono font-bold text-lg text-emerald-400">
              +{result.feeAprPct.toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              APY Comp: <span className="text-white font-mono">{result.feeApyCompoundPct.toFixed(1)}%</span>
            </div>
          </div>

          {/* Capital Efficiency Multiplier */}
          <div className="bg-surface/80 rounded-xl p-3.5 border border-surfaceBorder hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-semibold uppercase">Eficiência V3</span>
              <Award className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="font-mono font-bold text-lg text-amber-400">
              {result.capitalEfficiency.toFixed(1)}x
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Mais taxas que V2 (0 a ∞)
            </div>
          </div>

          {/* Break-even against IL */}
          <div className="bg-surface/80 rounded-xl p-3.5 border border-surfaceBorder hover:border-slate-600 transition-all col-span-2">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-semibold uppercase">Amortização de Risco</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono font-bold text-lg text-white">
                {result.breakEvenDays} dias de taxas
              </span>
              <span className="text-[11px] text-slate-400">
                pagam uma oscilação de 10%
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Margem de queda segura: <span className="text-cyan-300 font-mono">-{result.downsideBufferPct.toFixed(1)}%</span> | Alta: <span className="text-cyan-300 font-mono">+{result.upsideBufferPct.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

