"use client"
import { useEffect, useState } from "react";
import { CoinDetail, RelatedNews } from "../type";
import { getCoinData, getRelatedNews } from "../action";


export function useCoinData(coinId: string) {
    const[loading, setLoading] = useState<boolean>(true);
    const [coin, setCoin] = useState<CoinDetail>({} as CoinDetail);
    const [relatedNews, setRelatedNews] = useState<RelatedNews[]>([]);

    
    useEffect(() => {
        async function fetchData(coinId: string) {
            try {
                setLoading(true);
                const coinData = await getCoinData(coinId);
                if(coinData) {
                    setCoin(coinData);
                }
            } catch (error) {
                throw error;
            } finally {
                setLoading(false);
            }
        };
        fetchData(coinId);
        
        setTimeout(async () => {
            const res = await getRelatedNews(coinId);
            setRelatedNews(res);
        }, 1000);

    }, [coinId]);

    return {
        loading, 
        coin,
        relatedNews,
    }
}