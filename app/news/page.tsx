import NewsCard from './components/news-card';
import type { NewsItem } from './components/news-card';

const NEWS_FEED: NewsItem[] = [
  {
    id: 'n1', tag: 'bullish', headline: 'NexusCoin surges 40% following major protocol upgrade',
    body: 'The NXC network completed its long-awaited v3 upgrade today, introducing zero-fee micro-transactions and a new staking mechanism that analysts say could drive sustained demand.',
    coinSymbol: 'NXC', coinColor: '#00f5ff', time: '2m ago', source: 'Nexus Wire',
  },
  {
    id: 'n2', tag: 'bearish', headline: 'Global volatility index spikes to 6-month high, signals correction ahead',
    body: 'The Nexus Volatility Index (NVI) surged past the 80-point threshold today, a level historically associated with short-term market corrections. Analysts urge caution.',
    time: '14m ago', source: 'CryptoSignal',
  },
  {
    id: 'n3', tag: 'bullish', headline: 'VoxelCoin breaks resistance at $80, eyes $120 target',
    body: 'Technical analysts are increasingly bullish on VXL after it broke through a major resistance level that had held for three consecutive cycles. Volume data confirms strong buyer momentum.',
    coinSymbol: 'VXL', coinColor: '#a6e3a1', time: '31m ago', source: 'Chart Nexus',
  },
  {
    id: 'n4', tag: 'neutral', headline: 'Three new coins scheduled for Nexus listing in next market cycle',
    body: 'The Nexus Market Committee has approved three new tokens for listing in the upcoming cycle. Community voting will determine the final roster and initial price ranges.',
    time: '1h ago', source: 'Nexus Dispatch',
  },
  {
    id: 'n5', tag: 'bearish', headline: 'HelixChain drops 12% as whale wallets offload significant holdings',
    body: 'On-chain data reveals that three wallets collectively holding over 8% of the HLX supply have been steadily distributing since yesterday, contributing to the downward pressure.',
    coinSymbol: 'HLX', coinColor: '#cba6f7', time: '1h 22m ago', source: 'Chain Intel',
  },
  {
    id: 'n6', tag: 'bullish', headline: 'NightShade (NGT) gains 44% as low-cap gem catches trader attention',
    body: 'The micro-cap token NGT has become one of the most discussed assets on Nexus forums this week. Early adopters are reporting exceptional returns as the project gains visibility.',
    coinSymbol: 'NGT', coinColor: '#f9e2af', time: '2h ago', source: 'Gem Hunter',
  },
  {
    id: 'n7', tag: 'neutral', headline: 'Monthly portfolio rewards cycle begins — top traders earn bonus tokens',
    body: 'The monthly rewards distribution is now live. Traders ranked in the top 100 will receive bonus NXC tokens proportional to their performance over the past 30 days.',
    time: '3h ago', source: 'Nexus Rewards',
  },
  {
    id: 'n8', tag: 'bullish', headline: 'FluxCore ecosystem expands with new DeFi integration',
    body: 'FLX holders can now stake their tokens in the new FluxPool mechanism, earning passive yield while contributing to network security. APY projections range from 12% to 28%.',
    coinSymbol: 'FLX', coinColor: '#b4befe', time: '4h ago', source: 'DeFi Nexus',
  },
  {
    id: 'n9', tag: 'bearish', headline: 'PhotonToken struggles below key support as sell pressure mounts',
    body: 'PHT has failed to reclaim the $340 support level for the third consecutive session. Options data suggests elevated put volume, indicating traders are hedging for further downside.',
    coinSymbol: 'PHT', coinColor: '#cba6f7', time: '5h ago', source: 'Market Depth',
  },
];

const TICKER_ITEMS = [
  'NXC +12.4%', 'PHT -3.2%', 'VXL +28.7%', 'DRK -8.1%', 'SLR +5.3%',
  'QNT +2.1%', 'ZRO -1.8%', 'FLX +18.9%', 'NGT +44.8%', 'HLX -12.3%',
];

export default function NewsPage() {
  const bullish = NEWS_FEED.filter((n) => n.tag === 'bullish');
  const bearish = NEWS_FEED.filter((n) => n.tag === 'bearish');
  const neutral = NEWS_FEED.filter((n) => n.tag === 'neutral');

  return (
    <div className="min-h-screen">
      {/* Ticker */}
      <div className="bg-[rgba(17,17,27,0.8)] border-b border-[rgba(180,190,254,0.08)] overflow-hidden py-2">
        <div className="flex gap-8 animate-ticker whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => {
            const isNeg = item.includes('-');
            return (
              <span
                key={i}
                className={`font-mono-tech text-xs ${isNeg ? 'text-[#f38ba8]' : 'text-[#a6e3a1]'}`}
              >
                {item}
                <span className="text-[#313148] mx-4">|</span>
              </span>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="live-dot font-orbitron text-xs text-[#00f5ff] tracking-widest uppercase">Live Feed</span>
          </div>
          <h1 className="font-orbitron font-black text-3xl uppercase tracking-widest text-[#cdd6f4] mb-1">
            Market Intel
          </h1>
          <p className="font-rajdhani text-[#7f849c]">AI-generated simulated market news</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Bullish', count: bullish.length, color: '#a6e3a1', bg: 'rgba(166,227,161,0.08)', border: 'rgba(166,227,161,0.2)' },
            { label: 'Bearish', count: bearish.length, color: '#f38ba8', bg: 'rgba(243,139,168,0.08)', border: 'rgba(243,139,168,0.2)' },
            { label: 'Neutral', count: neutral.length, color: '#f9e2af', bg: 'rgba(249,226,175,0.08)', border: 'rgba(249,226,175,0.2)' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl px-4 py-3 text-center"
              style={{ background: s.bg, border: `1px solid ${s.border}` }}
            >
              <div className="font-orbitron font-bold text-xl" style={{ color: s.color }}>{s.count}</div>
              <div className="font-rajdhani text-xs text-[#585b70] uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* News grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {NEWS_FEED.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      </div>
    </div>
  );
}