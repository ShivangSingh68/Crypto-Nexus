
import { Decimal } from "@prisma/client/runtime/library";

interface PriceChangeParams {
    demand: Decimal,
    momentum: Decimal,
    sentimentScore: Decimal,
}

export function calculatePriceChange(params: PriceChangeParams): Decimal{
    const {demand, momentum, sentimentScore} = params;
    
    //random noise [-1%, +1%]
    const randomNoise = new Decimal(Math.random() * 0.02 -0.01);
    const MAX = new Decimal(0.2);
    const MIN = new Decimal(-0.2);
    let change = demand.add(momentum).add(sentimentScore).add(randomNoise);

    if(change.greaterThan(MAX)) {
        change = MAX;
    }
    if(change.lessThan(MIN)) {
        change = MIN;
    }
    return change;
}

export function applyPriceChange(oldPrice: Decimal, change: Decimal): Decimal {
    const ONE = new Decimal(1);

    const newPrice =  oldPrice.mul(ONE.add(change));

    //To prevent negative price
    if(newPrice.lessThanOrEqualTo(0)) {
        return new Decimal(0.0001);
    }
    return newPrice;
}