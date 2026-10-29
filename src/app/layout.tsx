import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QuantPool V3 Simulator — Simulador de Liquidez Concentrada & DefiLlama',
  description:
    'Simulador profissional de pools de liquidez Uniswap V3 com cálculo de ganhos mensais, impermanent loss e integração direta com DefiLlama.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-[#080B10] text-slate-100 min-h-screen antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}

