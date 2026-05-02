
export type CoinDetail = {
    id: string,
    name: string,
    color: string,
    currentPrice: number,
    ticker: string,
    circulatingSupply: number,
    totalSupply: number
    ath: number,
    atl: number,
    change24h: number,
    marketCap: number,
    volume24h: number,
    change7d: number,
    description: string,
}

export interface Candle {
    open: number,
    high: number,
    close: number,
    low: number,
}

export interface RelatedNews {
    tag: 'bullish' | 'bearish' | 'neutral',
    text: string,
    time: string,
}