"use client"
import { useEffect, useState } from "react";
import { Candle } from "../type";
import { getCandlesData } from "../action";



export function useCandles(coinId: string) {
    const [candlesLoading, setCandlesLoading] = useState<boolean>(true);
    const [timeframe, setTimeframe] = useState<"4h" | "7h" | "1d">("4h");
    const [candles, setCandles] = useState<Candle[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                setCandlesLoading(true);
                const candlesData = await getCandlesData(coinId, timeframe);
                if(candlesData) {
                    setCandles(candlesData);
                }
            } catch (error) {
                throw error;
            } finally {
                setCandlesLoading(false);
            }
        };

        fetchData();
    }, [coinId, timeframe]);


    return{
        candlesLoading, timeframe, setTimeframe, candles
    }
}