'use client';

import { use } from 'react';
import { useCoinData } from './hooks/useCoin';
import { useCandles } from './hooks/useCandles';
import PriceChart from './components/price-chart';
import TradePanel from './components/trade-panel';
import CoinStat from './components/coin-stat';
import { formatNumberCompact } from '@/lib/functions';

export default function CoinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { coin, loading, relatedNews } = useCoinData(id);
  const { candles, candlesLoading, timeframe, setTimeframe } = useCandles(id);

  if (loading || !coin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', border: '2px solid #00f5ff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p className="font-rajdhani" style={{ color: '#585b70' }}>Loading coin data...</p>
        </div>
      </div>
    );
  }

  const isGain = coin.change24h >= 0;

  return (
    <div className="page-wrapper">

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{
          width: '4rem', height: '4rem', borderRadius: '1rem', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Orbitron', fontWeight: 900, fontSize: '1.1rem',
          background: `${coin.color}18`, color: coin.color,
          border: `1px solid ${coin.color}33`, boxShadow: `0 0 24px ${coin.color}20`,
        }}>
          {coin.ticker?.slice(0, 2)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 className="font-orbitron" style={{ fontWeight: 900, fontSize: '1.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#cdd6f4', marginBottom: '0.25rem' }}>
            {coin.name}
          </h1>
          <p className="font-rajdhani" style={{ color: '#585b70', fontSize: '0.9rem' }}>{coin.description}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
          <div className="font-mono-tech" style={{ fontSize: '2rem', fontWeight: 700, color: '#cdd6f4', lineHeight: 1 }}>
            ${coin.currentPrice < 0.01 ? coin.currentPrice.toFixed(6) : coin.currentPrice?.toLocaleString()}
          </div>
          <span className="font-mono-tech" style={{ fontSize: '0.9rem', color: isGain ? '#a6e3a1' : '#f38ba8', textShadow: isGain ? '0 0 8px rgba(166,227,161,0.5)' : '0 0 8px rgba(243,139,168,0.5)' }}>
            {isGain ? '▲' : '▼'} {Math.abs(coin.change24h*100).toFixed(2)}% (24h)
          </span>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: '1.5rem', alignItems: 'start' }}>

          {/* Left — chart + stats + news */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
            <PriceChart
              candles={candles}
              loading={candlesLoading}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              color={coin.color}
            />

            {/* Stats row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem' }}>
              <CoinStat label="Market Cap"  value={formatNumberCompact(coin.marketCap)}  color="#b4befe" />
              <CoinStat label="Volume 24h"  value={formatNumberCompact(coin.volume24h)}   color="#89dceb" />
              <CoinStat label="Change 7d"   value={`${coin.change7d > 0 ? '+' : ''}${(coin.change7d*100).toFixed(2)}%`} color={coin.change7d >= 0 ? '#a6e3a1' : '#f38ba8'} />
              <CoinStat label="Circulating" value={formatNumberCompact(coin.circulatingSupply)} sub={`/ ${(coin.totalSupply / 1e6).toFixed(1)}M max`} color="#cba6f7" />
            </div>

            {/* Stats row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem' }}>
              <CoinStat label="ATH"      value={`$${coin.ath?.toLocaleString()}`}  color="#f9e2af" />
              <CoinStat label="ATL"      value={`$${coin.atl?.toLocaleString()}`}  color="#f38ba8" />
              <CoinStat label="Supply %" value={`${((coin.circulatingSupply / coin.totalSupply) * 100).toFixed(1)}%`} color="#fab387" />
              <CoinStat label="Symbol"   value={coin.ticker} color={coin.color} highlight />
            </div>
            <div className="nx-card">
              <div className="nx-section-title">Related News</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {relatedNews.map((n, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(17,17,27,0.5)', border: '1px solid rgba(180,190,254,0.06)' }}>
                    <span className="nx-badge" style={
                      n.tag === 'bullish' ? { background: 'rgba(166,227,161,0.12)', border: '1px solid rgba(166,227,161,0.3)', color: '#a6e3a1' }
                      : n.tag === 'bearish' ? { background: 'rgba(243,139,168,0.12)', border: '1px solid rgba(243,139,168,0.3)', color: '#f38ba8' }
                      : { background: 'rgba(249,226,175,0.12)', border: '1px solid rgba(249,226,175,0.3)', color: '#f9e2af' }
                    }>{n.tag}</span>
                    <span className="font-rajdhani" style={{ fontSize: '0.875rem', color: '#bac2de', flex: 1 }}>{n.text}</span>
                    <span className="font-mono-tech" style={{ fontSize: '0.68rem', color: '#45475a', flexShrink: 0 }}>{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — trade + supply */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <TradePanel coin={coin} />

            {/* Supply bar */}
            <div className="nx-card">
              <div className="nx-section-title">Supply Progress</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span className="font-mono-tech" style={{ fontSize: '0.72rem', color: '#7f849c' }}>{(coin.circulatingSupply / 1e6).toFixed(1)}M</span>
                <span className="font-mono-tech" style={{ fontSize: '0.72rem', color: '#7f849c' }}>{(coin.totalSupply / 1e6).toFixed(1)}M max</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(180,190,254,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '999px', transition: 'width 0.5s ease',
                  width: `${(coin.circulatingSupply / coin.totalSupply) * 100}%`,
                  background: `linear-gradient(90deg, ${coin.color}, ${coin.color}88)`,
                  boxShadow: `0 0 8px ${coin.color}44`,
                }} />
              </div>
              <div style={{ marginTop: '0.6rem', textAlign: 'right' }}>
                <span className="font-mono-tech" style={{ fontSize: '0.72rem', color: coin.color }}>
                  {((coin.circulatingSupply / coin.totalSupply) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}