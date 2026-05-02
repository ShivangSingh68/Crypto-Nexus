'use client';

import { useState } from 'react';
import LeaderboardTable from './components/leaderboard-table';
import { useLeaderBoardData } from './hooks/useLeaderboardData';
import { LeaderboardEntry, Mover, ViewMode } from './types';

// ─── Floating Tab Bar ─────────────────────────────────────────────────────────
function FloatingTabBar({
  active,
  onChange,
}: {
  active: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  const tabs: { id: ViewMode; label: string; icon: string }[] = [
    { id: 'portfolio', label: 'By Portfolio',    icon: '🏆' },
    { id: 'gainers',   label: 'Top Gainers 24h', icon: '📈' },
    { id: 'losers',    label: 'Top Losers 24h',  icon: '📉' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-[#1e1e2e]/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/60">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={[
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200',
              'font-rajdhani uppercase tracking-widest whitespace-nowrap',
              active === tab.id
                ? tab.id === 'gainers'
                  ? 'bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20 border border-emerald-500/30'
                  : tab.id === 'losers'
                  ? 'bg-rose-500/20 text-rose-400 shadow-lg shadow-rose-500/20 border border-rose-500/30'
                  : 'bg-[#b4befe]/20 text-[#b4befe] shadow-lg shadow-[#b4befe]/20 border border-[#b4befe]/30'
                : 'text-[#585b70] hover:text-[#cdd6f4] hover:bg-white/5 border border-transparent',
            ].join(' ')}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── User Standing Card ───────────────────────────────────────────────────────
function UserStandingCard({
  mode,
  rank,
  total,
  netWorth,
  dayChangePct,
}: {
  mode: ViewMode;
  rank: number;
  total: number;
  netWorth: number;
  dayChangePct: number;
}) {
  const isGain = dayChangePct >= 0;

  const accentClass =
    mode === 'gainers'
      ? 'border-emerald-500/25 shadow-emerald-500/10'
      : mode === 'losers'
      ? 'border-rose-500/25 shadow-rose-500/10'
      : 'border-cyan-400/25 shadow-cyan-400/10';

  const rankColor =
    mode === 'gainers'
      ? 'text-emerald-400'
      : mode === 'losers'
      ? 'text-rose-400'
      : 'text-cyan-400';

  const labels: Record<ViewMode, string> = {
    portfolio: 'Your Portfolio Rank',
    gainers:   'Your Gainer Rank',
    losers:    'Your Loser Rank',
  };

  return (
    <div className={`mt-6 rounded-2xl p-5 bg-white/3 border ${accentClass} shadow-lg`}>
      <div className="font-rajdhani text-xs uppercase tracking-widest text-[#585b70] mb-3">
        {labels[mode]}
      </div>
      <div className="text-center py-4">
        <div className={`font-orbitron font-black text-4xl mb-1 ${rankColor} drop-shadow-lg`}>
          #{rank}
        </div>
        <div className="font-rajdhani text-sm text-[#585b70]">
          out of {total.toLocaleString()} traders
        </div>
        <div className="mt-3 flex items-center justify-center gap-3">
          <span className="font-mono text-sm text-[#cdd6f4]">
            ${netWorth.toLocaleString()}
          </span>
          <span className={`font-mono text-xs ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isGain ? '+' : ''}{dayChangePct}%
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Podium ───────────────────────────────────────────────────────────────────
// Structural type containing only the fields both LeaderboardEntry and Mover share,
// plus optional netWorth so portfolio mode can show it without requiring it from Mover.
type PodiumEntry = {
  userId: string;
  avatar: string;
  username: string;
  dayChangePct: number;
  netWorth?: number;
};

const PODIUM_CONFIG = [
  {
    idx: 1,
    medal: '🥈',
    borderClass: 'border-[#b4befe]/20',
    glowClass:   'shadow-[#b4befe]/10',
    textClass:   'text-[#b4befe]',
    sizeClass:   'w-full sm:w-48',
    padClass:    'p-5',
    avatarSize:  'text-3xl',
    medalSize:   'text-2xl',
    labelSize:   'text-sm',
    valueSize:   'text-xs',
  },
  {
    idx: 0,
    medal: '🏆',
    borderClass: 'border-[#f9e2af]/30',
    glowClass:   'shadow-[#f9e2af]/15',
    textClass:   'text-[#f9e2af]',
    sizeClass:   'w-full sm:w-56',
    padClass:    'p-6',
    avatarSize:  'text-4xl',
    medalSize:   'text-3xl',
    labelSize:   'text-base',
    valueSize:   'text-sm',
  },
  {
    idx: 2,
    medal: '🥉',
    borderClass: 'border-[#fab387]/20',
    glowClass:   'shadow-[#fab387]/10',
    textClass:   'text-[#fab387]',
    sizeClass:   'w-full sm:w-48',
    padClass:    'p-5',
    avatarSize:  'text-3xl',
    medalSize:   'text-2xl',
    labelSize:   'text-sm',
    valueSize:   'text-xs',
  },
] as const;

function Podium({ top3, mode }: { top3: PodiumEntry[]; mode: ViewMode }) {
  function getValueLabel(entry: PodiumEntry | undefined): string {
    if (!entry) return '—';
    if (mode === 'portfolio' && entry.netWorth != null) {
      return `$${entry.netWorth.toLocaleString()}`;
    }
    return `${entry.dayChangePct >= 0 ? '+' : ''}${entry.dayChangePct}%`;
  }

  return (
    <div className="flex flex-col sm:flex-row items-end justify-center gap-4 mb-12">
      {PODIUM_CONFIG.map(({ idx, medal, borderClass, glowClass, textClass, sizeClass, padClass, avatarSize, medalSize, labelSize, valueSize }) => {
        const entry = top3[idx];
        return (
          <div
            key={idx}
            className={`card-glass rounded-2xl ${padClass} text-center ${sizeClass} border ${borderClass} shadow-xl ${glowClass}`}
          >
            <div className={`${avatarSize} mb-2`}>{entry?.avatar}</div>
            <div className={`${medalSize} mb-1`}>{medal}</div>
            <div className={`font-orbitron font-bold ${labelSize} ${textClass} mb-1`}>
              {entry?.username}
            </div>
            <div className={`font-mono ${valueSize} text-[#7f849c]`}>
              {getValueLabel(entry)}
            </div>
            {idx === 0 && (
              <div className="mt-2">
                <span className="badge badge-bullish text-[10px]">
                  {mode === 'gainers' ? 'Top Gainer' : mode === 'losers' ? 'Top Loser' : 'Top Trader'}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LeaderboardPage() {
  const [mode, setMode] = useState<ViewMode>('portfolio');

  const { entries, movers, userStanding, isLoading } = useLeaderBoardData(mode);

  const top3: PodiumEntry[] = entries.slice(0, 3).map((e) => ({
    userId:       e.userId,
    avatar:       e.avatar,
    username:     e.username,
    dayChangePct: e.dayChangePct,
    netWorth: 'netWorth' in e ? (e as LeaderboardEntry).netWorth : undefined,
  }));

  const headings: Record<ViewMode, { title: string; sub: string }> = {
    portfolio: { title: '🏆 Leaderboard', sub: 'The richest traders in the Nexus universe' },
    gainers:   { title: '📈 Top Gainers', sub: 'Biggest 24-hour portfolio gains' },
    losers:    { title: '📉 Top Losers',  sub: 'Biggest 24-hour portfolio drops' },
  };

  return (
    <div className="page-wrapper pb-32">
      {/* ── Header ── */}
      <div className="mb-10 text-center transition-all duration-300">
        <h1 className="font-orbitron font-black text-4xl uppercase tracking-widest text-[#cdd6f4] mb-2">
          {headings[mode].title}
        </h1>
        <p className="font-rajdhani text-[#7f849c]">{headings[mode].sub}</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="font-orbitron text-sm text-[#585b70] animate-pulse tracking-widest">
            LOADING DATA…
          </div>
        </div>
      ) : (
        <>
          {/* ── Podium ── */}
          <Podium top3={top3} mode={mode} />

          {/* ── Main grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table */}
            <div className="lg:col-span-2">
              <h2 className="font-orbitron font-bold text-lg uppercase tracking-widest text-[#cdd6f4] mb-4">
                {mode === 'portfolio' ? 'All Traders' : mode === 'gainers' ? 'Top 10 Gainers' : 'Top 10 Losers'}
              </h2>
              <LeaderboardTable entries={entries as LeaderboardEntry[]} mode={mode} />
            </div>

            {/* Sidebar */}
            <div>
              {mode === 'portfolio' ? (
                <>
                  <h2 className="font-orbitron font-bold text-lg uppercase tracking-widest text-[#cdd6f4] mb-4">
                    ⚡ Daily Movers
                  </h2>
                  <div className="flex flex-col gap-3">
                    {movers.map((m: Mover) => {
                      const isGain = m.dayChange >= 0;
                      return (
                        <div key={m.userId} className="card-glass rounded-2xl px-4 py-3 flex items-center gap-3 hover-lift">
                          <div className="text-xl">{m.avatar}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-orbitron font-bold text-xs text-[#cdd6f4] truncate">{m.username}</div>
                            <div className="font-mono text-xs text-[#585b70]">#{m.rank}</div>
                          </div>
                          <div className="text-right">
                            <div className={`font-mono text-sm ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {isGain ? '+' : ''}{m.dayChangePct}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="font-orbitron font-bold text-lg uppercase tracking-widest text-[#cdd6f4] mb-4">
                    {mode === 'gainers' ? '📊 Gain Stats' : '📊 Loss Stats'}
                  </h2>
                  <div className="flex flex-col gap-3">
                    {(entries as Mover[]).slice(0, 5).map((e, i) => {
                      const isGain = e.dayChange >= 0;
                      return (
                        <div key={e.userId} className="card-glass rounded-2xl px-4 py-3 flex items-center gap-3 hover-lift">
                          <div className="font-orbitron font-bold text-xs text-[#585b70] w-5">{i + 1}</div>
                          <div className="text-xl">{e.avatar}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-orbitron font-bold text-xs text-[#cdd6f4] truncate">{e.username}</div>
                          </div>
                          <div className={`font-mono text-sm ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isGain ? '+' : ''}{e.dayChangePct}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              <UserStandingCard
                mode={mode}
                rank={userStanding.rank}
                total={userStanding.total}
                netWorth={userStanding.netWorth}
                dayChangePct={userStanding.dayChangePct}
              />
            </div>
          </div>
        </>
      )}

      <FloatingTabBar active={mode} onChange={setMode} />
    </div>
  );
}