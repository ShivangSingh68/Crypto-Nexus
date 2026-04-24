export interface NewsItem {
  id: string;
  headline: string;
  body: string;
  tag: 'bullish' | 'bearish' | 'neutral';
  coinSymbol?: string;
  coinColor?: string;
  time: string;
  source: string;
}

interface NewsCardProps {
  news: NewsItem;
}

const TAG_ICONS: Record<string, string> = {
  bullish: '📈',
  bearish: '📉',
  neutral: '📰',
};

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <article className="card-glass rounded-2xl p-5 hover-lift group transition-all duration-200">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`badge ${
            news.tag === 'bullish' ? 'badge-bullish' :
            news.tag === 'bearish' ? 'badge-bearish' :
            'badge-neutral'
          }`}>
            {TAG_ICONS[news.tag]} {news.tag}
          </span>
          {news.coinSymbol && (
            <span
              className="badge text-[10px] font-orbitron"
              style={{
                background: `${news.coinColor ?? '#b4befe'}15`,
                border: `1px solid ${news.coinColor ?? '#b4befe'}30`,
                color: news.coinColor ?? '#b4befe',
              }}
            >
              {news.coinSymbol}
            </span>
          )}
        </div>
        <span className="font-mono-tech text-xs text-[#45475a] shrink-0">{news.time}</span>
      </div>

      <h3 className="font-rajdhani font-bold text-base text-[#cdd6f4] mb-2 leading-snug group-hover:text-[#00f5ff] transition-colors">
        {news.headline}
      </h3>

      <p className="font-rajdhani text-sm text-[#7f849c] leading-relaxed line-clamp-2 mb-3">
        {news.body}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-[rgba(180,190,254,0.06)]">
        <span className="font-rajdhani text-xs text-[#45475a] uppercase tracking-wider">{news.source}</span>
        <span className="font-rajdhani text-xs text-[#00f5ff] opacity-0 group-hover:opacity-100 transition-opacity">
          Read more →
        </span>
      </div>
    </article>
  );
}