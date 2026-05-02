"use server"

import { db } from "@/lib/db";
import { AdminCoin, CreateCoinParams, Stat, StatIcons } from "./type";
import { getTradesToday, getVolume24H } from "@/modules/trading/trading.service";
import { getActiveUsers } from "@/modules/auth/actions";
import { calculateDayChangePctForCoins } from "@/modules/engine/engine.service";
import { Message } from "@/types/messages";
import { Decimal } from "@prisma/client/runtime/library";


export async function getStats(): Promise<Stat[]> {
    try {
        const [totalUsers, totalCoins, tradesToday, volume24h, activeUsers, newsGenerated] = await Promise.all([
            db.user.count(),
            db.coin.count(),
            getTradesToday(),
            getVolume24H(),
            getActiveUsers(),
            db.news.count(),
        ]);

        const stats: Stat[] = [
            {
                label: "Total Users",
                color: '#00f5ff',
                icon: StatIcons.TOTAL_USERS,
                value: totalUsers.toString(),
            },
            {
                label: "Total Coins",
                color: '#cba6f7',
                icon: StatIcons.TOTAL_COINS,
                value: totalCoins.toString(),
            },
            {
                label: "Trades Today",
                color: '#a6e3a1',
                icon: StatIcons.TRADES_TODAY,
                value: tradesToday.data.toString(),
            },
            {
                label: "Volume 24h",
                color: '#f9e2af',
                icon: StatIcons.VOLUME_24H,
                value: volume24h.data.toFixed(2).toString(),
            },
            {
                label: "Active Users",
                color: '#fab387',
                icon: StatIcons.ACTIVE_USERS,
                value: activeUsers.toString(),
            },
            {
                label: "News Generated",
                color: '#f38ba8',
                icon: StatIcons.NEWS_GENERATED,
                value: newsGenerated.toString(),
            },
        ];

        return stats;
    } catch (error) {
        console.error("Error in getStats action: ", error);
        return [];
    }
}

export async function getCoins(): Promise<AdminCoin[]> {
    try {
        const coins = await db.coin.findMany();
        const processedCoins: AdminCoin[] = await Promise.all(coins.map(async (c) => {
            const change24hRes = await calculateDayChangePctForCoins({coinId: c.id, timeframe:"1d"});
            
            const trades = await db.trade.findMany({
                where: {
                    coinId: c.id
                },
            });

            let coinTrades = 0;

            for(const t of trades) {
                coinTrades += t.coinCount.toNumber();
            }
            
            return {
            id: c.id,
            symbol: c.ticker,
            name: c.name,
            price: c.currentPrice.toNumber(),
            change24h: change24hRes.data[0].pct.toNumber(),
            active: true,
            color: c.color,
            trades: coinTrades
            }
        }))

        return processedCoins;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function deleteCoinAction(coinId: string):Promise<boolean> {
    try {
        await db.coin.delete({
            where: {
                id: coinId
            }
        });

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function handlePriceUpdate() {
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cron/update-price`);
}

export async function handleGenerateNews() {
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cron/generate-news`);
}

export async function handleMonthlyRewards() {
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cron/monthly-rewards`);
}

export async function createCoin(params: string): Promise<Message<number>> {
    try {
        const body = JSON.parse(params) as CreateCoinParams;
        const {
            category,
            color,
            description,
            initialPrice,
            maxSupply,
            name,
            symbol
        } = body;
        
        if(!symbol || !name || !initialPrice) {
            return {
                success: false,
                error: "Required fields missing",
            }
        };

        const ticker =  symbol.toUpperCase().trim();

        const existingBasedOnSymbol = await db.coin.findFirst({
            where: {
                ticker: symbol
            }
        });

        const existingBasedOnName = await db.coin.findFirst({
            where: {
                name: name,
            }
        })

        if(existingBasedOnSymbol) {
            return {
                success: false,
                error: "Coin with same symbol already exists",
            }
        };

        if(existingBasedOnName) {
            return {
                success: false,
                error: "Coin with same name already exists."
            }
        }

        const coinType = category === "meme" ? "MEME" : category === "ai" ? "AI" : "GAME";

        const volatility = category === "meme" ? "HIGH" : category === "ai" ? "MEDIUM" : "LOW";

        const totalSupply = new Decimal(maxSupply && Number(maxSupply) > 0 ? maxSupply : 1000000);

        const created = await db.coin.create({
            data: {
                name: name.trim(),
                ticker,
                logo: '/coin/default.png',
                color,
                description: description.trim(),
                type: coinType,
                totalSupply,
                circulatingSupply: totalSupply,
                liquidity: new Decimal(100000),
                volatility,
                currentPrice: new Decimal(initialPrice),
                sentiment: new Decimal(0),
                momentum: new Decimal(0),
                buyVolume: new Decimal(0),
                sellVolume: new Decimal(0),
            }
        });

        return {
            success: true,
            msg: "Coin created successfully",
            data: created.currentPrice.toNumber(),
        }

    } catch (error) {

        console.error("Failed to create coin: ", error);

        return {
            success: false
        }
    }
}
