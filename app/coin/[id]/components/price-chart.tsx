'use client';

import { Candle } from "../type";

interface PriceChartProps {
  candles: Candle[];
  loading: boolean;
  timeframe: string;
  onTimeframeChange: (tf: "4h" | "7h" | "1d") => void;
  color: string;
}

const TIMEFRAMES = ["4h", "7h", "1d"] as const;

export default function PriceChart({ candles, loading, timeframe, onTimeframeChange, color }: PriceChartProps) {
  if (loading || candles.length === 0) {
    return (
      <div className="nx-card" style={{ height: '20rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '2rem', height: '2rem', border: `2px solid ${color}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 0.75rem' }} />
          <p className="font-rajdhani" style={{ color: '#585b70', fontSize: '0.875rem' }}>Loading chart...</p>
        </div>
      </div>
    );
  }

  const W = 800;
  const H = 260;
  const PAD = { top: 16, bottom: 24, left: 8, right: 48 };

  const lows = candles.map((c) => c.low);
  const highs = candles.map((c) => c.high);
  const minP = Math.min(...lows);
  const maxP = Math.max(...highs);
  const range = maxP - minP || 1;

  const scaleY = (v: number) => PAD.top + ((maxP - v) / range) * (H - PAD.top - PAD.bottom);
  const candleW = Math.max(2, (W - PAD.left - PAD.right) / candles.length - 1);

  const closePoints = candles.map((c, i) => ({
    x: PAD.left + (i / (candles.length - 1)) * (W - PAD.left - PAD.right),
    y: scaleY(c.close),
  }));

  const linePath = closePoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${closePoints[closePoints.length - 1].x},${H - PAD.bottom} L${closePoints[0].x},${H - PAD.bottom} Z`;

  const lastClose = candles[candles.length - 1].close;
  const firstClose = candles[0].close;
  const isUp = lastClose >= firstClose;
  const lineColor = isUp ? '#a6e3a1' : '#f38ba8';

  return (
    <div className="nx-card" style={{ overflow: 'hidden', padding: 0 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 1.25rem 0.75rem' }}>
        <div className="font-rajdhani" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#585b70' }}>
          Price Chart
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(17,17,27,0.8)', borderRadius: '10px', padding: '0.25rem' }}>
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              style={{
                padding: '0.35rem 0.75rem', borderRadius: '8px',
                fontFamily: 'Orbitron', fontSize: '0.6rem', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.18s', border: 'none',
                background: timeframe === tf ? 'rgba(0,245,255,0.1)' : 'transparent',
                color: timeframe === tf ? '#00f5ff' : '#585b70',
                boxShadow: timeframe === tf ? '0 0 0 1px rgba(0,245,255,0.25)' : 'none',
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG */}
      <div style={{ padding: '0 0.5rem 1rem' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '280px' }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity={0.25} />
              <stop offset="100%" stopColor={lineColor} stopOpacity={0.01} />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((pct, i) => {
            const y = PAD.top + pct * (H - PAD.top - PAD.bottom);
            const price = maxP - pct * range;
            return (
              <g key={i}>
                <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="rgba(180,190,254,0.06)" strokeWidth={1} />
                <text x={W - PAD.right + 6} y={y + 4} fontSize={9} fill="rgba(99,102,116,0.8)" fontFamily="Share Tech Mono">
                  {price < 0.01 ? price.toFixed(6) : price.toFixed(2)}
                </text>
              </g>
            );
          })}

          <path d={areaPath} fill="url(#areaGrad)" />

          {candles.map((c, i) => {
            const x = PAD.left + i * ((W - PAD.left - PAD.right) / candles.length) + candleW / 2;
            const isBull = c.close >= c.open;
            const candleColor = isBull ? '#a6e3a1' : '#f38ba8';
            const bodyTop = scaleY(Math.max(c.open, c.close));
            const bodyBot = scaleY(Math.min(c.open, c.close));
            const bodyH = Math.max(1, bodyBot - bodyTop);
            return (
              <g key={i}>
                <line x1={x} y1={scaleY(c.high)} x2={x} y2={scaleY(c.low)} stroke={candleColor} strokeWidth={1} opacity={0.7} />
                <rect x={x - candleW / 2} y={bodyTop} width={candleW} height={bodyH} fill={candleColor} opacity={0.85} rx={1} />
              </g>
            );
          })}

          <path d={linePath} fill="none" stroke={lineColor} strokeWidth={1.5} opacity={0.6} strokeLinecap="round" strokeLinejoin="round" />
          <line x1={PAD.left} y1={scaleY(lastClose)} x2={W - PAD.right} y2={scaleY(lastClose)} stroke={lineColor} strokeWidth={1} strokeDasharray="4,4" opacity={0.5} />
        </svg>
      </div>
    </div>
  );
}