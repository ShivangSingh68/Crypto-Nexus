
import { useEffect, useState } from "react";
import { getCoins } from "../actions";
import { CoinWithAdditionalData } from "../type";


export function useMarketData () {
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const [loading, setLoading] = useState<boolean>(true);
    const [sortBy, setSortBy] = useState<"price" | "change24h" | "volume24h" | "marketCap">("price");
    const [search, setSearch] = useState<string>("");
    const [coins, setCoins] = useState<CoinWithAdditionalData[]>([]);

    useEffect(() => {
        async function fetchCoins(){
            const res = await getCoins();
            setCoins(res.data!);
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
        setSortDir,
    }
}