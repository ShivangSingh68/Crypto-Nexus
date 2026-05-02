"use server"

import { db } from "@/lib/db";
import { NewsItem } from "./types";
import { calculateDayChangePctForCoins } from "@/modules/engine/engine.service";

export async function getNews(): Promise<NewsItem[]> {
    try {
        const news = await db.news.findMany({
            include: {
                coin: true,
            }
        });

        const newsItem: NewsItem[] = news.map(n => ({
            id: n.id,
            body: n.description,
            headline: n.heading,
            source: n.source,
            time: n.timestamp.toISOString(),
            coinSymbol: n.coin.ticker,
            coinColor: n.coin.color,
            tag: n.impact.greaterThan(0.3) ? "bullish" : n.impact.lessThan(-0.3) ? "bearish" : "neutral",

        }))
        return newsItem;
    } catch (error) {
        console.error(error);
        return;
    }
}

export async function getTickerItems(): Promise<string[]> {
    try {
        const res = await calculateDayChangePctForCoins({timeframe: "1d"});
        if(!res.success){
            return;
        }
        const processedData: string[] = res.data.map((p) => {
            return `${p.ticker} ${p.pct.greaterThanOrEqualTo(0) ? "+" : ""}${p.pct.mul(100).toFixed(2)}%`
        })
        return processedData;
    } catch (error) {
        console.error(error);
        return;
    }
}