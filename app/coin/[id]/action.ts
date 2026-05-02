"use server";

import { db } from "@/lib/db";
import { Candle, CoinDetail, RelatedNews } from "./type";
import { calculateDayChangePctForCoins, getCoinATHandATL, getOHCLdata } from "@/modules/engine/engine.service";
import { getCurrentUser } from "@/modules/auth/actions";
import { executeUserTrade } from "@/modules/trading/trading.service";
import { Decimal } from "@prisma/client/runtime/library";
import { Message } from "@/types/messages";
import { AchievementType } from "@/lib/generated/prisma/enums";



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

export async function getCoinData(coinId: string): Promise<CoinDetail> {
    try {
        
        const [coin, athAndAtlRes, change24hRes, change7dRes] = await Promise.all([
            db.coin.findFirst({where: {id: coinId}}), 
            getCoinATHandATL(coinId), 
            calculateDayChangePctForCoins({coinId, timeframe: "1d"}), 
            calculateDayChangePctForCoins({coinId, timeframe: "7d"})
        ]); 
        const processedCoin: CoinDetail = {
            circulatingSupply: coin.circulatingSupply.toNumber(),
            color: coin.color,
            currentPrice: coin.currentPrice.toNumber(),
            id: coin.id,
            name: coin.name,
            ticker: coin.ticker,
            totalSupply: coin.totalSupply.toNumber(),
            description: coin.description,
            ath: athAndAtlRes.data.ath.toNumber(),
            atl: athAndAtlRes.data.atl.toNumber(),
            change24h: change24hRes.data[0].pct.toNumber(),
            marketCap: coin.circulatingSupply.mul(coin.currentPrice).toNumber(),
            volume24h: coin.buyVolume.add(coin.sellVolume).toNumber(),
            change7d: change7dRes.data[0].pct.toNumber(),
        };
        return processedCoin;
    } catch (error) {
        console.error("Error in getCoinData: ", error);
        return;
    }
}

export async function getCandlesData(coinId: string, timeframe: "4h" | "7h" | "1d"): Promise<Candle[]> {
    try {
        
        const response = await getOHCLdata(coinId, timeframe);
        
        if(!response.success) {
            console.error("Error: ", response.error);
            return;
        }
        
        const candles = response.data;

        const processedCandles: Candle[] = candles.map((c) => ({
            open: c.open.toNumber(),
            close: c.close.toNumber(),
            high: c.high.toNumber(),
            low: c.low.toNumber(),
        }));

        return processedCandles;

    } catch (error) {
        
        console.error("Error in getCandlesData: ", error);
        
        return;
    }
}

export async function getRelatedNews(coinId: string): Promise<RelatedNews[]> {
    try {
        const news = await db.news.findMany({
            where: {
                coinId,
            }
        });
        const processedNews: RelatedNews[] = news.map(n => ({
            tag: n.impact.toNumber() > 0.3 ? 'bullish' : n.impact.toNumber() < -0.3 ? 'bearish' : 'neutral',
            text: n.heading,
            time: getFormattedTime(Date.now() - n.timestamp.getTime()),
        }));

        return processedNews;
        
    } catch (error) {
        console.error("Error in getRelatedNews: ", error);

        return [];
    }
}

export async function getBalanceAndHoldings(coinId: string) {
    try {
        const currUser = await getCurrentUser();
        const portfolio = await db.portfolio.findFirst({
            where: {
                userId: currUser.id
            },
            include: {
                holdings: {
                    where: {
                        coinId,
                    }
                }
            }
        });

        const balance = portfolio.cash.toNumber();
        const holdings  = portfolio.holdings[0]?.quantity.toNumber() ?? 0;

        return {
            bl: balance,
            hld: holdings
        }

    } catch (error) {
        
        console.error("Error: ", error);
        
        return {bl: 0, hld: 0};
    
    }
}

export async function executeTrade(coinId: string, quantity: number, type: "BUY" | "SELL"): Promise<Message<AchievementType[]>> {
    try {

        const currUser = await getCurrentUser();
        const tradeRes = await executeUserTrade(currUser.id, coinId, new Decimal(quantity), type);
    
        if(!tradeRes.success) {
            return {
                success: false,
            }
        } 

        return {
            success: true,
            data: tradeRes.data,
        }

    } catch (error) {
        console.error("Error in executing trade hook: ",error);
        return {
            success: false,
        };
    }
}