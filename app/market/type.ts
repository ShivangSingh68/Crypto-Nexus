
export type CoinWithAdditionalData = {
  id: string,
  currentPrice: number,
  ticker: string,
  name: string,
  color: string,
  change24h: string;
  volume24h: number;
  marketCap: number;
  sparkline: number[];
}

export interface CoinData {
    coins: CoinWithAdditionalData[],
    loading: boolean,
    search: string, 
    setSearch: () => void, 
    sortBy: string, 
    setSortBy: () => void, 
    sortDir: "asc" | "desc", 
    setSortDir: () => void,
}
