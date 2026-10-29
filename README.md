# QuantPool V3 Simulator — Simulador de Pool de Liquidez Concentrada

Simulador profissional e interativo de Pools de Liquidez (**Uniswap V3**), projetado para calcular com exatidão matemática institucional **quanto você vai ganhar por mês** provendo liquidez, além de simular a **Perda Impermanente (IL)** e o **Resultado Líquido**.

O projeto foi inteiramente baseado e calibrado com base nas referências:
- **[DeFi-Lab Uniswap V3 Simulator](https://defi-lab.xyz/uniswapv3simulator)**: Motor de matemática de liquidez concentrada ($\sqrt{P}$, $L$, eficiência de capital, decomposição de tokens e cenários de divergência).
- **[DefiLlama Yields](https://defillama.com/yields/pool/b99bcdf5-1350-4269-981e-0e9b5cccb007)**: Conexão direta com a API pública do DefiLlama para TVL real, volume 24h/7d e histórico diário de rendimento da pool **WETH-USDC (Base, Uniswap V3)** e qualquer outra pool por ID/URL.

---

## 🚀 Principais Funcionalidades

### 1. 💰 Resposta Direta: Quanto Você Vai Ganhar por Mês
- **Card Hero de Destaque**: Exibe em tempo real o **Ganho Mensal Estimado em Dólares ($)**, em **Reais (R$)** e o **Retorno Percentual (%/mês)** sobre o capital investido.
- **Desdobramento Temporal Completo**:
  - Ganho Diário ($ e %/dia)
  - Ganho Semanal ($ e %/semana)
  - Taxa Anualizada (**APR**) e **APY Composto** (com reinvestimento das taxas)
  - **Eficiência de Capital V3**: Mostra quantas vezes mais taxas sua posição gera em relação ao Uniswap V2 tradicional ($0$ a $\infty$).

### 2. 🦙 Integração em Tempo Real com o DefiLlama
- **Pool Padrão Pré-carregada**: `b99bcdf5-1350-4269-981e-0e9b5cccb007` (WETH-USDC na rede Base, Uniswap V3, taxa 0.3%).
- **Importação Universal**: Permite colar qualquer link ou UUID de pool do DefiLlama para sincronizar automaticamente:
  - TVL Real (ex: ~$157M USD)
  - Volume diário de negociação (ex: ~$96M USD/dia)
  - Fee Tier da Pool (0.01%, 0.05%, 0.3%, 1.0%)
  - Preço real dos tokens via DefiLlama Coins API
  - Gráfico histórico diário de APY e TVL dos últimos 60 dias

### 3. 🎯 Motor de Liquidez Concentrada Uniswap V3 (DeFi-Lab Math)
- **Faixas Pré-configuradas em 1 Clique**:
  - **Estrito / Agressivo (±5%)**: Máxima eficiência de taxas ($~20x$), ideal para ativos estáveis ou gestão ativa.
  - **Equilibrado (±15%)**: Padrão institucional recomendado pelo DeFi-Lab.
  - **Amplo / Conservador (±30%)**: Grande margem de segurança contra saída de faixa.
  - **Full Range (V2)**: Sem risco de sair da faixa.
- **Divisão Exata de Capital**: Calcula quantos tokens de cada ponta você precisa depositar (ex: $X$ WETH e $Y$ USDC) e a proporção de cada um.

### 4. ⚖️ Simulador Interativo de Perda Impermanente (IL) & Lucro Líquido
- **Slider de Sensibilidade de Preço**: Simule o que acontece se o preço variar de -50% a +50%.
- **Comparativo Lado a Lado**:
  - Valor no **HODL** (se você apenas segurasse os tokens)
  - Valor da posição na **Pool (LP)**
  - **Perda Impermanente (IL)** em dólares e percentual
  - **Taxas Coletadas no Mês**
  - **Resultado Líquido (Taxas + IL)**: Destaca visualmente se o lucro das taxas supera a perda impermanente.
- **Amortização de Risco (Break-even)**: Quantos dias de taxas pagam uma queda de 10% do ativo.

---

## 🛠️ Tecnologias Utilizadas

- **Next.js 15 (App Router)** com React 19 e TypeScript
- **Tailwind CSS** com tema escuro institucional grafite/esmeralda
- **Lucide Icons** para alta legibilidade técnica
- **APIs Integradas**:
  - `https://yields.llama.fi/pools` (Metadados e métricas de yield)
  - `https://yields.llama.fi/chart/{poolId}` (Histórico de APY e TVL)
  - `https://coins.llama.fi/prices/current/{chain}:{address}` (Cotações de mercado)

---

## ⚡ Como Executar

### Opção 1: Via Windows Bat (Mais Rápido)
Basta dar dois cliques no arquivo:
```cmd
start_simulator.bat
```

### Opção 2: Via Linha de Comando
```bash
cd liquidity_pool_simulator
npm.cmd run dev
```

Abra no seu navegador: **`http://localhost:3000`**

