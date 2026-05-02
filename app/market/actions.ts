"use server"
import { db } from "@/lib/db";
import { Message } from "@/types/messages";
import { CoinWithAdditionalData } from "./type";
import { calculateDayChangePct } from "@/modules/engine/calculateDayChangePct";


export async function getCoins(): Promise<Message<CoinWithAdditionalData[]>> {
    try {

        const coins = await db.coin.findMany({
            include: {
                price: {
                    orderBy: {
                        timestamp: "asc"
                    }
                }
            },
        });
        
        const updatedCoins: CoinWithAdditionalData[] = coins.map((c)=> {
            const sparkline = [];
            for(const p  of c.price) {
                sparkline.push(p.price.toNumber());
            };

            const change24h = calculateDayChangePct(c.price, "1d").mul(100).toFixed(2);
            const volume24h = c.buyVolume.add(c.sellVolume).toNumber();
            const marketCap = c.currentPrice.mul(c.circulatingSupply).toNumber();

            return{
                id: c.id,
                color: c.color,
                currentPrice: c.currentPrice.toNumber(),
                name: c.name,
                ticker: c.ticker,
                change24h,
                volume24h,
                marketCap,
                sparkline,
            }
        })

        return {
            success: true,
            data: updatedCoins,
        }

    } catch (error) {

        console.error("Error: ", error);

        const errMsg = error instanceof Error ? error.message : "Unknown Error";

        return {
            success: false,
            error: errMsg
        }

    }
}