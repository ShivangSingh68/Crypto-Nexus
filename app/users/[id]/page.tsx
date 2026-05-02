'use client';

import { use, useEffect, useRef } from 'react';
import { usePortfolio } from './hooks/usePortfolio';
import PnlCard from './components/pnl-card';
import PortfolioTable from './components/portfolio-table';
import UserSettingsDialog from './components/user-settings-dialog';
import { Achievement, Holding, PortfolioSnapshotWithoutDecimal } from './types';

function fmt(n: number, decimals = 2) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtUsd(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function PortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { holdings, stats, achievements, loading, user } = usePortfolio(id);
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current || !stats?.snapshots?.length) return;

    const build = () => {
      const ChartJS = (window as typeof window & { Chart?: typeof import('chart.js').Chart }).Chart;
      if (!ChartJS) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const existing = (ChartJS as any).getChart?.(chartRef.current!);
      if (existing) existing.destroy();

      const ctx = chartRef.current!.getContext('2d');
      if (!ctx) return;

      const labels: string[] = stats.snapshots.map((s: PortfolioSnapshotWithoutDecimal) =>
        new Date(s.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      );
      const values: number[] = stats.snapshots.map((s: PortfolioSnapshotWithoutDecimal) =>
        s.value,
      );

      const isUp = values[values.length - 1] >= values[0];
      const lineColor = isUp ? '#a6e3a1' : '#f38ba8';

      const gradient = ctx.createLinearGradient(0, 0, 0, 280);
      gradient.addColorStop(0, isUp ? 'rgba(166,227,161,0.18)' : 'rgba(243,139,168,0.18)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (ChartJS as any)(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              data: values,
              borderColor: lineColor,
              borderWidth: 2,
              pointBackgroundColor: lineColor,
              pointBorderColor: 'rgba(24,24,37,1)',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
              fill: true,
              backgroundColor: gradient,
              tension: 0.42,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(17,17,27,0.95)',
              borderColor: 'rgba(203,166,247,0.18)',
              borderWidth: 1,
              titleColor: '#6c7086',
              bodyColor: '#cdd6f4',
              padding: 14,
              callbacks: {
                label: (item: { raw: unknown }) =>
                  ` $${Number(item.raw).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
              },
            },
          },
          scales: {
            x: {
              grid: { color: 'rgba(180,190,254,0.04)', drawBorder: false },
              ticks: { color: '#45475a', font: { size: 11 }, padding: 8 },
              border: { display: false },
            },
            y: {
              position: 'right',
              grid: { color: 'rgba(180,190,254,0.04)', drawBorder: false },
              ticks: {
                color: '#45475a',
                font: { size: 10 },
                padding: 12,
                callback: (v: number) =>
                  v >= 1_000_000
                    ? `$${(v / 1_000_000).toFixed(1)}M`
                    : `$${(v / 1_000).toFixed(0)}K`,
              },
              border: { display: false },
            },
          },
        },
      });
    };

    if ((window as typeof window & { Chart?: unknown }).Chart) {
      build();
    } else {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
      s.onload = build;
      document.head.appendChild(s);
    }
  }, [stats]);

  if (loading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-t-transparent border-[#cba6f7] rounded-full animate-spin mx-auto mb-4" />
          <p className="font-rajdhani text-sm uppercase tracking-widest" style={{ color: '#585b70' }}>
            Loading portfolio…
          </p>
        </div>
      </div>
    );
  }

  const totalPnl = holdings.reduce((acc: number, h: Holding) => {
    return acc + h.quantity * h.currentPrice - h.quantity * h.avgBuyPrice;
  }, 0);

  const userProfile = {
    username: user?.name ?? 'trader',
    displayName: user?.name ?? 'Trader',
    email: user?.email ?? '',
    bio: '',
    avatarInitials: (user?.name ?? 'TR').slice(0, 2).toUpperCase(),
    avatarUrl: user?.image ?? undefined,
    joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '—',
    location: '—',
  };

  const pnlPctDisplay = fmt(stats.pnlPct*100, 2);
  const dayChangePctDisplay = fmt(stats.dayChangePct * 100, 2);

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

      {/* ── Top bar ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1
            className="font-orbitron font-black uppercase tracking-widest"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: '#cdd6f4', marginBottom: '6px' }}
          >
            Portfolio
          </h1>
          <p className="font-rajdhani" style={{ fontSize: '14px', color: '#7f849c' }}>
            Holdings, performance &amp; achievements
          </p>
        </div>
        <UserSettingsDialog profile={userProfile} />
      </div>

      {/* ── Net Worth Hero ── */}
      <div
        className="rounded-3xl relative overflow-hidden"
        style={{
          background: 'rgba(30,30,46,0.65)',
          border: '1px solid rgba(203,166,247,0.12)',
          backdropFilter: 'blur(12px)',
          padding: 'clamp(1.75rem, 4vw, 2.5rem)',
        }}
      >
        <div
          className="absolute top-0 right-0 pointer-events-none"
          style={{
            width: '320px', height: '320px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(203,166,247,0.07) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 pointer-events-none"
          style={{
            width: '220px', height: '220px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%)',
          }}
        />

        <div className="relative" style={{ zIndex: 1 }}>
          <p
            className="font-rajdhani uppercase tracking-[0.18em]"
            style={{ fontSize: '11px', color: '#45475a', marginBottom: '12px' }}
          >
            Total Net Worth
          </p>
          <p
            className="font-orbitron font-black gradient-text-cyan-mauve"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', lineHeight: 1, marginBottom: '16px' }}
          >
            ${fmtUsd(stats.netWorth)}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px' }}>
            <span
              className={`font-mono-tech ${stats.dayChange >= 0 ? 'text-gain glow-gain' : 'text-loss glow-loss'}`}
              style={{ fontSize: '15px' }}
            >
              {stats.dayChange >= 0 ? '▲' : '▼'} ${fmtUsd(Math.abs(stats.dayChange))} ({dayChangePctDisplay}%) today
            </span>
            <span style={{ color: '#2a2a3a', fontSize: '12px' }}>|</span>
            <span className="font-mono-tech" style={{ fontSize: '13px', color: '#7f849c' }}>
              Cash: ${fmtUsd(stats.cashBalance)}
            </span>
          </div>
        </div>
      </div>

      {/* ── PnL Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <PnlCard label="Total Invested" value={`$${fmtUsd(stats.totalInvested)}`} color="#b4befe" icon="💰" />
        <PnlCard label="Portfolio Value" value={`$${fmtUsd(stats.netWorth)}`} color="#89dceb" icon="📊" />
        <PnlCard
          label="Unrealized PnL"
          value={`${totalPnl >= 0 ? '+' : '−'}$${fmtUsd(Math.abs(totalPnl))}`}
          isGain={totalPnl >= 0}
          isLoss={totalPnl < 0}
          icon="📈"
        />
        <PnlCard
          label="Return %"
          value={`${stats.pnlPct >= 0 ? '+' : ''}${pnlPctDisplay}%`}
          isGain={stats.pnlPct >= 0}
          isLoss={stats.pnlPct < 0}
          icon="🎯"
        />
      </div>

      {/* ── Performance Graph ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h2 className="font-orbitron font-bold uppercase tracking-widest" style={{ fontSize: '16px', color: '#cdd6f4' }}>
            Performance
          </h2>
          <span className="font-rajdhani uppercase tracking-widest" style={{ fontSize: '11px', color: '#45475a' }}>
            Last 6 months
          </span>
        </div>
        <div
          className="rounded-3xl"
          style={{ background: 'rgba(17,17,27,0.7)', border: '1px solid rgba(180,190,254,0.06)', padding: '1.75rem' }}
        >
          <div style={{ position: 'relative', height: '280px' }}>
            <canvas ref={chartRef} role="img" aria-label="Portfolio value over time" />
          </div>
        </div>
      </section>

      {/* ── Holdings ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h2 className="font-orbitron font-bold uppercase tracking-widest" style={{ fontSize: '16px', color: '#cdd6f4' }}>
          Holdings
        </h2>
        {holdings.length === 0 ? (
          <div
            className="rounded-3xl"
            style={{ background: 'rgba(17,17,27,0.5)', border: '1px solid rgba(180,190,254,0.05)', padding: '5rem', textAlign: 'center' }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌑</div>
            <p className="font-rajdhani" style={{ color: '#585b70' }}>
              No holdings yet. Head to the market to start trading.
            </p>
          </div>
        ) : (
          <PortfolioTable holdings={holdings} />
        )}
      </section>

      {/* ── Allocation ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h2 className="font-orbitron font-bold uppercase tracking-widest" style={{ fontSize: '16px', color: '#cdd6f4' }}>
          Allocation
        </h2>
        <div
          className="rounded-3xl"
          style={{ background: 'rgba(17,17,27,0.7)', border: '1px solid rgba(180,190,254,0.06)', padding: '1.75rem' }}
        >
          <div
            className="rounded-full overflow-hidden"
            style={{ display: 'flex', height: '10px', gap: '2px', marginBottom: '1.5rem' }}
          >
            {holdings.map((h: Holding) => (
              <div
                key={h.id}
                title={`${h.symbol}: ${(h.allocation * 100).toFixed(2)}%`}
                style={{ width: `${h.allocation * 100}%`, background: h.color, boxShadow: `0 0 8px ${h.color}66` }}
              />
            ))}
            <div style={{ flex: 1, background: 'rgba(180,190,254,0.06)' }} title="Cash" />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {holdings.map((h: Holding) => (
              <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="rounded-full shrink-0" style={{ width: '10px', height: '10px', background: h.color }} />
                <span className="font-mono-tech" style={{ fontSize: '12px', color: '#7f849c' }}>
                  {h.symbol}{' '}
                  <span style={{ color: '#45475a' }}>{(h.allocation * 100).toFixed(1)}%</span>
                </span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="rounded-full shrink-0" style={{ width: '10px', height: '10px', background: 'rgba(180,190,254,0.15)' }} />
              <span className="font-mono-tech" style={{ fontSize: '12px', color: '#7f849c' }}>
                Cash{' '}
                <span style={{ color: '#45475a' }}>
                  {(100 - holdings.reduce((s: number, h: Holding) => s + h.allocation * 100, 0)).toFixed(1)}%
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Achievements ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '4rem' }}>
        <h2 className="font-orbitron font-bold uppercase tracking-widest" style={{ fontSize: '16px', color: '#cdd6f4' }}>
          Achievements
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
          {achievements.map((a: Achievement) => (
            <div
              key={a.id}
              className={a.unlocked ? 'hover-lift' : ''}
              style={{
                borderRadius: '20px',
                padding: '1.5rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '10px',
                opacity: a.unlocked ? 1 : 0.4,
                background: a.unlocked ? 'rgba(203,166,247,0.06)' : 'rgba(17,17,27,0.5)',
                border: a.unlocked ? '1px solid rgba(203,166,247,0.15)' : '1px solid rgba(180,190,254,0.05)',
              }}
            >
              <div style={{ fontSize: '2rem', filter: a.unlocked ? 'none' : 'grayscale(1)' }}>{a.icon}</div>
              <p className="font-orbitron font-bold uppercase" style={{ fontSize: '10px', color: '#cdd6f4', lineHeight: 1.3 }}>
                {a.label}
              </p>
              <p className="font-rajdhani" style={{ fontSize: '11px', color: '#585b70', lineHeight: 1.4 }}>
                {a.desc}
              </p>
              {a.unlocked ? (
                <span
                  className="font-mono-tech"
                  style={{
                    fontSize: '9px', padding: '4px 10px', borderRadius: '8px',
                    background: 'rgba(166,227,161,0.1)', color: '#a6e3a1',
                    border: '1px solid rgba(166,227,161,0.2)', marginTop: 'auto',
                  }}
                >
                  ✓ Unlocked
                </span>
              ) : (
                <div style={{ width: '100%', marginTop: 'auto' }}>
                  <div
                    className="rounded-full overflow-hidden"
                    style={{ height: '4px', background: 'rgba(180,190,254,0.07)', marginBottom: '6px' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${a.progress ?? 0}%`, background: 'rgba(203,166,247,0.45)' }}
                    />
                  </div>
                  <span className="font-mono-tech" style={{ fontSize: '9px', color: '#45475a' }}>
                    {a.progress ?? 0}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}