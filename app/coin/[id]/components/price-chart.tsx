'use client';

import type { Candle } from '../hooks/useCandles';

interface PriceChartProps {
  candles: Candle[];
  loading: boolean;
  timeframe: string;
  onTimeframeChange: (tf: '1H' | '4H' | '1D' | '1W') => void;
  color: string;
}

const TIMEFRAMES = ['1H', '4H', '1D', '1W'] as const;

export default function PriceChart({ candles, loading, timeframe, onTimeframeChange, color }: PriceChartProps) {
  if (loading || candles.length === 0) {
    return (
      <div className="card-glass rounded-2xl p-6 h-80 flex items-center justify-center terminal-scanline">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: color }} />
          <p className="font-rajdhani text-[#585b70] text-sm">Loading chart...</p>
        </div>
      </div>
    );
  }

  const W = 800;
  const H = 260;
  const PAD = { top: 16, bottom: 24, left: 8, right: 8 };

  const lows = candles.map((c) => c.low);
  const highs = candles.map((c) => c.high);
  const minP = Math.min(...lows);
  const maxP = Math.max(...highs);
  const range = maxP - minP || 1;

  const scaleY = (v: number) => PAD.top + ((maxP - v) / range) * (H - PAD.top - PAD.bottom);
  const candleW = Math.max(2, (W - PAD.left - PAD.right) / candles.length - 1);

  // Line close prices for area chart
  const closePoints = candles.map((c, i) => {
    const x = PAD.left + (i / (candles.length - 1)) * (W - PAD.left - PAD.right);
    const y = scaleY(c.close);
    return { x, y };
  });

  const linePath = closePoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${closePoints[closePoints.length - 1].x},${H - PAD.bottom} L${closePoints[0].x},${H - PAD.bottom} Z`;

  const lastClose = candles[candles.length - 1].close;
  const firstClose = candles[0].close;
  const isUp = lastClose >= firstClose;
  const lineColor = isUp ? '#a6e3a1' : '#f38ba8';

  return (
    <div className="card-glass rounded-2xl overflow-hidden terminal-scanline">
      {/* Timeframe buttons */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="font-rajdhani text-xs text-[#585b70] uppercase tracking-widest">Price Chart</div>
        <div className="flex items-center gap-1 bg-[rgba(17,17,27,0.8)] rounded-xl p-1">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-3 py-1.5 rounded-lg font-orbitron text-[10px] font-bold tracking-widest uppercase transition-all ${
                timeframe === tf
                  ? 'text-[#00f5ff] bg-[rgba(0,245,255,0.1)] border border-[rgba(0,245,255,0.25)]'
                  : 'text-[#585b70] hover:text-[#a6adc8]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="px-2 pb-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: '280px' }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity={0.25} />
              <stop offset="100%" stopColor={lineColor} stopOpacity={0.01} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((pct, i) => {
            const y = PAD.top + pct * (H - PAD.top - PAD.bottom);
            const price = maxP - pct * range;
            return (
              <g key={i}>
                <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="rgba(180,190,254,0.06)" strokeWidth={1} />
                <text x={W - PAD.right + 4} y={y + 4} fontSize={9} fill="rgba(99,102,116,0.8)" fontFamily="Share Tech Mono">
                  {price < 0.01 ? price.toFixed(6) : price.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaPath} fill="url(#areaGrad)" />

          {/* Candlesticks */}
          {candles.map((c, i) => {
            const x = PAD.left + i * ((W - PAD.left - PAD.right) / candles.length) + candleW / 2;
            const isBull = c.close >= c.open;
            const candleColor = isBull ? '#a6e3a1' : '#f38ba8';
            const bodyTop = scaleY(Math.max(c.open, c.close));
            const bodyBot = scaleY(Math.min(c.open, c.close));
            const bodyH = Math.max(1, bodyBot - bodyTop);

            return (
              <g key={i}>
                {/* Wick */}
                <line
                  x1={x} y1={scaleY(c.high)} x2={x} y2={scaleY(c.low)}
                  stroke={candleColor} strokeWidth={1} opacity={0.7}
                />
                {/* Body */}
                <rect
                  x={x - candleW / 2} y={bodyTop}
                  width={candleW} height={bodyH}
                  fill={candleColor} opacity={0.85}
                  rx={1}
                />
              </g>
            );
          })}

          {/* Close line */}
          <path d={linePath} fill="none" stroke={lineColor} strokeWidth={1.5} opacity={0.6} strokeLinecap="round" strokeLinejoin="round" />

          {/* Last price line */}
          <line
            x1={PAD.left} y1={scaleY(lastClose)} x2={W - PAD.right} y2={scaleY(lastClose)}
            stroke={lineColor} strokeWidth={1} strokeDasharray="4,4" opacity={0.5}
          />
        </svg>
      </div>
    </div>
  );
}