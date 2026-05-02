import Link from 'next/link';
import { CoinWithAdditionalData } from '../type';

interface CoinCardProps {
  coin: CoinWithAdditionalData;
}

export default function CoinCard({ coin }: CoinCardProps) {
  const isGain = !coin.change24h.includes('-');
  return (
    <Link href={`/coin/${coin.id}`}>
      <div
        className="card-glass rounded-2xl p-5 hover-lift cursor-pointer group transition-all duration-200"
        style={{
          borderColor: `${coin.color}20`,
          boxShadow: `0 4px 24px ${coin.color}0d`,
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-orbitron font-black text-sm"
            style={{
              background: `${coin.color}18`,
              color: coin.color,
              border: `1px solid ${coin.color}33`,
              boxShadow: `0 0 12px ${coin.color}20`,
            }}
          >
            {coin.ticker.slice(0, 2)}
          </div>
          <span
            className={`font-mono-tech text-xs px-2.5 py-1 rounded-full ${
              isGain
                ? 'bg-[rgba(166,227,161,0.1)] text-[#a6e3a1] border border-[rgba(166,227,161,0.25)]'
                : 'bg-[rgba(243,139,168,0.1)] text-[#f38ba8] border border-[rgba(243,139,168,0.25)]'
            }`}
          >
            {isGain ? '▲' : '▼'} {coin.change24h.replace('-', '')}%
          </span>
        </div>

        {/* Name */}
        <div className="mb-1">
          <div className="font-orbitron font-bold text-sm text-[#cdd6f4]">{coin.ticker}</div>
          <div className="font-rajdhani text-xs text-[#585b70] mt-0.5 truncate">{coin.name}</div>
        </div>

        {/* Price */}
        <div className="mt-3">
          <div className="font-mono-tech text-lg font-bold text-[#cdd6f4]">
            ${coin.currentPrice < 0.01 ? coin.currentPrice.toFixed(6) : coin.currentPrice.toLocaleString()}
          </div>
        </div>

        {/* Sparkline (visual only) */}
        {/* TODO: */}
        <div className="mt-3 h-8 flex items-end gap-0.5">
          {coin.sparkline.map((v, i) => {
            const min = Math.min(...coin.sparkline);
            const max = Math.max(...coin.sparkline);
            const pct = max === min ? 0.5 : (v - min) / (max - min);
            return (
              <div
                key={i}
                className="flex-1 rounded-sm transition-all"
                style={{
                  height: `${Math.max(10, pct * 100)}%`,
                  background: isGain
                    ? `rgba(166,227,161,${0.3 + pct * 0.5})`
                    : `rgba(243,139,168,${0.3 + (1 - pct) * 0.5})`,
                }}
              />
            );
          })}
        </div>

        {/* Volume */}
        <div className="mt-3 pt-3 border-t border-[rgba(180,190,254,0.06)] flex justify-between">
          <span className="font-rajdhani text-[11px] text-[#585b70] uppercase tracking-wider">Vol 24h</span>
          <span className="font-mono-tech text-[11px] text-[#7f849c]">
            ${(coin.volume24h / 1_000_000).toFixed(1)}M
          </span>
        </div>
      </div>
    </Link>
  );
}