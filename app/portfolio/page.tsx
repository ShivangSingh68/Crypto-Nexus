'use client';

import { usePortfolio } from './hooks/usePortfolio';
import PnlCard from './components/pnl-card';
import PortfolioTable from './components/portfolio-table';

const ACHIEVEMENTS = [
  { id: 'a1', label: 'First Trade', icon: '🎯', unlocked: true, desc: 'Placed your first order' },
  { id: 'a2', label: 'Diamond Hands', icon: '💎', unlocked: true, desc: 'Held a coin for 7 days' },
  { id: 'a3', label: 'Moon Shot', icon: '🚀', unlocked: false, desc: '10x a single trade', progress: 42 },
  { id: 'a4', label: 'Top Trader', icon: '🏆', unlocked: false, desc: 'Reach rank #1', progress: 15 },
  { id: 'a5', label: 'Whale', icon: '🐋', unlocked: false, desc: 'Portfolio over $100k', progress: 25 },
  { id: 'a6', label: 'Speed Trader', icon: '⚡', unlocked: false, desc: '50 trades in one day', progress: 8 },
];

export default function PortfolioPage() {
  const { holdings, stats, loading } = usePortfolio();

  if (loading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-t-transparent border-[#cba6f7] rounded-full animate-spin mx-auto mb-3" />
          <p className="font-rajdhani text-[#585b70]">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  const totalPnl = holdings.reduce((acc, h) => {
    const value = h.quantity * h.currentPrice;
    const invested = h.quantity * h.avgBuyPrice;
    return acc + (value - invested);
  }, 0);

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-orbitron font-black text-3xl uppercase tracking-widest text-[#cdd6f4] mb-1">
          Portfolio
        </h1>
        <p className="font-rajdhani text-[#7f849c]">Your holdings and performance overview</p>
      </div>

      {/* Net Worth Hero */}
      <div className="card-glass-strong rounded-3xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[rgba(203,166,247,0.05)] blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[rgba(0,245,255,0.04)] blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="font-rajdhani text-sm uppercase tracking-widest text-[#585b70] mb-2">Total Net Worth</div>
          <div className="font-orbitron font-black text-5xl text-[#cdd6f4] mb-3">
            $<span className="gradient-text-cyan-mauve">{stats.netWorth.toLocaleString()}</span>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <span className={`font-mono-tech text-base ${stats.dayChange >= 0 ? 'text-gain glow-gain' : 'text-loss glow-loss'}`}>
              {stats.dayChange >= 0 ? '▲' : '▼'} ${Math.abs(stats.dayChange).toLocaleString()} ({stats.dayChangePct}%) today
            </span>
            <span className="font-rajdhani text-sm text-[#585b70]">•</span>
            <span className="font-mono-tech text-sm text-[#7f849c]">
              Cash: ${stats.cashBalance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* PnL Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <PnlCard
          label="Total Invested"
          value={`$${stats.totalInvested.toLocaleString()}`}
          color="#b4befe"
          icon="💰"
        />
        <PnlCard
          label="Portfolio Value"
          value={`$${stats.totalValue.toLocaleString()}`}
          color="#89dceb"
          icon="📊"
        />
        <PnlCard
          label="Unrealized PnL"
          value={`${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`}
          isGain={totalPnl >= 0}
          isLoss={totalPnl < 0}
          icon="📈"
        />
        <PnlCard
          label="Return %"
          value={`${stats.pnlPct >= 0 ? '+' : ''}${stats.pnlPct}%`}
          isGain={stats.pnlPct >= 0}
          isLoss={stats.pnlPct < 0}
          icon="🎯"
        />
      </div>

      {/* Holdings Table */}
      <div className="mb-8">
        <h2 className="font-orbitron font-bold text-lg uppercase tracking-widest text-[#cdd6f4] mb-4">
          Holdings
        </h2>
        {holdings.length === 0 ? (
          <div className="card-glass rounded-2xl py-16 text-center">
            <div className="text-4xl mb-3">🌑</div>
            <p className="font-rajdhani text-[#585b70]">No holdings yet. Head to the market to start trading.</p>
          </div>
        ) : (
          <PortfolioTable holdings={holdings} />
        )}
      </div>

      {/* Allocation Section */}
      <div className="mb-8">
        <h2 className="font-orbitron font-bold text-lg uppercase tracking-widest text-[#cdd6f4] mb-4">
          Allocation
        </h2>
        <div className="card-glass rounded-2xl p-5">
          {/* Bar chart */}
          <div className="flex h-4 rounded-full overflow-hidden gap-0.5 mb-4">
            {holdings.map((h) => (
              <div
                key={h.id}
                title={`${h.symbol}: ${h.allocation}%`}
                style={{ width: `${h.allocation}%`, background: h.color, boxShadow: `0 0 8px ${h.color}55` }}
              />
            ))}
            <div style={{ flex: 1, background: 'rgba(180,190,254,0.08)' }} title="Cash" />
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-3">
            {holdings.map((h) => (
              <div key={h.id} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: h.color }} />
                <span className="font-mono-tech text-xs text-[#7f849c]">{h.symbol} {h.allocation}%</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[rgba(180,190,254,0.2)]" />
              <span className="font-mono-tech text-xs text-[#7f849c]">
                Cash {(100 - holdings.reduce((s, h) => s + h.allocation, 0))}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="font-orbitron font-bold text-lg uppercase tracking-widest text-[#cdd6f4] mb-4">
          Achievements
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ACHIEVEMENTS.map((a) => (
            <div
              key={a.id}
              className={`card-glass rounded-2xl p-4 flex flex-col items-center text-center transition-all ${
                a.unlocked ? 'hover-lift' : 'opacity-50'
              }`}
            >
              <div className={`text-3xl mb-2 ${a.unlocked ? '' : 'grayscale'}`}>{a.icon}</div>
              <div className="font-orbitron font-bold text-xs text-[#cdd6f4] mb-1">{a.label}</div>
              <div className="font-rajdhani text-[10px] text-[#585b70] mb-2">{a.desc}</div>
              {a.unlocked ? (
                <span className="badge badge-bullish text-[9px]">Unlocked</span>
              ) : (
                <div className="w-full">
                  <div className="h-1 bg-[rgba(180,190,254,0.08)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[rgba(203,166,247,0.6)] rounded-full"
                      style={{ width: `${a.progress ?? 0}%` }}
                    />
                  </div>
                  <div className="font-mono-tech text-[9px] text-[#585b70] mt-1">{a.progress ?? 0}%</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}