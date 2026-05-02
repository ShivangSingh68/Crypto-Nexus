'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NewsItem, TrendingCoin } from './types';
import { getNewsItems, getTrendingCoins } from './action';
import Image from 'next/image';

const achievements = [
  {
    icon: '/badges/first-trade.png',
    label: 'First Trade',
    desc: 'Complete your very first buy or sell order',
    color: '#f9e2af',
    glow: 'rgba(249,226,175,0.15)',
  },
  {
    icon: '/badges/first-profit.png',
    label: 'First Profit',
    desc: 'Close a trade with positive returns',
    color: '#a6e3a1',
    glow: 'rgba(166,227,161,0.15)',
  },
  {
    icon: '/badges/ten-trades.png',
    label: 'Ten Trades',
    desc: 'Successfully complete 10 total trades',
    color: '#89b4fa',
    glow: 'rgba(137,180,250,0.15)',
  },
  {
    icon: '/badges/double-portfolio.png',
    label: 'Double Portfolio',
    desc: 'Grow your portfolio value by 100%',
    color: '#f38ba8',
    glow: 'rgba(243,139,168,0.15)',
  },
  {
    icon: '/badges/meme-lord.png',
    label: 'Meme Lord',
    desc: 'Invest a total of $50,000 in Meme coins',
    color: '#fab387',
    glow: 'rgba(250,179,135,0.15)',
  },
  {
    icon: '/badges/ai-visionary.png',
    label: 'AI Visionary',
    desc: 'Invest a total of $50,000 in AI coins',
    color: '#94e2d5',
    glow: 'rgba(148,226,213,0.15)',
  },
  {
    icon: '/badges/top-ten.png',
    label: 'Top Ten',
    desc: 'Finish inside the top 10 leaderboard ranks',
    color: '#cba6f7',
    glow: 'rgba(203,166,247,0.15)',
  },
  {
    icon: '/badges/rank-one.png',
    label: 'Rank One',
    desc: 'Reach #1 on the global leaderboard',
    color: '#f5c2e7',
    glow: 'rgba(245,194,231,0.15)',
  },
  {
    icon: '/badges/millionaire.png',
    label: 'Millionare',
    desc: 'Reach a portfolio value of $1,000,000',
    color: '#74c7ec',
    glow: 'rgba(116,199,236,0.15)',
  },
];

const newsTagStyle = (tag: string) => {
  if (tag === 'bullish') return { background: 'rgba(166,227,161,0.12)', border: '1px solid rgba(166,227,161,0.3)', color: '#a6e3a1' };
  if (tag === 'bearish') return { background: 'rgba(243,139,168,0.12)', border: '1px solid rgba(243,139,168,0.3)', color: '#f38ba8' };
  return { background: 'rgba(180,190,254,0.08)', border: '1px solid rgba(180,190,254,0.2)', color: '#b4befe' };
};

export default function HomePage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [tc, ni] = await Promise.all([getTrendingCoins(), getNewsItems()]);
        setTrendingCoins(tc);
        setNewsItems(ni);
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '85vh', padding: '3rem 2rem 5rem' }}>

        {/* Background blobs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div className="animate-float" style={{ position: 'absolute', top: '5rem', left: '10%', width: '16rem', height: '16rem', borderRadius: '50%', background: 'rgba(0,245,255,0.04)', filter: 'blur(48px)' }} />
          <div className="animate-float-slow" style={{ position: 'absolute', bottom: '5rem', right: '10%', width: '20rem', height: '20rem', borderRadius: '50%', background: 'rgba(203,166,247,0.05)', filter: 'blur(48px)' }} />
          <div className="animate-float" style={{ position: 'absolute', top: '8rem', right: '20%', width: '4rem', height: '4rem', borderRadius: '0.75rem', border: '1px solid rgba(0,245,255,0.2)', transform: 'rotate(12deg)', animationDelay: '1s' }} />
          <div className="animate-float-slow" style={{ position: 'absolute', bottom: '8rem', left: '15%', width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', border: '1px solid rgba(203,166,247,0.3)', transform: 'rotate(45deg)', animationDelay: '2s' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', width: '100%', maxWidth: '52rem' }}>

          {/* Live badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.5rem', borderRadius: '999px', background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)', marginBottom: '2rem' }}>
            <span className="live-dot font-orbitron animate-pulse-glow" style={{ fontSize: '0.7rem', color: '#00f5ff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Live Market Active
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-orbitron" style={{ fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, marginBottom: '1.5rem', fontSize: 'clamp(3.5rem, 12vw, 6rem)', letterSpacing: '-0.02em' }}>
            <span style={{ background: 'linear-gradient(135deg, #00f5ff 0%, #cba6f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Crypto
            </span>
            <br />
            <span style={{ color: '#cdd6f4' }}>Nexus</span>
          </h1>

          <p className="font-rajdhani" style={{ fontSize: '1.15rem', color: '#a6adc8', maxWidth: '34rem', margin: '0 auto 1rem', lineHeight: 1.7 }}>
            The ultimate virtual crypto trading arena. Build your portfolio, dominate the leaderboard, and{' '}
            <span style={{ color: '#cba6f7' }}>master the market</span>.
          </p>

          <p className="font-mono-tech" style={{ fontSize: '0.75rem', color: '#7f849c', letterSpacing: '0.1em', marginBottom: '2.5rem' }}>
            NO REAL MONEY · PURE STRATEGY · UNLIMITED FUN
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', alignItems: 'stretch' }}>
            <Link href="/market" style={{ textDecoration: 'none' }}>
              <div
                style={{ padding: '0.85rem 1.75rem', borderRadius: '0.875rem', cursor: 'pointer', background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.35)', color: '#00f5ff', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,245,255,0.18)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(0,245,255,0.25)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,245,255,0.1)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                <span className="font-orbitron" style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>⬡ Enter Market</span>
              </div>
            </Link>

            <Link href="/leaderboard" style={{ textDecoration: 'none' }}>
              <div
                style={{ padding: '0.85rem 1.75rem', borderRadius: '0.875rem', cursor: 'pointer', background: 'rgba(243,139,168,0.1)', border: '1px solid rgba(243,139,168,0.35)', color: '#f38ba8', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(243,139,168,0.18)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(243,139,168,0.2)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(243,139,168,0.1)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                <span className="font-orbitron" style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>🏆 Leaderboard</span>
              </div>
            </Link>

            <Link href="/auth/sign-in" style={{ textDecoration: 'none' }}>
              <div
                style={{ padding: '0.85rem 1.75rem', borderRadius: '0.875rem', cursor: 'pointer', background: 'rgba(180,190,254,0.08)', border: '1px solid rgba(180,190,254,0.25)', color: '#b4befe', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(180,190,254,0.15)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(180,190,254,0.15)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(180,190,254,0.08)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                <span className="font-orbitron" style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Get Started →</span>
              </div>
            </Link>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', maxWidth: '26rem', margin: '4rem auto 0' }}>
            {[
              { value: '12,841', label: 'Traders'     },
              { value: '48',     label: 'Coins'       },
              { value: '$2.4B',  label: 'Vol. Traded' },
            ].map((stat, i) => (
              <div key={stat.label} style={{ textAlign: 'center', padding: '0 1.5rem', borderLeft: i > 0 ? '1px solid rgba(180,190,254,0.1)' : 'none' }}>
                <div className="font-orbitron" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#00f5ff' }}>{stat.value}</div>
                <div className="font-rajdhani" style={{ fontSize: '0.65rem', color: '#7f849c', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING COINS ── */}
      <section style={{ padding: '5rem 2rem', maxWidth: '80rem', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h2 className="font-orbitron" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#cdd6f4', textTransform: 'uppercase', letterSpacing: '0.08em' }}>🔥 Trending</h2>
            <p className="font-rajdhani" style={{ fontSize: '0.875rem', color: '#7f849c', marginTop: '0.4rem' }}>Top movers in the last 24h</p>
          </div>
          <Link href="/market" className="font-rajdhani" style={{ fontSize: '0.875rem', color: '#00f5ff', textDecoration: 'none' }}>View All →</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '1rem' }}>
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="nx-stat" style={{ opacity: 0.4, gap: '0.75rem' }}>
                  <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', background: 'rgba(180,190,254,0.08)' }} />
                  <div style={{ height: '0.8rem', width: '3rem', borderRadius: '4px', background: 'rgba(180,190,254,0.08)' }} />
                  <div style={{ height: '0.65rem', width: '5rem', borderRadius: '4px', background: 'rgba(180,190,254,0.06)' }} />
                  <div style={{ height: '0.9rem', width: '4rem', borderRadius: '4px', background: 'rgba(180,190,254,0.08)' }} />
                  <div style={{ height: '0.65rem', width: '2.5rem', borderRadius: '4px', background: 'rgba(180,190,254,0.06)' }} />
                </div>
              ))
            : trendingCoins.map((coin) => (
                <Link key={coin.id} href={`/coin/${coin.id}`} style={{ textDecoration: 'none' }}>
                  <div className="nx-stat" style={{ borderColor: `${coin.color}22`, boxShadow: `0 0 20px ${coin.color}10`, cursor: 'pointer' }}>
                    <div className="font-orbitron" style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900, marginBottom: '0.5rem', background: `${coin.color}18`, color: coin.color, border: `1px solid ${coin.color}33` }}>
                      {coin.symbol.slice(0, 2)}
                    </div>
                    <div className="font-orbitron" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#cdd6f4', marginBottom: '0.15rem' }}>{coin.symbol}</div>
                    <div className="font-rajdhani" style={{ fontSize: '0.7rem', color: '#7f849c', marginBottom: '0.6rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{coin.name}</div>
                    <div className="font-mono-tech" style={{ fontSize: '0.9rem', color: '#cdd6f4', marginBottom: '0.25rem' }}>${coin.price.toLocaleString()}</div>
                    <div className="font-mono-tech" style={{ fontSize: '0.75rem', color: !coin.change.includes('-') ? '#a6e3a1' : '#f38ba8' }}>
                      {!coin.change.includes('-') ? '▲' : '▼'} {coin.change.replace('-', '')}%
                    </div>
                  </div>
                </Link>
              ))
          }
        </div>
      </section>

      {/* ── ACHIEVEMENTS ── */}
      <section style={{ padding: '5rem 2rem', maxWidth: '80rem', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 className="font-orbitron" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#cdd6f4', textTransform: 'uppercase', letterSpacing: '0.08em' }}>🏅 Achievements</h2>
          <p className="font-rajdhani" style={{ fontSize: '0.875rem', color: '#7f849c', marginTop: '0.4rem' }}>Unlock badges as you trade</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1rem' }}>
          {achievements.map((a) => (
            <div key={a.label} className="nx-stat" style={{ borderColor: `${a.color}22`, boxShadow: `0 4px 30px ${a.glow}`, alignItems: 'center', textAlign: 'center', padding: '2rem 1.5rem' }}>
                            <div
                              style={{
                                width: "3.25rem",
                                height: "3.25rem",
                                flexShrink: 0,
                                borderRadius: "6px",
                                background:
                                  "linear-gradient(135deg, rgba(249,226,175,0.15), rgba(250,179,135,0.08))",
                                border: "1px solid rgba(249,226,175,0.25)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                                boxShadow:
                                  "0 0 20px rgba(249,226,175,0.15), inset 0 1px 0 rgba(249,226,175,0.1)",
                              }}
                            >
                              {a.icon?.endsWith(".png") ||
                              a.icon?.endsWith(".webp") ||
                              a.icon?.startsWith("/") ? (
                                <Image
                                  src={a.icon}
                                  alt={a.icon}
                                  width={52}
                                  height={52}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "6px",
                                  }}
                                />
                              ) : (
                                <span style={{ fontSize: "1.6rem" }}>{a.icon}</span>
                              )}
                            </div>
              <div className="font-orbitron" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#cdd6f4', marginBottom: '0.5rem' }}>{a.label}</div>
              <div className="font-rajdhani" style={{ fontSize: '0.8rem', color: '#7f849c', lineHeight: 1.5 }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEWS ── */}
      <section style={{ padding: '5rem 2rem', maxWidth: '80rem', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h2 className="font-orbitron" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#cdd6f4', textTransform: 'uppercase', letterSpacing: '0.08em' }}>📡 Market Intel</h2>
            <p className="font-rajdhani" style={{ fontSize: '0.875rem', color: '#7f849c', marginTop: '0.4rem' }}>Live simulated news feed</p>
          </div>
          <Link href="/news" className="font-rajdhani" style={{ fontSize: '0.875rem', color: '#00f5ff', textDecoration: 'none' }}>Read More →</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="nx-stat" style={{ flexDirection: 'row', alignItems: 'center', gap: '1.25rem', padding: '1rem 1.5rem', opacity: 0.4 }}>
                  <div style={{ width: '4rem', height: '1.4rem', borderRadius: '999px', background: 'rgba(180,190,254,0.08)', flexShrink: 0 }} />
                  <div style={{ flex: 1, height: '0.85rem', borderRadius: '4px', background: 'rgba(180,190,254,0.06)' }} />
                  <div style={{ width: '2.5rem', height: '0.65rem', borderRadius: '4px', background: 'rgba(180,190,254,0.06)', flexShrink: 0 }} />
                </div>
              ))
            : newsItems.map((item, i) => (
                <div key={i} className="nx-stat" style={{ flexDirection: 'row', alignItems: 'center', gap: '1.25rem', padding: '1rem 1.5rem' }}>
                  <span className="nx-badge" style={newsTagStyle(item.tag)}>{item.tag}</span>
                  <span className="font-rajdhani" style={{ fontSize: '0.9rem', color: '#bac2de', flex: 1 }}>{item.headline}</span>
                  <span className="font-mono-tech" style={{ fontSize: '0.7rem', color: '#585b70', flexShrink: 0 }}>{item.time}</span>
                </div>
              ))
          }
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ padding: '5rem 2rem' }}>
        <div className="nx-card" style={{ maxWidth: '40rem', margin: '0 auto', textAlign: 'center', padding: '4rem 3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.25rem' }}>🚀</div>
          <h2 className="font-orbitron" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#cdd6f4', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
            Ready to Trade?
          </h2>
          <p className="font-rajdhani" style={{ color: '#a6adc8', fontSize: '1.05rem', marginBottom: '2.25rem' }}>
            Start with $25,000 in virtual cash. No risk, all the thrill.
          </p>
          <Link href="/auth/sign-in" style={{ textDecoration: 'none' }}>
            <div
              style={{ display: 'inline-flex', alignItems: 'center', padding: '0.9rem 2.5rem', borderRadius: '1rem', background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.35)', color: '#00f5ff', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,245,255,0.18)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(0,245,255,0.25)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,245,255,0.1)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
            >
              <span className="font-orbitron" style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Launch Game →
              </span>
            </div>
          </Link>
        </div>
      </section>

    </div>
  );
}