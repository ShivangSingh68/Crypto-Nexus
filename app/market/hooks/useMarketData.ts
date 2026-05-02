
import { useEffect, useState } from "react";
import { getCoins } from "../actions";
import { CoinWithAdditionalData } from "../type";
import { getMarketCap } from "@/modules/trading/trading.service";


export function useMarketData () {
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const [loading, setLoading] = useState<boolean>(true);
    const [sortBy, setSortBy] = useState<"price" | "change24h" | "volume24h" | "marketCap">("price");
    const [search, setSearch] = useState<string>("");
    const [coins, setCoins] = useState<CoinWithAdditionalData[]>([]);
    const [marketCap, setMarketCap] = useState<number>(0);

    useEffect(() => {
        async function fetchCoins(){
            const [coinRes, marketCapRes] = await Promise.all([getCoins(), getMarketCap()]);
            setCoins(coinRes.data!);
            setMarketCap(marketCapRes.data!);
            setLoading(false);
        };

        fetchCoins();
    }, []);
    return {
        coins,
        loading,
        search,
        setSearch,
        sortBy,
        setSortBy,
        sortDir,
        marketCap,
        setSortDir,
    }
}