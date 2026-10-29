export interface PresetPool {
  id: string;
  name: string;
  chain: string;
  project: string;
  symbol: string;
  feeTierPct: number;
  feeTierLabel: string;
  defaultPriceMinPct: number; // e.g. -15%
  defaultPriceMaxPct: number; // e.g. +15%
  icon0: string;
  icon1: string;
  description: string;
}

export const PRESET_POOLS: PresetPool[] = [
  {
    id: "b99bcdf5-1350-4269-981e-0e9b5cccb007",
    name: "WETH / USDC",
    chain: "Base",
    project: "Uniswap V3",
    symbol: "WETH-USDC",
    feeTierPct: 0.3,
    feeTierLabel: "0.3%",
    defaultPriceMinPct: -12,
    defaultPriceMaxPct: 12,
    icon0: "🔷",
    icon1: "💵",
    description: "Pool de alta liquidez e alto volume na rede Base (Coinbase L2)",
  },
  {
    id: "37f59424-6338-4e32-a89e-293ce8bbd912",
    name: "WETH / USDC",
    chain: "Arbitrum",
    project: "Uniswap V3",
    symbol: "WETH-USDC",
    feeTierPct: 0.05,
    feeTierLabel: "0.05%",
    defaultPriceMinPct: -10,
    defaultPriceMaxPct: 10,
    icon0: "🔷",
    icon1: "💵",
    description: "Pool institucional mais negociado do ecossistema Arbitrum One",
  },
  {
    id: "a9643447-9750-4bb5-867c-9b5cebe9430c",
    name: "WBTC / USDC",
    chain: "Ethereum",
    project: "Uniswap V3",
    symbol: "WBTC-USDC",
    feeTierPct: 0.3,
    feeTierLabel: "0.3%",
    defaultPriceMinPct: -15,
    defaultPriceMaxPct: 15,
    icon0: "🟠",
    icon1: "💵",
    description: "Pool principal de Bitcoin embrulhado com pares em Dólar na Ethereum",
  },
  {
    id: "09e7c10b-ee73-4560-93a9-b3a1a67a6d88",
    name: "USDC / USDT",
    chain: "Ethereum",
    project: "Uniswap V3",
    symbol: "USDC-USDT",
    feeTierPct: 0.01,
    feeTierLabel: "0.01%",
    defaultPriceMinPct: -0.2,
    defaultPriceMaxPct: 0.2,
    icon0: "💵",
    icon1: "🟢",
    description: "Pool de Stablecoins: baixíssimo risco de IL com alta rotação",
  },
];

