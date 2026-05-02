"use client"

import { useCallback, useEffect, useState } from "react"
import { AdminCoin } from "../type"
import { getCoins } from "../action";

export function useCoins() {
    const [coins, setCoins] = useState<AdminCoin[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchCoins = useCallback(async () => {
        try {
            setLoading(true);
            const coins: AdminCoin[] = await getCoins();
            setCoins(coins);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        (async () => {
            await fetchCoins();
        })();
    }, [fetchCoins]);

    return {
        coins,
        loading,
        refetch: fetchCoins,
    };
}