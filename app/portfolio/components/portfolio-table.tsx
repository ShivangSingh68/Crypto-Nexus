import Link from 'next/link';
import type { Holding } from '../hooks/usePortfolio';

interface PortfolioTableProps {
  holdings: Holding[];
}

export default function PortfolioTable({ holdings }: PortfolioTableProps) {
  return (
    <div className="card-glass rounded-2xl overflow-hidden">
      <table className="w-full nexus-table">
        <thead>
          <tr className="text-left">
            <th className="px-5 py-4 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70]">Coin</th>
            <th className="px-5 py-4 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] text-right">Qty</th>
            <th className="px-5 py-4 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] text-right">Avg Buy</th>
            <th className="px-5 py-4 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] text-right">Current</th>
            <th className="px-5 py-4 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] text-right">Value</th>
            <th className="px-5 py-4 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] text-right">PnL</th>
            <th className="px-5 py-4 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] text-right">Alloc</th>
            <th className="px-5 py-4" />
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => {
            const value = h.quantity * h.currentPrice;
            const invested = h.quantity * h.avgBuyPrice;
            const pnl = value - invested;
            const pnlPct = ((pnl / invested) * 100).toFixed(2);
            const isGain = pnl >= 0;

            return (
              <tr key={h.id} className="group">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-orbitron font-black text-xs shrink-0"
                      style={{ background: `${h.color}15`, color: h.color, border: `1px solid ${h.color}30` }}
                    >
                      {h.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-orbitron font-bold text-sm text-[#cdd6f4]">{h.symbol}</div>
                      <div className="font-rajdhani text-xs text-[#585b70]">{h.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-right font-mono-tech text-sm text-[#cdd6f4]">{h.quantity}</td>
                <td className="px-5 py-4 text-right font-mono-tech text-sm text-[#7f849c]">
                  ${h.avgBuyPrice.toLocaleString()}
                </td>
                <td className="px-5 py-4 text-right font-mono-tech text-sm text-[#cdd6f4]">
                  ${h.currentPrice.toLocaleString()}
                </td>
                <td className="px-5 py-4 text-right font-mono-tech text-sm text-[#cdd6f4]">
                  ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </td>
                <td className="px-5 py-4 text-right">
                  <div>
                    <div className={`font-mono-tech text-sm ${isGain ? 'text-gain glow-gain' : 'text-loss glow-loss'}`}>
                      {isGain ? '+' : ''}${pnl.toFixed(2)}
                    </div>
                    <div className={`font-mono-tech text-xs ${isGain ? 'text-gain' : 'text-loss'}`}>
                      {isGain ? '+' : ''}{pnlPct}%
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 bg-[rgba(180,190,254,0.08)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${h.allocation}%`, background: h.color, boxShadow: `0 0 4px ${h.color}` }}
                      />
                    </div>
                    <span className="font-mono-tech text-xs text-[#7f849c]">{h.allocation}%</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/coin/${h.id}`}
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