import { Coin } from "@/lib/generated/prisma/client"

export type CoinWithAdditionalData = Coin & {
  change24h: number;
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
