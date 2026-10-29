'use client';

import React, { useState } from 'react';
import { PRESET_POOLS, PresetPool } from '../lib/constants';
import { PoolMetadata } from '../types';
import { Layers, Search, ExternalLink, Activity, Sparkles, RefreshCw } from 'lucide-react';

interface HeaderProps {
  currentPool: PoolMetadata | null;
  onSelectPreset: (preset: PresetPool) => void;
  onLoadCustomPoolId: (poolId: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
}

export function Header({
  currentPool,
  onSelectPreset,
  onLoadCustomPoolId,
  isLoading,
  onRefresh,
}: HeaderProps) {
  const [customInput, setCustomInput] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    // Extract UUID if full URL was pasted
    // e.g. https://defillama.com/yields/pool/b99bcdf5-1350-4269-981e-0e9b5cccb007
    let cleanId = customInput.trim();
    const urlMatch = cleanId.match(/pool\/([a-f0-9\-]+)/i);
    if (urlMatch && urlMatch[1]) {
      cleanId = urlMatch[1];
    }

    onLoadCustomPoolId(cleanId);
    setShowCustomModal(false);
    setCustomInput('');
  };

  return (
    <header className="border-b border-surfaceBorder bg-[#0B0F17]/90 backdrop-blur sticky top-0 z-50 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-[1px] flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <div className="w-full h-full bg-[#0B0F17] rounded-xl flex items-center justify-center">
                <Layers className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  QuantPool <span className="text-emerald-400 font-mono text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 uppercase tracking-normal">V3</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                  <Activity className="w-3 h-3 animate-pulse" />
                  DeFi-Lab + DefiLlama
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Simulador Institucional de Rendimento & Perda Impermanente
              </p>
            </div>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg bg-surfaceLight border border-surfaceBorder text-slate-300 hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Center / Pools Selector */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 hidden lg:inline">
            Pools Principais:
          </span>
          {PRESET_POOLS.map((preset) => {
            const isSelected = currentPool?.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/20'
                    : 'bg-surface border border-surfaceBorder text-slate-300 hover:bg-surfaceLight hover:border-slate-600'
                }`}
              >
                <span>{preset.icon0}</span>
                <span>{preset.symbol}</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-black/40 text-slate-400">
                  {preset.chain}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {preset.feeTierLabel}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setShowCustomModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-all"
            title="Importar qualquer pool do DefiLlama"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Colar ID DefiLlama</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface border border-surfaceBorder text-slate-300 hover:bg-surfaceLight hover:text-white transition-all ml-1"
            title="Recarregar cotações e APY"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isLoading ? 'Sincronizando...' : 'Atualizar'}</span>
          </button>
        </div>
      </div>

      {/* Modal for Custom DefiLlama Pool */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0F141E] border border-surfaceBorder rounded-2xl p-6 shadow-2xl shadow-cyan-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base text-white">Importar Pool do DefiLlama</h3>
              </div>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Cole o link direto da pool no DefiLlama ou o UUID identificador (ex:{' '}
              <code className="text-emerald-400 bg-black/40 px-1 py-0.5 rounded font-mono text-[11px]">
                b99bcdf5-1350-4269-981e-0e9b5cccb007
              </code>
              ). O simulador importará automaticamente o TVL, volume diário, APY histórico e preços!
            </p>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Link ou UUID da Pool (DefiLlama Yields):
                </label>
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="https://defillama.com/yields/pool/b99bcdf5-1350-4269-981e-0e9b5cccb007"
                  className="w-full bg-[#080B10] border border-surfaceBorder rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-surface border border-surfaceBorder"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!customInput.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-emerald-400 to-cyan-400 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Carregar Pool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

