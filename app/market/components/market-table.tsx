import Link from 'next/link';
import type { Coin } from '../hooks/useMarketData';

interface MarketTableProps {
  coins: Coin[];
  sortBy: string;
  sortDir: 'asc' | 'desc';
  onSort: (col: 'price' | 'change24h' | 'volume24h' | 'marketCap') => void;
}

const COLS: { key: 'price' | 'change24h' | 'volume24h' | 'marketCap'; label: string }[] = [
  { key: 'price', label: 'Price' },
  { key: 'change24h', label: '24h %' },
  { key: 'volume24h', label: 'Volume 24h' },
  { key: 'marketCap', label: 'Market Cap' },
];

export default function MarketTable({ coins, sortBy, sortDir, onSort }: MarketTableProps) {
  return (
    <div className="card-glass rounded-2xl overflow-hidden">
      <table className="w-full nexus-table">
        <thead>
          <tr className="text-left">
            <th className="px-5 py-4 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] w-8">#</th>
            <th className="px-5 py-4 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70]">Coin</th>
            {COLS.map((col) => (
              <th
                key={col.key}
                className="px-5 py-4 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] text-right cursor-pointer hover:text-[#cdd6f4] transition-colors select-none"
                onClick={() => onSort(col.key)}
              >
                <span className="flex items-center justify-end gap-1">
                  {col.label}
                  {sortBy === col.key && (
                    <span className="text-[#00f5ff]">{sortDir === 'desc' ? '↓' : '↑'}</span>
                  )}
                </span>
              </th>
            ))}
            <th className="px-5 py-4 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] text-right">
              Sparkline
            </th>
            <th className="px-5 py-4" />
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, i) => {
            const isGain = coin.change24h >= 0;
            return (
              <tr key={coin.id} className="group">
                <td className="px-5 py-4">
                  <span className="font-mono-tech text-xs text-[#585b70]">{i + 1}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-orbitron font-black text-xs shrink-0"
                      style={{
                        background: `${coin.color}15`,
                        color: coin.color,
                        border: `1px solid ${coin.color}30`,
                      }}
                    >
                      {coin.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-orbitron font-bold text-sm text-[#cdd6f4]">{coin.symbol}</div>
                      <div className="font-rajdhani text-xs text-[#585b70]">{coin.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="font-mono-tech text-sm text-[#cdd6f4]">
                    ${coin.price < 0.01 ? coin.price.toFixed(6) : coin.price.toLocaleString()}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span
                    className={`font-mono-tech text-sm ${isGain ? 'text-gain glow-gain' : 'text-loss glow-loss'}`}
                  >
                    {isGain ? '+' : ''}{coin.change24h}%
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="font-mono-tech text-xs text-[#7f849c]">
                    ${(coin.volume24h / 1_000_000).toFixed(1)}M
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="font-mono-tech text-xs text-[#7f849c]">
                    ${(coin.marketCap / 1_000_000_000).toFixed(2)}B
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-end gap-0.5 h-6 w-20">
                    {coin.sparkline.map((v, idx) => {
                      const min = Math.min(...coin.sparkline);
                      const max = Math.max(...coin.sparkline);
                      const pct = max === min ? 0.5 : (v - min) / (max - min);
                      return (
                        <div
                          key={idx}
                          className="flex-1 rounded-sm"
                          style={{
                            height: `${Math.max(15, pct * 100)}%`,
                            background: isGain ? 'rgba(166,227,161,0.6)' : 'rgba(243,139,168,0.6)',
                          }}
                        />
                      );
                    })}
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/coin/${coin.id}`}
                    className="font-rajdhani text-xs font-semibold px-3 py-1.5 rounded-lg neon-btn-cyan opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Trade →
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}