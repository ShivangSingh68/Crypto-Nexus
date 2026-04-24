import { getLeaderboard, getDailyMovers } from './actions';
import LeaderboardTable from './components/leaderboard-table';

export default async function LeaderboardPage() {
  const [leaders, movers] = await Promise.all([getLeaderboard(), getDailyMovers()]);
  const top3 = leaders.slice(0, 3);

  return (
    <div className="min-h-screen px-4 py-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="font-orbitron font-black text-4xl uppercase tracking-widest text-[#cdd6f4] mb-2">
          🏆 Leaderboard
        </h1>
        <p className="font-rajdhani text-[#7f849c]">The richest traders in the Nexus universe</p>
      </div>

      {/* Top 3 Podium */}
      <div className="flex flex-col sm:flex-row items-end justify-center gap-4 mb-12">
        {/* 2nd place */}
        <div className="card-glass rounded-2xl p-5 text-center w-full sm:w-48 border border-[rgba(180,190,254,0.2)]"
          style={{ boxShadow: '0 0 30px rgba(180,190,254,0.08)' }}>
          <div className="text-3xl mb-2">{top3[1]?.avatar}</div>
          <div className="text-2xl mb-1">🥈</div>
          <div className="font-orbitron font-bold text-sm text-[#b4befe] mb-1">{top3[1]?.username}</div>
          <div className="font-mono-tech text-xs text-[#7f849c]">${top3[1]?.netWorth.toLocaleString()}</div>
        </div>

        {/* 1st place - tallest */}
        <div className="card-glass rounded-2xl p-6 text-center w-full sm:w-56 border border-[rgba(249,226,175,0.3)]"
          style={{ boxShadow: '0 0 40px rgba(249,226,175,0.12)' }}>
          <div className="text-4xl mb-2">{top3[0]?.avatar}</div>
          <div className="text-3xl mb-2">🏆</div>
          <div className="font-orbitron font-bold text-base text-[#f9e2af] mb-1">{top3[0]?.username}</div>
          <div className="font-mono-tech text-sm text-[#a6adc8]">${top3[0]?.netWorth.toLocaleString()}</div>
          <div className="mt-2">
            <span className="badge badge-bullish text-[10px]">Top Trader</span>
          </div>
        </div>

        {/* 3rd place */}
        <div className="card-glass rounded-2xl p-5 text-center w-full sm:w-48 border border-[rgba(250,179,135,0.2)]"
          style={{ boxShadow: '0 0 30px rgba(250,179,135,0.08)' }}>
          <div className="text-3xl mb-2">{top3[2]?.avatar}</div>
          <div className="text-2xl mb-1">🥉</div>
          <div className="font-orbitron font-bold text-sm text-[#fab387] mb-1">{top3[2]?.username}</div>
          <div className="font-mono-tech text-xs text-[#7f849c]">${top3[2]?.netWorth.toLocaleString()}</div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Full table */}
        <div className="lg:col-span-2">
          <h2 className="font-orbitron font-bold text-lg uppercase tracking-widest text-[#cdd6f4] mb-4">
            All Traders
          </h2>
          <LeaderboardTable entries={leaders} />
        </div>

        {/* Daily movers sidebar */}
        <div>
          <h2 className="font-orbitron font-bold text-lg uppercase tracking-widest text-[#cdd6f4] mb-4">
            ⚡ Daily Movers
          </h2>
          <div className="flex flex-col gap-3">
            {movers.map((m) => {
              const isGain = m.dayChange >= 0;
              return (
                <div key={m.userId} className="card-glass rounded-2xl px-4 py-3 flex items-center gap-3 hover-lift">
                  <div className="text-xl">{m.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-orbitron font-bold text-xs text-[#cdd6f4] truncate">{m.username}</div>
                    <div className="font-mono-tech text-xs text-[#585b70]">#{m.rank}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono-tech text-sm ${isGain ? 'text-gain glow-gain' : 'text-loss glow-loss'}`}>
                      {isGain ? '+' : ''}{m.dayChangePct}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Your ranking */}
          <div className="mt-6 card-glass rounded-2xl p-5 border border-[rgba(0,245,255,0.15)]"
            style={{ boxShadow: '0 0 20px rgba(0,245,255,0.06)' }}>
            <div className="font-rajdhani text-xs uppercase tracking-widest text-[#585b70] mb-3">Your Ranking</div>
            <div className="text-center py-4">
              <div className="font-orbitron font-black text-4xl text-[#00f5ff] text-glow-cyan mb-1">#42</div>
              <div className="font-rajdhani text-sm text-[#585b70]">out of 12,841 traders</div>
              <div className="mt-3 font-mono-tech text-sm text-[#a6e3a1] glow-gain">$25,000</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}