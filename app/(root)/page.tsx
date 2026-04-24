import Link from 'next/link';

const trendingCoins = [
  { id: '1', symbol: 'NXC', name: 'NexusCoin', price: 4821.33, change: +12.4, color: '#00f5ff' },
  { id: '2', symbol: 'PHT', name: 'PhotonToken', price: 328.91, change: -3.2, color: '#cba6f7' },
  { id: '3', symbol: 'VXL', name: 'VoxelCoin', price: 82.14, change: +28.7, color: '#a6e3a1' },
  { id: '4', symbol: 'DRK', name: 'DarkMatter', price: 1204.5, change: -8.1, color: '#f38ba8' },
  { id: '5', symbol: 'SLR', name: 'SolarFlare', price: 56.77, change: +5.3, color: '#fab387' },
  { id: '6', symbol: 'QNT', name: 'QuantumBit', price: 9901.0, change: +2.1, color: '#f9e2af' },
];

const achievements = [
  { icon: '🏆', label: 'Top Trader', desc: 'Rank #1 on leaderboard', color: '#f9e2af', glow: 'rgba(249,226,175,0.3)' },
  { icon: '💎', label: 'Diamond Hands', desc: 'Hold a coin for 30 days', color: '#89dceb', glow: 'rgba(137,220,235,0.3)' },
  { icon: '🚀', label: 'Moon Shot', desc: '10x a single trade', color: '#cba6f7', glow: 'rgba(203,166,247,0.3)' },
  { icon: '⚡', label: 'Speed Trader', desc: '50 trades in one day', color: '#f38ba8', glow: 'rgba(243,139,168,0.3)' },
];

const newsItems = [
  { tag: 'bullish', headline: 'NexusCoin surges 40% after protocol upgrade announcement', time: '2m ago' },
  { tag: 'bearish', headline: 'Market-wide correction looms as volatility index spikes', time: '14m ago' },
  { tag: 'neutral', headline: 'New coins scheduled for listing in next market cycle', time: '1h ago' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center justify-center px-4">
        {/* Floating background shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-[rgba(0,245,255,0.04)] blur-3xl animate-float" />
          <div className="absolute bottom-20 right-[10%] w-80 h-80 rounded-full bg-[rgba(203,166,247,0.05)] blur-3xl animate-float-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-[rgba(0,245,255,0.02)] blur-[80px]" />

          {/* Decorative geometric shapes */}
          <div className="absolute top-32 right-[20%] w-16 h-16 border border-[rgba(0,245,255,0.2)] rounded-2xl rotate-12 animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-[15%] w-10 h-10 border border-[rgba(203,166,247,0.3)] rounded-xl rotate-45 animate-float-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-48 left-[30%] w-6 h-6 bg-[rgba(246,249,38,0.15)] rounded-full animate-pulse-glow" />
          <div className="absolute top-64 right-[35%] w-4 h-4 bg-[rgba(0,245,255,0.2)] rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(0,245,255,0.08)] border border-[rgba(0,245,255,0.2)] mb-8">
            <span className="live-dot text-xs font-orbitron text-[#00f5ff] tracking-widest uppercase">
              Live Market Active
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-orbitron text-5xl sm:text-7xl font-black uppercase tracking-tight mb-4 leading-none">
            <span className="gradient-text-cyan-mauve">Crypto</span>
            <br />
            <span className="text-[#cdd6f4]">Nexus</span>
          </h1>

          <p className="font-rajdhani text-xl text-[#a6adc8] max-w-xl mx-auto mb-4 leading-relaxed">
            The ultimate virtual crypto trading arena. Build your portfolio, dominate the leaderboard, and{' '}
            <span className="text-[#cba6f7]">master the market</span>.
          </p>

          <p className="font-mono-tech text-sm text-[#7f849c] mb-10 tracking-wider">
            NO REAL MONEY · PURE STRATEGY · UNLIMITED FUN
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/market"
              className="neon-btn-cyan px-8 py-4 rounded-2xl font-orbitron font-bold text-sm tracking-widest uppercase glow-cyan flex items-center gap-2"
            >
              <span>⬡</span> Enter Market
            </Link>
            <Link
              href="/leaderboard"
              className="neon-btn-pink px-8 py-4 rounded-2xl font-orbitron font-bold text-sm tracking-widest uppercase"
            >
              🏆 Leaderboard
            </Link>
            <Link
              href="/auth/sign-in"
              className="px-8 py-4 rounded-2xl font-orbitron font-bold text-sm tracking-widest uppercase bg-[rgba(180,190,254,0.08)] border border-[rgba(180,190,254,0.2)] text-[#b4befe] hover:bg-[rgba(180,190,254,0.14)] transition-all"
            >
              Get Started →
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto">
            {[
              { value: '12,841', label: 'Traders' },
              { value: '48', label: 'Coins' },
              { value: '$2.4B', label: 'Vol. Traded' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-orbitron font-bold text-xl text-[#00f5ff] text-glow-cyan">{stat.value}</div>
                <div className="font-rajdhani text-xs text-[#7f849c] uppercase tracking-widest mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING COINS */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-orbitron font-bold text-2xl uppercase tracking-widest text-[#cdd6f4]">
              🔥 Trending
            </h2>
            <p className="font-rajdhani text-[#7f849c] text-sm mt-1">Top movers in the last 24h</p>
          </div>
          <Link href="/market" className="font-rajdhani text-sm text-[#00f5ff] hover:text-glow-cyan transition-all tracking-wide">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {trendingCoins.map((coin) => (
            <Link key={coin.id} href={`/coin/${coin.id}`}>
              <div
                className="card-glass rounded-2xl p-4 hover-lift cursor-pointer"
                style={{ borderColor: `${coin.color}22`, boxShadow: `0 0 20px ${coin.color}10` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 font-orbitron font-black text-xs"
                  style={{ background: `${coin.color}18`, color: coin.color, border: `1px solid ${coin.color}33` }}
                >
                  {coin.symbol.slice(0, 2)}
                </div>
                <div className="font-orbitron font-bold text-xs text-[#cdd6f4] mb-0.5">{coin.symbol}</div>
                <div className="font-rajdhani text-[10px] text-[#7f849c] mb-2 truncate">{coin.name}</div>
                <div className="font-mono-tech text-sm text-[#cdd6f4]">${coin.price.toLocaleString()}</div>
                <div className={`font-mono-tech text-xs mt-1 ${coin.change > 0 ? 'text-gain glow-gain' : 'text-loss glow-loss'}`}>
                  {coin.change > 0 ? '▲' : '▼'} {Math.abs(coin.change)}%
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ACHIEVEMENTS PREVIEW */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-orbitron font-bold text-2xl uppercase tracking-widest text-[#cdd6f4]">
              🏅 Achievements
            </h2>
            <p className="font-rajdhani text-[#7f849c] text-sm mt-1">Unlock badges as you trade</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((a) => (
            <div
              key={a.label}
              className="card-glass rounded-2xl p-5 flex flex-col items-center text-center hover-lift"
              style={{ borderColor: `${a.color}22`, boxShadow: `0 4px 30px ${a.glow}` }}
            >
              <div
                className="text-4xl mb-3 w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: `${a.glow}`, border: `1px solid ${a.color}33` }}
              >
                {a.icon}
              </div>
              <div className="font-orbitron font-bold text-sm text-[#cdd6f4] mb-1">{a.label}</div>
              <div className="font-rajdhani text-xs text-[#7f849c]">{a.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWS PREVIEW */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-orbitron font-bold text-2xl uppercase tracking-widest text-[#cdd6f4]">
              📡 Market Intel
            </h2>
            <p className="font-rajdhani text-[#7f849c] text-sm mt-1">Live simulated news feed</p>
          </div>
          <Link href="/news" className="font-rajdhani text-sm text-[#00f5ff] hover:text-glow-cyan transition-all tracking-wide">
            Read More →
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {newsItems.map((item, i) => (
            <div key={i} className="card-glass rounded-2xl px-5 py-4 flex items-center gap-4 hover-lift">
              <span className={`badge ${item.tag === 'bullish' ? 'badge-bullish' : item.tag === 'bearish' ? 'badge-bearish' : 'badge-neutral'}`}>
                {item.tag}
              </span>
              <span className="font-rajdhani text-sm text-[#bac2de] flex-1">{item.headline}</span>
              <span className="font-mono-tech text-xs text-[#585b70] shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center card-glass-strong rounded-3xl p-12">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="font-orbitron font-bold text-3xl uppercase tracking-wider text-[#cdd6f4] mb-4">
            Ready to Trade?
          </h2>
          <p className="font-rajdhani text-[#a6adc8] mb-8">
            Start with $25,000 in virtual cash. No risk, all the thrill.
          </p>
          <Link
            href="/auth/sign-in"
            className="neon-btn-cyan px-10 py-4 rounded-2xl font-orbitron font-bold text-sm tracking-widest uppercase inline-block glow-cyan"
          >
            Launch Game →
          </Link>
        </div>
      </section>
    </div>
  );
}