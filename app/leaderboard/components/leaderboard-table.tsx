import type { LeaderboardEntry } from '../actions';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

const RANK_STYLES: Record<number, { bg: string; border: string; text: string; glow: string }> = {
  1: { bg: 'rgba(249,226,175,0.08)', border: 'rgba(249,226,175,0.3)', text: '#f9e2af', glow: '0 0 20px rgba(249,226,175,0.1)' },
  2: { bg: 'rgba(180,190,254,0.08)', border: 'rgba(180,190,254,0.3)', text: '#b4befe', glow: '0 0 20px rgba(180,190,254,0.1)' },
  3: { bg: 'rgba(250,179,135,0.08)', border: 'rgba(250,179,135,0.3)', text: '#fab387', glow: '0 0 20px rgba(250,179,135,0.1)' },
};

export default function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <div className="card-glass rounded-2xl overflow-hidden">
      <table className="w-full nexus-table">
        <thead>
          <tr className="text-left">
            <th className="px-5 py-4 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] w-12">Rank</th>
            <th className="px-5 py-4 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70]">Trader</th>
            <th className="px-5 py-4 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] text-right">Net Worth</th>
            <th className="px-5 py-4 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] text-right hidden sm:table-cell">Day Change</th>
            <th className="px-5 py-4 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] text-right hidden md:table-cell">Trades</th>
            <th className="px-5 py-4 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] text-right hidden lg:table-cell">Win Rate</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const style = RANK_STYLES[entry.rank];
            const isGain = entry.dayChange >= 0;

            return (
              <tr
                key={entry.userId}
                className="group transition-colors"
                style={style ? { background: style.bg, boxShadow: style.glow } : {}}
              >
                {/* Rank */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {entry.badge ? (
                      <span className="text-xl">{entry.badge}</span>
                    ) : (
                      <span
                        className="font-orbitron font-bold text-sm w-7 h-7 flex items-center justify-center rounded-lg bg-[rgba(180,190,254,0.06)]"
                        style={{ color: style?.text ?? '#585b70' }}
                      >
                        {entry.rank}
                      </span>
                    )}
                  </div>
                </td>

                {/* Trader */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg border"
                      style={style ? { borderColor: style.border, background: style.bg } : { borderColor: 'rgba(180,190,254,0.1)', background: 'rgba(180,190,254,0.04)' }}
                    >
                      {entry.avatar}
                    </div>
                    <div>
                      <div
                        className="font-orbitron font-bold text-sm"
                        style={{ color: style?.text ?? '#cdd6f4' }}
                      >
                        {entry.username}
                      </div>
                      <div className="font-rajdhani text-xs text-[#585b70]">#{entry.userId}</div>
                    </div>
                  </div>
                </td>

                {/* Net Worth */}
                <td className="px-5 py-4 text-right">
                  <span className="font-mono-tech text-sm text-[#cdd6f4]">
                    ${entry.netWorth.toLocaleString()}
                  </span>
                </td>

                {/* Day Change */}
                <td className="px-5 py-4 text-right hidden sm:table-cell">
                  <div>
                    <div className={`font-mono-tech text-sm ${isGain ? 'text-gain glow-gain' : 'text-loss glow-loss'}`}>
                      {isGain ? '+' : ''}${Math.abs(entry.dayChange).toLocaleString()}
                    </div>
                    <div className={`font-mono-tech text-xs ${isGain ? 'text-gain' : 'text-loss'}`}>
                      {isGain ? '+' : ''}{entry.dayChangePct}%
                    </div>
                  </div>
                </td>

                {/* Trades */}
                <td className="px-5 py-4 text-right hidden md:table-cell">
                  <span className="font-mono-tech text-sm text-[#7f849c]">{entry.totalTrades}</span>
                </td>

                {/* Win Rate */}
                <td className="px-5 py-4 text-right hidden lg:table-cell">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 bg-[rgba(180,190,254,0.08)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${entry.winRate}%`,
                          background: entry.winRate >= 60 ? '#a6e3a1' : entry.winRate >= 50 ? '#f9e2af' : '#f38ba8',
                        }}
                      />
                    </div>
                    <span className="font-mono-tech text-xs text-[#7f849c]">{entry.winRate}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}