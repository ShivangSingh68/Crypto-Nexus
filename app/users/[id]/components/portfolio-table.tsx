'use client';

import Link from 'next/link';
import { Holding } from '../types';

interface PortfolioTableProps {
  holdings: Holding[];
}

function fmt(n: number, decimals = 2) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtCompact(n: number) {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(2)}K`;
  return `$${fmt(n)}`;
}

export default function PortfolioTable({ holdings }: PortfolioTableProps) {
  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: 'rgba(24,24,37,0.85)',
        border: '1px solid rgba(180,190,254,0.07)',
      }}
    >
      <table className="w-full" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr
            style={{
              borderBottom: '1px solid rgba(180,190,254,0.07)',
              background: 'rgba(180,190,254,0.025)',
            }}
          >
            {['Coin', 'Qty', 'Avg Buy', 'Current', 'Value', 'PnL', 'Alloc', ''].map((h, i) => (
              <th
                key={i}
                className="font-rajdhani uppercase tracking-[0.15em]"
                style={{
                  padding: '1.1rem 1.5rem',
                  fontSize: '11px',
                  color: '#45475a',
                  textAlign: i === 0 ? 'left' : i === 7 ? 'center' : 'right',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {holdings.map((h, idx) => {
            const value = h.quantity * h.currentPrice;
            const invested = h.quantity * h.avgBuyPrice;
            const pnl = value - invested;
            const pnlPct = invested > 0 ? ((pnl / invested) * 100).toFixed(2) : '0.00';
            const isGain = pnl >= 0;
            const pnlColor = isGain ? '#a6e3a1' : '#f38ba8';

            return (
              <tr
                key={h.id}
                className="group"
                style={{
                  borderBottom:
                    idx < holdings.length - 1
                      ? '1px solid rgba(180,190,254,0.04)'
                      : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = 'rgba(180,190,254,0.03)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'transparent')
                }
              >
                {/* Coin */}
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-orbitron font-black text-xs shrink-0"
                      style={{
                        background: `${h.color}15`,
                        color: h.color,
                        border: `1px solid ${h.color}30`,
                        boxShadow: `0 0 12px ${h.color}15`,
                      }}
                    >
                      {h.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p
                        className="font-orbitron font-bold"
                        style={{ fontSize: '13px', color: '#cdd6f4', marginBottom: '2px' }}
                      >
                        {h.symbol}
                      </p>
                      <p
                        className="font-rajdhani"
                        style={{ fontSize: '12px', color: '#585b70' }}
                      >
                        {h.name}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Qty */}
                <td
                  className="font-mono-tech"
                  style={{
                    padding: '1.25rem 1.5rem',
                    textAlign: 'right',
                    fontSize: '13px',
                    color: '#cdd6f4',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h.quantity % 1 === 0
                    ? h.quantity.toLocaleString()
                    : fmt(h.quantity, 4)}
                </td>

                {/* Avg Buy */}
                <td
                  className="font-mono-tech"
                  style={{
                    padding: '1.25rem 1.5rem',
                    textAlign: 'right',
                    fontSize: '13px',
                    color: '#7f849c',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ${fmt(h.avgBuyPrice, h.avgBuyPrice >= 100 ? 2 : 4)}
                </td>

                {/* Current */}
                <td
                  className="font-mono-tech"
                  style={{
                    padding: '1.25rem 1.5rem',
                    textAlign: 'right',
                    fontSize: '13px',
                    color: '#cdd6f4',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ${fmt(h.currentPrice, h.currentPrice >= 100 ? 2 : 4)}
                </td>

                {/* Value */}
                <td
                  className="font-mono-tech"
                  style={{
                    padding: '1.25rem 1.5rem',
                    textAlign: 'right',
                    fontSize: '13px',
                    color: '#cdd6f4',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {fmtCompact(value)}
                </td>

                {/* PnL */}
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <p
                    className="font-mono-tech"
                    style={{
                      fontSize: '13px',
                      color: pnlColor,
                      whiteSpace: 'nowrap',
                      textShadow: `0 0 12px ${pnlColor}55`,
                    }}
                  >
                    {isGain ? '+' : ''}
                    {fmtCompact(pnl)}
                  </p>
                  <p
                    className="font-mono-tech"
                    style={{ fontSize: '11px', color: `${pnlColor}bb`, marginTop: '2px' }}
                  >
                    {isGain ? '+' : ''}{pnlPct}%
                  </p>
                </td>

                {/* Alloc */}
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <div
                    className="flex items-center justify-end gap-2"
                    style={{ minWidth: '90px' }}
                  >
                    <div
                      className="rounded-full overflow-hidden"
                      style={{
                        width: '56px',
                        height: '5px',
                        background: 'rgba(180,190,254,0.07)',
                      }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min((h.allocation*100), 100)}%`,
                          background: h.color,
                          boxShadow: `0 0 6px ${h.color}`,
                        }}
                      />
                    </div>
                    <span
                      className="font-mono-tech"
                      style={{ fontSize: '12px', color: '#7f849c', whiteSpace: 'nowrap' }}
                    >
                      {Number(h.allocation*100).toFixed(1)}%
                    </span>
                  </div>
                </td>

                {/* Trade link */}
                <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                  <Link
                    href={`/coin/${h.id}`}
                    className="font-rajdhani font-semibold uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                    style={{
                      fontSize: '11px',
                      padding: '6px 14px',
                      background: 'rgba(137,220,235,0.1)',
                      color: '#89dceb',
                      border: '1px solid rgba(137,220,235,0.2)',
                      whiteSpace: 'nowrap',
                    }}
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