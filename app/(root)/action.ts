"use server"

import { db } from "@/lib/db";
import {NewsItem, TrendingCoin} from "./types"
import { calculateDayChangePctForCoins } from "@/modules/engine/engine.service";


function getFormattedTime(time: number): string {

    if(time < 60*1000) {
        return `${Math.floor(time/1000)}s ago`;
    } else if(time< 60*60*1000) {
        return `${Math.floor(time/(60*1000))}m ago`
    } else if(time < 24*60*60*1000) {
        return `${Math.floor(time/(60*60*1000))}h ago`
    } else {
        return `${Math.floor(time/(24*60*60*1000))}d ago`
    }
}


export async function getNewsItems (): Promise<NewsItem[]> {
    try {
        const news = await db.news.findMany({
            orderBy: {
                timestamp: "desc",
            },
            take: 5
        });

        const processedNews: NewsItem[] = news.map((n) => {
            const time = Date.now() - n.timestamp.getTime();
            const timeInFormat = getFormattedTime(time);
            return{
                tag: n.impact.greaterThan(0.3) ? "bullish" : n.impact.lessThan(-0.3) ? "bearish" : "neutral",
                headline: n.heading,
                time: timeInFormat
            }
        });

        return processedNews;
    } catch (error) {
        console.error(error);

        return [];
    }
}

export async function getTrendingCoins (): Promise<TrendingCoin[]> {
    try {
        const coins = await db.coin.findMany();

        const sorted = [...coins].sort((a,b) => b.buyVolume.add(b.sellVolume).toNumber() - a.buyVolume.add(b.sellVolume).toNumber()).slice(0, 5);

        const processedCoins: TrendingCoin[] = await Promise.all(sorted.map(async (c) => {

            const dayChange = await calculateDayChangePctForCoins({coinId: c.id, timeframe: "1d"});
            return {
                id: c.id,
                price: c.currentPrice.toNumber(),
                color: c.color,
                symbol: c.ticker,
                change: dayChange.data[0].pct.mul(100).toFixed(2) ?? "0",
                name: c.name,
            }
        }));

        return processedCoins.slice(0, 5);
    } catch (error) {
        console.error(error);

        return [];
    }
}