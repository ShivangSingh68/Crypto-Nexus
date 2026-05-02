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