

export interface TrendingCoin {
    id: string,
    symbol: string,
    price: number,
    change: string,
    name: string,
    color: string,
}

export interface NewsItem {
    tag: 'bullish' | 'neutral' | 'bearish'
    headline: string,
    time: string,
}