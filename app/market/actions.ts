"use server"
import { db } from "@/lib/db";
import { Message } from "@/types/messages";
import { Decimal } from "@prisma/client/runtime/library";
import { CoinWithAdditionalData } from "./type";


export async function getCoins(): Promise<Message<CoinWithAdditionalData[]>> {
    try {
        
        const offset = 24*60*60*1000;
        
        const coins = await db.coin.findMany({
            include: {
                price: {
                    orderBy: {
                        timestamp: "asc"
                    }
                }
            },
        });
        
        const updatedCoins: CoinWithAdditionalData[] = coins.map( (c)=> {
            const latestPrice = new Decimal(c.price[c.price.length - 1].price);
            let oldPrice;
            const sparkline = [];
            for(const p  of c.price) {
                if(p.timestamp.getTime() >= Date.now() - offset) {
                    oldPrice = new Decimal(p.price);
                }
                sparkline.push(p.price.toNumber());
            };

            if(!oldPrice) {
                oldPrice = c.price[0].price;
            }

            const change24h = oldPrice.eq(0) ? 1 :(latestPrice.sub(oldPrice).div(oldPrice)).toNumber();
            const volume24h = c.buyVolume.add(c.sellVolume).toNumber();
            const marketCap = c.currentPrice.mul(c.circulatingSupply).toNumber();

            return{
                ...c,
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