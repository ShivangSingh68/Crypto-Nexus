"use client"

import { useCallback, useEffect, useState } from "react";
import { Stat } from "../type"
import { getStats } from "../action";

export function useStat () {
    const [stats, setStats] = useState<Stat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchStats = useCallback(async() => {
        try {
            
            setLoading(true);
            const data = await getStats();
            setStats(data);

        } catch (error) {
        
            console.error(error);

        } finally {

            setLoading(false);
        
        }
    },[]);

    useEffect(() => {
        (async() => {
            await fetchStats();
        })();
    },[fetchStats])

    return {
        stats,
        loading,
        refetch: fetchStats,
    };
}