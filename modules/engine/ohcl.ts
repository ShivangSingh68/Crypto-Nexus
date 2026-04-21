import { Decimal } from "@prisma/client/runtime/library";

export interface OHCLData {
    time: number
    open: Decimal,
    high: Decimal,
    close: Decimal,
    low: Decimal,
}

interface CoinPrice {
    timestamp: Date,
    price: Decimal,
}

export function groupOHCLData(coinPrices: CoinPrice[], interval: "4h" | "7h" | "1d"): OHCLData[] {
    const intervalMs = {
        "4h": 4*60*60*1000,
        "7h": 7*60*60*1000,
        "1d": 24*60*60*1000,
    }

    const buckets = new Map<number, Decimal[]>();

    const ms = intervalMs[interval];

    for(const p of coinPrices) {
        const bucket = Math.floor(p.timestamp.getTime()/ms) *ms;
        if(!buckets.has(bucket)) {
            buckets.set(bucket, []);
        }

        buckets.get(bucket)!.push(p.price);
    }

    return Array.from(buckets.entries())
        .sort(([a], [b]) => a - b)
        .map(([time, prices]) => ({
            time: time/1000,
            open: prices[0],
            high: prices.reduce((prev, curr) => prev.greaterThan(curr) ? prev : curr),
            close: prices[prices.length -1],
            low: prices.reduce((prev, curr)=> prev.lessThan(curr) ? prev : curr),
        }))

}