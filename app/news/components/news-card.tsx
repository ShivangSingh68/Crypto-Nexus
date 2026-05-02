import { NewsItem } from "../types";

interface NewsCardProps {
  news: NewsItem;
}

const TAG_ICONS: Record<string, string> = {
  bullish: '📈',
  bearish: '📉',
  neutral: '📰',
};

export default function NewsCard({ news }: NewsCardProps) {
  const isBullish = news.tag === 'bullish';
  const isBearish = news.tag === 'bearish';

  const accentColor = isBullish ? '#a6e3a1' : isBearish ? '#f38ba8' : '#f9e2af';

  return (
    <article
      style={{
        borderLeft: `4px solid ${accentColor}`,
        border: `1px solid rgba(180,190,254,0.1)`,
        borderLeftWidth: '4px',
        borderLeftColor: accentColor,
        borderRadius: '1.25rem',
        background: 'rgba(24,24,37,0.9)',
        transition: 'all 0.2s',
        cursor: 'pointer',
        display: 'block',
        width: '100%',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(180,190,254,0.22)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(180,190,254,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
    >
      <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

        {/* Tags + time */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="nx-badge" style={
              isBullish
                ? { background: 'rgba(166,227,161,0.12)', border: '1px solid rgba(166,227,161,0.3)', color: '#a6e3a1' }
                : isBearish
                ? { background: 'rgba(243,139,168,0.12)', border: '1px solid rgba(243,139,168,0.3)', color: '#f38ba8' }
                : { background: 'rgba(249,226,175,0.12)', border: '1px solid rgba(249,226,175,0.3)', color: '#f9e2af' }
            }>
              {TAG_ICONS[news.tag]} {news.tag}
            </span>
            {news.coinSymbol && (
              <span className="nx-badge" style={{
                background: `${news.coinColor ?? '#b4befe'}18`,
                border: `1px solid ${news.coinColor ?? '#b4befe'}40`,
                color: news.coinColor ?? '#b4befe',
              }}>
                {news.coinSymbol}
              </span>
            )}
          </div>
          <span className="font-mono-tech" style={{ fontSize: '0.68rem', color: '#45475a', flexShrink: 0, marginTop: '2px' }}>
            {news.time}
          </span>
        </div>

        {/* Headline */}
        <h3 className="font-rajdhani" style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.45, color: '#cdd6f4', margin: 0 }}>
          {news.headline}
        </h3>

        {/* Body */}
        <p className="font-rajdhani" style={{ fontSize: '0.875rem', color: '#6c7086', lineHeight: 1.65, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {news.body}
        </p>

        {/* Footer */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(180,190,254,0.07)', marginTop: '0.25rem' }}>
          <span className="font-rajdhani" style={{ fontSize: '0.72rem', color: '#45475a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {news.source}
          </span>
        </div>
      </div>
    </article>
  );
}