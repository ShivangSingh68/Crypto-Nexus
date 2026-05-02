import { LeaderboardEntry } from '../types';

type ViewMode = 'portfolio' | 'gainers' | 'losers';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  mode?: ViewMode;
}

const RANK_ROW: Record<
  number,
  { rowBg: string; text: string; avatarBg: string; avatarBorder: string }
> = {
  1: {
    rowBg:        'bg-[#f9e2af]/[0.08]',
    text:         'text-[#f9e2af]',
    avatarBg:     'bg-[#f9e2af]/[0.08]',
    avatarBorder: 'border-[#f9e2af]/30',
  },
  2: {
    rowBg:        'bg-[#b4befe]/[0.08]',
    text:         'text-[#b4befe]',
    avatarBg:     'bg-[#b4befe]/[0.08]',
    avatarBorder: 'border-[#b4befe]/30',
  },
  3: {
    rowBg:        'bg-[#fab387]/[0.08]',
    text:         'text-[#fab387]',
    avatarBg:     'bg-[#fab387]/[0.08]',
    avatarBorder: 'border-[#fab387]/30',
  },
};

const DEFAULT_ROW = {
  rowBg:        '',
  text:         'text-[#cdd6f4]',
  avatarBg:     'bg-[#b4befe]/[0.04]',
  avatarBorder: 'border-[#b4befe]/10',
};

export default function LeaderboardTable({ entries, mode = 'portfolio' }: LeaderboardTableProps) {
  const is24hMode = mode === 'gainers' || mode === 'losers';

  return (
    <div className="card-glass rounded-2xl overflow-hidden">
      <table className="w-full nexus-table">
        <thead>
          <tr className="text-left">
            <th className="px-5 py-4 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] w-12">
              Rank
            </th>
            <th className="px-5 py-4 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70]">
              Trader
            </th>
            <th className="px-5 py-4 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] text-right">
              {is24hMode ? '24h Change' : 'Net Worth'}
            </th>
            <th className="px-5 py-4 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] text-right hidden sm:table-cell">
              {is24hMode ? 'Net Worth' : 'Day Change'}
            </th>
            <th className="px-5 py-4 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] text-right hidden md:table-cell">
              Trades
            </th>
            <th className="px-5 py-4 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] text-right hidden lg:table-cell">
              Win Rate
            </th>
          </tr>
        </thead>

        <tbody>
          {entries.map((entry) => {
            const s      = RANK_ROW[entry.rank] ?? DEFAULT_ROW;
            const isGain = entry.dayChange >= 0;
            const sign   = isGain ? '+' : '';

            const changeColor =
              mode === 'gainers'
                ? 'text-emerald-400'
                : mode === 'losers'
                ? 'text-rose-400'
                : isGain
                ? 'text-emerald-400'
                : 'text-rose-400';

            return (
              <tr key={entry.userId} className={`group transition-colors ${s.rowBg}`}>
                {/* Rank */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {entry.badge?.length ? (
                      <span className="text-xl">{entry.badge[0]}</span>
                    ) : (
                      <span className={`font-orbitron font-bold text-sm w-7 h-7 flex items-center justify-center rounded-lg bg-[#b4befe]/6 ${s.text}`}>
                        {entry.rank}
                      </span>
                    )}
                  </div>
                </td>

                {/* Trader */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border ${s.avatarBg} ${s.avatarBorder}`}>
                      {entry.avatar}
                    </div>
                    <div>
                      <div className={`font-orbitron font-bold text-sm ${s.text}`}>
                        {entry.username}
                      </div>
                      <div className="font-rajdhani text-xs text-[#585b70]">#{entry.userId}</div>
                    </div>
                  </div>
                </td>

                {/* Primary column */}
                <td className="px-5 py-4 text-right">
                  {is24hMode ? (
                    <div>
                      <div className={`font-mono text-sm font-semibold ${changeColor}`}>
                        {sign}{entry.dayChangePct}%
                      </div>
                      <div className={`font-mono text-xs opacity-70 ${changeColor}`}>
                        {sign}${Math.abs(entry.dayChange).toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <span className="font-mono text-sm text-[#cdd6f4]">
                      ${entry.netWorth?.toLocaleString()}
                    </span>
                  )}
                </td>

                {/* Secondary column */}
                <td className="px-5 py-4 text-right hidden sm:table-cell">
                  {is24hMode ? (
                    <span className="font-mono text-sm text-[#7f849c]">
                      ${entry.netWorth?.toLocaleString()}
                    </span>
                  ) : (
                    <div>
                      <div className={`font-mono text-sm ${changeColor}`}>
                        {sign}${Math.abs(entry.dayChange).toLocaleString()}
                      </div>
                      <div className={`font-mono text-xs ${changeColor}`}>
                        {sign}{entry.dayChangePct}%
                      </div>
                    </div>
                  )}
                </td>

                {/* Trades */}
                <td className="px-5 py-4 text-right hidden md:table-cell">
                  <span className="font-mono text-sm text-[#7f849c]">{entry.totalTrades}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}