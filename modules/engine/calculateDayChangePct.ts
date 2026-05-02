import { CoinPrice } from "@/lib/generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/library";


export function calculateDayChangePct (prices: CoinPrice[], timeframe: "1d" | "7d") {
    const offset = {
        '1d' : 24*60*60*1000,
        '7d': 7*24*60*60*1000,
    }
    const latestPrice = prices[prices?.length -1]?.price ?? new Decimal(0);
    
    let oldPrice = prices[0]?.price ?? new Decimal(0);

    for(const p of prices) {
        if(p.timestamp.getTime() >= Date.now() - offset[timeframe]) {
            oldPrice = p.price;
            break;
        }
    }
    if(oldPrice.eq(0)) {
        return new Decimal(0);
    }
    return latestPrice.sub(oldPrice).div(oldPrice);
}