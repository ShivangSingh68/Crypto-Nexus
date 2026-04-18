
import { Decimal } from "@prisma/client/runtime/library";

export interface HoldingData {
    coinId: string,
    quantity: Decimal,
    avgBuyPrice: Decimal,
    currentPrice: Decimal,
}
export function calculateHoldingPnL(holding: HoldingData): Decimal {
    const {quantity, avgBuyPrice, currentPrice} = holding;
    return currentPrice.sub(avgBuyPrice).mul(quantity);
}

export function calculateHoldingValue(qty: Decimal, currentPrice: Decimal): Decimal {
    return currentPrice.mul(qty);
}

export function calculateTotalValue(holdings: HoldingData[], cash: Decimal): Decimal {
    let totalValue = cash;
    for(const hld of holdings) {
        const hldValue = calculateHoldingValue(hld.quantity, hld.currentPrice);
        totalValue = totalValue.add(hldValue);
    }
    return totalValue;
}

export function calculateTotalPnL(holdings: HoldingData[]): Decimal {
    let totalPnL = new Decimal(0);
    for(const hld of holdings) {
        const holdingPnL = calculateHoldingPnL(hld);
        totalPnL = totalPnL.add(holdingPnL);
    }

    return totalPnL;
}
// return 0.8 for 80%
export function calculateAllocation(qty: Decimal, currentPrice: Decimal, totalPortfolioValue: Decimal): Decimal {
    if(totalPortfolioValue.eq(0)) {
        return new Decimal(0);
    }
    const coinValue = calculateHoldingValue(qty, currentPrice);
    return coinValue.div(totalPortfolioValue);
}

export function calculatePnLPercentage(avgBuyPrice: Decimal, currentPrice: Decimal): Decimal {
    if(avgBuyPrice.eq(0)) {
        return new Decimal(0);
    }
    const pnl = currentPrice.sub(avgBuyPrice);

    return pnl.div(avgBuyPrice);
}