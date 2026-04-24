'use client';

import { use } from 'react';
import { useCoin } from './hooks/useCoin';
import { useCandles } from './hooks/useCandles';
import PriceChart from './components/price-chart';
import TradePanel from './components/trade-panel';
import CoinStat from './components/coin-stat';

const relatedNews = [
  { tag: 'bullish', text: 'Major protocol upgrade drives surge in adoption.', time: '3m ago' },
  { tag: 'neutral', text: 'Network validators reach new milestone this cycle.', time: '22m ago' },
  { tag: 'bearish', text: 'Profit-taking pressure mounts after recent rally.', time: '1h ago' },
];

export default function CoinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { coin, loading } = useCoin(id);
  const { candles, loading: candlesLoading, timeframe, setTimeframe } = useCandles(id, coin?.price ?? 1000);

  if (loading || !coin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-t-transparent border-[#00f5ff] rounded-full animate-spin mx-auto mb-3" />
          <p className="font-rajdhani text-[#585b70]">Loading coin data...</p>
        </div>
      </div>
    );
  }

  const isGain = coin.change24h >= 0;

  return (
    <div className="min-h-screen px-4 py-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center font-orbitron font-black text-xl"
          style={{ background: `${coin.color}18`, color: coin.color, border: `1px solid ${coin.color}33`, boxShadow: `0 0 24px ${coin.color}20` }}
        >
          {coin.symbol.slice(0, 2)}
        </div>
        <div>
          <h1 className="font-orbitron font-black text-3xl uppercase tracking-widest text-[#cdd6f4]">
            {coin.name}
          </h1>
          <p className="font-rajdhani text-[#585b70] text-sm">{coin.description}</p>
        </div>
        <div className="sm:ml-auto flex flex-col items-end">
          <div className="font-mono-tech text-3xl font-bold text-[#cdd6f4]">
            ${coin.price < 0.01 ? coin.price.toFixed(6) : coin.price.toLocaleString()}
          </div>
          <span
            className={`font-mono-tech text-base mt-1 ${isGain ? 'text-gain glow-gain' : 'text-loss glow-loss'}`}
          >
            {isGain ? '▲' : '▼'} {Math.abs(coin.change24h)}% (24h)
          </span>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart + stats (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <PriceChart
            candles={candles}
            loading={candlesLoading}
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            color={coin.color}
          />

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <CoinStat label="Market Cap" value={`$${(coin.marketCap / 1e9).toFixed(2)}B`} color="#b4befe" />
            <CoinStat label="Volume 24h" value={`$${(coin.volume24h / 1e6).toFixed(1)}M`} color="#89dceb" />
            <CoinStat
              label="Change 7d"
              value={`${coin.change7d > 0 ? '+' : ''}${coin.change7d}%`}
              color={coin.change7d >= 0 ? '#a6e3a1' : '#f38ba8'}
            />
            <CoinStat
              label="Circulating"
              value={`${(coin.circulatingSupply / 1e6).toFixed(1)}M`}
              sub={`/ ${(coin.maxSupply / 1e6).toFixed(1)}M max`}
              color="#cba6f7"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <CoinStat label="ATH" value={`$${coin.ath.toLocaleString()}`} color="#f9e2af" />
            <CoinStat label="ATL" value={`$${coin.atl.toLocaleString()}`} color="#f38ba8" />
            <CoinStat
              label="Supply %"
              value={`${((coin.circulatingSupply / coin.maxSupply) * 100).toFixed(1)}%`}
              color="#fab387"
            />
            <CoinStat label="Symbol" value={coin.symbol} color={coin.color} highlight />
          </div>

          {/* Related news */}
          <div>
            <div className="font-rajdhani text-xs uppercase tracking-widest text-[#585b70] mb-3">Related News</div>
            <div className="flex flex-col gap-2">
              {relatedNews.map((n, i) => (
                <div key={i} className="card-glass rounded-2xl px-4 py-3 flex items-center gap-3">
                  <span className={`badge ${n.tag === 'bullish' ? 'badge-bullish' : n.tag === 'bearish' ? 'badge-bearish' : 'badge-neutral'}`}>
                    {n.tag}
                  </span>
                  <span className="font-rajdhani text-sm text-[#bac2de] flex-1">{n.text}</span>
                  <span className="font-mono-tech text-xs text-[#45475a] shrink-0">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trade panel (1/3) */}
        <div className="flex flex-col gap-4">
          <TradePanel coin={coin} />

          {/* Supply bar */}
          <div className="card-glass rounded-2xl p-4">
            <div className="font-rajdhani text-xs uppercase tracking-widest text-[#585b70] mb-3">Supply Progress</div>
            <div className="flex justify-between text-xs font-mono-tech text-[#7f849c] mb-2">
              <span>{(coin.circulatingSupply / 1e6).toFixed(1)}M</span>
              <span>{(coin.maxSupply / 1e6).toFixed(1)}M max</span>
            </div>
            <div className="h-2 bg-[rgba(180,190,254,0.08)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(coin.circulatingSupply / coin.maxSupply) * 100}%`,
                  background: `linear-gradient(90deg, ${coin.color}, ${coin.color}88)`,
                  boxShadow: `0 0 8px ${coin.color}44`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}